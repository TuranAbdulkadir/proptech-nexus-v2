import hashlib
import httpx
from typing import Dict, Any, List
from cachetools import TTLCache
import asyncio
from datetime import datetime, timedelta

nyc_data_cache = TTLCache(maxsize=1000, ttl=3600)
nypd_crime_cache = TTLCache(maxsize=1000, ttl=3600)

class GlobalAuditorService:
    """
    Sovereign Node for Real NYC Open Data Integration.
    Fetches real property data (PLUTO) and crime data (NYPD).
    Uses deterministic hashing for IoT vulnerability simulation to remain legally compliant.
    """
    
    @staticmethod
    def calculate_property_tax(price: float, state: str = "NY") -> float:
        """Dynamic Property Tax Engine."""
        rates = {"NY": 0.0192, "NJ": 0.0249, "CA": 0.0073}
        rate = rates.get(state, 0.0192)
        return (price * rate) / 12

    @staticmethod
    def _deterministic_hash(seed_str: str) -> int:
        """Cryptographic deterministic seed using SHA-256 for legal compliance."""
        h = hashlib.sha256(seed_str.encode('utf-8')).hexdigest()
        return int(h[:8], 16)

    @staticmethod
    def run_cyber_physical_scan(property_id: str, crime_density: int = 0) -> Dict[str, Any]:
        """
        Uses deterministic hashing of property BBL to simulate Shodan/Censys.
        Integrates real crime density to affect the security score.
        """
        seed = GlobalAuditorService._deterministic_hash(property_id)
        
        base_security = 40 + (seed % 60)
        
        security_score = max(10, base_security - (crime_density * 2))
        
        possible_ports = ['80 (HTTP)', '443 (HTTPS)', '554 (RTSP/Camera)', '22 (SSH)', '21 (FTP)', '3389 (RDP)']
        num_ports = seed % 4
        open_ports = []
        temp_seed = seed
        for _ in range(num_ports):
            port = possible_ports[temp_seed % len(possible_ports)]
            if port not in open_ports:
                open_ports.append(port)
            temp_seed //= 2
            
        if '554 (RTSP/Camera)' in open_ports:
            security_score = max(5, security_score - 15)

        return {
            "securityScore": security_score,
            "crimeIndex": crime_density,
            "distanceToPolice": round(0.1 + (seed % 40) / 10.0, 1),
            "openIotPorts": open_ports
        }

    @staticmethod
    def run_climate_hazard_scan(property_id: str) -> Dict[str, Any]:
        """Simulates Climate & Hazard Scoring (FEMA Flood)."""
        seed = GlobalAuditorService._deterministic_hash(property_id + "_climate")
        
        zones = [
            "Zone X (Minimal Risk)", 
            "Zone AE (High Risk Floodplain)", 
            "Zone VE (Coastal High Hazard)", 
            "Zone 500 (Moderate Risk)"
        ]
        
        zone_idx = seed % 100
        if zone_idx < 10:
            zone = "Zone VE (Coastal High Hazard)"
        elif zone_idx < 25:
            zone = "Zone AE (High Risk Floodplain)"
        elif zone_idx < 40:
            zone = "Zone 500 (Moderate Risk)"
        else:
            zone = "Zone X (Minimal Risk)"
            
        seismic = 20 + (seed % 80)
        
        return {
            "floodZone": zone,
            "seismicSafety": seismic
        }

    @staticmethod
    def generate_financials(price: float) -> Dict[str, float]:
        gross_rent = price * 0.008
        tax = GlobalAuditorService.calculate_property_tax(price)
        hoa = 250.0
        vacancy = gross_rent * 0.05
        net_cashflow = gross_rent - tax - hoa - vacancy
        roi = (net_cashflow * 12) / price * 100 if price > 0 else 0

        return {
            "grossRent": round(gross_rent, 2),
            "propertyTax": round(tax, 2),
            "hoaFee": hoa,
            "vacancyBuffer": round(vacancy, 2),
            "netCashflow": round(net_cashflow, 2),
            "annualizedRoi": round(roi, 2)
        }

    @staticmethod
    async def fetch_real_properties(limit: int = 50) -> List[Dict[str, Any]]:
        """Fetches real building data from NYC Open Data (PLUTO)."""
        cache_key = f"pluto_real_{limit}"
        if cache_key in nyc_data_cache:
            return nyc_data_cache[cache_key]

        from urllib.parse import quote
        query = "assesstot > 500000 AND assesstot < 100000000 AND latitude IS NOT NULL"
        url = f"https://data.cityofnewyork.us/resource/64uk-42ks.json?$where={quote(query)}&$limit={limit}&$order=assesstot%20DESC"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
            except Exception as e:
                print(f"[SYSTEM WARNING] PLUTO Live Fetch Failed ({e}). Falling back to static real-data snapshot.")
                import json, os
                snapshot_path = os.path.join(os.path.dirname(__file__), 'pluto_snapshot.json')
                try:
                    with open(snapshot_path, 'r') as f:
                        data = json.load(f)
                except Exception as inner_e:
                    print(f"[SYSTEM ERROR] Snapshot also failed: {inner_e}")
                    return []
                
            properties = []
            for item in data:
                try:
                    bbl = item.get("bbl")
                    if not bbl: continue
                    
                    price = float(item.get("assesstot", 0)) * 2
                    sqft = int(item.get("bldgarea", 0))
                    if sqft == 0: sqft = int(item.get("lotarea", 0))
                    
                    if price < 100000 or sqft < 200: continue
                    
                    properties.append({
                        "id": f"nyc-{bbl}",
                        "bbl": bbl,
                        "address": item.get("address", "Unknown Address").title(),
                        "borough": item.get("borough", "NYC").title(),
                        "latitude": float(item.get("latitude")),
                        "longitude": float(item.get("longitude")),
                        "price": round(price),
                        "sqft": sqft,
                        "bedrooms": max(1, sqft // 800),
                        "bathrooms": max(1, sqft // 1200)
                    })
                except (ValueError, TypeError):
                    continue
            
            # Limit properties just in case snapshot has too many
            properties = properties[:limit]
            nyc_data_cache[cache_key] = properties
            return properties

    @staticmethod
    async def fetch_real_crime_density(lat: float, lon: float) -> int:
        """
        Fetches historical crime complaints within ~0.5 miles (approx 0.007 degrees)
        of the given coordinates to calculate a real crime density score.
        """
        cache_key = f"crime_{round(lat, 3)}_{round(lon, 3)}"
        if cache_key in nypd_crime_cache:
            return nypd_crime_cache[cache_key]

        from urllib.parse import quote
        query = f"within_circle(lat_lon, {lat}, {lon}, 800)"
        url = f"https://data.cityofnewyork.us/resource/qgea-i56i.json?$where={quote(query)}&$select=count(*) AS count"
        
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
                count = int(data[0].get("count", 0)) if data else 0
                
                density = min(100, int((count / 5000.0) * 100))
                nypd_crime_cache[cache_key] = density
                return density
            except Exception as e:
                print(f"[SYSTEM ERROR] NYPD Fetch Failed: {e}")
                return 25

auditor_service = GlobalAuditorService()
