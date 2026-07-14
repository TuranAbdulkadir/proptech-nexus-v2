import random
from typing import Dict, Any, List

class GlobalAuditorService:
    """
    Simulates the Global Auditor (Financial, Threat, and Climate Intelligence).
    In a true production environment, this would call actual APIs (Shodan, Censys, FEMA, etc.).
    """
    
    @staticmethod
    def calculate_property_tax(price: float, state: str = "NY") -> float:
        """Dynamic Property Tax Engine (simulating GeoJSON intersection)."""
        rates = {
            "NY": 0.0192,
            "NJ": 0.0249,
            "CA": 0.0073
        }
        rate = rates.get(state, 0.0120)
        return (price * rate) / 12  # Monthly property tax

    @staticmethod
    def run_cyber_physical_scan(property_id: str) -> Dict[str, Any]:
        """Simulates Shodan/Censys Cyber-Physical Security Intelligence."""
        # Use property_id string as a seed for deterministic randomness
        seed_val = sum(ord(c) for c in property_id)
        random.seed(seed_val)
        
        security_score = random.randint(40, 95)
        crime_index = random.randint(15, 80)
        distance_to_police = round(random.uniform(0.1, 4.5), 1)
        
        # Simulate open ports
        possible_ports = ['80 (HTTP)', '443 (HTTPS)', '554 (RTSP/Camera)', '22 (SSH)', '21 (FTP)']
        open_ports = random.sample(possible_ports, k=random.randint(0, 3))
        
        # If camera port is open, lower the score significantly
        if '554 (RTSP/Camera)' in open_ports:
            security_score = max(10, security_score - 30)

        return {
            "securityScore": security_score,
            "crimeIndex": crime_index,
            "distanceToPolice": distance_to_police,
            "openIotPorts": open_ports
        }

    @staticmethod
    def run_climate_hazard_scan(property_id: str) -> Dict[str, Any]:
        """Simulates Climate & Hazard Scoring (FEMA Flood)."""
        seed_val = sum(ord(c) for c in property_id)
        random.seed(seed_val + 1) # Different seed offset
        
        zones = [
            "Zone X (Minimal Risk)", 
            "Zone AE (High Risk Floodplain)", 
            "Zone VE (Coastal High Hazard)", 
            "Zone 500 (Moderate Risk)"
        ]
        
        zone = random.choice(zones)
        seismic = random.randint(20, 99)
        
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
        roi = (net_cashflow * 12) / price * 100

        return {
            "grossRent": round(gross_rent, 2),
            "propertyTax": round(tax, 2),
            "hoaFee": hoa,
            "vacancyBuffer": round(vacancy, 2),
            "netCashflow": round(net_cashflow, 2),
            "annualizedRoi": round(roi, 2)
        }

auditor_service = GlobalAuditorService()
