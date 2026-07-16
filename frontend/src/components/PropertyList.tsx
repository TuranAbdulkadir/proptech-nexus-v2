import React from "react";
import { Property } from "../types";

export default function PropertyList({ properties, onSelect }: { properties: Property[]; onSelect: (prop: Property) => void }) {
    if (properties.length === 0) return null;

    return (
        <div className="absolute top-28 left-6 bottom-6 w-[400px] z-[1000] pointer-events-none flex flex-col">
            <div className="flex-1 pointer-events-auto bg-nexus-800/85 backdrop-blur-2xl border border-nexus-700/50 rounded-2xl shadow-glass flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-nexus-700/40 to-transparent p-4 border-b border-nexus-700/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-nexus-cyan animate-pulse shadow-neon-cyan"></div>
                        <h2 className="font-display font-bold text-slate-200 text-sm tracking-[0.2em] uppercase">Property Registry</h2>
                    </div>
                    <span className="font-mono text-[9px] text-nexus-cyan border border-nexus-cyan/30 bg-nexus-cyan/10 px-2 py-0.5 rounded uppercase tracking-widest">{properties.length} FOUND</span>
                </div>

                {/* List Body */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {properties.map(prop => {
                        const ext = prop as any;
                        const priceM = (prop.price / 1_000_000).toFixed(2);
                        const roi = ext.annualizedRoi ? ext.annualizedRoi.toFixed(1) : "?";
                        const score = ext.securityScore || 0;
                        const scoreColor = score >= 65 ? "text-nexus-neon" : score >= 40 ? "text-yellow-400" : "text-red-500";

                        return (
                            <div 
                                key={prop.id}
                                onClick={() => onSelect(prop)}
                                className="group cursor-pointer bg-nexus-900/40 hover:bg-nexus-700/40 border border-nexus-700/30 hover:border-nexus-cyan/50 rounded-xl p-4 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-nexus-700/50 group-hover:bg-nexus-cyan transition-colors"></div>
                                
                                <div className="pl-2">
                                    <h3 className="font-mono text-xs text-slate-200 group-hover:text-white mb-2 leading-tight uppercase truncate">{prop.address}</h3>
                                    
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Value</span>
                                            <span className="font-mono text-[11px] text-nexus-cyan font-bold">${priceM}M</span>
                                        </div>
                                        <div>
                                            <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">ROI</span>
                                            <span className="font-mono text-[11px] text-slate-300">{roi}%</span>
                                        </div>
                                        <div>
                                            <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Security</span>
                                            <span className={`font-mono text-[11px] ${scoreColor} font-bold`}>{score}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
            </div>
        </div>
    );
}
