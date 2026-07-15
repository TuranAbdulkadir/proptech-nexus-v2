"use client";
import React, { useState, useCallback, useRef, useMemo } from "react";
import { Property, PropertyExtended, FilterState } from "../types";
import dynamic from "next/dynamic";
const MapDashboard = dynamic(() => import("./MapDashboard"), { ssr: false });
import FilterHeader from "./FilterHeader";
import AuditSidebar from "./AuditSidebar";
import SecurityTerminal from "./SecurityTerminal";
import StatsPanel from "./StatsPanel";

function generateMockProperties(): Property[] {
    const neighborhoods = [
        { name: "Wall Street Tower", lat: 40.7074, lng: -74.0113, priceBase: 6000000, sqftBase: 4000 },
        { name: "Times Square Loft", lat: 40.7580, lng: -73.9855, priceBase: 11000000, sqftBase: 5500 },
        { name: "Empire State Hub", lat: 40.7484, lng: -73.9857, priceBase: 8500000, sqftBase: 4800 },
        { name: "Gramercy Park Villa", lat: 40.7376, lng: -73.9856, priceBase: 4200000, sqftBase: 2800 },
        { name: "East Village Node", lat: 40.7265, lng: -73.9815, priceBase: 1800000, sqftBase: 1400 },
        { name: "SoHo Art District", lat: 40.7233, lng: -74.0030, priceBase: 7200000, sqftBase: 3500 },
        { name: "TriBeCa Penthouse", lat: 40.7163, lng: -74.0086, priceBase: 15000000, sqftBase: 7000 },
        { name: "Chelsea Market Unit", lat: 40.7425, lng: -74.0061, priceBase: 3800000, sqftBase: 2200 },
        { name: "Midtown Executive", lat: 40.7549, lng: -73.9840, priceBase: 9800000, sqftBase: 5200 },
        { name: "Upper East Side", lat: 40.7736, lng: -73.9566, priceBase: 12500000, sqftBase: 6000 },
        { name: "Upper West Side", lat: 40.7870, lng: -73.9754, priceBase: 8900000, sqftBase: 4500 },
        { name: "Harlem Renaissance", lat: 40.8116, lng: -73.9465, priceBase: 950000, sqftBase: 1100 },
        { name: "Financial District", lat: 40.7075, lng: -74.0089, priceBase: 17000000, sqftBase: 11000 },
        { name: "Brooklyn Heights", lat: 40.6960, lng: -73.9936, priceBase: 3200000, sqftBase: 2400 },
        { name: "Williamsburg Loft", lat: 40.7081, lng: -73.9571, priceBase: 2100000, sqftBase: 1800 },
        { name: "DUMBO Studio", lat: 40.7033, lng: -73.9883, priceBase: 4500000, sqftBase: 2600 },
        { name: "Park Slope Villa", lat: 40.6681, lng: -73.9822, priceBase: 2800000, sqftBase: 2200 },
        { name: "Bushwick Creative", lat: 40.6944, lng: -73.9213, priceBase: 850000, sqftBase: 1000 },
        { name: "LIC Waterfront", lat: 40.7425, lng: -73.9580, priceBase: 3600000, sqftBase: 2500 },
        { name: "Astoria Complex", lat: 40.7720, lng: -73.9300, priceBase: 1500000, sqftBase: 1300 },
        { name: "Flushing Tower", lat: 40.7580, lng: -73.8330, priceBase: 1200000, sqftBase: 1100 },
        { name: "Jamaica Estates", lat: 40.7164, lng: -73.7834, priceBase: 780000, sqftBase: 2000 },
        { name: "Hudson Yards", lat: 40.7537, lng: -74.0008, priceBase: 22000000, sqftBase: 9000 },
        { name: "Hell's Kitchen", lat: 40.7632, lng: -73.9934, priceBase: 2900000, sqftBase: 1900 },
        { name: "Murray Hill", lat: 40.7488, lng: -73.9753, priceBase: 3400000, sqftBase: 2100 },
        { name: "Flatiron Loft", lat: 40.7411, lng: -73.9897, priceBase: 5600000, sqftBase: 3200 },
        { name: "Kips Bay Tower", lat: 40.7425, lng: -73.9790, priceBase: 2700000, sqftBase: 1800 },
        { name: "NoHo Gallery", lat: 40.7265, lng: -73.9927, priceBase: 6100000, sqftBase: 3000 },
        { name: "Lower East Side", lat: 40.7150, lng: -73.9843, priceBase: 1600000, sqftBase: 1200 },
        { name: "Battery Park City", lat: 40.7117, lng: -74.0160, priceBase: 7800000, sqftBase: 4200 },
        { name: "Chinatown Node", lat: 40.7158, lng: -73.9971, priceBase: 1300000, sqftBase: 900 },
        { name: "Little Italy", lat: 40.7191, lng: -73.9973, priceBase: 3100000, sqftBase: 1600 },
        { name: "Morningside Hts", lat: 40.8086, lng: -73.9622, priceBase: 1100000, sqftBase: 1300 },
        { name: "Washington Hts", lat: 40.8398, lng: -73.9395, priceBase: 650000, sqftBase: 900 },
        { name: "Inwood Green", lat: 40.8677, lng: -73.9212, priceBase: 520000, sqftBase: 800 },
        { name: "Cobble Hill", lat: 40.6862, lng: -73.9962, priceBase: 3500000, sqftBase: 2600 },
        { name: "Red Hook Yard", lat: 40.6730, lng: -74.0060, priceBase: 1900000, sqftBase: 3500 },
        { name: "Greenpoint Studio", lat: 40.7295, lng: -73.9514, priceBase: 1700000, sqftBase: 1400 },
        { name: "Crown Heights", lat: 40.6694, lng: -73.9507, priceBase: 920000, sqftBase: 1500 },
        { name: "Bed-Stuy Classic", lat: 40.6872, lng: -73.9418, priceBase: 1050000, sqftBase: 1700 },
        { name: "Fort Greene", lat: 40.6887, lng: -73.9762, priceBase: 2400000, sqftBase: 2000 },
        { name: "Prospect Park W", lat: 40.6603, lng: -73.9806, priceBase: 4800000, sqftBase: 3200 },
        { name: "Bay Ridge Manor", lat: 40.6340, lng: -74.0281, priceBase: 1400000, sqftBase: 2400 },
        { name: "Staten Island Hub", lat: 40.6435, lng: -74.0768, priceBase: 480000, sqftBase: 1800 },
        { name: "Bronx River Tower", lat: 40.8376, lng: -73.8631, priceBase: 550000, sqftBase: 1100 },
        { name: "Fordham Heights", lat: 40.8614, lng: -73.8981, priceBase: 420000, sqftBase: 950 },
        { name: "Riverdale Estate", lat: 40.8961, lng: -73.9110, priceBase: 1800000, sqftBase: 3200 },
        { name: "City Island Dock", lat: 40.8468, lng: -73.7876, priceBase: 750000, sqftBase: 1600 },
    ];

    return neighborhoods.map((n, i) => {
        const jitterLat = (Math.sin(i * 7.3) * 0.003);
        const jitterLng = (Math.cos(i * 5.1) * 0.004);
        const priceVariation = 1 + (Math.sin(i * 3.7) * 0.15);
        const sqftVariation = 1 + (Math.cos(i * 2.9) * 0.12);
        const bedrooms = i % 7 === 0 ? 0 : 1 + (i % 5);
        const bathrooms = Math.max(1, Math.floor(bedrooms * 0.8));

        return {
            id: `prop-${i + 1}`,
            latitude: n.lat + jitterLat,
            longitude: n.lng + jitterLng,
            price: Math.round(n.priceBase * priceVariation / 1000) * 1000,
            sqft: Math.round(n.sqftBase * sqftVariation / 10) * 10,
            bedrooms,
            bathrooms,
            address: n.name,
        };
    });
}

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
    const MOCK_PROPERTIES = useMemo(() => generateMockProperties(), []);

    const stats = useMemo(() => {
        if (properties.length === 0) return null;
        const prices = properties.map(p => p.price);
        const totalValue = prices.reduce((a, b) => a + b, 0);
        const avgPrice = totalValue / prices.length;
        const maxP = Math.max(...prices);
        const minP = Math.min(...prices);
        const avgSqft = properties.reduce((a, p) => a + (p.sqft || 0), 0) / properties.length;
        return { totalValue, avgPrice, maxP, minP, avgSqft, count: properties.length };
    }, [properties]);

    const handleBoundsChange = useCallback(
        async (bounds: { minLon: number; minLat: number; maxLon: number; maxLat: number }) => {
            try {
                if (abortControllerRef.current) abortControllerRef.current.abort();
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
                    setProperties(data.filter(p => p.price <= filters.maxPrice && p.price >= filters.minPrice));
                } else {
                    throw new Error("Backend non-OK");
                }
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    const inBounds = MOCK_PROPERTIES.filter(p =>
                        p.latitude >= bounds.minLat && p.latitude <= bounds.maxLat &&
                        p.longitude >= bounds.minLon && p.longitude <= bounds.maxLon
                    );
                    setProperties(inBounds.filter(p => p.price <= filters.maxPrice && p.price >= filters.minPrice));
                }
            }
        },
        [filters, BACKEND_URL, MOCK_PROPERTIES]
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
        } catch { /* fallback below */ }

        const idx = parseInt(prop.id.split("-")[1]) || 1;
        const s = idx * 17;
        const defectTypes = ["Structural Crack", "Water Damage", "Mold Growth", "Roof Sag", "Foundation Shift", "Electrical Fault"];
        const defects = [];
        if (s % 3 === 0) defects.push({ type: defectTypes[s % 6], box: [0.1 + (s % 3) * 0.1, 0.15 + (s % 4) * 0.05, 0.4 + (s % 3) * 0.1, 0.5 + (s % 4) * 0.05] as [number, number, number, number], confidence: 0.75 + (s % 25) * 0.01 });
        if (s % 5 === 0) defects.push({ type: defectTypes[(s + 2) % 6], box: [0.5, 0.55, 0.85, 0.9] as [number, number, number, number], confidence: 0.82 + (s % 15) * 0.01 });

        const grossRent = prop.price * 0.008;
        const propTax = (prop.price * 0.0192) / 12;
        const hoa = 250 + (idx * 37) % 400;
        const vacancy = grossRent * 0.05;
        const net = grossRent - propTax - hoa - vacancy;

        setSelectedProperty({
            ...prop,
            opportunityScore: 3.0 + (s % 7),
            securityScore: 25 + (s % 70),
            hazardScore: 5 + (s % 80),
            grossRent, propertyTax: propTax, hoaFee: hoa, vacancyBuffer: vacancy,
            netCashflow: net,
            annualizedRoi: (net * 12) / prop.price * 100,
            openIotPorts: s % 4 === 0 ? ["554 (RTSP/Camera)", "80 (HTTP)"] : s % 3 === 0 ? ["22 (SSH)"] : s % 5 === 0 ? ["443 (HTTPS)", "21 (FTP)"] : [],
            crimeIndex: 10 + (s % 70),
            distanceToPolice: 0.2 + (s % 40) * 0.1,
            floodZone: s % 7 === 0 ? "Zone AE (High Risk Floodplain)" : s % 5 === 0 ? "Zone VE (Coastal High Hazard)" : s % 3 === 0 ? "Zone 500 (Moderate Risk)" : "Zone X (Minimal Risk)",
            seismicSafety: 20 + (s % 75),
            structuralDefects: defects,
        });
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
            {stats && <StatsPanel stats={stats} />}
        </>
    );
}
