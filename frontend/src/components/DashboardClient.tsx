"use client";
import React, { useState, useCallback, useRef } from 'react';
import { Property, PropertyExtended, FilterState } from '@/types';
import MapDashboard from './MapDashboard';
import FilterHeader from './FilterHeader';
import AuditSidebar from './AuditSidebar';

export default function DashboardClient({ initialMetrics }: { initialMetrics: any }) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<PropertyExtended | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        minPrice: 0,
        maxPrice: 5000000,
        minRoi: 5.0,
        minSecurityScore: 50,
        hideFloodZones: false
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    const handleBoundsChange = useCallback(async (bounds: { minLon: number, minLat: number, maxLon: number, maxLat: number }) => {
        try {
            // Cancel previous in-flight requests to prevent race conditions during rapid panning
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            const params = new URLSearchParams({
                min_lon: bounds.minLon.toString(),
                min_lat: bounds.minLat.toString(),
                max_lon: bounds.maxLon.toString(),
                max_lat: bounds.maxLat.toString()
            });

            // Make the HTTP request to the async FastAPI backend
            const res = await fetch(`http://localhost:8000/properties/search/bbox?${params}`, {
                signal: abortControllerRef.current.signal
            });
            
            if (res.ok) {
                const data: Property[] = await res.json();
                
                // Client-side filtering propagation based on user inputs
                const filteredData = data.filter(p => p.price <= filters.maxPrice && p.price >= filters.minPrice);
                setProperties(filteredData);
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error("Failed to fetch geospatial bounds:", err);
            }
        }
    }, [filters]);

    const handlePropertyClick = async (prop: Property) => {
        // Hydrating the extended audit view (Simulating the /api/properties/{id}/audit call)
        const extended: PropertyExtended = {
            ...prop,
            opportunityScore: 8.5,
            securityScore: 85,
            hazardScore: 20,
            grossRent: prop.price * 0.008,
            propertyTax: (prop.price * 0.012) / 12,
            hoaFee: 250,
            vacancyBuffer: (prop.price * 0.008) * 0.05,
            netCashflow: (prop.price * 0.008) - ((prop.price * 0.012) / 12) - 250 - ((prop.price * 0.008) * 0.05),
            annualizedRoi: 7.2,
            openIotPorts: ['80 (HTTP/Web)', '554 (RTSP/Camera)'],
            crimeIndex: 35,
            distanceToPolice: 1.2,
            floodZone: 'Zone X (Minimal Risk)',
            seismicSafety: 88,
            structuralDefects: [
                {
                    type: 'structural_crack',
                    box: [0.65, 0.20, 0.75, 0.35],
                    confidence: 0.88
                },
                {
                    type: 'water_damage',
                    box: [0.15, 0.70, 0.30, 0.90],
                    confidence: 0.94
                }
            ]
        };
        setSelectedProperty(extended);
    };

    return (
        <>
            <FilterHeader filters={filters} onFilterChange={setFilters} />
            <MapDashboard 
                properties={properties} 
                onPropertyClick={handlePropertyClick} 
                onBoundsChange={handleBoundsChange} 
            />
            <AuditSidebar 
                property={selectedProperty} 
                onClose={() => setSelectedProperty(null)} 
            />
            
            {/* Global Macro Fallback HUD */}
            <div className="absolute bottom-6 left-6 z-10 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg p-3 flex gap-6 text-[10px] font-mono tracking-widest text-slate-400 uppercase shadow-xl">
                <div>Global Inflation: <span className="text-slate-100">{initialMetrics.globalInflationRate}%</span></div>
                <div>Base Rate: <span className="text-slate-100">{initialMetrics.baseInterestRate}%</span></div>
            </div>
        </>
    );
}
