-- PropTech-Nexus v2 SQL Schema
-- Ensure PostGIS and uuid-ossp extensions are enabled
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Countries Table
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    iso_code VARCHAR(3) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Risk and Tax Zones Table (Using Polygon for Geofencing)
CREATE TABLE IF NOT EXISTS risk_and_tax_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    geom geometry(Polygon, 4326) NOT NULL,
    property_tax_rate DECIMAL(5,4) NOT NULL, -- e.g., 0.0125 for 1.25%
    flood_risk_score INTEGER CHECK (flood_risk_score >= 0 AND flood_risk_score <= 100),
    seismic_risk_score INTEGER CHECK (seismic_risk_score >= 0 AND seismic_risk_score <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing spatial data for zones
CREATE INDEX IF NOT EXISTS idx_risk_and_tax_zones_geom ON risk_and_tax_zones USING GIST (geom);

-- 3. Properties Table (Using Point for exact location)
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    geom geometry(Point, 4326) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    sqft DECIMAL(10,2) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing spatial data for properties
CREATE INDEX IF NOT EXISTS idx_properties_geom ON properties USING GIST (geom);

-- 4. Property Security Audits
CREATE TABLE IF NOT EXISTS property_security_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID UNIQUE REFERENCES properties(id) ON DELETE CASCADE,
    iot_open_ports TEXT[] DEFAULT '{}',
    crime_rate_index INTEGER CHECK (crime_rate_index >= 0 AND crime_rate_index <= 100),
    cyber_security_score INTEGER CHECK (cyber_security_score >= 0 AND cyber_security_score <= 100),
    last_scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Property Investment Audits
CREATE TABLE IF NOT EXISTS property_investment_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID UNIQUE REFERENCES properties(id) ON DELETE CASCADE,
    gross_rent DECIMAL(15,2) NOT NULL,
    mortgage DECIMAL(15,2) NOT NULL,
    property_tax DECIMAL(15,2) NOT NULL,
    insurance DECIMAL(15,2) NOT NULL,
    hoa_fee DECIMAL(15,2) NOT NULL,
    vacancy_reserve DECIMAL(15,2) NOT NULL,
    net_cashflow DECIMAL(15,2) NOT NULL,
    annualized_roi DECIMAL(8,4) NOT NULL, -- e.g., 0.0850 for 8.5%
    fair_market_value DECIMAL(15,2) NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI Audits (Gemini visual defects and truth verification)
CREATE TABLE IF NOT EXISTS ai_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID UNIQUE REFERENCES properties(id) ON DELETE CASCADE,
    structural_defects TEXT[] DEFAULT '{}',
    truth_verification_score INTEGER CHECK (truth_verification_score >= 0 AND truth_verification_score <= 100),
    audited_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Data Sources Lineage
CREATE TABLE IF NOT EXISTS data_sources_lineage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    api_source VARCHAR(255) NOT NULL, -- e.g., 'Shodan', 'Zillow', 'Gemini'
    fetch_status VARCHAR(50) NOT NULL, -- e.g., 'SUCCESS', 'FAILED'
    raw_hash VARCHAR(255) NOT NULL, -- Cryptographic hash of raw response
    fetched_at TIMESTAMPTZ DEFAULT NOW()
);
