"""
Synthetic Indian Profile Generator
Uses Faker en_IN to simulate realistic Indian directories with transliterations,
phone formats (+91, 0-prefix), and same-name distractors.
"""

import re
import random
from typing import List, Dict, Any
from faker import Faker

fake = Faker('en_IN')

# Common transliteration mappings in Indian contexts
TRANSLITERATIONS = {
    "Laxmi": "Lakshmi",
    "Lakshmi": "Laxmi",
    "Pooja": "Puja",
    "Puja": "Pooja",
    "Suresh": "Sureshkumar",
    "Deepak": "Dipak",
    "Vikas": "Bikash",
    "Swathi": "Swati",
    "Sanjay": "Sanjai"
}

# Indian city aliases and common landmark variations
CITY_ALIASES = {
    "Bangalore": ["Bengaluru", "Bangalore Urban", "Bangalore South"],
    "Bengaluru": ["Bangalore", "Bangalore Urban", "Bangalore North"],
    "Bombay": ["Mumbai", "Mumbai Suburban"],
    "Mumbai": ["Bombay", "Mumbai Suburban"],
    "Madras": ["Chennai"],
    "Chennai": ["Madras"],
    "Calcutta": ["Kolkata"],
    "Kolkata": ["Calcutta"]
}

def format_phone_variant(raw_phone: str) -> str:
    """Formats 10-digit number into +91, 0-prefix, or dashed variations."""
    digits = re.sub(r'\D', '', raw_phone)[-10:]
    formats = [
        f"+91 {digits[:5]} {digits[5:]}",
        f"0{digits}",
        f"+91{digits}",
        f"{digits[:5]}-{digits[5:]}",
        digits
    ]
    return random.choice(formats)

def generate_synthetic_profiles(count: int = 20) -> List[Dict[str, Any]]:
    """Generates a synthetic list of Indian profiles with edge-case formatting."""
    profiles = []
    for _ in range(count):
        name = fake.name()
        phone = format_phone_variant(fake.phone_number())
        address = fake.address().replace("\n", ", ")
        company = fake.company()
        job = fake.job()
        
        profiles.append({
            "name": name,
            "phone": phone,
            "address": address,
            "workplace": f"{job}, {company}"
        })
    return profiles

def generate_distractors(target_name: str, count: int = 5) -> List[Dict[str, Any]]:
    """Generates same-name strangers in completely different locations to test false-positive rejection."""
    distractors = []
    cities = ["Jaipur, Rajasthan", "Kolkata, West Bengal", "Bhopal, Madhya Pradesh", "Kochi, Kerala", "Patna, Bihar"]
    for i in range(count):
        distractors.append({
            "name": target_name,
            "phone": format_phone_variant(fake.phone_number()),
            "address": f"Plot {random.randint(10, 999)}, Main Road, {cities[i % len(cities)]}",
            "workplace": f"{fake.job()}, {fake.company()}",
            "is_distractor": True
        })
    return distractors
