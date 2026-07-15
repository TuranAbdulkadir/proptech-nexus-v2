"use client";
import React, { useState, useCallback, useRef, useMemo } from "react";
import { Property, PropertyExtended, FilterState } from "../types";
import dynamic from "next/dynamic";
const MapDashboard = dynamic(() => import("./MapDashboard"), { ssr: false });
import FilterHeader from "./FilterHeader";
import AuditSidebar from "./AuditSidebar";
import SecurityTerminal from "./SecurityTerminal";
import StatsPanel from "./StatsPanel";
import PropertyList from "./PropertyList";

const BOROUGHS: Record<string, string> = {
    "Wall Street Tower": "Manhattan", "Times Square Loft": "Manhattan", "Empire State Hub": "Manhattan",
    "Gramercy Park Villa": "Manhattan", "East Village Node": "Manhattan", "SoHo Art District": "Manhattan",
    "TriBeCa Penthouse": "Manhattan", "Chelsea Market Unit": "Manhattan", "Midtown Executive": "Manhattan",
    "Upper East Side": "Manhattan", "Upper West Side": "Manhattan", "Harlem Renaissance": "Manhattan",
    "Financial District": "Manhattan", "Hudson Yards": "Manhattan", "Hell's Kitchen": "Manhattan",
    "Murray Hill": "Manhattan", "Flatiron Loft": "Manhattan", "Kips Bay Tower": "Manhattan",
    "NoHo Gallery": "Manhattan", "Lower East Side": "Manhattan", "Battery Park City": "Manhattan",
    "Chinatown Node": "Manhattan", "Little Italy": "Manhattan", "Morningside Hts": "Manhattan",
    "Washington Hts": "Manhattan", "Inwood Green": "Manhattan",
    "Brooklyn Heights": "Brooklyn", "Williamsburg Loft": "Brooklyn", "DUMBO Studio": "Brooklyn",
    "Park Slope Villa": "Brooklyn", "Bushwick Creative": "Brooklyn", "Cobble Hill": "Brooklyn",
    "Red Hook Yard": "Brooklyn", "Greenpoint Studio": "Brooklyn", "Crown Heights": "Brooklyn",
    "Bed-Stuy Classic": "Brooklyn", "Fort Greene": "Brooklyn", "Prospect Park W": "Brooklyn",
    "Bay Ridge Manor": "Brooklyn",
    "LIC Waterfront": "Queens", "Astoria Complex": "Queens", "Flushing Tower": "Queens", "Jamaica Estates": "Queens",
    "Staten Island Hub": "Staten Island",
    "Bronx River Tower": "Bronx", "Fordham Heights": "Bronx", "Riverdale Estate": "Bronx", "City Island Dock": "Bronx",
};

const PROPERTY_IMAGES = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600566753086-00f18e6f5dbb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=800",
];

function seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function generateProperties(): Property[] {
    const neighborhoods = [
        { name: "Wall Street Tower", lat: 40.7074, lng: -74.0113, priceBase: 6200000, sqftBase: 4200 },
        { name: "Times Square Loft", lat: 40.7580, lng: -73.9855, priceBase: 11200000, sqftBase: 5500 },
        { name: "Empire State Hub", lat: 40.7484, lng: -73.9857, priceBase: 8700000, sqftBase: 4800 },
        { name: "Gramercy Park Villa", lat: 40.7376, lng: -73.9856, priceBase: 4300000, sqftBase: 2800 },
        { name: "East Village Node", lat: 40.7265, lng: -73.9815, priceBase: 1850000, sqftBase: 1400 },
        { name: "SoHo Art District", lat: 40.7233, lng: -74.0030, priceBase: 7400000, sqftBase: 3500 },
        { name: "TriBeCa Penthouse", lat: 40.7163, lng: -74.0086, priceBase: 15500000, sqftBase: 7200 },
        { name: "Chelsea Market Unit", lat: 40.7425, lng: -74.0061, priceBase: 3900000, sqftBase: 2200 },
        { name: "Midtown Executive", lat: 40.7549, lng: -73.9840, priceBase: 10200000, sqftBase: 5200 },
        { name: "Upper East Side", lat: 40.7736, lng: -73.9566, priceBase: 12800000, sqftBase: 6000 },
        { name: "Upper West Side", lat: 40.7870, lng: -73.9754, priceBase: 9100000, sqftBase: 4500 },
        { name: "Harlem Renaissance", lat: 40.8116, lng: -73.9465, priceBase: 980000, sqftBase: 1100 },
        { name: "Financial District", lat: 40.7075, lng: -74.0089, priceBase: 17500000, sqftBase: 11000 },
        { name: "Brooklyn Heights", lat: 40.6960, lng: -73.9936, priceBase: 3300000, sqftBase: 2400 },
        { name: "Williamsburg Loft", lat: 40.7081, lng: -73.9571, priceBase: 2200000, sqftBase: 1800 },
        { name: "DUMBO Studio", lat: 40.7033, lng: -73.9883, priceBase: 4600000, sqftBase: 2600 },
        { name: "Park Slope Villa", lat: 40.6681, lng: -73.9822, priceBase: 2900000, sqftBase: 2200 },
        { name: "Bushwick Creative", lat: 40.6944, lng: -73.9213, priceBase: 870000, sqftBase: 1050 },
        { name: "LIC Waterfront", lat: 40.7425, lng: -73.9580, priceBase: 3700000, sqftBase: 2500 },
        { name: "Astoria Complex", lat: 40.7720, lng: -73.9300, priceBase: 1550000, sqftBase: 1350 },
        { name: "Flushing Tower", lat: 40.7580, lng: -73.8330, priceBase: 1250000, sqftBase: 1100 },
        { name: "Jamaica Estates", lat: 40.7164, lng: -73.7834, priceBase: 810000, sqftBase: 2000 },
        { name: "Hudson Yards", lat: 40.7537, lng: -74.0008, priceBase: 22500000, sqftBase: 9200 },
        { name: "Hell's Kitchen", lat: 40.7632, lng: -73.9934, priceBase: 3000000, sqftBase: 1900 },
        { name: "Murray Hill", lat: 40.7488, lng: -73.9753, priceBase: 3500000, sqftBase: 2100 },
        { name: "Flatiron Loft", lat: 40.7411, lng: -73.9897, priceBase: 5800000, sqftBase: 3200 },
        { name: "Kips Bay Tower", lat: 40.7425, lng: -73.9790, priceBase: 2750000, sqftBase: 1800 },
        { name: "NoHo Gallery", lat: 40.7265, lng: -73.9927, priceBase: 6300000, sqftBase: 3000 },
        { name: "Lower East Side", lat: 40.7150, lng: -73.9843, priceBase: 1650000, sqftBase: 1200 },
        { name: "Battery Park City", lat: 40.7117, lng: -74.0160, priceBase: 8000000, sqftBase: 4200 },
        { name: "Chinatown Node", lat: 40.7158, lng: -73.9971, priceBase: 1350000, sqftBase: 920 },
        { name: "Little Italy", lat: 40.7191, lng: -73.9973, priceBase: 3200000, sqftBase: 1600 },
        { name: "Morningside Hts", lat: 40.8086, lng: -73.9622, priceBase: 1150000, sqftBase: 1300 },
        { name: "Washington Hts", lat: 40.8398, lng: -73.9395, priceBase: 680000, sqftBase: 950 },
        { name: "Inwood Green", lat: 40.8677, lng: -73.9212, priceBase: 540000, sqftBase: 820 },
        { name: "Cobble Hill", lat: 40.6862, lng: -73.9962, priceBase: 3600000, sqftBase: 2600 },
        { name: "Red Hook Yard", lat: 40.6730, lng: -74.0060, priceBase: 1950000, sqftBase: 3500 },
        { name: "Greenpoint Studio", lat: 40.7295, lng: -73.9514, priceBase: 1750000, sqftBase: 1400 },
        { name: "Crown Heights", lat: 40.6694, lng: -73.9507, priceBase: 950000, sqftBase: 1500 },
        { name: "Bed-Stuy Classic", lat: 40.6872, lng: -73.9418, priceBase: 1080000, sqftBase: 1700 },
        { name: "Fort Greene", lat: 40.6887, lng: -73.9762, priceBase: 2500000, sqftBase: 2000 },
        { name: "Prospect Park W", lat: 40.6603, lng: -73.9806, priceBase: 4900000, sqftBase: 3200 },
        { name: "Bay Ridge Manor", lat: 40.6340, lng: -74.0281, priceBase: 1450000, sqftBase: 2400 },
        { name: "Staten Island Hub", lat: 40.6435, lng: -74.0768, priceBase: 500000, sqftBase: 1800 },
        { name: "Bronx River Tower", lat: 40.8376, lng: -73.8631, priceBase: 580000, sqftBase: 1100 },
        { name: "Fordham Heights", lat: 40.8614, lng: -73.8981, priceBase: 440000, sqftBase: 950 },
        { name: "Riverdale Estate", lat: 40.8961, lng: -73.9110, priceBase: 1850000, sqftBase: 3200 },
        { name: "City Island Dock", lat: 40.8468, lng: -73.7876, priceBase: 780000, sqftBase: 1600 },
    ];

    return neighborhoods.map((n, i) => {
        const rng = seededRandom(i * 31 + 7);
        const jLat = (rng() - 0.5) * 0.005;
        const jLng = (rng() - 0.5) * 0.006;
        const pVar = 0.85 + rng() * 0.3;
        const sVar = 0.88 + rng() * 0.24;
        const bd = i % 8 === 0 ? 0 : 1 + Math.floor(rng() * 5);
        const ba = Math.max(1, Math.ceil(bd * (0.5 + rng() * 0.5)));

        return {
            id: `prop-${i + 1}`,
            latitude: n.lat + jLat,
            longitude: n.lng + jLng,
            price: Math.round((n.priceBase * pVar) / 1000) * 1000,
            sqft: Math.round((n.sqftBase * sVar) / 10) * 10,
            bedrooms: bd,
            bathrooms: ba,
            address: n.name,
        };
    });
}

