import React from "react";
import { Property } from "../types";

export default function PropertyList({ properties, onSelect, selectedId }: { properties: Property[]; onSelect: (prop: Property) => void; selectedId?: string | null; }) {
    if (properties.length === 0) return (
        <div className="p-6 text-center text-[10px] font-mono text-[#555]">
            NO PROPERTIES IN VIEW
        </div>
    );

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-[#0a0a0a]">
            {/* Header */}
            <div className="sticky top-0 bg-[#0f0f0f] border-b border-[#1a1a1a] p-2 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                    <span className="font-mono text-[9px] text-[#888] uppercase tracking-widest">Registry</span>
                </div>
                <span className="font-mono text-[9px] text-blue-400 border border-blue-900/50 bg-blue-900/10 px-1.5 py-0.5 rounded uppercase">{properties.length} FOUND</span>
            </div>

            {/* List Body */}
            <div className="flex flex-col">
                {properties.map(prop => {
                    const ext = prop as any;
                    const priceM = (prop.price / 1_000_000).toFixed(2);
                    const roi = ext.annualizedRoi ? ext.annualizedRoi.toFixed(1) : "?";
                    const score = ext.securityScore || 0;
                    const scoreColor = score >= 65 ? "text-green-500" : score >= 40 ? "text-yellow-500" : "text-red-500";
                    const isSelected = selectedId === prop.id;

                    return (
                        <div 
                            key={prop.id}
                            onClick={() => onSelect(prop)}
                            className={`group cursor-pointer border-b border-[#1a1a1a] p-3 transition-colors ${isSelected ? 'bg-[#141414] border-l-2 border-l-blue-500' : 'bg-[#0a0a0a] border-l-2 border-l-transparent hover:bg-[#111]'}`}
                        >
                            <h3 className={`font-mono text-[11px] mb-2 leading-tight uppercase truncate ${isSelected ? 'text-blue-400 font-bold' : 'text-slate-300 group-hover:text-white'}`}>
                                {prop.address}
                            </h3>
                            
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <span className="block font-mono text-[8px] text-[#666] uppercase mb-0.5">Value</span>
                                    <span className="font-mono text-[10px] text-slate-200">${priceM}M</span>
                                </div>
                                <div>
                                    <span className="block font-mono text-[8px] text-[#666] uppercase mb-0.5">ROI</span>
                                    <span className="font-mono text-[10px] text-green-400">{roi}%</span>
                                </div>
                                <div>
                                    <span className="block font-mono text-[8px] text-[#666] uppercase mb-0.5">Security</span>
                                    <span className={`font-mono text-[10px] ${scoreColor}`}>{score}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
