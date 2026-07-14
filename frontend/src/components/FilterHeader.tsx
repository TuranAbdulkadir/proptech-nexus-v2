"use client";
import React from 'react';
import { FilterState } from '../types';

interface FilterHeaderProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export default function FilterHeader({ filters, onFilterChange }: FilterHeaderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        onFilterChange({
            ...filters,
            [name]: type === 'checkbox' ? checked : Number(value)
        });
    };

    return (
        <header className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-5xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-2xl p-4 text-slate-100 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] flex items-center justify-center font-black text-xl text-slate-900">
                    N
                </div>
                <div>
                    <h1 className="text-lg font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">PropTech Nexus</h1>
                    <span className="text-[10px] text-green-400 tracking-widest uppercase font-mono">Global Sentinel Active</span>
                </div>
            </div>
            
            <div className="flex items-center gap-8 text-sm font-medium">
                <div className="flex flex-col gap-1">
                    <label className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Max Price ($)</label>
                    <input 
                        type="number" 
                        name="maxPrice" 
                        value={filters.maxPrice} 
                        onChange={handleChange} 
                        className="bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 outline-none focus:border-green-500 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all w-32 font-mono text-slate-300" 
                    />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Min ROI (%)</label>
                    <input 
                        type="number" 
                        name="minRoi" 
                        value={filters.minRoi} 
                        onChange={handleChange} 
                        className="bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 outline-none focus:border-green-500 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all w-24 font-mono text-slate-300" 
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Min Security Score</label>
                    <input 
                        type="number" 
                        name="minSecurityScore" 
                        value={filters.minSecurityScore} 
                        onChange={handleChange} 
                        className="bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 outline-none focus:border-green-500 focus:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all w-24 font-mono text-slate-300" 
                    />
                </div>
                
                <div className="flex items-center gap-3 mt-4 bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-700/50">
                    <input 
                        type="checkbox" 
                        name="hideFloodZones" 
                        checked={filters.hideFloodZones} 
                        onChange={handleChange} 
                        className="accent-green-500 w-4 h-4 cursor-pointer" 
                    />
                    <label className="text-slate-300 text-[11px] uppercase tracking-widest font-bold cursor-pointer">Hide Hazards</label>
                </div>
            </div>
        </header>
    );
}
