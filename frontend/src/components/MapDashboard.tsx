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
    if (score >= 65) return { dotColor: "#22c55e", glowRgba: "rgba(34,197,94,0.6)", score };
    if (score >= 40) return { dotColor: "#eab308", glowRgba: "rgba(234,179,8,0.6)", score };
    return { dotColor: "#ef4444", glowRgba: "rgba(239,68,68,0.6)", score };
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
            center: [40.74, -73.97],
            zoom: 12,
            zoomControl: false,
            attributionControl: false,
            maxBounds: [[40.45, -74.30], [40.95, -73.65]],
            minZoom: 10,
            maxZoom: 18,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map.current);
        L.control.attribution({ position: "bottomright" }).addTo(map.current);

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

            const markerHtml = `
                <div class="marker-enter" style="position:relative;cursor:pointer;display:flex;align-items:center;gap:4px;">
                    <div style="width:${isSelected ? 18 : 12}px;height:${isSelected ? 18 : 12}px;border-radius:50%;border:2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.7)'};background:${dotColor};box-shadow:0 0 ${isSelected ? 20 : 8}px ${glowRgba};transition:all 0.3s;"></div>
                    <div style="position:absolute;top:-2px;left:-2px;width:${isSelected ? 22 : 16}px;height:${isSelected ? 22 : 16}px;border-radius:50%;background:${dotColor};opacity:0.25;animation:radar-ping 2.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
                    ${showLabel ? `<span style="position:absolute;left:18px;top:-3px;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.25);padding:1px 5px;border-radius:4px;font-size:9px;font-family:ui-monospace,monospace;color:${dotColor};white-space:nowrap;font-weight:700;backdrop-filter:blur(4px);">${formatPrice(prop.price)}</span>` : ""}
                </div>
            `;

            const icon = L.divIcon({
                className: "",
                html: markerHtml,
                iconSize: [isSelected ? 18 : 12, isSelected ? 18 : 12],
                iconAnchor: [isSelected ? 9 : 6, isSelected ? 9 : 6],
            });

            const marker = L.marker([prop.latitude, prop.longitude], { icon }).addTo(map.current!);

            const tooltipContent = `
                <div style="font-family:ui-monospace,monospace;min-width:200px;">
                    <div style="font-weight:700;color:#f8fafc;font-size:11px;margin-bottom:4px;">${prop.address}</div>
                    <div style="color:${dotColor};font-size:14px;font-weight:800;">${formatPrice(prop.price)}</div>
                    <div style="display:flex;gap:8px;margin-top:5px;">
                        <span style="color:#94a3b8;font-size:10px;">${(prop.sqft || 0).toLocaleString()} sqft</span>
                        <span style="color:#94a3b8;font-size:10px;">${prop.bedrooms}BD / ${prop.bathrooms}BA</span>
                    </div>
                    <div style="margin-top:5px;padding-top:5px;border-top:1px solid rgba(100,116,139,0.2);display:flex;justify-content:space-between;">
                        <span style="color:#64748b;font-size:9px;">Security: ${score}/100</span>
                        <span style="color:${dotColor};font-size:9px;font-weight:700;">●  ${score >= 65 ? "LOW RISK" : score >= 40 ? "MODERATE" : "HIGH RISK"}</span>
                    </div>
                </div>
            `;
            marker.bindTooltip(tooltipContent, { className: "custom-tooltip", direction: "top", offset: [0, -8], opacity: 1 });

            marker.on("click", () => {
                onPropertyClick(prop);
                map.current?.flyTo([prop.latitude, prop.longitude], Math.max(currentZoom, 14), { animate: true, duration: 0.8 });
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
                    <div style="position:relative;width:70px;height:70px;">
                        <div class="radar-ring" style="position:absolute;top:0;left:0;width:70px;height:70px;border-radius:50%;border:2px solid #22c55e;opacity:0.5;"></div>
                        <div class="radar-ring" style="position:absolute;top:12px;left:12px;width:46px;height:46px;border-radius:50%;border:1.5px solid #22c55e;opacity:0.35;animation-delay:0.4s;"></div>
                        <div class="radar-ring" style="position:absolute;top:24px;left:24px;width:22px;height:22px;border-radius:50%;border:1px solid #22c55e;opacity:0.2;animation-delay:0.8s;"></div>
                    </div>
                `;
                const radarIcon = L.divIcon({ className: "", html: radarHtml, iconSize: [70, 70], iconAnchor: [35, 35] });
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
                const radius = 200 + (100 - score) * 6;
                const color = score >= 65 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";

                L.circle([prop.latitude, prop.longitude], {
                    radius, color, fillColor: color, fillOpacity: 0.06, weight: 0.8, opacity: 0.12, interactive: false,
                }).addTo(heatLayerGroup.current!);
            });
            heatLayerGroup.current.addTo(map.current);
        } else {
            map.current.removeLayer(heatLayerGroup.current);
        }
    }, [showHeatmap, properties]);

    return (
        <>
            <div ref={mapContainer} className="w-full h-full absolute top-0 left-0 bg-slate-950 z-0" />

            <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
                <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/40 rounded-xl px-3 py-2 text-center shadow-xl">
                    <span className="text-[8px] text-slate-600 uppercase tracking-[0.15em] block">Active Nodes</span>
                    <span className="text-2xl font-bold text-green-400 font-mono leading-tight">{properties.length}</span>
                    <span className="text-[8px] text-slate-600 block">in view</span>
                </div>

                <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`px-3 py-2.5 rounded-xl border text-[9px] uppercase tracking-[0.12em] font-bold transition-all shadow-xl backdrop-blur-xl ${
                        showHeatmap
                            ? "bg-green-500/15 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                            : "bg-slate-900/85 border-slate-700/40 text-slate-500 hover:text-slate-300"
                    }`}
                >
                    🔥 {showHeatmap ? "Heat ON" : "Heat OFF"}
                </button>

                <button
                    onClick={() => { map.current?.setView([40.74, -73.97], 12, { animate: true }); }}
                    className="px-3 py-2 rounded-xl border bg-slate-900/85 border-slate-700/40 text-slate-500 text-[9px] uppercase tracking-[0.12em] font-bold hover:text-green-400 hover:border-green-500/30 transition-all shadow-xl backdrop-blur-xl"
                >
                    🏠 Reset View
                </button>
            </div>
        </>
    );
}
