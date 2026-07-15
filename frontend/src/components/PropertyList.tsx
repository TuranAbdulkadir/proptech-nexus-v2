"use client";
import React from "react";
import { Property } from "../types";

interface PropertyListProps {
    properties: Property[];
    selectedId: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onPropertyClick: (prop: Property) => void;
    boroughs: Record<string, string>;
}

export default function PropertyList({ properties, selectedId, searchQuery, onSearchChange, onPropertyClick, boroughs }: PropertyListProps) {
    return (
        <aside className="absolute top-24 left-6 z-10 w-[380px] h-[calc(100vh-140px)] bg-slate-950/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="p-4 border-b border-slate-800/60 bg-slate-900/50">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-green-400 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Node Index
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{properties.length} Results</span>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search address or borough..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-700/60 rounded-lg pl-8 pr-4 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-green-500/50 focus:shadow-[0_0_10px_rgba(34,197,94,0.15)] transition-all"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5" style={{ scrollbarWidth: "thin", scrollbarColor: "#334155 transparent" }}>
                {properties.map((prop: any) => {
                    const isSelected = selectedId === prop.id;
                    const borough = prop.borough || boroughs[prop.address] || "NYC";
                    return (
                        <div
                            key={prop.id}
                            onClick={() => onPropertyClick(prop)}
                            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                                isSelected
                                    ? "bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                    : "bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/60 hover:border-slate-700/50"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1.5">
                                <span className={`text-xs font-bold font-mono tracking-wide ${isSelected ? "text-green-400" : "text-slate-200"}`}>
                                    {prop.address}
                                </span>
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest">{borough}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono">
                                <span className={isSelected ? "text-green-300 font-bold" : "text-slate-400"}>
                                    ${(prop.price / 1e6).toFixed(2)}M
                                </span>
                                <span className="text-slate-500 text-[10px]">
                                    {prop.sqft} sqft &bull; {prop.bedrooms}BD
                                </span>
                            </div>
                        </div>
                    );
                })}
                {properties.length === 0 && (
                    <div className="p-6 text-center text-slate-500 text-xs font-mono">
                        No active nodes found matching parameters.
                    </div>
                )}
            </div>
        </aside>
    );
}
