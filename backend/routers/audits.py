from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import Response
import logging

from services.gemini_service import GeminiAuditor
from services.pdf_generator import generate_audit_report

router = APIRouter(prefix="/audits", tags=["Audits"])
logger = logging.getLogger(__name__)

@router.post("/{property_id}/analyze")
async def trigger_ai_analysis(property_id: str, request: Request):
    """
    Triggers the async Gemini multimodal pipeline.
    Identifies structural defects and sanitizes descriptions.
    """
    logger.info(f"Triggering Gemini AI analysis for property {property_id}")
    
    # In production, images would be pulled dynamically from Supabase storage
    mock_images = ["https://fake-s3-bucket.com/properties/img1.jpg"]
    
    try:
        defects = await GeminiAuditor.analyze_property_media(mock_images)
        sanitized_desc = await GeminiAuditor.sanitize_description("Amazing beautiful home with crazy ROI! Must see!")
        
        # Here we would persist `defects` array to the `ai_audits` PostGIS schema table
        
        return {
            "status": "success",
            "property_id": property_id,
            "defects": defects,
            "sanitized_description": sanitized_desc
        }
    except Exception as e:
        logger.error(f"Gemini Analysis failed: {e}")
        raise HTTPException(status_code=500, detail="AI Analysis pipeline failed")

@router.get("/{property_id}/pdf")
async def download_audit_pdf(property_id: str, request: Request):
    """
    Serves the compiled PropTech PDF report as a binary streaming response.
    Highly optimized to stream directly into the browser without touching disk.
    """
    logger.info(f"Serving PDF Sovereign Audit Report for property {property_id}")
    
    pool = getattr(request.app.state, "db_pool", None)
    if not pool:
        logger.warning("Database connection pool unavailable, falling back to mock generation.")
        
    try:
        pdf_bytes = await generate_audit_report(pool, property_id)
        
        # Serve bytes dynamically
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=PropTech_Sovereign_Audit_{property_id}.pdf"
            }
        )
    except Exception as e:
        logger.error(f"PDF generation failed: {e}")
        raise HTTPException(status_code=500, detail="PDF document generation failed")
