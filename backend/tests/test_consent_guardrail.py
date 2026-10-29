"""
Test Suite: Zero Removals Without User Consent Guardrail
Asserts that the system strictly rejects unauthorized removal dispatches.
"""

import pytest
from app.models import UserProfile, BrokerListing, MatchResult, MatchScore, ConsentPayload, RemovalState
from app.workflow.state_machine import RemovalWorkflowEngine, ConsentRequiredException

@pytest.fixture
def test_setup():
    engine = RemovalWorkflowEngine()
    profile = UserProfile(
        name="Pooja Sharma",
        phone="+91 98450 12345",
        address="Koramangala 4th Block, Bengaluru",
        workplace="Swiggy"
    )
    listing = BrokerListing(
        id="broker-1-rec-1",
        broker_id="broker-1",
        broker_name="IndiaLookup",
        exposed_name="Pooja Sharma",
        exposed_phone="+91 98450 12345",
        exposed_address="Koramangala, Bangalore",
        raw_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        evidence_timestamp="2026-10-29T10:00:00Z"
    )
    score = MatchScore(
        name_score=100.0,
        phone_score=100.0,
        address_semantic_score=94.0,
        workplace_semantic_score=90.0,
        solution_a_score=60.0,
        solution_b_score=96.0
    )
    finding = MatchResult(
        id="finding-test-1",
        listing=listing,
        score=score,
        state=RemovalState.FOUND,
        is_authorized=False
    )
    engine.register_finding(finding)
    return engine, profile, finding

def test_unauthorized_removal_strictly_blocked(test_setup):
    """Ensures dispatch_removal_request raises ConsentRequiredException if not authorized."""
    engine, profile, finding = test_setup
    
    with pytest.raises(ConsentRequiredException) as excinfo:
        engine.dispatch_removal_request("finding-test-1")
    
    assert "HARD GUARDRAIL VIOLATION: Zero Removals Without User Consent" in str(excinfo.value)
    assert finding.state == RemovalState.FOUND

def test_valid_authorization_flow(test_setup):
    """Ensures explicit user consent transitions state and generates valid Section 12 notice."""
    engine, profile, finding = test_setup

    consent = ConsentPayload(
        finding_id="finding-test-1",
        data_principal_name="Pooja Sharma",
        consent_confirmed=True,
        signature_timestamp="2026-10-29T10:05:00Z"
    )

    authorized_finding = engine.authorize_removal("finding-test-1", consent, profile)
    assert authorized_finding.is_authorized is True
    assert authorized_finding.state == RemovalState.AUTHORISED
    assert "CT-SEC12-SIG-" in authorized_finding.consent_token
    assert "SECTION 12, DPDP ACT, 2023" in authorized_finding.legal_notice_text

    # Now dispatch succeeds
    dispatched = engine.dispatch_removal_request("finding-test-1")
    assert dispatched.state == RemovalState.REQUESTED
