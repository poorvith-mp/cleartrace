"""
ClearTrace Data Models
Complying with DPDP Act 2023 Section 12 and 13
"""

from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class RemovalState(str, Enum):
    FOUND = "Found"
    AUTHORISED = "Authorised"
    REQUESTED = "Requested"
    REMOVED = "Removed"
    RE_APPEARED = "Re-appeared"

class UserProfile(BaseModel):
    name: str = Field(..., description="Full legal name of the Data Principal")
    phone: str = Field(..., description="Indian phone number variant (+91, 0-prefix, or 10 digits)")
    address: str = Field(..., description="Current or previous residential address")
    workplace: Optional[str] = Field(None, description="Current or previous employer / workplace")

class BrokerListing(BaseModel):
    id: str
    broker_id: str
    broker_name: str
    exposed_name: str
    exposed_phone: str
    exposed_address: str
    exposed_workplace: Optional[str] = None
    raw_hash: str = Field(..., description="SHA-256 evidence snapshot hash")
    evidence_timestamp: str

class MatchScore(BaseModel):
    name_score: float = Field(..., ge=0.0, le=100.0)
    phone_score: float = Field(..., ge=0.0, le=100.0)
    address_semantic_score: float = Field(..., ge=0.0, le=100.0)
    workplace_semantic_score: float = Field(..., ge=0.0, le=100.0)
    solution_a_score: float = Field(..., ge=0.0, le=100.0)
    solution_b_score: float = Field(..., ge=0.0, le=100.0)
    is_borderline: bool = False
    is_solution_a_divergence: bool = False
    divergence_reason: Optional[str] = None

class MatchResult(BaseModel):
    id: str
    listing: BrokerListing
    score: MatchScore
    state: RemovalState = RemovalState.FOUND
    is_authorized: bool = False
    consent_token: Optional[str] = None
    legal_notice_text: Optional[str] = None

class ConsentPayload(BaseModel):
    finding_id: str
    data_principal_name: str
    consent_confirmed: bool
    dpdp_section: str = "Section 12(1), Digital Personal Data Protection Act 2023"
    signature_timestamp: str

class RescanResult(BaseModel):
    finding_id: str
    broker_name: str
    status: str
    is_delisted: bool
    is_reappeared: bool
    before_hash: str
    current_hash: Optional[str] = None
    audit_certificate: Optional[str] = None
