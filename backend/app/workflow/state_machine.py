"""
ClearTrace Removal State Machine
Enforces strict consent invariants and manages lifecycle states:
Found -> Authorised -> Requested -> Removed -> Re-appeared
"""

import hashlib
from datetime import datetime, timezone
from typing import Dict, Optional
from ..models import RemovalState, MatchResult, ConsentPayload, UserProfile
from .legal_notices import generate_section12_erasure_notice
from ..brokers.mock_sites import broker_db

class ConsentRequiredException(Exception):
    """Raised when an automated removal is attempted without prior user authorization."""
    pass

class InvalidStateTransitionException(Exception):
    """Raised when an illegal state machine transition is attempted."""
    pass

class RemovalWorkflowEngine:
    def __init__(self):
        self.active_findings: Dict[str, MatchResult] = {}

    def register_finding(self, finding: MatchResult):
        self.active_findings[finding.id] = finding

    def authorize_removal(self, finding_id: str, consent: ConsentPayload, profile: UserProfile) -> MatchResult:
        """Transitions state from FOUND to AUTHORISED using signed user consent."""
        if finding_id not in self.active_findings:
            raise KeyError(f"Finding {finding_id} not found in active audit records.")

        finding = self.active_findings[finding_id]
        if not consent.consent_confirmed:
            raise ConsentRequiredException("Data Principal explicitly denied or did not confirm consent.")

        # Cryptographic consent signature
        raw_token = f"{finding_id}-{consent.data_principal_name}-{datetime.now(timezone.utc).isoformat()}"
        consent_token = f"CT-SEC12-SIG-{hashlib.sha256(raw_token.encode()).hexdigest()[:16].upper()}"

        finding.is_authorized = True
        finding.consent_token = consent_token
        finding.state = RemovalState.AUTHORISED
        finding.legal_notice_text = generate_section12_erasure_notice(profile, finding.listing, consent_token)
        return finding

    def dispatch_removal_request(self, finding_id: str) -> MatchResult:
        """Transitions state from AUTHORISED to REQUESTED. Rejects if not authorized."""
        if finding_id not in self.active_findings:
            raise KeyError(f"Finding {finding_id} not found.")

        finding = self.active_findings[finding_id]
        if not finding.is_authorized:
            raise ConsentRequiredException(
                "HARD GUARDRAIL VIOLATION: Zero Removals Without User Consent. "
                f"Finding {finding_id} has not been authorized by the Data Principal."
            )

        if finding.state not in [RemovalState.AUTHORISED, RemovalState.RE_APPEARED]:
            raise InvalidStateTransitionException(f"Cannot request removal from state '{finding.state}'.")

        finding.state = RemovalState.REQUESTED
        return finding

    def complete_removal(self, finding_id: str) -> MatchResult:
        """Transitions state from REQUESTED to REMOVED, delisting record from mock broker."""
        if finding_id not in self.active_findings:
            raise KeyError(f"Finding {finding_id} not found.")

        finding = self.active_findings[finding_id]
        if not finding.is_authorized:
            raise ConsentRequiredException("Cannot complete removal without recorded consent.")

        # Delist from broker mock database
        broker_db.delist_record(finding.listing.id)
        finding.state = RemovalState.REMOVED
        return finding

    def record_reappearance(self, finding_id: str) -> MatchResult:
        """Transitions state to RE_APPEARED when drift is detected during re-scan."""
        if finding_id not in self.active_findings:
            raise KeyError(f"Finding {finding_id} not found.")

        finding = self.active_findings[finding_id]
        finding.state = RemovalState.RE_APPEARED
        return finding

workflow_engine = RemovalWorkflowEngine()
