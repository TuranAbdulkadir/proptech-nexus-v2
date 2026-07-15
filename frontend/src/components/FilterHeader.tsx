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
        <header className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-[96%] max-w-7xl bg-[#050505]/60 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,229,255,0.05)] rounded-2xl text-slate-100 transition-all">
            <div className="px-6 py-4 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-black border border-cyan-500/50 shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center font-black text-xl text-cyan-400 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent"></div>
                        N
                    </div>
                    <div>
                        <h1 className="text-base font-bold tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            PropTech Nexus
                        </h1>
                        <span className="text-[9px] text-cyan-400 tracking-[0.25em] uppercase font-semibold flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse inline-block shadow-[0_0_8px_rgba(0,229,255,1)]"></span>
                            Global Sentinel Active
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    <FilterInput label="Max Price ($)" name="maxPrice" value={filters.maxPrice} onChange={handleChange} width="w-32" />
                    <FilterInput label="Min ROI (%)" name="minRoi" value={filters.minRoi} onChange={handleChange} width="w-24" />
                    <FilterInput label="Min Security" name="minSecurityScore" value={filters.minSecurityScore} onChange={handleChange} width="w-24" />

                    <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2.5 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors">
                        <input
                            type="checkbox"
                            name="hideFloodZones"
                            checked={filters.hideFloodZones}
                            onChange={handleChange}
                            className="accent-cyan-500 w-4 h-4 cursor-pointer"
                        />
                        <label className="text-slate-300 text-[10px] uppercase tracking-[0.2em] font-bold cursor-pointer">
                            Hide Hazards
                        </label>
                    </div>

                    <button
                        onClick={onToggleList}
                        className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all px-4 py-2.5 rounded-lg border ${showingList ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(0,229,255,0.2)]' : 'bg-transparent text-slate-400 hover:text-cyan-300 border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5'}`}
                    >
                        {showingList ? "Hide Registry" : "Show Registry"}
                    </button>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-cyan-300 transition-colors px-3 py-2.5 rounded-lg border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5"
                    >
                        {expanded ? "Less ▲" : "More ▼"}
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-6 bg-black/20 rounded-b-2xl">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-400 text-[9px] uppercase tracking-[0.2em] font-bold">Min Price ($)</label>
                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleChange}
                                className="bg-black/50 border border-white/10 rounded-md px-3 py-2 outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all w-32 font-mono text-cyan-50 text-xs"
                            />
                        </div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono text-right">
                        <span className="block font-bold">SENTINEL ENGINE v3.0</span>
                        <span className="block text-cyan-500/60 mt-0.5">Quantum API Interface</span>
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
        <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-[9px] uppercase tracking-[0.2em] font-bold">{label}</label>
            <div className="relative group">
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`bg-black/40 border border-white/10 rounded-md px-3 py-2 outline-none focus:border-cyan-500 focus:bg-cyan-950/20 transition-all ${width} font-mono text-cyan-50 text-xs shadow-inner`}
                />
                <div className="absolute bottom-0 left-0 h-[1px] bg-cyan-500 w-0 group-focus-within:w-full transition-all duration-300 shadow-[0_0_8px_rgba(0,229,255,0.8)]"></div>
            </div>
        </div>
    );
}
