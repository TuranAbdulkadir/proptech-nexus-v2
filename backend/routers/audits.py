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

# Mock price and address store — in production this queries the `properties` table
MOCK_PROPERTIES = {
    "prop-1": {"price": 5500000, "address": "Wall Street Tower Alpha"},
    "prop-2": {"price": 12500000, "address": "Times Square Penthouse"},
    "prop-3": {"price": 8000000, "address": "Empire Sector Node"},
    "prop-4": {"price": 1200000, "address": "Cyber Node Alpha"},
    "prop-5": {"price": 2500000, "address": "Neon Heights"},
    "prop-6": {"price": 800000, "address": "Grid Sector 7"},
    "prop-7": {"price": 18000000, "address": "Financial District Hub"},
    "prop-8": {"price": 9500000, "address": "MoMA Sky-Loft"},
    "prop-9": {"price": 3400000, "address": "Pace University Node"},
    "prop-10": {"price": 4200000, "address": "Union Square Condo"},
    "prop-11": {"price": 6700000, "address": "SoHo Art District Hub"},
}


def _build_audit(property_id: str) -> Dict[str, Any]:
    """Internal helper to build the full audit payload."""
    prop_info = MOCK_PROPERTIES.get(property_id, {"price": 2000000, "address": "Unknown Property"})
    price = prop_info["price"]

    financials = auditor_service.generate_financials(price)
    cyber = auditor_service.run_cyber_physical_scan(property_id)
    climate = auditor_service.run_climate_hazard_scan(property_id)

    # Simulate Gemini AI structural defect detection
    random.seed(sum(ord(c) for c in property_id) + 2)
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
    return _build_audit(property_id)


@router.get("/{property_id}/pdf")
async def download_audit_pdf(property_id: str):
    """
    Generates and streams a professional Sovereign Audit PDF report.
    """
    audit = _build_audit(property_id)
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