function buildAuditLocally(prop: Property): PropertyExtended {
    const idx = parseInt(prop.id.split("-")[1]) || 1;
    const rng = seededRandom(idx * 53 + 13);

    const grossRent = prop.price * (0.006 + rng() * 0.004);
    const taxRate = 0.012 + rng() * 0.012;
    const propTax = (prop.price * taxRate) / 12;
    const hoa = 150 + Math.floor(rng() * 600);
    const vacancy = grossRent * (0.03 + rng() * 0.05);
    const net = grossRent - propTax - hoa - vacancy;
    const roi = (net * 12) / prop.price * 100;

    const secScore = 20 + Math.floor(rng() * 78);
    const crimeIdx = 8 + Math.floor(rng() * 72);
    const distPolice = 0.2 + rng() * 4.5;
    const seismic = 25 + Math.floor(rng() * 72);

    const portPool = ["554 (RTSP/Camera)", "80 (HTTP)", "22 (SSH)", "443 (HTTPS)", "21 (FTP)", "8080 (Alt HTTP)", "23 (Telnet)", "3389 (RDP)"];
    const numPorts = rng() > 0.6 ? Math.floor(rng() * 3) + 1 : 0;
    const ports: string[] = [];
    for (let p = 0; p < numPorts; p++) {
        const port = portPool[Math.floor(rng() * portPool.length)];
        if (!ports.includes(port)) ports.push(port);
    }

    const zoneRoll = rng();
    const floodZone = zoneRoll < 0.12 ? "Zone VE (Coastal High Hazard)"
        : zoneRoll < 0.25 ? "Zone AE (High Risk Floodplain)"
        : zoneRoll < 0.42 ? "Zone 500 (Moderate Risk)"
        : "Zone X (Minimal Risk)";

    const defectTypes = ["Structural Crack", "Water Damage", "Mold Growth", "Roof Sag", "Foundation Shift", "Electrical Fault"];
    const defects = [];
    const defectChance = rng();
    if (defectChance > 0.45) {
        const count = defectChance > 0.8 ? 2 : 1;
        for (let d = 0; d < count; d++) {
            defects.push({
                type: defectTypes[Math.floor(rng() * defectTypes.length)],
                box: [0.05 + rng() * 0.3, 0.05 + rng() * 0.3, 0.55 + rng() * 0.4, 0.55 + rng() * 0.4] as [number, number, number, number],
                confidence: 0.68 + rng() * 0.3,
            });
        }
    }

    return {
        ...prop,
        opportunityScore: Math.min(10, 2 + rng() * 8),
        securityScore: secScore,
        hazardScore: floodZone.includes("High") || floodZone.includes("Coastal") ? 60 + Math.floor(rng() * 35) : floodZone.includes("Moderate") ? 30 + Math.floor(rng() * 25) : 5 + Math.floor(rng() * 20),
        grossRent: Math.round(grossRent * 100) / 100,
        propertyTax: Math.round(propTax * 100) / 100,
        hoaFee: hoa,
        vacancyBuffer: Math.round(vacancy * 100) / 100,
        netCashflow: Math.round(net * 100) / 100,
        annualizedRoi: Math.round(roi * 100) / 100,
        openIotPorts: ports,
        crimeIndex: crimeIdx,
        distanceToPolice: Math.round(distPolice * 10) / 10,
        floodZone,
        seismicSafety: seismic,
        structuralDefects: defects,
    };
}

