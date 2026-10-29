"""
Test Suite: Removal State Machine Lifecycle
Tests transitions: Found -> Authorised -> Requested -> Removed -> Re-appeared
"""

import pytest
from app.models import UserProfile, BrokerListing, MatchResult, MatchScore, ConsentPayload, RemovalState
from app.workflow.state_machine import RemovalWorkflowEngine

def test_full_state_lifecycle():
    engine = RemovalWorkflowEngine()
    profile = UserProfile(name="Rajesh Iyer", phone="098410 98765", address="T. Nagar, Chennai")
    listing = BrokerListing(
        id="broker-2-rec-1",
        broker_id="broker-2",
        broker_name="BharatPeopleDirectory",
        exposed_name="Rajesh Iyer",
        exposed_phone="098410 98765",
        exposed_address="T. Nagar, Chennai",
        raw_hash="hash-rajesh",
        evidence_timestamp="2026-10-29T10:00:00Z"
    )
    score = MatchScore(
        name_score=100.0,
        phone_score=100.0,
        address_semantic_score=100.0,
        workplace_semantic_score=80.0,
        solution_a_score=95.0,
        solution_b_score=98.0
    )
    finding = MatchResult(id="finding-rajesh", listing=listing, score=score, state=RemovalState.FOUND)
    engine.register_finding(finding)

    # 1. Authorise
    consent = ConsentPayload(
        finding_id="finding-rajesh",
        data_principal_name="Rajesh Iyer",
        consent_confirmed=True,
        signature_timestamp="2026-10-29T10:05:00Z"
    )
    engine.authorize_removal("finding-rajesh", consent, profile)
    assert finding.state == RemovalState.AUTHORISED

    # 2. Request
    engine.dispatch_removal_request("finding-rajesh")
    assert finding.state == RemovalState.REQUESTED

    # 3. Remove
    engine.complete_removal("finding-rajesh")
    assert finding.state == RemovalState.REMOVED

    # 4. Re-appearance drift
    engine.record_reappearance("finding-rajesh")
    assert finding.state == RemovalState.RE_APPEARED
