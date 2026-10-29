"""
Solution A: Fuzzy Matching + Rules Baseline
Uses RapidFuzz token matching with static weights.
Sufficient for simple data, but drops recall on colloquial Indian addresses and landmarks.
"""

import re
from rapidfuzz import fuzz, distance
from ..models import UserProfile, BrokerListing

def normalize_phone(phone: str) -> str:
    """Extracts trailing 10 digits."""
    if not phone or "hidden" in phone.lower() or "exposed" in phone.lower():
        return ""
    digits = re.sub(r'\D', '', phone)
    return digits[-10:] if len(digits) >= 10 else digits

def compute_phone_similarity(p1: str, p2: str) -> float:
    """
    Evaluates phone similarity based on discrete identity.
    If 10-digit numbers differ by > 2 digits, similarity is 0.0.
    """
    u_p = normalize_phone(p1)
    l_p = normalize_phone(p2)

    if not u_p or not l_p:
        return 0.0

    if u_p == l_p:
        return 100.0

    # Calculate Levenshtein distance
    dist = distance.Levenshtein.distance(u_p, l_p)
    if dist == 1:
        return 70.0  # Likely single-digit typo
    elif dist == 2:
        return 40.0
    return 0.0

def score_solution_a(profile: UserProfile, listing: BrokerListing) -> float:
    """
    Computes Solution A rule-based fuzzy score:
    Name: 40%, Phone: 40%, Address: 20%
    """
    # 1. Name match
    name_score = fuzz.token_sort_ratio(profile.name.lower(), listing.exposed_name.lower())
    
    # 2. Phone match
    phone_score = compute_phone_similarity(profile.phone, listing.exposed_phone)
    
    # 3. Address match (pure token sort ratio)
    address_score = fuzz.token_sort_ratio(profile.address.lower(), listing.exposed_address.lower())
    
    # Fixed weights
    composite = (0.40 * name_score) + (0.40 * phone_score) + (0.20 * address_score)
    return round(composite, 1)
