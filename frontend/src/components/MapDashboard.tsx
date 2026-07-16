import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Property } from "../types";

export default function MapDashboard({
    properties,
    selectedId,
    onPropertyClick,
    onBoundsChange
}: {
    properties: Property[];
    selectedId: string | null;
    onPropertyClick: (prop: Property) => void;
    onBoundsChange: (bounds: { minLon: number; minLat: number; maxLon: number; maxLat: number }) => void;
}) {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainer = useRef<HTMLDivElement>(null);
    const markersLayer = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        mapRef.current = L.map(mapContainer.current, {
            zoomControl: false,
            attributionControl: false,
        }).setView([47.54, -122.0], 11);

        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

        // Professional dark mode map tile
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
        }).addTo(mapRef.current);

        markersLayer.current = L.layerGroup().addTo(mapRef.current);

        mapRef.current.on('moveend', () => {
            if (mapRef.current) {
                const bounds = mapRef.current.getBounds();
                onBoundsChange({
                    minLat: bounds.getSouth(),
                    maxLat: bounds.getNorth(),
                    minLon: bounds.getWest(),
                    maxLon: bounds.getEast(),
                });
            }
        });

        // Trigger initial load
        setTimeout(() => {
            if (mapRef.current) {
                const bounds = mapRef.current.getBounds();
                onBoundsChange({
                    minLat: bounds.getSouth(),
                    maxLat: bounds.getNorth(),
                    minLon: bounds.getWest(),
                    maxLon: bounds.getEast(),
                });
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (!mapRef.current || !markersLayer.current) return;

        markersLayer.current.clearLayers();

        for (const prop of properties) {
            const isSelected = selectedId === prop.id;
            
            const html = `
                <div class="relative flex items-center justify-center w-6 h-6 group">
                    <div class="absolute w-2.5 h-2.5 ${isSelected ? 'bg-blue-400 scale-150' : 'bg-white'} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform duration-300"></div>
                    <div class="absolute w-full h-full border ${isSelected ? 'border-blue-400' : 'border-white/30'} rounded-full scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
            `;
            const icon = L.divIcon({ className: "", html, iconSize: [24, 24], iconAnchor: [12, 12] });
            
            const marker = L.marker([prop.latitude, prop.longitude], { icon })
                .addTo(markersLayer.current)
                .on('click', () => onPropertyClick(prop));

            if (isSelected) {
                marker.setZIndexOffset(1000);
            }
        }
    }, [properties, selectedId, onPropertyClick]);

    return (
        <div className="w-full h-full relative">
            <div className="absolute inset-0 z-0 bg-[#0a0a0a]" ref={mapContainer} />
        </div>
    );
}
