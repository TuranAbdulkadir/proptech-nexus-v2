-- =================================================================================
-- PROPTECH-NEXUS V2 - SUPABASE ROW LEVEL SECURITY (RLS) HARDENING
-- =================================================================================

-- 1. Enable RLS heavily on all data tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_security_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_investment_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources_lineage ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_and_tax_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- =================================================================================
-- READ POLICIES (PUBLIC)
-- Allow public access for SELECT queries from the Next.js edge frontend mapping UI
-- =================================================================================
CREATE POLICY "Allow public read access for properties" ON properties FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access for security audits" ON property_security_audits FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access for investment audits" ON property_investment_audits FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access for ai audits" ON ai_audits FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access for risk_and_tax_zones" ON risk_and_tax_zones FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access for countries" ON countries FOR SELECT TO public USING (true);

-- NOTE: `data_sources_lineage` deliberately lacks a public read policy.
-- The raw data hashes and API execution statuses are sensitive internal audit trails.

-- =================================================================================
-- WRITE/DELETE POLICIES (SERVICE_ROLE ONLY)
-- Restrict all mutating operations exclusively to the authenticated FastAPI microservice 
-- utilizing the secure 'service_role' key.
-- =================================================================================
CREATE POLICY "Allow service_role write access for properties" ON properties FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role write access for security audits" ON property_security_audits FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role write access for investment audits" ON property_investment_audits FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role write access for ai audits" ON ai_audits FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role write access for risk_and_tax_zones" ON risk_and_tax_zones FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role write access for countries" ON countries FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access for lineage" ON data_sources_lineage FOR ALL TO service_role USING (true) WITH CHECK (true);
