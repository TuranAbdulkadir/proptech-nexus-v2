import React from "react";
import { FilterState } from "../types";

interface FilterHeaderProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    onToggleList: () => void;
    showingList: boolean;
}

export default function FilterHeader({ filters, onFilterChange, onToggleList, showingList }: FilterHeaderProps) {
    return (
        <div className="absolute top-0 left-0 w-full z-[1000] p-6 pointer-events-none">
            <div className="max-w-[1600px] mx-auto pointer-events-auto flex items-center justify-between">
                
                {/* LOGO HUD */}
                <div className="flex items-center gap-6 bg-nexus-800/80 backdrop-blur-xl border border-nexus-700/50 rounded-2xl p-4 shadow-glass">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-nexus-cyan to-blue-600 p-[1px] shadow-neon-cyan">
                        <div className="h-full w-full bg-nexus-900 rounded-xl flex items-center justify-center">
                            <span className="font-display font-bold text-nexus-cyan text-xl tracking-tighter">N</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-xl tracking-[0.2em] text-white">PROPTECH NEXUS</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-nexus-cyan animate-pulse"></div>
                            <span className="font-mono text-xs text-nexus-cyan/80 tracking-widest uppercase">Global Sentinel Active</span>
                        </div>
                    </div>
                </div>

                {/* ADVANCED CONTROLS */}
                <div className="flex items-center gap-4 bg-nexus-800/80 backdrop-blur-xl border border-nexus-700/50 rounded-2xl p-3 shadow-glass">
                    
                    <div className="flex flex-col gap-1 px-4 border-r border-nexus-700/50">
                        <label className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Max Value Limit</label>
                        <div className="flex items-center gap-2">
                            <span className="text-nexus-cyan font-mono">$</span>
                            <input 
                                type="number" 
                                value={filters.maxPrice / 1000} 
                                onChange={(e) => onFilterChange({...filters, maxPrice: Number(e.target.value) * 1000})}
                                className="bg-transparent border-none text-white font-mono focus:outline-none focus:ring-0 w-24 placeholder-slate-600"
                                placeholder="000"
                            />
                            <span className="text-slate-500 font-mono text-xs">K</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 px-4 border-r border-nexus-700/50">
                        <label className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Min Yield (ROI)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-nexus-neon font-mono">%</span>
                            <input 
                                type="number" 
                                value={filters.minRoi} 
                                onChange={(e) => onFilterChange({...filters, minRoi: Number(e.target.value)})}
                                className="bg-transparent border-none text-white font-mono focus:outline-none focus:ring-0 w-16 placeholder-slate-600"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 px-4 border-r border-nexus-700/50">
                        <label className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Security Floor</label>
                        <div className="flex items-center gap-2">
                            <span className="text-nexus-purple font-mono">🛡</span>
                            <input 
                                type="number" 
                                value={filters.minSecurityScore} 
                                onChange={(e) => onFilterChange({...filters, minSecurityScore: Number(e.target.value)})}
                                className="bg-transparent border-none text-white font-mono focus:outline-none focus:ring-0 w-16 placeholder-slate-600"
                            />
                        </div>
                    </div>

                    <div className="px-2 flex gap-3">
                        <button 
                            onClick={onToggleList}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all duration-300 ${
                                showingList 
                                ? 'bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan/50 shadow-neon-cyan' 
                                : 'bg-nexus-900 text-slate-400 border border-nexus-700/50 hover:bg-nexus-700'
                            }`}
                        >
                            {showingList ? 'HIDE REGISTRY' : 'SHOW REGISTRY'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
