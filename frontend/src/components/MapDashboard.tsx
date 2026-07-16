"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Property } from "../types";

interface MapDashboardProps {
    properties: Property[];
    selectedId: string | null;
    onPropertyClick: (prop: Property) => void;
    onBoundsChange: (bounds: { minLon: number; minLat: number; maxLon: number; maxLat: number }) => void;
}

function formatPrice(price: number): string {
    if (price >= 1e6) return `$${(price / 1e6).toFixed(1)}M`;
    if (price >= 1e3) return `$${(price / 1e3).toFixed(0)}K`;
    return `$${price}`;
}

function getScoreColor(propId: string): { dotColor: string; glowRgba: string; score: number } {
    const idx = parseInt(propId.split("-")[1]) || 1;
    const score = 25 + ((idx * 17) % 70);
    if (score >= 65) return { dotColor: "#00ff66", glowRgba: "rgba(0,255,102,0.8)", score }; 
    if (score >= 40) return { dotColor: "#eab308", glowRgba: "rgba(234,179,8,0.8)", score };
    return { dotColor: "#ef4444", glowRgba: "rgba(239,68,68,0.8)", score };
}

export default function MapDashboard({ properties, selectedId, onPropertyClick, onBoundsChange }: MapDashboardProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<L.Map | null>(null);
    const markers = useRef<Record<string, L.Marker>>({});
    const radarLayer = useRef<L.LayerGroup | null>(null);
    const heatLayerGroup = useRef<L.LayerGroup | null>(null);
    const [currentZoom, setCurrentZoom] = useState(12);

    useEffect(() => {
        if (!mapContainer.current) return;
        if (map.current) return;

        map.current = L.map(mapContainer.current, {
            center: [47.54, -122.0],
            zoom: 10,
            zoomControl: false,
            attributionControl: false,
            minZoom: 9,
            maxZoom: 18,
        });

        // Advanced Dark Theme Tiles
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: "&copy; OpenStreetMap &copy; CARTO",
            subdomains: "abcd",
            maxZoom: 20,
        }).addTo(map.current);

        radarLayer.current = L.layerGroup().addTo(map.current);
        heatLayerGroup.current = L.layerGroup();

        const updateBounds = () => {
            if (!map.current) return;
            setCurrentZoom(map.current.getZoom());
            const bounds = map.current.getBounds();
            if (bounds) {
                onBoundsChange({
                    minLon: bounds.getWest(),
                    minLat: bounds.getSouth(),
                    maxLon: bounds.getEast(),
                    maxLat: bounds.getNorth(),
                });
            }
        };

        map.current.on("moveend", updateBounds);
        map.current.on("zoomend", updateBounds);
        map.current.whenReady(updateBounds);

        return () => {
            if (map.current) {
                map.current.off("moveend", updateBounds);
                map.current.off("zoomend", updateBounds);
                map.current.remove();
                map.current = null;
            }
        };
    }, [onBoundsChange]);

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
            if (markers.current[prop.id]) {
                markers.current[prop.id].remove();
                delete markers.current[prop.id];
            }

            const { dotColor, glowRgba, score } = getScoreColor(prop.id);
            const showLabel = currentZoom >= 14;
            const isSelected = prop.id === selectedId;

            const size = isSelected ? 24 : 12;
            const coreSize = isSelected ? 12 : 6;

            const markerHtml = `
                <div class="marker-enter" style="position:relative;cursor:pointer;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;">
                    <!-- Outer Ring -->
                    <div style="position:absolute;width:100%;height:100%;border-radius:50%;border:1px solid ${isSelected ? '#00f3ff' : dotColor};opacity:${isSelected ? 1 : 0.5};box-shadow:0 0 ${isSelected ? 20 : 10}px ${isSelected ? 'rgba(0,243,255,0.8)' : glowRgba};transition:all 0.3s;${isSelected ? 'animation: spin 4s linear infinite;' : ''}">
                        ${isSelected ? '<div style="position:absolute;top:-2px;left:50%;width:4px;height:4px;background:#00f3ff;transform:translateX(-50%);border-radius:50%;"></div>' : ''}
                    </div>
                    <!-- Inner Core -->
                    <div style="width:${coreSize}px;height:${coreSize}px;border-radius:50%;background:${isSelected ? '#00f3ff' : dotColor};box-shadow:0 0 10px ${isSelected ? '#00f3ff' : dotColor};transition:all 0.3s;"></div>
                    
                    ${showLabel ? `<span style="position:absolute;left:${size + 8}px;top:50%;transform:translateY(-50%);background:rgba(3,7,18,0.9);border:1px solid rgba(0,243,255,0.3);padding:3px 6px;border-radius:4px;font-size:10px;font-family:ui-monospace,monospace;color:${isSelected ? '#00f3ff' : dotColor};white-space:nowrap;font-weight:700;backdrop-filter:blur(10px);box-shadow:0 0 10px rgba(0,0,0,0.5);">${formatPrice(prop.price)}</span>` : ""}
                </div>
            `;

            const icon = L.divIcon({
                className: "",
                html: markerHtml,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
            });

            const marker = L.marker([prop.latitude, prop.longitude], { icon }).addTo(map.current!);

            const tooltipContent = `
                <div style="font-family:ui-monospace,SFMono-Regular,monospace;min-width:240px;background:rgba(3,7,18,0.95);padding:14px;border:1px solid rgba(0,243,255,0.25);box-shadow:0 20px 40px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-radius:12px;overflow:hidden;position:relative;">
                    <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(180deg, rgba(0,243,255,0.05) 0%, rgba(255,255,255,0) 100%);pointer-events:none;"></div>
                    <div style="font-weight:700;color:#fff;font-size:10px;margin-bottom:8px;letter-spacing:0.1em;text-transform:uppercase;">${prop.address}</div>
                    <div style="color:${dotColor};font-size:22px;font-weight:700;letter-spacing:-0.05em;text-shadow:0 0 20px ${dotColor};">${formatPrice(prop.price)}</div>
                    <div style="display:flex;gap:12px;margin-top:10px;color:rgba(255,255,255,0.6);font-size:10px;">
                        <span><span style="color:#00f3ff">►</span> ${(prop.sqft || 0).toLocaleString()} SQFT</span>
                        <span><span style="color:#00f3ff">►</span> ${prop.bedrooms}B / ${prop.bathrooms}B</span>
                    </div>
                </div>
            `;
            marker.bindTooltip(tooltipContent, { className: "custom-tooltip", direction: "top", offset: [0, -10], opacity: 1 });

            marker.on("click", () => {
                onPropertyClick(prop);
                map.current?.flyTo([prop.latitude, prop.longitude], Math.max(currentZoom, 15), { animate: true, duration: 1.2, easeLinearity: 0.1 });
            });

            markers.current[prop.id] = marker;
        });
    }, [properties, onPropertyClick, selectedId, currentZoom]);

    useEffect(() => {
        if (!radarLayer.current) return;
        radarLayer.current.clearLayers();

        if (selectedId) {
            const prop = properties.find(p => p.id === selectedId);
            if (prop) {
                const radarHtml = `
                    <div style="position:relative;width:160px;height:160px;pointer-events:none;">
                        <div class="radar-ring" style="position:absolute;top:0;left:0;width:160px;height:160px;border-radius:50%;border:1px solid #00f3ff;opacity:0.2;box-shadow:inset 0 0 20px rgba(0,243,255,0.1), 0 0 20px rgba(0,243,255,0.1);"></div>
                        <div class="radar-ring" style="position:absolute;top:30px;left:30px;width:100px;height:100px;border-radius:50%;border:1px solid #00f3ff;opacity:0.4;animation-delay:0.3s;"></div>
                        <div class="radar-ring" style="position:absolute;top:50px;left:50px;width:60px;height:60px;border-radius:50%;border:1.5px solid #00f3ff;opacity:0.7;animation-delay:0.6s;"></div>
                    </div>
                `;
                const radarIcon = L.divIcon({ className: "", html: radarHtml, iconSize: [160, 160], iconAnchor: [80, 80] });
                L.marker([prop.latitude, prop.longitude], { icon: radarIcon, interactive: false }).addTo(radarLayer.current!);
            }
        }
    }, [selectedId, properties]);

    return (
        <div className="absolute inset-0 z-0 bg-nexus-900">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-[1]"></div>
            <div className="absolute inset-0 bg-cyber-gradient opacity-90 pointer-events-none z-[2]"></div>
            
            <div className="absolute inset-0 z-[5]" ref={mapContainer} />
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}} />
        </div>
    );
}
