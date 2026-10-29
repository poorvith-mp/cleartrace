"""
Test Suite: Broker Connectors & Cryptographic Evidence
Asserts that all 5 connectors retrieve records and generate valid SHA-256 evidence hashes.
"""

from app.connectors.site_connectors import CONNECTORS, scan_all_brokers

def test_five_connectors_active():
    """Confirms exactly 5 distinct broker connectors exist."""
    assert len(CONNECTORS) == 5
    broker_names = [c.broker_name for c in CONNECTORS]
    assert "IndiaLookup" in broker_names
    assert "BharatPeopleDirectory" in broker_names
    assert "CityRecordsIN" in broker_names
    assert "ContactFinderIndia" in broker_names
    assert "TrueCitizenRegistry" in broker_names

def test_evidence_hash_integrity():
    """Asserts that scraped listings contain valid 64-character SHA-256 hashes."""
    listings = scan_all_brokers()
    assert len(listings) >= 5
    for listing in listings:
        assert len(listing.raw_hash) == 64
        assert isinstance(listing.raw_hash, str)
        assert listing.evidence_timestamp is not None
