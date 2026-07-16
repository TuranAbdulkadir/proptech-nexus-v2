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
                }
            } catch (err: any) {
                if (err.name !== "AbortError") console.error("Error fetching live properties:", err);
            }
        },
        [filters, BACKEND_URL]
    );

    const handlePropertyClick = async (prop: Property) => {
        setSelectedId(prop.id);
        setSelectedProperty(null); 
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
            }
        } catch (err) { 
            console.error("Error fetching audit data:", err);
        }
    };

    return (
        <div className="flex h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans">
            
            {/* LEFT SIDEBAR (Registry & Terminal) */}
            <div className="w-[380px] h-full flex flex-col border-r border-[#1a1a1a] bg-[#0a0a0a] shrink-0 z-20">
                <div className="p-5 border-b border-[#1a1a1a] flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                        N
                    </div>
                    <div>
                        <h1 className="font-bold text-sm tracking-[0.15em] text-white leading-tight">PROPTECH NEXUS</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] text-green-500 tracking-widest uppercase font-mono">Global Sentinel Active</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-3 border-b border-[#1a1a1a] bg-[#0f0f0f]">
                        <input 
                            type="text" 
                            placeholder="SEARCH REGISTRY..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white p-2 rounded focus:outline-none focus:border-blue-500 font-mono placeholder-[#555]"
                        />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <PropertyList properties={filteredListProperties} onSelect={handlePropertyClick} selectedId={selectedId} />
                    </div>
                </div>
                
                <div className="h-[250px] shrink-0 border-t border-[#1a1a1a]">
                    <SecurityTerminal />
                </div>
            </div>

            {/* MAIN CONTENT (Header & Map) */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* TOP HEADER (Filters) */}
                <div className="h-16 shrink-0 border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center px-6">
                    <FilterHeader filters={filters} onFilterChange={setFilters} />
                </div>

                {/* MAP AREA */}
                <div className="flex-1 relative bg-[#050505]">
                    <MapDashboard properties={properties} selectedId={selectedId} onPropertyClick={handlePropertyClick} onBoundsChange={handleBoundsChange} />
                </div>
            </div>

            {/* RIGHT SIDEBAR (Analytics / Audit) */}
            <div className="w-[400px] h-full flex flex-col border-l border-[#1a1a1a] bg-[#0a0a0a] shrink-0 z-20">
                {selectedProperty ? (
                    <AuditSidebar
                        property={selectedProperty}
                        borough={selectedProperty ? (selectedProperty as any).borough || "King County" : ""}
                        imageUrl={selectedProperty ? `https://loremflickr.com/800/600/mansion,architecture?lock=${parseInt(selectedProperty.id.replace(/\D/g, "") || "0") % 100000}` : ""}
                        onClose={() => { setSelectedProperty(null); setSelectedId(null); }}
                    />
                ) : (
                    <div className="flex-1 flex flex-col h-full">
                        <div className="p-5 border-b border-[#1a1a1a]">
                            <h2 className="font-bold text-xs tracking-[0.2em] text-slate-400 uppercase">Portfolio Analytics</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {stats ? <StatsPanel stats={stats} /> : (
                                <div className="p-8 text-center font-mono text-[10px] text-[#555]">
                                    WAITING FOR GEOSPATIAL DATA...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
