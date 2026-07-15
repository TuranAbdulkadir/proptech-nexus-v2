from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from typing import Dict, Any
import logging
import random
import io
import asyncio
from services.auditor import auditor_service
from services.pdf_generator import generate_audit_pdf

router = APIRouter(prefix="/audits", tags=["Audits"])
logger = logging.getLogger(__name__)

async def _build_audit(property_id: str) -> Dict[str, Any]:
    """Internal helper to build the full audit payload using real NYC data."""
    # Find property in our cached real data
    all_properties = await auditor_service.fetch_real_properties(limit=200)
    prop_info = next((p for p in all_properties if p["id"] == property_id), None)
    
    if not prop_info:
        prop_info = {"price": 2000000, "address": "Unknown NYC Property", "latitude": 40.7, "longitude": -74.0}
        
    price = prop_info["price"]
    
    # Fetch real crime density for this location
    crime_density = await auditor_service.fetch_real_crime_density(prop_info.get("latitude", 40.7), prop_info.get("longitude", -74.0))

    financials = auditor_service.generate_financials(price)
    cyber = auditor_service.run_cyber_physical_scan(property_id, crime_density)
    climate = auditor_service.run_climate_hazard_scan(property_id)

    # Deterministic defects simulation based on hash (because we don't have real structural defects for all NYC buildings)
    import hashlib
    seed_val = int(hashlib.sha256(property_id.encode('utf-8')).hexdigest()[:8], 16)
    random.seed(seed_val + 2)
    defects = []
    if random.random() > 0.4:
        num_defects = random.randint(1, 3)
        defect_types = ["Structural Crack", "Water Damage", "Roof Sag", "Foundation Shift", "Mold Growth", "Electrical Fault"]
        for _ in range(num_defects):
            defects.append({
                "type": random.choice(defect_types),
                "box": [round(random.uniform(0.05, 0.35), 2), round(random.uniform(0.05, 0.35), 2),
                        round(random.uniform(0.55, 0.95), 2), round(random.uniform(0.55, 0.95), 2)],
                "confidence": round(random.uniform(0.72, 0.98), 2)
            })

    return {
        "id": property_id,
        "address": prop_info["address"],
        **financials,
        **cyber,
        **climate,
        "structuralDefects": defects
    }


@router.get("/{property_id}")
async def get_property_audit(property_id: str) -> Dict[str, Any]:
    """
    Aggregates financial, cyber-security, and climate intelligence for a property.
    """
    return await _build_audit(property_id)


@router.get("/{property_id}/pdf")
async def download_audit_pdf(property_id: str):
    """
    Generates and streams a professional Sovereign Audit PDF report.
    """
    audit = await _build_audit(property_id)
    address = audit.pop("address", "Unknown")

    # Run the CPU-bound PDF generation in a thread pool to avoid blocking the event loop
    pdf_bytes = await asyncio.to_thread(generate_audit_pdf, property_id, address, audit)

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="PropTech_Audit_{property_id}.pdf"'
        }
    )
