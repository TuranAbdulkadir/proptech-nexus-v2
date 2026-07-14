import { pgTable, uuid, varchar, text, decimal, integer, timestamp, customType } from 'drizzle-orm/pg-core';

// Custom PostGIS Geometry Types
const geometryPoint = customType<{ data: string, driverData: string }>({
  dataType() {
    return 'geometry(Point, 4326)';
  },
  toDriver(value: string) {
    return value;
  },
  fromDriver(value: string) {
    return value;
  },
});

const geometryPolygon = customType<{ data: string, driverData: string }>({
  dataType() {
    return 'geometry(Polygon, 4326)';
  },
  toDriver(value: string) {
    return value;
  },
  fromDriver(value: string) {
    return value;
  },
});

export const countries = pgTable('countries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  isoCode: varchar('iso_code', { length: 3 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const riskAndTaxZones = pgTable('risk_and_tax_zones', {
  id: uuid('id').primaryKey().defaultRandom(),
  countryId: uuid('country_id').references(() => countries.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  geom: geometryPolygon('geom').notNull(),
  propertyTaxRate: decimal('property_tax_rate', { precision: 5, scale: 4 }).notNull(),
  floodRiskScore: integer('flood_risk_score'),
  seismicRiskScore: integer('seismic_risk_score'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  countryId: uuid('country_id').references(() => countries.id, { onDelete: 'cascade' }),
  address: text('address').notNull(),
  geom: geometryPoint('geom').notNull(),
  price: decimal('price', { precision: 15, scale: 2 }).notNull(),
  sqft: decimal('sqft', { precision: 10, scale: 2 }).notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const propertySecurityAudits = pgTable('property_security_audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).unique(),
  iotOpenPorts: text('iot_open_ports').array().default([]),
  crimeRateIndex: integer('crime_rate_index'),
  cyberSecurityScore: integer('cyber_security_score'),
  lastScannedAt: timestamp('last_scanned_at').defaultNow(),
});

export const propertyInvestmentAudits = pgTable('property_investment_audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).unique(),
  grossRent: decimal('gross_rent', { precision: 15, scale: 2 }).notNull(),
  mortgage: decimal('mortgage', { precision: 15, scale: 2 }).notNull(),
  propertyTax: decimal('property_tax', { precision: 15, scale: 2 }).notNull(),
  insurance: decimal('insurance', { precision: 15, scale: 2 }).notNull(),
  hoaFee: decimal('hoa_fee', { precision: 15, scale: 2 }).notNull(),
  vacancyReserve: decimal('vacancy_reserve', { precision: 15, scale: 2 }).notNull(),
  netCashflow: decimal('net_cashflow', { precision: 15, scale: 2 }).notNull(),
  annualizedRoi: decimal('annualized_roi', { precision: 8, scale: 4 }).notNull(),
  fairMarketValue: decimal('fair_market_value', { precision: 15, scale: 2 }).notNull(),
  calculatedAt: timestamp('calculated_at').defaultNow(),
});

export const aiAudits = pgTable('ai_audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).unique(),
  structuralDefects: text('structural_defects').array().default([]),
  truthVerificationScore: integer('truth_verification_score'),
  auditedAt: timestamp('audited_at').defaultNow(),
});

export const dataSourcesLineage = pgTable('data_sources_lineage', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }),
  apiSource: varchar('api_source', { length: 255 }).notNull(),
  fetchStatus: varchar('fetch_status', { length: 50 }).notNull(),
  rawHash: varchar('raw_hash', { length: 255 }).notNull(),
  fetchedAt: timestamp('fetched_at').defaultNow(),
});
