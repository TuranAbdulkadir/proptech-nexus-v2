"use client";
import React, { useState } from "react";
import { FilterState } from "../types";

interface FilterHeaderProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    onToggleList: () => void;
    showingList: boolean;
}

export default function FilterHeader({ filters, onFilterChange, onToggleList, showingList }: FilterHeaderProps) {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        onFilterChange({
            ...filters,
            [name]: type === "checkbox" ? checked : Number(value),
        });
    };

    return (
        <header className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[95%] max-w-6xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/40 shadow-[0_8px_40px_rgba(0,0,0,0.6)] rounded-2xl text-slate-100">
            <div className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-green-600 shadow-[0_0_20px_rgba(34,197,94,0.5)] flex items-center justify-center font-black text-lg text-slate-900">
                        N
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-[0.15em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                            PropTech Nexus
                        </h1>
                        <span className="text-[8px] text-green-400 tracking-[0.2em] uppercase font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block"></span>
                            Global Sentinel Active
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-5 text-sm">
                    <FilterInput label="Max Price ($)" name="maxPrice" value={filters.maxPrice} onChange={handleChange} width="w-28" />
                    <FilterInput label="Min ROI (%)" name="minRoi" value={filters.minRoi} onChange={handleChange} width="w-20" />
                    <FilterInput label="Min Security" name="minSecurityScore" value={filters.minSecurityScore} onChange={handleChange} width="w-20" />

                    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/40">
                        <input
                            type="checkbox"
                            name="hideFloodZones"
                            checked={filters.hideFloodZones}
                            onChange={handleChange}
                            className="accent-green-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <label className="text-slate-400 text-[9px] uppercase tracking-[0.15em] font-bold cursor-pointer">
                            Hide Hazards
                        </label>
                    </div>

                    <button
                        onClick={onToggleList}
                        className={`text-[9px] uppercase tracking-[0.15em] font-bold transition-colors px-3 py-1.5 rounded border ${showingList ? 'bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'text-slate-500 hover:text-green-400 border-slate-700/40 hover:border-green-500/30'}`}
                    >
                        {showingList ? "Hide List" : "Show List"}
                    </button>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-[9px] uppercase tracking-[0.15em] font-bold text-slate-500 hover:text-green-400 transition-colors px-2 py-1.5 rounded border border-slate-700/40 hover:border-green-500/30"
                    >
                        {expanded ? "Less ▲" : "More ▼"}
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="px-5 py-3 border-t border-slate-800/60 flex items-center gap-6 animate-in fade-in duration-200">
                    <div className="flex flex-col gap-1">
                        <label className="text-slate-500 text-[9px] uppercase tracking-[0.15em] font-bold">Min Price ($)</label>
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleChange}
                            className="bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1.5 outline-none focus:border-green-500 focus:shadow-[0_0_8px_rgba(34,197,94,0.2)] transition-all w-28 font-mono text-slate-300 text-xs"
                        />
                    </div>
                    <div className="text-[9px] text-slate-600 font-mono">
                        <span className="block">Sentinel Engine v2.0</span>
                        <span className="block text-green-500/60">48 nodes indexed across 5 boroughs</span>
                    </div>
                </div>
            )}
        </header>
    );
}

function FilterInput({ label, name, value, onChange, width }: {
    label: string; name: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; width: string;
}) {
    return (
        <div className="flex flex-col gap-0.5">
            <label className="text-slate-500 text-[9px] uppercase tracking-[0.12em] font-bold">{label}</label>
            <input
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                className={`bg-slate-950/80 border border-slate-700/60 rounded-md px-2.5 py-1.5 outline-none focus:border-green-500 focus:shadow-[0_0_8px_rgba(34,197,94,0.2)] transition-all ${width} font-mono text-slate-300 text-xs`}
            />
        </div>
    );
}
