import React from "react";

export default function StatsPanel({ stats }: { stats: any }) {
    if (!stats) return null;

    return (
        <div className="absolute bottom-6 right-6 w-96 z-[1000] pointer-events-none">
            <div className="pointer-events-auto bg-nexus-800/85 backdrop-blur-2xl border border-nexus-700/50 rounded-2xl shadow-glass overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-nexus-700/40 to-transparent p-4 border-b border-nexus-700/50 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-nexus-purple animate-pulse shadow-neon-cyan"></div>
                    <h2 className="font-display font-bold text-slate-200 text-sm tracking-[0.2em] uppercase">Macro Analytics</h2>
                </div>

                {/* Body */}
                <div className="p-5 space-y-6">
                    
                    {/* Primary Stats Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-nexus-900/50 rounded-xl p-3 border border-nexus-700/30">
                            <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-1">Active Nodes</span>
                            <div className="flex items-end gap-2">
                                <span className="font-display text-2xl font-bold text-white">{stats.totalProperties}</span>
                                <span className="font-mono text-[10px] text-nexus-neon mb-1">LIVE</span>
                            </div>
                        </div>
                        <div className="bg-nexus-900/50 rounded-xl p-3 border border-nexus-700/30">
                            <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-1">Total Market Value</span>
                            <div className="flex items-end gap-1">
                                <span className="font-display text-2xl font-bold text-white">{(stats.totalValue / 1_000_000).toFixed(1)}</span>
                                <span className="font-mono text-[11px] text-nexus-cyan mb-1">M</span>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center group">
                            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Avg Price</span>
                            <span className="font-mono text-sm text-nexus-cyan">${(stats.averagePrice / 1_000_000).toFixed(2)}M</span>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Peak Value</span>
                            <span className="font-mono text-sm text-nexus-purple">${(stats.highestPrice / 1_000_000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Avg Floor Space</span>
                            <span className="font-mono text-sm text-slate-200">{stats.averageSqft} <span className="text-[9px] text-slate-500">SQFT</span></span>
                        </div>
                    </div>

                    {/* Distribution Bars */}
                    <div className="pt-3 border-t border-nexus-700/30">
                        <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-3">Value Distribution</span>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-[9px] text-slate-400 w-8">{"< 1M"}</span>
                                <div className="flex-1 h-1.5 bg-nexus-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-nexus-neon w-[45%] shadow-neon-green"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-[9px] text-slate-400 w-8">1-5M</span>
                                <div className="flex-1 h-1.5 bg-nexus-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-nexus-cyan w-[35%] shadow-neon-cyan"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-[9px] text-slate-400 w-8">{"> 5M"}</span>
                                <div className="flex-1 h-1.5 bg-nexus-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-nexus-purple w-[20%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
