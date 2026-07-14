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
        if (map.current) return; // Prevent multiple initializations

        // Initialize Leaflet map
        map.current = L.map(mapContainer.current, {
            center: [40.730610, -73.935242], // Leaflet uses [lat, lng]
            zoom: 12,
            zoomControl: false // Hide default controls from top left
        });

        // Add zoom controls to the bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map.current);

        // Add CartoDB Dark Matter tile layer for the cyber aesthetic
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

        // Attach event listeners for real-time bounding box fetching
        map.current.on('moveend', updateBounds);
        map.current.on('zoomend', updateBounds);
        
        // Initial fetch after load
        map.current.whenReady(updateBounds);

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
                
                // Simulating score calculation for the glowing markers
                const hashScore = prop.id.charCodeAt(0) % 10;
                let markerClass = '';
                
                if (hashScore < 4) {
                    markerClass = 'w-6 h-6 rounded-full border-2 border-white shadow-[0_0_15px_rgba(239,68,68,0.8)] bg-red-500 transition-transform hover:scale-125';
                } else if (hashScore < 7) {
                    markerClass = 'w-6 h-6 rounded-full border-2 border-white shadow-[0_0_15px_rgba(234,179,8,0.8)] bg-yellow-500 transition-transform hover:scale-125';
                } else {
                    markerClass = 'w-6 h-6 rounded-full border-2 border-white shadow-[0_0_15px_rgba(34,197,94,0.8)] bg-green-500 transition-transform hover:scale-125';
                }

                // Create a Leaflet DivIcon
                const icon = L.divIcon({
                    className: 'bg-transparent',
                    html: `<div class="${markerClass}"></div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                const marker = L.marker([prop.latitude, prop.longitude], { icon })
                    .addTo(map.current!);
                
                marker.on('click', () => {
                    onPropertyClick(prop);
                    // Fly-to animation for immersion
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
        <div ref={mapContainer} className="w-full h-full absolute top-0 left-0 bg-slate-950 z-0" />
    );
}
