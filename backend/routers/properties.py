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
    pool = request.app.state.db_pool
    if not pool:
        raise HTTPException(status_code=500, detail="Database pool not initialized")

    query = """
        SELECT 
            id, 
            address, 
            price, 
            sqft, 
            bedrooms, 
            bathrooms,
            ST_X(geom::geometry) as longitude,
            ST_Y(geom::geometry) as latitude
        FROM properties
        WHERE ST_Contains(
            ST_MakeEnvelope($1, $2, $3, $4, 4326),
            geom::geometry
        );
    """
    
    try:
        async with pool.acquire() as conn:
            records = await conn.fetch(query, min_lon, min_lat, max_lon, max_lat)
            
        properties = []
        for record in records:
            properties.append(PropertyResponse(
                id=str(record['id']),
                address=record['address'],
                price=float(record['price']),
                sqft=float(record['sqft']),
                bedrooms=record['bedrooms'],
                bathrooms=record['bathrooms'],
                latitude=float(record['latitude']),
                longitude=float(record['longitude'])
            ))
            
        return properties
    except Exception as e:
        logger.error(f"Error executing PostGIS query: {e}")
        raise HTTPException(status_code=500, detail="Error fetching spatial data")
