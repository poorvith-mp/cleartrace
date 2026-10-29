"""
DPDP Act 2023 Section 12 & 13 Legal Notice Generator
Generates formal erasure and grievance notices.
"""

from datetime import datetime, timezone
from ..models import BrokerListing, UserProfile

def generate_section12_erasure_notice(profile: UserProfile, listing: BrokerListing, consent_token: str) -> str:
    """
    Generates a formal statutory notice under Section 12 of India's DPDP Act, 2023.
    """
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    notice = f"""
================================================================================
STATUTORY NOTICE OF ERASURE UNDER SECTION 12, DPDP ACT, 2023
================================================================================

DATE & TIME: {timestamp}
TO DATA FIDUCIARY / BROKER: {listing.broker_name}
EVIDENCE SNAPSHOT IDENTIFIER: {listing.id}
DIGITAL EVIDENCE HASH (SHA-256): {listing.raw_hash}
VERIFIED CONSENT TOKEN: {consent_token}

DATA PRINCIPAL DETAILS:
- Full Legal Name: {profile.name}
- Registered Contact Vector: {profile.phone}
- Verified Physical Jurisdiction: {profile.address}

REPRESENTATION AND DEMAND:
Notice is hereby formally given pursuant to Section 12(1) of the Digital Personal Data
Protection Act, 2023 (DPDP Act). The Data Principal hereby exercises their statutory right
to require that you erase, purge, and permanently cease publication or dissemination of
the personal data indexed under listing '{listing.id}', including:
  1. Exposed phone number: {listing.exposed_phone}
  2. Exposed residential address: {listing.exposed_address}
  3. Associated workplace affiliations: {listing.exposed_workplace or 'N/A'}

LEGAL CONSEQUENCES OF NON-COMPLIANCE:
Failure to act within your published statutory SLA or within the period specified by the
Data Protection Board of India will trigger escalation under Section 13 (Right of Grievance
Redressal) and referral to the Board for penal determination under the Act.

BY ORDER OF THE VERIFIED DATA PRINCIPAL
Issued via ClearTrace Privacy Engine (Auth Protocol CT-DPDP-V1)
================================================================================
"""
    return notice.strip()

def generate_section13_grievance_notice(profile: UserProfile, listing: BrokerListing) -> str:
    """
    Generates a Section 13 grievance notice for unresponsive brokers or brokers with no opt-out route.
    """
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    return f"""
NOTICE OF GRIEVANCE ESCALATION (SECTION 13, DPDP ACT 2023)
Date: {timestamp}
To: Grievance Officer, {listing.broker_name} / Data Protection Board of India
Subject: Failure to provide accessible opt-out mechanism for personal data removal
Notice: Under Section 13 of the DPDP Act 2023, formal grievance is lodged regarding listing {listing.id}.
""".strip()
