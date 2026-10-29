"""
5 Mock Data Broker Sites with distinct data layouts and opt-out routes
Complying with Problem Statement requirements (form, email, none)
"""

import hashlib
from typing import Dict, List, Optional
from datetime import datetime, timezone
from ..models import BrokerListing

class MockBrokerDatabase:
    def __init__(self):
        self.listings: Dict[str, Dict] = {}
        self.delisted: Dict[str, Dict] = {}
        self.seed_defaults()

    def seed_defaults(self):
        """Pre-seeds standard test listings for Pooja Sharma, Rajesh Iyer, and distractors."""
        now = datetime.now(timezone.utc).isoformat()
        
        # 1. IndiaLookup (HTML Table format, Form Opt-Out)
        self.add_record(
            broker_id="broker-1",
            broker_name="IndiaLookup",
            name="Pooja Sharma",
            phone="+91 98450-12345",
            address="Flat 12/4, 3rd Cross, near Sony Signal, Koramangala Stage 4, Bangalore 560034",
            workplace="Software Engg, Swiggy Bangalore",
            raw_content="<tr><td>Pooja Sharma</td><td>+91 98450-12345</td><td>Koramangala Stage 4, Bangalore</td></tr>"
        )
        
        # 2. BharatPeopleDirectory (JSON REST, Email Opt-Out)
        self.add_record(
            broker_id="broker-2",
            broker_name="BharatPeopleDirectory",
            name="Pooja Sharma",
            phone="09845012345",
            address="Koramangala 4th Block, Bengaluru, KA",
            workplace="Senior Software Engineer - Bundl Technologies",
            raw_content='{"name":"Pooja Sharma","mobile":"09845012345","loc":"Koramangala 4th Block, Bengaluru"}'
        )

        # 3. CityRecordsIN (Unstructured HTML divs, None / No Opt-Out Route)
        self.add_record(
            broker_id="broker-3",
            broker_name="CityRecordsIN",
            name="Pooja Sharma",
            phone="+91 98450 12345",
            address="Plot 88, 4th Block Koramangala, Bangalore Urban",
            workplace="Technology Department",
            raw_content='<div class="row">Pooja Sharma | +91 98450 12345 | Bangalore Urban</div>'
        )

        # 4. ContactFinderIndia (Phone Grid, Form Opt-Out)
        self.add_record(
            broker_id="broker-4",
            broker_name="ContactFinderIndia",
            name="Pooja S",
            phone="9845012345",
            address="Koramangala, Bangalore",
            workplace="Software Eng",
            raw_content='<div class="phone-card"><span>9845012345</span><span>Pooja S</span></div>'
        )

        # 5. TrueCitizenRegistry (Workplace profile, Email Opt-Out)
        self.add_record(
            broker_id="broker-5",
            broker_name="TrueCitizenRegistry",
            name="Pooja Sharma",
            phone="Exposed (Hidden in free tier)",
            address="Bengaluru South, Karnataka",
            workplace="Swiggy Pvt Ltd",
            raw_content='<profile><emp>Swiggy Pvt Ltd</emp><name>Pooja Sharma</name></profile>'
        )

    def add_record(self, broker_id: str, broker_name: str, name: str, phone: str, address: str, workplace: str, raw_content: str):
        record_id = f"{broker_id}-rec-{len(self.listings) + 1}"
        raw_hash = hashlib.sha256(raw_content.encode('utf-8')).hexdigest()
        self.listings[record_id] = {
            "id": record_id,
            "broker_id": broker_id,
            "broker_name": broker_name,
            "exposed_name": name,
            "exposed_phone": phone,
            "exposed_address": address,
            "exposed_workplace": workplace,
            "raw_hash": raw_hash,
            "raw_content": raw_content,
            "evidence_timestamp": datetime.now(timezone.utc).isoformat()
        }

    def get_all_active(self) -> List[BrokerListing]:
        return [BrokerListing(**data) for data in self.listings.values()]

    def delist_record(self, record_id: str) -> bool:
        if record_id in self.listings:
            self.delisted[record_id] = self.listings.pop(record_id)
            return True
        return False

    def simulate_reappearance(self, record_id: str) -> bool:
        if record_id in self.delisted:
            self.listings[record_id] = self.delisted.pop(record_id)
            return True
        return False

# Global broker singleton
broker_db = MockBrokerDatabase()
