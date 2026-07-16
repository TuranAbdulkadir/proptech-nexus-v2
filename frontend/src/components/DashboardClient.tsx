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

export default function DashboardClient({ initialMetrics }: { initialMetrics: any }) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<PropertyExtended | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showPropertyList, setShowPropertyList] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<FilterState>({
        minPrice: 0, maxPrice: 250000000, minRoi: 0, minSecurityScore: 0, hideFloodZones: false,
    });

    const abortControllerRef = useRef<AbortController | null>(null);
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://proptech-nexus-v2-production.up.railway.app";

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
            list = list.filter(p => p.address.toLowerCase().includes(q) || (p as any).borough?.toLowerCase().includes(q));
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
                } else {
                    console.error("Backend returned non-OK status");
                }
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error("Error fetching live properties:", err);
                }
            }
        },
        [filters, BACKEND_URL]
    );

    const handlePropertyClick = async (prop: Property) => {
        setSelectedId(prop.id);
        setSelectedProperty(null); // Clear previous selection while loading
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
            } else {
                console.error("Failed to fetch audit for property:", prop.id);
            }
        } catch (err) { 
            console.error("Error fetching audit data:", err);
        }
    };

    return (
        <>
            <FilterHeader filters={filters} onFilterChange={setFilters} onToggleList={() => setShowPropertyList(!showPropertyList)} showingList={showPropertyList} />
            <MapDashboard properties={properties} selectedId={selectedId} onPropertyClick={handlePropertyClick} onBoundsChange={handleBoundsChange} />

            {showPropertyList && (
                <PropertyList
                    properties={filteredListProperties}
                    onSelect={handlePropertyClick}
                />
            )}

            <AuditSidebar
                property={selectedProperty}
                borough={selectedProperty ? (selectedProperty as any).borough || "King County" : ""}
                imageUrl={selectedProperty ? `https://loremflickr.com/800/600/mansion,architecture?lock=${parseInt(selectedProperty.id.replace(/\D/g, "") || "0") % 100000}` : ""}
                onClose={() => { setSelectedProperty(null); setSelectedId(null); }}
            />
            <SecurityTerminal />
            {stats && <StatsPanel stats={stats} />}
        </>
    );
}
