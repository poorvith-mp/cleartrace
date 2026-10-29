"""
Test Suite: Re-Scan Verification & Proof Diff
Verifies that removed records return HTTP 404 proof diff and detect re-appearance drift.
"""

from app.models import UserProfile, BrokerListing, MatchResult, MatchScore, ConsentPayload, RemovalState
from app.workflow.state_machine import workflow_engine
from app.rescan.verifier import execute_verification_rescan
from app.brokers.mock_sites import broker_db

def test_rescan_confirms_delisting():
    profile = UserProfile(name="Pooja Sharma", phone="+91 98450 12345", address="Koramangala, Bengaluru")
    listing = broker_db.get_all_active()[0]
    
    score = MatchScore(
        name_score=100.0,
        phone_score=100.0,
        address_semantic_score=100.0,
        workplace_semantic_score=100.0,
        solution_a_score=100.0,
        solution_b_score=100.0
    )
    finding = MatchResult(id="finding-delist-test", listing=listing, score=score, state=RemovalState.FOUND)
    workflow_engine.register_finding(finding)

    consent = ConsentPayload(
        finding_id="finding-delist-test",
        data_principal_name="Pooja Sharma",
        consent_confirmed=True,
        signature_timestamp="2026-10-29T10:05:00Z"
    )
    workflow_engine.authorize_removal("finding-delist-test", consent, profile)
    workflow_engine.dispatch_removal_request("finding-delist-test")
    workflow_engine.complete_removal("finding-delist-test")

    # Now execute re-scan
    rescan = execute_verification_rescan(finding)
    assert rescan.is_delisted is True
    assert "DELISTED / EXPUNGED" in rescan.status
    assert rescan.audit_certificate is not None

def test_rescan_detects_reappearance():
    # Simulate record re-appearance
    finding = workflow_engine.active_findings["finding-delist-test"]
    broker_db.simulate_reappearance(finding.listing.id)

    rescan = execute_verification_rescan(finding)
    assert rescan.is_delisted is False
    assert rescan.is_reappeared is True
    assert "RE-APPEARANCE ALERT" in rescan.status
