"use client";
import React, { useState, useCallback, useRef } from "react";
import { Property, PropertyExtended, FilterState } from "../types";
import dynamic from "next/dynamic";
const MapDashboard = dynamic(() => import("./MapDashboard"), { ssr: false });
import FilterHeader from "./FilterHeader";
import AuditSidebar from "./AuditSidebar";
import SecurityTerminal from "./SecurityTerminal";

export default function DashboardClient({ initialMetrics }: { initialMetrics: any }) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<PropertyExtended | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        minPrice: 0,
        maxPrice: 25000000,
        minRoi: 0,
        minSecurityScore: 0,
        hideFloodZones: false,
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://proptech-nexus-v2-production.up.railway.app";

    const MOCK_PROPERTIES: Property[] = [
        { id: "prop-1", latitude: 40.7128, longitude: -74.006, price: 5500000, sqft: 4200, bedrooms: 3, bathrooms: 4, address: "Wall Street Tower Alpha" },
        { id: "prop-2", latitude: 40.758, longitude: -73.9855, price: 12500000, sqft: 6500, bedrooms: 5, bathrooms: 6, address: "Times Square Penthouse" },
        { id: "prop-3", latitude: 40.7484, longitude: -73.9857, price: 8000000, sqft: 5000, bedrooms: 0, bathrooms: 2, address: "Empire Sector Node" },
        { id: "prop-4", latitude: 40.7306, longitude: -73.9352, price: 1200000, sqft: 1500, bedrooms: 2, bathrooms: 1, address: "Cyber Node Alpha" },
        { id: "prop-5", latitude: 40.7406, longitude: -73.9452, price: 2500000, sqft: 2200, bedrooms: 3, bathrooms: 2, address: "Neon Heights" },
        { id: "prop-6", latitude: 40.7206, longitude: -73.9252, price: 800000, sqft: 1200, bedrooms: 1, bathrooms: 1, address: "Grid Sector 7" },
        { id: "prop-7", latitude: 40.705, longitude: -74.009, price: 18000000, sqft: 12000, bedrooms: 0, bathrooms: 8, address: "Financial District Hub" },
        { id: "prop-8", latitude: 40.7614, longitude: -73.9776, price: 9500000, sqft: 4800, bedrooms: 4, bathrooms: 4, address: "MoMA Sky-Loft" },
        { id: "prop-9", latitude: 40.7112, longitude: -74.0, price: 3400000, sqft: 2800, bedrooms: 0, bathrooms: 2, address: "Pace University Node" },
        { id: "prop-10", latitude: 40.735, longitude: -73.992, price: 4200000, sqft: 3100, bedrooms: 3, bathrooms: 3, address: "Union Square Condo" },
        { id: "prop-11", latitude: 40.725, longitude: -74.0, price: 6700000, sqft: 4000, bedrooms: 0, bathrooms: 4, address: "SoHo Art District Hub" },
    ];

    const handleBoundsChange = useCallback(
        async (bounds: { minLon: number; minLat: number; maxLon: number; maxLat: number }) => {
            try {
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                abortControllerRef.current = new AbortController();

                const params = new URLSearchParams({
                    min_lon: bounds.minLon.toString(),
                    min_lat: bounds.minLat.toString(),
                    max_lon: bounds.maxLon.toString(),
                    max_lat: bounds.maxLat.toString(),
                });

                const res = await fetch(`${BACKEND_URL}/properties/search/bbox?${params}`, {
                    signal: abortControllerRef.current.signal,
                });

                if (res.ok) {
                    const data: Property[] = await res.json();
                    const filteredData = data.filter((p) => p.price <= filters.maxPrice && p.price >= filters.minPrice);
                    setProperties(filteredData);
                } else {
                    throw new Error("Backend returned non-OK status");
                }
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    const filteredData = MOCK_PROPERTIES.filter(
                        (p) => p.price <= filters.maxPrice && p.price >= filters.minPrice
                    );
                    setProperties(filteredData);
                }
            }
        },
        [filters, BACKEND_URL]
    );

    const handlePropertyClick = async (prop: Property) => {
        setSelectedId(prop.id);

        try {
            const res = await fetch(`${BACKEND_URL}/audits/${prop.id}`);
            if (res.ok) {
                const audit = await res.json();
                const extended: PropertyExtended = {
                    ...prop,
                    opportunityScore: audit.annualizedRoi > 6 ? 8.5 : audit.annualizedRoi > 4 ? 6.0 : 3.5,
                    securityScore: audit.securityScore,
                    hazardScore: audit.floodZone.includes("High") || audit.floodZone.includes("Coastal") ? 75 : audit.floodZone.includes("Moderate") ? 45 : 15,
                    grossRent: audit.grossRent,
                    propertyTax: audit.propertyTax,
                    hoaFee: audit.hoaFee,
                    vacancyBuffer: audit.vacancyBuffer,
                    netCashflow: audit.netCashflow,
                    annualizedRoi: audit.annualizedRoi,
                    openIotPorts: audit.openIotPorts,
                    crimeIndex: audit.crimeIndex,
                    distanceToPolice: audit.distanceToPolice,
                    floodZone: audit.floodZone,
                    seismicSafety: audit.seismicSafety,
                    structuralDefects: audit.structuralDefects || [],
                };
                setSelectedProperty(extended);
                return;
            }
        } catch (err) {
            /* Backend offline — use fallback */
        }

        const seed = prop.id.charCodeAt(prop.id.length - 1);
        const extended: PropertyExtended = {
            ...prop,
            opportunityScore: 4.0 + (seed % 6),
            securityScore: 30 + ((seed * 7) % 65),
            hazardScore: 10 + ((seed * 3) % 70),
            grossRent: prop.price * 0.008,
            propertyTax: (prop.price * 0.0192) / 12,
            hoaFee: 250,
            vacancyBuffer: prop.price * 0.008 * 0.05,
            netCashflow: prop.price * 0.008 - (prop.price * 0.0192) / 12 - 250 - prop.price * 0.008 * 0.05,
            annualizedRoi: ((prop.price * 0.008 - (prop.price * 0.0192) / 12 - 250 - prop.price * 0.008 * 0.05) * 12) / prop.price * 100,
            openIotPorts: seed % 3 === 0 ? ["554 (RTSP/Camera)", "80 (HTTP)"] : seed % 2 === 0 ? ["22 (SSH)"] : [],
            crimeIndex: 15 + ((seed * 5) % 65),
            distanceToPolice: 0.3 + (seed % 5) * 0.7,
            floodZone: seed % 5 === 0 ? "Zone AE (High Risk Floodplain)" : seed % 3 === 0 ? "Zone 500 (Moderate Risk)" : "Zone X (Minimal Risk)",
            seismicSafety: 35 + ((seed * 4) % 60),
            structuralDefects:
                seed % 3 === 0
                    ? [{ type: "Structural Crack", box: [0.12, 0.18, 0.42, 0.52], confidence: 0.88 }]
                    : seed % 2 === 0
                    ? [
                          { type: "Water Damage", box: [0.2, 0.6, 0.5, 0.9], confidence: 0.94 },
                          { type: "Mold Growth", box: [0.55, 0.1, 0.85, 0.4], confidence: 0.91 },
                      ]
                    : [],
        };
        setSelectedProperty(extended);
    };

    return (
        <>
            <FilterHeader filters={filters} onFilterChange={setFilters} />
            <MapDashboard
                properties={properties}
                selectedId={selectedId}
                onPropertyClick={handlePropertyClick}
                onBoundsChange={handleBoundsChange}
            />
            <AuditSidebar property={selectedProperty} onClose={() => { setSelectedProperty(null); setSelectedId(null); }} />
            <SecurityTerminal />
        </>
    );
}
