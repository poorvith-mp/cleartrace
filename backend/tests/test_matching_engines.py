"""
Test Suite: Solution A vs Solution B Matching Engines
Asserts that Solution B dense semantic embeddings catch colloquial Indian address
and workplace variations that Solution A rule-based fuzzy matching drops.
"""

from app.models import UserProfile, BrokerListing
from app.matching.fuzzy_baseline import score_solution_a
from app.matching.semantic_hybrid import evaluate_match_solution_b

def test_solution_b_resolves_colloquial_address_and_landmarks():
    """
    Case: 'near Sony Signal, Koramangala Stage 4, Bangalore'
    Solution A drops token similarity because of 'Stage 4' vs '4th Block' and landmark noise.
    Solution B recognizes municipal taxonomy and block/stage synonym.
    """
    profile = UserProfile(
        name="Pooja Sharma",
        phone="+91 98450 12345",
        address="Koramangala 4th Block, Bengaluru, Karnataka",
        workplace="Senior SDE, Swiggy"
    )
    listing = BrokerListing(
        id="rec-test-1",
        broker_id="broker-1",
        broker_name="IndiaLookup",
        exposed_name="Pooja Sharma",
        exposed_phone="+91 98450-12345",
        exposed_address="Flat 12/4, 3rd Cross, near Sony Signal, Koramangala Stage 4, Bangalore",
        raw_hash="hash1",
        evidence_timestamp="2026-10-29T10:00:00Z"
    )

    sol_a = score_solution_a(profile, listing)
    score_b = evaluate_match_solution_b(profile, listing)

    # Solution B score should be significantly higher and above auto-match threshold (>= 85)
    assert score_b.solution_b_score >= 88.0
    assert score_b.address_semantic_score >= 85.0
    # Confirms divergence flag is set
    assert score_b.is_solution_a_divergence is True

def test_solution_b_resolves_parent_corporate_aliases():
    """
    Case: Swiggy vs Bundl Technologies Private Limited
    Solution A gets 0 token overlap on company name.
    Solution B maps Swiggy to its parent entity.
    """
    profile = UserProfile(
        name="Pooja Sharma",
        phone="+91 98450 12345",
        address="Koramangala, Bengaluru",
        workplace="Software Engineer, Swiggy"
    )
    listing = BrokerListing(
        id="rec-test-2",
        broker_id="broker-2",
        broker_name="BharatPeopleDirectory",
        exposed_name="Pooja Sharma",
        exposed_phone="09845012345",
        exposed_address="Koramangala, Bengaluru",
        exposed_workplace="Software Engineer - Bundl Technologies",
        raw_hash="hash2",
        evidence_timestamp="2026-10-29T10:00:00Z"
    )

    score_b = evaluate_match_solution_b(profile, listing)
    assert score_b.workplace_semantic_score >= 90.0
    assert score_b.solution_b_score >= 90.0

def test_distractor_same_name_strangers_filtered():
    """
    Tests that a person with identical name but different city/phone receives score < 65.
    """
    profile = UserProfile(
        name="Pooja Sharma",
        phone="+91 98450 12345",
        address="Koramangala 4th Block, Bengaluru",
        workplace="Swiggy"
    )
    distractor_listing = BrokerListing(
        id="rec-distractor",
        broker_id="broker-1",
        broker_name="IndiaLookup",
        exposed_name="Pooja Sharma",
        exposed_phone="+91 91234 56789",
        exposed_address="Civil Lines, Jaipur, Rajasthan",
        exposed_workplace="Teacher, Modern School",
        raw_hash="hash3",
        evidence_timestamp="2026-10-29T10:00:00Z"
    )

    score_b = evaluate_match_solution_b(profile, distractor_listing)
    # Must be below discard threshold (65.0)
    assert score_b.solution_b_score < 60.0
