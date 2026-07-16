import React from 'react';
import { FilterState } from '../types';

export default function FilterHeader({
    filters,
    onFilterChange,
}: {
    filters: FilterState;
    onFilterChange: (f: FilterState) => void;
}) {
    const update = (key: keyof FilterState, val: any) => onFilterChange({ ...filters, [key]: val });

    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-[#666] uppercase">Max Price</span>
                    <input 
                        type="range" 
                        min={1000000} max={250000000} step={1000000}
                        value={filters.maxPrice} 
                        onChange={e => update('maxPrice', Number(e.target.value))}
                        className="w-24 accent-blue-500 h-1 bg-[#1a1a1a] rounded-full appearance-none outline-none"
                    />
                    <span className="font-mono text-[10px] text-slate-300 w-12">${(filters.maxPrice / 1_000_000).toFixed(0)}M</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-[#666] uppercase">Min ROI</span>
                    <input 
                        type="range" 
                        min={0} max={25} step={0.5}
                        value={filters.minRoi} 
                        onChange={e => update('minRoi', Number(e.target.value))}
                        className="w-24 accent-green-500 h-1 bg-[#1a1a1a] rounded-full appearance-none outline-none"
                    />
                    <span className="font-mono text-[10px] text-green-400 w-8">{filters.minRoi}%</span>
                </div>

                <div className="flex items-center gap-2 border-l border-[#1a1a1a] pl-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={filters.hideFloodZones} 
                            onChange={e => update('hideFloodZones', e.target.checked)}
                            className="accent-blue-500 w-3 h-3 bg-[#1a1a1a] border-[#333]"
                        />
                        <span className="font-mono text-[9px] text-[#888] uppercase select-none">Hide High-Risk Flood</span>
                    </label>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#1a1a1a] px-2 py-1 rounded">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                    <span className="font-mono text-[9px] text-green-500 uppercase tracking-widest">System Nominal</span>
                </div>
            </div>
        </div>
    );
}