export default function DashboardClient({ initialMetrics }: { initialMetrics: any }) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<PropertyExtended | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showPropertyList, setShowPropertyList] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<FilterState>({
        minPrice: 0, maxPrice: 25000000, minRoi: 0, minSecurityScore: 0, hideFloodZones: false,
    });

    const abortControllerRef = useRef<AbortController | null>(null);
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://proptech-nexus-v2-production.up.railway.app";
    const ALL_PROPERTIES = useMemo(() => generateProperties(), []);

    const stats = useMemo(() => {
        if (properties.length === 0) return null;
        const prices = properties.map(p => p.price);
        const totalValue = prices.reduce((a, b) => a + b, 0);
        const avgPrice = totalValue / prices.length;
        const avgSqft = properties.reduce((a, p) => a + (p.sqft || 0), 0) / properties.length;
        return { totalValue, avgPrice, maxP: Math.max(...prices), minP: Math.min(...prices), avgSqft, count: properties.length };
    }, [properties]);

    const filteredListProperties = useMemo(() => {
        let list = properties;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p => p.address.toLowerCase().includes(q));
        }
        return list;
    }, [properties, searchQuery]);

    const handleBoundsChange = useCallback(
        async (bounds: { minLon: number; minLat: number; maxLon: number; maxLat: number }) => {
            try {
                if (abortControllerRef.current) abortControllerRef.current.abort();
                abortControllerRef.current = new AbortController();
                const params = new URLSearchParams({
                    min_lon: bounds.minLon.toString(), min_lat: bounds.minLat.toString(),
                    max_lon: bounds.maxLon.toString(), max_lat: bounds.maxLat.toString(),
                });
                const res = await fetch(`${BACKEND_URL}/properties/search/bbox?${params}`, { signal: abortControllerRef.current.signal });
                if (res.ok) {
                    const data: Property[] = await res.json();
                    setProperties(data.filter(p => p.price <= filters.maxPrice && p.price >= filters.minPrice));
                } else { throw new Error("non-OK"); }
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    const inBounds = ALL_PROPERTIES.filter(p =>
                        p.latitude >= bounds.minLat && p.latitude <= bounds.maxLat &&
                        p.longitude >= bounds.minLon && p.longitude <= bounds.maxLon
                    );
                    setProperties(inBounds.filter(p => p.price <= filters.maxPrice && p.price >= filters.minPrice));
                }
            }
        },
        [filters, BACKEND_URL, ALL_PROPERTIES]
    );

    const handlePropertyClick = async (prop: Property) => {
        setSelectedId(prop.id);
        try {
            const res = await fetch(`${BACKEND_URL}/audits/${prop.id}`);
            if (res.ok) {
                const audit = await res.json();
                setSelectedProperty({
                    ...prop,
                    opportunityScore: audit.annualizedRoi > 6 ? 8.5 : audit.annualizedRoi > 4 ? 6.0 : 3.5,
                    securityScore: audit.securityScore,
                    hazardScore: audit.floodZone.includes("High") || audit.floodZone.includes("Coastal") ? 75 : audit.floodZone.includes("Moderate") ? 45 : 15,
                    grossRent: audit.grossRent, propertyTax: audit.propertyTax, hoaFee: audit.hoaFee,
                    vacancyBuffer: audit.vacancyBuffer, netCashflow: audit.netCashflow, annualizedRoi: audit.annualizedRoi,
                    openIotPorts: audit.openIotPorts, crimeIndex: audit.crimeIndex, distanceToPolice: audit.distanceToPolice,
                    floodZone: audit.floodZone, seismicSafety: audit.seismicSafety, structuralDefects: audit.structuralDefects || [],
                });
                return;
            }
        } catch { /* fallback */ }

        setSelectedProperty(buildAuditLocally(prop));
    };

    return (
        <>
            <FilterHeader filters={filters} onFilterChange={setFilters} onToggleList={() => setShowPropertyList(!showPropertyList)} showingList={showPropertyList} />
            <MapDashboard properties={properties} selectedId={selectedId} onPropertyClick={handlePropertyClick} onBoundsChange={handleBoundsChange} />

            {showPropertyList && (
                <PropertyList
                    properties={filteredListProperties}
                    selectedId={selectedId}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onPropertyClick={handlePropertyClick}
                    boroughs={BOROUGHS}
                />
            )}

            <AuditSidebar
                property={selectedProperty}
                borough={selectedProperty ? BOROUGHS[selectedProperty.address] || "NYC" : ""}
                imageUrl={selectedProperty ? PROPERTY_IMAGES[(parseInt(selectedProperty.id.split("-")[1]) || 0) % PROPERTY_IMAGES.length] : ""}
                onClose={() => { setSelectedProperty(null); setSelectedId(null); }}
            />
            <SecurityTerminal />
            {stats && <StatsPanel stats={stats} />}
        </>
    );
}
