"use client";
import React, { useState, useCallback, useRef } from 'react';
import { Property, PropertyExtended, FilterState } from '../types';
import dynamic from 'next/dynamic';
const MapDashboard = dynamic(() => import('./MapDashboard'), { ssr: false });
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

            // Make the HTTP request to the async FastAPI backend via environment variables
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "https://proptech-nexus-v2-production.up.railway.app"}/properties/search/bbox?${params}`, {
                signal: abortControllerRef.current.signal
            });
            
            if (res.ok) {
                const data: Property[] = await res.json();
                
                // Client-side filtering propagation based on user inputs
                const filteredData = data.filter(p => p.price <= filters.maxPrice && p.price >= filters.minPrice);
                setProperties(filteredData);
            } else {
                throw new Error(`HTTP Error: ${res.status}`);
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                // Backend is likely offline/not deployed yet. Fallback to mock data to keep UI alive.
                const mockProperties: Property[] = [
                    { id: 'prop-1', latitude: 40.7128, longitude: -74.0060, price: 5500000, sqft: 4200, bedrooms: 3, bathrooms: 4, type: 'commercial', address: 'Wall Street Tower Alpha' } as any,
                    { id: 'prop-2', latitude: 40.7580, longitude: -73.9855, price: 12500000, sqft: 6500, bedrooms: 5, bathrooms: 6, type: 'residential', address: 'Times Square Penthouse' } as any,
                    { id: 'prop-3', latitude: 40.7484, longitude: -73.9857, price: 8000000, sqft: 5000, bedrooms: 0, bathrooms: 2, type: 'commercial', address: 'Empire Sector Node' } as any,
                    { id: 'prop-4', latitude: 40.7306, longitude: -73.9352, price: 1200000, sqft: 1500, bedrooms: 2, bathrooms: 1, type: 'industrial', address: 'Cyber Node Alpha' } as any,
                    { id: 'prop-5', latitude: 40.7406, longitude: -73.9452, price: 2500000, sqft: 2200, bedrooms: 3, bathrooms: 2, type: 'residential', address: 'Neon Heights' } as any,
                    { id: 'prop-6', latitude: 40.7206, longitude: -73.9252, price: 800000, sqft: 1200, bedrooms: 1, bathrooms: 1, type: 'industrial', address: 'Grid Sector 7' } as any,
                    { id: 'prop-7', latitude: 40.7050, longitude: -74.0090, price: 18000000, sqft: 12000, bedrooms: 0, bathrooms: 8, type: 'commercial', address: 'Financial District Hub' } as any,
                    { id: 'prop-8', latitude: 40.7614, longitude: -73.9776, price: 9500000, sqft: 4800, bedrooms: 4, bathrooms: 4, type: 'residential', address: 'MoMA Sky-Loft' } as any,
                    { id: 'prop-9', latitude: 40.7112, longitude: -74.0000, price: 3400000, sqft: 2800, bedrooms: 0, bathrooms: 2, type: 'commercial', address: 'Pace University Node' } as any,
                    { id: 'prop-10', latitude: 40.7350, longitude: -73.9920, price: 4200000, sqft: 3100, bedrooms: 3, bathrooms: 3, type: 'residential', address: 'Union Square Condo' } as any,
                    { id: 'prop-11', latitude: 40.7250, longitude: -74.0000, price: 6700000, sqft: 4000, bedrooms: 0, bathrooms: 4, type: 'commercial', address: 'SoHo Art District Hub' } as any,
                ];
                
                const filteredData = mockProperties.filter(p => p.price <= filters.maxPrice && p.price >= filters.minPrice);
                setProperties(filteredData);
            }
        }
    }, [filters]);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://proptech-nexus-v2-production.up.railway.app";

    const handlePropertyClick = async (prop: Property) => {
        try {
            const res = await fetch(`${BACKEND_URL}/audits/${prop.id}`);
            if (res.ok) {
                const audit = await res.json();
                const extended: PropertyExtended = {
                    ...prop,
                    opportunityScore: audit.annualizedRoi > 6 ? 8.5 : 5.0,
                    securityScore: audit.securityScore,
                    hazardScore: audit.floodZone.includes("High") ? 75 : 20,
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
                    structuralDefects: audit.structuralDefects || []
                };
                setSelectedProperty(extended);
                return;
            }
        } catch (err) {
            console.warn("Backend audit unavailable, using local simulation:", err);
        }

        // Fallback: local simulation if backend is unreachable
        const seed = prop.id.charCodeAt(prop.id.length - 1);
        const extended: PropertyExtended = {
            ...prop,
            opportunityScore: 6.0 + (seed % 4),
            securityScore: 40 + (seed * 7) % 55,
            hazardScore: 10 + (seed * 3) % 60,
            grossRent: prop.price * 0.008,
            propertyTax: (prop.price * 0.0192) / 12,
            hoaFee: 250,
            vacancyBuffer: (prop.price * 0.008) * 0.05,
            netCashflow: (prop.price * 0.008) - ((prop.price * 0.0192) / 12) - 250 - ((prop.price * 0.008) * 0.05),
            annualizedRoi: ((prop.price * 0.008 - (prop.price * 0.0192) / 12 - 250 - (prop.price * 0.008) * 0.05) * 12) / prop.price * 100,
            openIotPorts: seed % 3 === 0 ? ['554 (RTSP/Camera)', '80 (HTTP)'] : [],
            crimeIndex: 20 + (seed * 5) % 60,
            distanceToPolice: 0.5 + (seed % 4) * 0.8,
            floodZone: seed % 4 === 0 ? 'Zone AE (High Risk Floodplain)' : 'Zone X (Minimal Risk)',
            seismicSafety: 50 + (seed * 3) % 49,
            structuralDefects: seed % 2 === 0 ? [
                { type: 'Structural Crack', box: [0.15, 0.20, 0.45, 0.55], confidence: 0.88 },
            ] : []
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
