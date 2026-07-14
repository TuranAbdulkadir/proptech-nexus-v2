import logging
import asyncio
import hashlib
from typing import Dict, Any

from services.hunter_service import HunterService, RawPropertyData
from services.auditor_service import AuditorService

logger = logging.getLogger(__name__)

class PipelineOrchestrator:
    def __init__(self, db_pool):
        """
        Initialize the orchestrator with an established asyncpg connection pool.
        """
        self.db_pool = db_pool

    async def run_ingestion_pipeline(self):
        """
        Triggers hunter_service to ingest new listings, pipes them directly into 
        auditor_service for risk/tax evaluation, and triggers the Macro-Financial logic.
        """
        logger.info("Starting PropTech-Nexus Data Pipeline...")
        
        # 1. Concurrent Hunter Ingestion
        mls_task = asyncio.create_task(HunterService.fetch_mls_api(limit=5))
        eu_task = asyncio.create_task(HunterService.scrape_european_listings("https://fake-eu-real-estate.com/berlin"))
        
        mls_data, eu_data = await asyncio.gather(mls_task, eu_task)
        all_raw_data = mls_data + eu_data
        
        # 2. Process properties concurrently to optimize throughput
        tasks = [self.process_single_property(prop) for prop in all_raw_data]
        await asyncio.gather(*tasks)
        
        logger.info("Pipeline execution completed successfully.")

    async def process_single_property(self, prop: RawPropertyData):
        try:
            # 3. Resolve Coordinates via Geocoding
            lon, lat = await HunterService.geocode_address(prop.address)
            if lon is None or lat is None:
                logger.warning(f"Dropping {prop.address} due to fatal geocoding failure.")
                return
                
            prop.longitude = lon
            prop.latitude = lat
            
            # 4. Global Auditor Evaluation (Concurrent Sub-Tasks)
            tax_task = asyncio.create_task(AuditorService.fetch_tax_rate(self.db_pool, lon, lat))
            climate_task = asyncio.create_task(AuditorService.fetch_climate_hazards(lon, lat))
            crime_task = asyncio.create_task(AuditorService.fetch_crime_data(lon, lat))
            
            tax_rate, climate_data, crime_rate = await asyncio.gather(tax_task, climate_task, crime_task)
            
            # 5. Macro-Financial ROI Engine
            # Formula calculation adjusting against expenses
            gross_rent = prop.price * 0.008  # Baseline assumed 0.8% rent rule
            mortgage = (prop.price * 0.8) * 0.006 # Simple monthly mortgage proxy
            monthly_property_tax = (prop.price * tax_rate) / 12
            monthly_insurance = (prop.price * 0.003 * climate_data.get("insurance_multiplier", 1.0)) / 12
            hoa_fee = 200.0
            vacancy_reserve = gross_rent * 0.05
            
            net_cashflow = gross_rent - (mortgage + monthly_property_tax + monthly_insurance + hoa_fee + vacancy_reserve)
            
            # Defensive calculation to prevent ZeroDivisionError
            if prop.price > 0:
                annualized_roi = (net_cashflow * 12) / (prop.price * 0.2) 
            else:
                annualized_roi = 0.0
            
            financials = {
                "gross_rent": gross_rent,
                "mortgage": mortgage,
                "property_tax": monthly_property_tax,
                "insurance": monthly_insurance,
                "hoa_fee": hoa_fee,
                "vacancy_reserve": vacancy_reserve,
                "net_cashflow": net_cashflow,
                "annualized_roi": annualized_roi,
                "fair_market_value": prop.price
            }

            # 6. Database Persistence
            await self._save_to_database(prop, crime_rate, financials)
            
        except Exception as e:
            logger.error(f"Error orchestrating property pipeline for {prop.address}: {e}")

    async def _save_to_database(self, prop: RawPropertyData, crime_rate: int, financials: Dict[str, float]):
        """
        Transactional save of all processed components. Ensures data integrity and generates 
        a cryptographic hash of the incoming payload for the Lineage audit table.
        """
        # Cryptographic Data Lineage Tracking
        raw_payload = prop.model_dump_json()
        raw_hash = hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()
        
        async with self.db_pool.acquire() as conn:
            # Enforce atomic transaction
            async with conn.transaction():
                # A. Insert Core Property Point
                prop_query = """
                    INSERT INTO properties (address, geom, price, sqft, bedrooms, bathrooms)
                    VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6, $7)
                    RETURNING id;
                """
                property_id = await conn.fetchval(
                    prop_query, 
                    prop.address, prop.longitude, prop.latitude, 
                    prop.price, prop.sqft, prop.bedrooms, prop.bathrooms
                )
                
                # B. Insert Cyber-Physical Security Audit
                sec_query = """
                    INSERT INTO property_security_audits (property_id, crime_rate_index)
                    VALUES ($1, $2);
                """
                await conn.execute(sec_query, property_id, crime_rate)
                
                # C. Insert Investment Analytics
                inv_query = """
                    INSERT INTO property_investment_audits 
                    (property_id, gross_rent, mortgage, property_tax, insurance, hoa_fee, vacancy_reserve, net_cashflow, annualized_roi, fair_market_value)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
                """
                await conn.execute(
                    inv_query, property_id, financials['gross_rent'], financials['mortgage'],
                    financials['property_tax'], financials['insurance'], financials['hoa_fee'],
                    financials['vacancy_reserve'], financials['net_cashflow'], financials['annualized_roi'],
                    financials['fair_market_value']
                )
                
                # D. Insert Data Traceability Lineage
                lin_query = """
                    INSERT INTO data_sources_lineage (property_id, api_source, fetch_status, raw_hash)
                    VALUES ($1, $2, $3, $4);
                """
                await conn.execute(lin_query, property_id, prop.source_type, 'SUCCESS', raw_hash)
                
                logger.info(f"Committed {property_id} ({prop.address}) completely to Supabase.")
