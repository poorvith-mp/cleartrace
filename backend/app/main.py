"""
ClearTrace FastAPI REST API Entrypoint
Consent-Based Personal Data Removal Backend Engine
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

from .models import (
    UserProfile,
    BrokerListing,
    MatchResult,
    ConsentPayload,
    RescanResult,
    RemovalState
)
from .connectors.site_connectors import scan_all_brokers
from .matching.semantic_hybrid import evaluate_match_solution_b
from .workflow.state_machine import (
    workflow_engine,
    ConsentRequiredException,
    InvalidStateTransitionException
)
from .rescan.verifier import execute_verification_rescan
from .brokers.mock_sites import broker_db

app = FastAPI(
    title="ClearTrace API",
    description="Consent-Governed Personal Data Removal Platform under DPDP Act 2023",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "system": "ClearTrace Privacy Engine",
        "version": "1.0.0",
        "compliance": "DPDP Act 2023 Section 12 & 13",
        "matching_mode": "Solution B (Hybrid RapidFuzz + Dense Sentence Embeddings)",
        "status": "Operational"
    }

@app.post("/api/scan", response_model=List[MatchResult])
def run_scan(profile: UserProfile):
    """
    Executes deep audit across all 5 mock data broker connectors.
    Applies Solution B hybrid matching, registers findings, and flags borderline scores.
    """
    listings = scan_all_brokers()
    results: List[MatchResult] = []

    for idx, listing in enumerate(listings):
        score = evaluate_match_solution_b(profile, listing)
        
        # Only retain matches above discard threshold (>= 65.0)
        if score.solution_b_score >= 65.0:
            finding_id = f"finding-{idx + 1}"
            finding = MatchResult(
                id=finding_id,
                listing=listing,
                score=score,
                state=RemovalState.FOUND,
                is_authorized=False
            )
            workflow_engine.register_finding(finding)
            results.append(finding)

    return results

@app.post("/api/authorize", response_model=MatchResult)
def authorize_removal(consent: ConsentPayload, profile: UserProfile):
    """
    Records explicit user consent and transitions finding to AUTHORISED.
    Generates formal Section 12 DPDP Erasure Notice.
    """
    try:
        updated = workflow_engine.authorize_removal(consent.finding_id, consent, profile)
        return updated
    except KeyError:
        raise HTTPException(status_code=404, detail="Finding not found.")
    except ConsentRequiredException as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/request-removal/{finding_id}", response_model=MatchResult)
def request_removal(finding_id: str):
    """
    Dispatches formal Section 12 notice to data broker.
    HARD GUARDRAIL: Returns 403 Forbidden if not authorized by user!
    """
    try:
        updated = workflow_engine.dispatch_removal_request(finding_id)
        return updated
    except ConsentRequiredException as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Security Invariant Failed: {str(e)}"
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Finding not found.")
    except InvalidStateTransitionException as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/complete-removal/{finding_id}", response_model=MatchResult)
def complete_removal(finding_id: str):
    """
    Simulates broker delisting and expunging record upon receipt of notice.
    """
    try:
        updated = workflow_engine.complete_removal(finding_id)
        return updated
    except KeyError:
        raise HTTPException(status_code=404, detail="Finding not found.")
    except ConsentRequiredException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

@app.post("/api/rescan/{finding_id}", response_model=RescanResult)
def rescan_finding(finding_id: str):
    """
    Executes verification re-scan against broker endpoint.
    Returns HTTP 404 proof diff or flags re-appearance drift.
    """
    if finding_id not in workflow_engine.active_findings:
        raise HTTPException(status_code=404, detail="Finding not found.")
    
    finding = workflow_engine.active_findings[finding_id]
    result = execute_verification_rescan(finding)
    return result

@app.post("/api/simulate-reappearance/{finding_id}")
def simulate_reappearance(finding_id: str):
    """
    Simulates a broker restoring PII to test drift detection.
    """
    if finding_id not in workflow_engine.active_findings:
        raise HTTPException(status_code=404, detail="Finding not found.")
    
    finding = workflow_engine.active_findings[finding_id]
    broker_db.simulate_reappearance(finding.listing.id)
    workflow_engine.record_reappearance(finding_id)
    return {"message": "Re-appearance simulated. Re-scan will alert.", "state": "Re-appeared"}
