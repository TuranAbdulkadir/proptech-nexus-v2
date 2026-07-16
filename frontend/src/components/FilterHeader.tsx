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
        <div className="w-full h-full flex items-center justify-between">
            <div className="flex items-center gap-8">
                
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-[#666] tracking-wide uppercase">Max Price</span>
                    <div className="flex items-center bg-[#111] border border-[#222] rounded-md px-3 py-1.5 w-48">
                        <input 
                            type="range" 
                            min={1000000} max={250000000} step={1000000}
                            value={filters.maxPrice} 
                            onChange={e => update('maxPrice', Number(e.target.value))}
                            className="flex-1 h-1 bg-[#333] rounded-full appearance-none outline-none accent-white cursor-pointer mr-3"
                        />
                        <span className="text-[12px] font-medium text-white w-10 text-right">${(filters.maxPrice / 1_000_000).toFixed(0)}M</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-[#666] tracking-wide uppercase">Min ROI</span>
                    <div className="flex items-center bg-[#111] border border-[#222] rounded-md px-3 py-1.5 w-48">
                        <input 
                            type="range" 
                            min={0} max={25} step={0.5}
                            value={filters.minRoi} 
                            onChange={e => update('minRoi', Number(e.target.value))}
                            className="flex-1 h-1 bg-[#333] rounded-full appearance-none outline-none accent-white cursor-pointer mr-3"
                        />
                        <span className="text-[12px] font-medium text-white w-8 text-right">{filters.minRoi}%</span>
                    </div>
                </div>

                <div className="h-6 w-[1px] bg-[#222]"></div>

                <label className="flex items-center gap-2.5 cursor-pointer hover:bg-[#111] p-1.5 rounded-md transition-colors">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.hideFloodZones ? 'bg-white border-white' : 'bg-[#111] border-[#333]'}`}>
                        {filters.hideFloodZones && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4.5L3.5 7L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="text-[11px] font-medium text-[#888] tracking-wide uppercase select-none">Hide High-Risk Zones</span>
                </label>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#222] rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-[10px] font-medium text-[#888] tracking-widest uppercase">System Operational</span>
            </div>
        </div>
    );
}
