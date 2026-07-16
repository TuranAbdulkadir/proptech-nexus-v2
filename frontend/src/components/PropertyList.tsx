import React from "react";
import { Property } from "../types";

export default function PropertyList({ properties, onSelect, selectedId }: { properties: Property[]; onSelect: (prop: Property) => void; selectedId?: string | null; }) {
    if (properties.length === 0) return (
        <div className="p-6 text-center text-[10px] font-mono text-[#555]">
            NO PROPERTIES IN VIEW
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-[#030303]">
            {/* Header */}
            <div className="sticky top-0 bg-[#030303]/90 backdrop-blur-md border-b border-[#222] p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <span className="text-[12px] font-medium text-white tracking-wide">Registry</span>
                </div>
                <span className="text-[11px] text-[#888]">{properties.length} Results</span>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {properties.map(prop => {
                    const ext = prop as any;
                    const priceM = (prop.price / 1_000_000).toFixed(2);
                    const roi = ext.annualizedRoi ? ext.annualizedRoi.toFixed(1) : "?";
                    const isSelected = selectedId === prop.id;

                    return (
                        <div 
                            key={prop.id}
                            onClick={() => onSelect(prop)}
                            className={`group cursor-pointer border-b border-[#222] p-4 transition-all ${isSelected ? 'bg-[#111] border-l-4 border-l-white' : 'bg-[#030303] border-l-4 border-l-transparent hover:bg-[#0a0a0a]'}`}
                        >
                            <h3 className={`text-[13px] mb-3 leading-tight truncate ${isSelected ? 'text-white font-medium' : 'text-[#aaa] group-hover:text-white'}`}>
                                {prop.address}
                            </h3>
                            
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <span className="block text-[10px] text-[#666] mb-1">Value</span>
                                    <span className="text-[12px] text-white font-medium">${priceM}M</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-[#666] mb-1">ROI</span>
                                    <span className="text-[12px] text-white font-medium">{roi}%</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-[#666] mb-1">SqFt</span>
                                    <span className="text-[12px] text-white font-medium">{prop.sqft}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
