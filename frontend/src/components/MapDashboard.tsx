"use client";
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/types';

// In production, provide this via process.env.NEXT_PUBLIC_MAPBOX_TOKEN
mapboxgl.accessToken = 'pk.eyJ1IjoibW9jay10b2tlbiIsImEiOiJjbW9jay10b2tlbiJ9.mock-token';

interface MapDashboardProps {
    properties: Property[];
    onPropertyClick: (prop: Property) => void;
    onBoundsChange: (bounds: { minLon: number, minLat: number, maxLon: number, maxLat: number }) => void;
}

export default function MapDashboard({ properties, onPropertyClick, onBoundsChange }: MapDashboardProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<Record<string, mapboxgl.Marker>>({});

    useEffect(() => {
        if (!mapContainer.current) return;
        if (map.current) return; // Prevent multiple initializations

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11', // Cyber-sentinel dark mode aesthetic
            center: [-73.935242, 40.730610],
            zoom: 12,
            pitch: 45, // Add some 3D perspective
            bearing: -17.6
        });

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

        // Attach event listeners for real-time bounding box fetching
        map.current.on('moveend', updateBounds);
        map.current.on('zoomend', updateBounds);
        
        // Initial fetch after load
        map.current.once('load', updateBounds);

        // Memory leak prevention block
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

        // Cleanup stale markers out of bounding box bounds
        const newIds = new Set(properties.map(p => p.id));
        Object.keys(markers.current).forEach(id => {
            if (!newIds.has(id)) {
                markers.current[id].remove();
                delete markers.current[id];
            }
        });

        // Add or update markers based on fetched properties
        properties.forEach(prop => {
            if (!markers.current[prop.id]) {
                const el = document.createElement('div');
                
                // Simulating score calculation for the glowing markers
                // In production, this data comes directly from the API endpoint
                const hashScore = prop.id.charCodeAt(0) % 10;
                
                if (hashScore < 4) {
                    // Warning RED Marker
                    el.className = 'w-6 h-6 rounded-full border-2 border-white shadow-[0_0_15px_rgba(239,68,68,0.8)] bg-red-500 cursor-pointer transition-transform hover:scale-125';
                } else if (hashScore < 7) {
                    // Moderate YELLOW Marker
                    el.className = 'w-6 h-6 rounded-full border-2 border-white shadow-[0_0_15px_rgba(234,179,8,0.8)] bg-yellow-500 cursor-pointer transition-transform hover:scale-125';
                } else {
                    // Opportunity GREEN Marker
                    el.className = 'w-6 h-6 rounded-full border-2 border-white shadow-[0_0_15px_rgba(34,197,94,0.8)] bg-green-500 cursor-pointer transition-transform hover:scale-125';
                }

                el.addEventListener('click', () => {
                    onPropertyClick(prop);
                    // Fly-to animation for immersion
                    map.current?.flyTo({ 
                        center: [prop.longitude, prop.latitude], 
                        zoom: 16, 
                        pitch: 60,
                        duration: 1200 
                    });
                });

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([prop.longitude, prop.latitude])
                    .addTo(map.current!);
                
                markers.current[prop.id] = marker;
            }
        });
    }, [properties, onPropertyClick]);

    return (
        <div ref={mapContainer} className="w-full h-full absolute top-0 left-0 bg-slate-950" />
    );
}
