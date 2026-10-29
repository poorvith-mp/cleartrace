"""
5 Site Connectors for Data Broker Sites
Scrapes/queries broker layouts and captures SHA-256 evidence snapshots.
"""

import hashlib
from typing import List
from datetime import datetime
from ..models import BrokerListing
from ..brokers.mock_sites import broker_db

class BaseBrokerConnector:
    def __init__(self, broker_id: str, broker_name: str):
        self.broker_id = broker_id
        self.broker_name = broker_name

    def compute_evidence_hash(self, raw_data: str) -> str:
        return hashlib.sha256(raw_data.encode('utf-8')).hexdigest()

class IndiaLookupConnector(BaseBrokerConnector):
    def __init__(self):
        super().__init__("broker-1", "IndiaLookup")

    def query(self) -> List[BrokerListing]:
        return [l for l in broker_db.get_all_active() if l.broker_id == self.broker_id]

class BharatDirectoryConnector(BaseBrokerConnector):
    def __init__(self):
        super().__init__("broker-2", "BharatPeopleDirectory")

    def query(self) -> List[BrokerListing]:
        return [l for l in broker_db.get_all_active() if l.broker_id == self.broker_id]

class CityRecordsConnector(BaseBrokerConnector):
    def __init__(self):
        super().__init__("broker-3", "CityRecordsIN")

    def query(self) -> List[BrokerListing]:
        return [l for l in broker_db.get_all_active() if l.broker_id == self.broker_id]

class ContactFinderConnector(BaseBrokerConnector):
    def __init__(self):
        super().__init__("broker-4", "ContactFinderIndia")

    def query(self) -> List[BrokerListing]:
        return [l for l in broker_db.get_all_active() if l.broker_id == self.broker_id]

class TrueCitizenConnector(BaseBrokerConnector):
    def __init__(self):
        super().__init__("broker-5", "TrueCitizenRegistry")

    def query(self) -> List[BrokerListing]:
        return [l for l in broker_db.get_all_active() if l.broker_id == self.broker_id]

CONNECTORS = [
    IndiaLookupConnector(),
    BharatDirectoryConnector(),
    CityRecordsConnector(),
    ContactFinderConnector(),
    TrueCitizenConnector()
]

def scan_all_brokers() -> List[BrokerListing]:
    all_findings = []
    for connector in CONNECTORS:
        all_findings.extend(connector.query())
    return all_findings
