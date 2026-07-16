import React from "react";

export default function StatsPanel({ stats }: { stats: any }) {
    if (!stats) return null;

    const formatCurrency = (val: number) => `$${(val / 1000000).toFixed(1)}M`;
    const formatNumber = (val: number) => val.toLocaleString();

    return (
        <div className="p-6 bg-[#030303] h-full">
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                    <div className="text-[11px] font-medium text-[#666] uppercase tracking-wide mb-1">Total Monitored Value</div>
                    <div className="text-3xl font-medium text-white">{formatCurrency(stats.totalValue)}</div>
                </div>
                <div>
                    <div className="text-[11px] font-medium text-[#666] uppercase tracking-wide mb-1">Active Nodes</div>
                    <div className="text-3xl font-medium text-white">{formatNumber(stats.count)}</div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[11px] font-medium text-[#666] uppercase tracking-wide">Average Asset Value</span>
                        <span className="text-[13px] font-medium text-white">{formatCurrency(stats.avgPrice)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[60%]"></div>
                    </div>
                    <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] text-[#555]">{formatCurrency(stats.minP)} (Min)</span>
                        <span className="text-[10px] text-[#555]">{formatCurrency(stats.maxP)} (Max)</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[11px] font-medium text-[#666] uppercase tracking-wide">Average Size</span>
                        <span className="text-[13px] font-medium text-white">{formatNumber(Math.round(stats.avgSqft))} Sq.Ft.</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[45%]"></div>
                    </div>
                </div>
                
                <div className="border-t border-[#222] pt-6 mt-6">
                    <h3 className="text-[11px] font-medium text-[#666] uppercase tracking-wide mb-4">System Status</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="text-[#888]">Data Source</span>
                            <span className="text-white">Live PostGIS</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="text-[#888]">Last Sync</span>
                            <span className="text-white">Just Now</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="text-[#888]">AI Model</span>
                            <span className="text-white">ResNet-50-Structural-v4</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
