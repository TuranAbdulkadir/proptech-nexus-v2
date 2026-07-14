"use client";
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../types';

interface MapDashboardProps {
    properties: Property[];
    onPropertyClick: (prop: Property) => void;
    onBoundsChange: (bounds: { minLon: number, minLat: number, maxLon: number, maxLat: number }) => void;
}

export default function MapDashboard({ properties, onPropertyClick, onBoundsChange }: MapDashboardProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<L.Map | null>(null);
    const markers = useRef<Record<string, L.Marker>>({});

    useEffect(() => {
        if (!mapContainer.current) return;
        if (map.current) return;

        map.current = L.map(mapContainer.current, {
            center: [40.730610, -73.935242],
            zoom: 12,
            zoomControl: false,
            attributionControl: false
        });

        // Zoom controls at bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map.current);

        // Attribution at bottom right
        L.control.attribution({ position: 'bottomright' }).addTo(map.current);

        // CartoDB Dark Matter tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map.current);

        const updateBounds = () => {
            if (!map.current) return;
            const bounds = map.current.getBounds();
            if (bounds) {
                onBoundsChange({
                    minLon: bounds.getWest(),
                    minLat: bounds.getSouth(),
                    maxLon: bounds.getEast(),
                    maxLat: bounds.getNorth()
                });
            }
        };

        map.current.on('moveend', updateBounds);
        map.current.on('zoomend', updateBounds);
        map.current.whenReady(updateBounds);

        return () => {
            if (map.current) {
                map.current.off('moveend', updateBounds);
                map.current.off('zoomend', updateBounds);
                map.current.remove();
                map.current = null;
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!map.current) return;

        const newIds = new Set(properties.map(p => p.id));
        Object.keys(markers.current).forEach(id => {
            if (!newIds.has(id)) {
                markers.current[id].remove();
                delete markers.current[id];
            }
        });

        properties.forEach(prop => {
            if (!markers.current[prop.id]) {
                const hashScore = prop.id.charCodeAt(prop.id.length - 1) % 10;
                let dotColor = '';
                let glowColor = '';
                
                if (hashScore < 4) {
                    dotColor = 'bg-red-500';
                    glowColor = 'rgba(239,68,68,0.8)';
                } else if (hashScore < 7) {
                    dotColor = 'bg-yellow-500';
                    glowColor = 'rgba(234,179,8,0.8)';
                } else {
                    dotColor = 'bg-green-500';
                    glowColor = 'rgba(34,197,94,0.8)';
                }

                const markerHtml = `
                    <div class="relative cursor-pointer group">
                        <div class="w-5 h-5 rounded-full border-2 border-white/80 ${dotColor} transition-transform duration-200 hover:scale-150" style="box-shadow: 0 0 12px ${glowColor}"></div>
                        <div class="absolute -top-1 -left-1 w-7 h-7 rounded-full ${dotColor} opacity-30 animate-ping"></div>
                    </div>
                `;

                const icon = L.divIcon({
                    className: 'bg-transparent',
                    html: markerHtml,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                const marker = L.marker([prop.latitude, prop.longitude], { icon })
                    .addTo(map.current!);

                // Rich tooltip on hover
                const tooltipContent = `
                    <div style="font-family: ui-monospace, monospace; min-width: 180px;">
                        <div style="font-weight: bold; color: #f8fafc; font-size: 11px; margin-bottom: 4px;">${prop.address}</div>
                        <div style="color: #22c55e; font-size: 13px; font-weight: bold;">$${prop.price.toLocaleString()}</div>
                        <div style="color: #94a3b8; font-size: 10px; margin-top: 3px;">${prop.sqft?.toLocaleString() || 'N/A'} sqft &bull; ${prop.bedrooms}BD / ${prop.bathrooms}BA</div>
                    </div>
                `;

                marker.bindTooltip(tooltipContent, {
                    className: 'custom-tooltip',
                    direction: 'top',
                    offset: [0, -12],
                    opacity: 0.95
                });
                
                marker.on('click', () => {
                    onPropertyClick(prop);
                    map.current?.flyTo([prop.latitude, prop.longitude], 16, {
                        animate: true,
                        duration: 1.2
                    });
                });
                
                markers.current[prop.id] = marker;
            }
        });
    }, [properties, onPropertyClick]);

    return (
        <>
            <div ref={mapContainer} className="w-full h-full absolute top-0 left-0 bg-slate-950 z-0" />
            
            {/* Property Count HUD */}
            <div className="absolute top-20 right-4 z-10 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg px-3 py-2 text-center shadow-xl">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Properties</span>
                <span className="text-xl font-bold text-green-400 font-mono">{properties.length}</span>
            </div>

            {/* Custom tooltip styles */}
            <style jsx global>{`
                .custom-tooltip {
                    background: rgba(15, 23, 42, 0.95) !important;
                    border: 1px solid rgba(100, 116, 139, 0.3) !important;
                    border-radius: 8px !important;
                    padding: 8px 12px !important;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
                    backdrop-filter: blur(8px) !important;
                }
                .custom-tooltip::before {
                    border-top-color: rgba(15, 23, 42, 0.95) !important;
                }
                .leaflet-control-zoom a {
                    background-color: rgba(15, 23, 42, 0.9) !important;
                    color: #94a3b8 !important;
                    border-color: rgba(100, 116, 139, 0.3) !important;
                    backdrop-filter: blur(8px) !important;
                }
                .leaflet-control-zoom a:hover {
                    background-color: rgba(30, 41, 59, 0.95) !important;
                    color: #22c55e !important;
                }
            `}</style>
        </>
    );
}
