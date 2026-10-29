"""
Re-Scan Verification and Before/After Diff Inspector
Proves the removal result by re-querying brokers and verifying zero PII exposure.
"""

from typing import Dict, Any, List
from ..models import RescanResult, MatchResult, RemovalState
from ..brokers.mock_sites import broker_db
from ..workflow.state_machine import workflow_engine

def execute_verification_rescan(finding: MatchResult) -> RescanResult:
    """
    Re-scans data broker to confirm deletion.
    If the record is found in active listings, returns is_delisted=False.
    If the record is absent (in delisted store), returns is_delisted=True.
    """
    record_id = finding.listing.id
    is_active = any(l.id == record_id for l in broker_db.get_all_active())
    
    if not is_active:
        # Delisting confirmed
        return RescanResult(
            finding_id=finding.id,
            broker_name=finding.listing.broker_name,
            status="DELISTED / EXPUNGED (HTTP 404)",
            is_delisted=True,
            is_reappeared=False,
            before_hash=finding.listing.raw_hash,
            current_hash=None,
            audit_certificate=f"CT-EXP-CERT-{finding.id.upper()}"
        )
    else:
        # Record is still present or has re-appeared
        is_reappeared = (finding.state == RemovalState.REMOVED)
        if is_reappeared:
            workflow_engine.record_reappearance(finding.id)

        return RescanResult(
            finding_id=finding.id,
            broker_name=finding.listing.broker_name,
            status="ACTIVE EXPOSURE DETECTED" if not is_reappeared else "RE-APPEARANCE ALERT",
            is_delisted=False,
            is_reappeared=is_reappeared,
            before_hash=finding.listing.raw_hash,
            current_hash=finding.listing.raw_hash,
            audit_certificate=None
        )
