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

export default function MapDashboard({ properties, selectedId, onPropertyClick, onBoundsChange }: MapDashboardProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<L.Map | null>(null);
    const markers = useRef<Record<string, L.Marker>>({});
    const radarLayer = useRef<L.LayerGroup | null>(null);
    const heatLayerGroup = useRef<L.LayerGroup | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);

    useEffect(() => {
        if (!mapContainer.current) return;
        if (map.current) return;

        map.current = L.map(mapContainer.current, {
            center: [40.7306, -73.9352],
            zoom: 13,
            zoomControl: false,
            attributionControl: false,
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

        const newIds = new Set(properties.map((p) => p.id));
        Object.keys(markers.current).forEach((id) => {
            if (!newIds.has(id)) {
                markers.current[id].remove();
                delete markers.current[id];
            }
        });

        properties.forEach((prop) => {
            if (!markers.current[prop.id]) {
                const seed = prop.id.charCodeAt(prop.id.length - 1);
                const score = 30 + ((seed * 7) % 65);
                let dotColor: string;
                let glowRgba: string;

                if (score >= 70) {
                    dotColor = "#22c55e";
                    glowRgba = "rgba(34,197,94,0.7)";
                } else if (score >= 45) {
                    dotColor = "#eab308";
                    glowRgba = "rgba(234,179,8,0.7)";
                } else {
                    dotColor = "#ef4444";
                    glowRgba = "rgba(239,68,68,0.7)";
                }

                const markerHtml = `
                    <div class="marker-enter" style="position:relative;cursor:pointer;">
                        <div style="width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,0.8);background:${dotColor};box-shadow:0 0 10px ${glowRgba};transition:transform 0.2s;"></div>
                        <div style="position:absolute;top:-3px;left:-3px;width:20px;height:20px;border-radius:50%;background:${dotColor};opacity:0.3;animation:radar-ping 2.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
                    </div>
                `;

                const icon = L.divIcon({
                    className: "",
                    html: markerHtml,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7],
                });

                const marker = L.marker([prop.latitude, prop.longitude], { icon }).addTo(map.current!);

                const tooltipContent = `
                    <div style="font-family:ui-monospace,monospace;min-width:190px;">
                        <div style="font-weight:700;color:#f8fafc;font-size:11px;margin-bottom:3px;">${prop.address}</div>
                        <div style="color:#22c55e;font-size:14px;font-weight:800;">$${prop.price.toLocaleString()}</div>
                        <div style="color:#94a3b8;font-size:10px;margin-top:4px;">${(prop.sqft || 0).toLocaleString()} sqft &bull; ${prop.bedrooms}BD / ${prop.bathrooms}BA</div>
                        <div style="color:#64748b;font-size:9px;margin-top:3px;">Security: ${score}/100</div>
                    </div>
                `;
                marker.bindTooltip(tooltipContent, { className: "custom-tooltip", direction: "top", offset: [0, -10], opacity: 1 });

                marker.on("click", () => {
                    onPropertyClick(prop);
                    map.current?.flyTo([prop.latitude, prop.longitude], 15, { animate: true, duration: 1 });
                });

                markers.current[prop.id] = marker;
            }
        });
    }, [properties, onPropertyClick]);

    useEffect(() => {
        if (!radarLayer.current) return;
        radarLayer.current.clearLayers();

        if (selectedId) {
            const prop = properties.find((p) => p.id === selectedId);
            if (prop && map.current) {
                const radarHtml = `
                    <div style="position:relative;width:60px;height:60px;">
                        <div class="radar-ring" style="position:absolute;top:0;left:0;width:60px;height:60px;border-radius:50%;border:2px solid #22c55e;opacity:0.6;"></div>
                        <div class="radar-ring" style="position:absolute;top:10px;left:10px;width:40px;height:40px;border-radius:50%;border:2px solid #22c55e;opacity:0.4;animation-delay:0.5s;"></div>
                        <div class="radar-ring" style="position:absolute;top:20px;left:20px;width:20px;height:20px;border-radius:50%;border:2px solid #22c55e;opacity:0.3;animation-delay:1s;"></div>
                    </div>
                `;
                const radarIcon = L.divIcon({
                    className: "",
                    html: radarHtml,
                    iconSize: [60, 60],
                    iconAnchor: [30, 30],
                });
                L.marker([prop.latitude, prop.longitude], { icon: radarIcon, interactive: false }).addTo(radarLayer.current!);
            }
        }
    }, [selectedId, properties]);

    useEffect(() => {
        if (!map.current || !heatLayerGroup.current) return;

        heatLayerGroup.current.clearLayers();

        if (showHeatmap) {
            properties.forEach((prop) => {
                const seed = prop.id.charCodeAt(prop.id.length - 1);
                const score = 30 + ((seed * 7) % 65);
                const radius = 300 + (100 - score) * 8;
                let color: string;

                if (score >= 70) color = "#22c55e";
                else if (score >= 45) color = "#eab308";
                else color = "#ef4444";

                L.circle([prop.latitude, prop.longitude], {
                    radius: radius,
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.08,
                    weight: 1,
                    opacity: 0.15,
                    interactive: false,
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
                <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 rounded-xl px-3 py-2 text-center shadow-xl">
                    <span className="text-[9px] text-slate-500 uppercase tracking-[0.15em] block">Nodes</span>
                    <span className="text-xl font-bold text-green-400 font-mono">{properties.length}</span>
                </div>
                <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`px-3 py-2 rounded-xl border text-[9px] uppercase tracking-[0.15em] font-bold transition-all shadow-xl backdrop-blur-xl ${
                        showHeatmap
                            ? "bg-green-500/20 border-green-500/40 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                            : "bg-slate-900/85 border-slate-700/50 text-slate-500 hover:text-slate-300 hover:border-slate-600"
                    }`}
                >
                    {showHeatmap ? "🔥 Heat ON" : "🔥 Heat OFF"}
                </button>
            </div>
        </>
    );
}
