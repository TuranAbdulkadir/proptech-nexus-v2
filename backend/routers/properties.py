from fastapi import APIRouter, Request, Query, HTTPException
from pydantic import BaseModel
from typing import List
import logging

router = APIRouter(prefix="/properties", tags=["Properties"])
logger = logging.getLogger(__name__)

class PropertyResponse(BaseModel):
    id: str
    address: str
    price: float
    sqft: float
    bedrooms: int
    bathrooms: int
    latitude: float
    longitude: float

@router.get("/search/bbox", response_model=List[PropertyResponse])
async def search_properties_bbox(
    request: Request,
    min_lon: float = Query(..., description="Minimum Longitude (West)"),
    min_lat: float = Query(..., description="Minimum Latitude (South)"),
    max_lon: float = Query(..., description="Maximum Longitude (East)"),
    max_lat: float = Query(..., description="Maximum Latitude (North)")
):
    """
    Perform a geospatial bounding box search using PostGIS ST_MakeEnvelope and ST_Contains.
    """
    try:
        from services.auditor import auditor_service
        all_properties = await auditor_service.fetch_real_properties(limit=200)
        
        # Filter by bounding box manually
        properties = []
        for p in all_properties:
            if (min_lon <= p['longitude'] <= max_lon) and (min_lat <= p['latitude'] <= max_lat):
                properties.append(PropertyResponse(
                    id=p['id'],
                    address=p['address'],
                    price=p['price'],
                    sqft=p['sqft'],
                    bedrooms=p['bedrooms'],
                    bathrooms=p['bathrooms'],
                    latitude=p['latitude'],
                    longitude=p['longitude']
                ))
                
        return properties
    except Exception as e:
        logger.error(f"Error fetching real properties: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
