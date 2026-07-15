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
    if (score >= 65) return { dotColor: "#10b981", glowRgba: "rgba(16,185,129,0.8)", score }; // emerald-500
    if (score >= 40) return { dotColor: "#eab308", glowRgba: "rgba(234,179,8,0.8)", score };
    return { dotColor: "#ef4444", glowRgba: "rgba(239,68,68,0.8)", score };
}

export default function MapDashboard({ properties, selectedId, onPropertyClick, onBoundsChange }: MapDashboardProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<L.Map | null>(null);
    const markers = useRef<Record<string, L.Marker>>({});
    const radarLayer = useRef<L.LayerGroup | null>(null);
    const heatLayerGroup = useRef<L.LayerGroup | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(12);

    useEffect(() => {
        if (!mapContainer.current) return;
        if (map.current) return;

        map.current = L.map(mapContainer.current, {
            center: [47.54, -122.0], // Seattle / King County
            zoom: 10,
            zoomControl: false,
            attributionControl: false,
            minZoom: 9,
            maxZoom: 18,
        });

        // Use standard CARTO dark matter, but we filter it via CSS later to make it darker
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
    }, []);

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

            const size = isSelected ? 20 : 12;
            const coreSize = isSelected ? 12 : 6;

            const markerHtml = `
                <div class="marker-enter" style="position:relative;cursor:pointer;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;">
                    <!-- Outer Ring -->
                    <div style="position:absolute;width:100%;height:100%;border-radius:50%;border:1px solid ${isSelected ? '#00e5ff' : dotColor};opacity:${isSelected ? 1 : 0.5};box-shadow:0 0 ${isSelected ? 20 : 10}px ${isSelected ? 'rgba(0,229,255,0.8)' : glowRgba};transition:all 0.3s;${isSelected ? 'animation: spin 4s linear infinite;' : ''}">
                        ${isSelected ? '<div style="position:absolute;top:-2px;left:50%;width:4px;height:4px;background:#00e5ff;transform:translateX(-50%);border-radius:50%;"></div>' : ''}
                    </div>
                    <!-- Inner Core -->
                    <div style="width:${coreSize}px;height:${coreSize}px;border-radius:50%;background:${isSelected ? '#00e5ff' : dotColor};box-shadow:0 0 10px ${isSelected ? '#00e5ff' : dotColor};transition:all 0.3s;"></div>
                    
                    ${showLabel ? `<span style="position:absolute;left:${size + 8}px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.8);border:1px solid rgba(255,255,255,0.1);padding:3px 6px;border-radius:2px;font-size:10px;font-family:ui-monospace,monospace;color:${isSelected ? '#00e5ff' : dotColor};white-space:nowrap;font-weight:700;backdrop-filter:blur(10px);box-shadow:0 0 10px rgba(0,0,0,0.5);">${formatPrice(prop.price)}</span>` : ""}
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
                <div style="font-family:ui-monospace,monospace;min-width:220px;background:rgba(5,5,5,0.9);padding:10px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 0 30px rgba(0,229,255,0.1);backdrop-filter:blur(10px);border-radius:8px;">
                    <div style="font-weight:700;color:#f8fafc;font-size:11px;margin-bottom:6px;letter-spacing:0.05em;">${prop.address}</div>
                    <div style="color:${dotColor};font-size:16px;font-weight:300;letter-spacing:0.05em;">${formatPrice(prop.price)}</div>
                    <div style="display:flex;gap:12px;margin-top:8px;color:#94a3b8;font-size:10px;">
                        <span>${(prop.sqft || 0).toLocaleString()} SQFT</span>
                        <span>${prop.bedrooms}B / ${prop.bathrooms}B</span>
                    </div>
                    <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:#64748b;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;">Security: ${score}/100</span>
                        <span style="color:${dotColor};font-size:9px;font-weight:700;letter-spacing:0.1em;display:flex;align-items:center;gap:4px;">
                            <span style="width:6px;height:6px;border-radius:50%;background:${dotColor};box-shadow:0 0 5px ${dotColor};"></span>
                            ${score >= 65 ? "SECURE" : score >= 40 ? "WARNING" : "CRITICAL"}
                        </span>
                    </div>
                </div>
            `;
            // Remove leaflet default tooltip styling classes
            marker.bindTooltip(tooltipContent, { className: "cyber-tooltip", direction: "top", offset: [0, -10], opacity: 1 });

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
                    <div style="position:relative;width:120px;height:120px;pointer-events:none;">
                        <div class="radar-ring" style="position:absolute;top:0;left:0;width:120px;height:120px;border-radius:50%;border:1px solid #00e5ff;opacity:0.3;box-shadow:inset 0 0 20px rgba(0,229,255,0.1), 0 0 20px rgba(0,229,255,0.1);"></div>
                        <div class="radar-ring" style="position:absolute;top:20px;left:20px;width:80px;height:80px;border-radius:50%;border:1px solid #00e5ff;opacity:0.5;animation-delay:0.3s;"></div>
                        <div class="radar-ring" style="position:absolute;top:40px;left:40px;width:40px;height:40px;border-radius:50%;border:1.5px solid #00e5ff;opacity:0.8;animation-delay:0.6s;"></div>
                        <div style="position:absolute;top:0;left:60px;width:1px;height:60px;background:linear-gradient(to top, transparent, #00e5ff);transform-origin:bottom;animation: radar-sweep 4s linear infinite;"></div>
                    </div>
                `;
                const radarIcon = L.divIcon({ className: "", html: radarHtml, iconSize: [120, 120], iconAnchor: [60, 60] });
                L.marker([prop.latitude, prop.longitude], { icon: radarIcon, interactive: false }).addTo(radarLayer.current!);
            }
        }
    }, [selectedId, properties]);

    useEffect(() => {
        if (!map.current || !heatLayerGroup.current) return;
        heatLayerGroup.current.clearLayers();

        if (showHeatmap) {
            properties.forEach(prop => {
                const { score } = getScoreColor(prop.id);
                const radius = 250 + (100 - score) * 8;
                const color = score >= 65 ? "#10b981" : score >= 40 ? "#eab308" : "#ef4444";

                L.circle([prop.latitude, prop.longitude], {
                    radius, color, fillColor: color, fillOpacity: 0.08, weight: 0.5, opacity: 0.2, interactive: false,
                }).addTo(heatLayerGroup.current!);
            });
            heatLayerGroup.current.addTo(map.current);
        } else {
            map.current.removeLayer(heatLayerGroup.current);
        }
    }, [showHeatmap, properties]);

    return (
        <>
            <div ref={mapContainer} className="w-full h-full absolute top-0 left-0 bg-[#020202] z-0 map-darken filter contrast-125 saturate-50" />

            <style jsx global>{`
                .leaflet-container { background: #020202 !important; }
                .leaflet-layer { filter: brightness(0.6) contrast(1.5) sepia(0.2) hue-rotate(180deg) saturate(0.5); }
                .cyber-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; margin: 0 !important; padding: 0 !important; }
                .cyber-tooltip::before { display: none !important; }
                
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes radar-sweep { 100% { transform: rotate(360deg); } }
            `}</style>

            <div className="absolute top-28 right-6 z-10 flex flex-col gap-3">
                <div className="bg-[#050505]/90 backdrop-blur-3xl border border-white/10 rounded-xl px-4 py-3 text-center shadow-[0_0_30px_rgba(0,229,255,0.05)]">
                    <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] block mb-1">Active Nodes</span>
                    <span className="text-3xl font-light text-cyan-400 font-mono leading-none tracking-tight block drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">{properties.length}</span>
                    <span className="text-[9px] text-slate-600 block mt-1 uppercase tracking-widest">In Sector</span>
                </div>

                <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`px-4 py-3 rounded-xl border text-[9px] uppercase tracking-[0.2em] font-bold transition-all shadow-xl backdrop-blur-3xl flex items-center justify-center gap-2 ${
                        showHeatmap
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                            : "bg-[#050505]/90 border-white/10 text-slate-500 hover:text-cyan-300 hover:border-cyan-500/30"
                    }`}
                >
                    <span className={`w-2 h-2 rounded-full ${showHeatmap ? 'bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(0,229,255,1)]' : 'bg-slate-600'}`}></span>
                    {showHeatmap ? "Heat ON" : "Heat OFF"}
                </button>

                <button
                    onClick={() => { map.current?.setView([47.54, -122.0], 10, { animate: true }); }}
                    className="px-4 py-3 rounded-xl border bg-[#050505]/90 border-white/10 text-slate-500 text-[9px] uppercase tracking-[0.2em] font-bold hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-xl backdrop-blur-3xl flex items-center justify-center gap-2"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    Recenter
                </button>
            </div>
        </>
    );
}
