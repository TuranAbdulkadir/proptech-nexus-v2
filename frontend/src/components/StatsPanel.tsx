"use client";
import React, { useState } from "react";

interface StatsPanelProps {
    stats: {
        totalValue: number;
        avgPrice: number;
        maxP: number;
        minP: number;
        avgSqft: number;
        count: number;
    };
}

export default function StatsPanel({ stats }: StatsPanelProps) {
    const [collapsed, setCollapsed] = useState(false);

    if (collapsed) {
        return (
            <button
                onClick={() => setCollapsed(false)}
                className="absolute bottom-6 right-4 z-10 bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 rounded-xl px-3 py-2 text-[9px] text-slate-500 uppercase tracking-[0.15em] font-bold hover:text-green-400 hover:border-green-500/30 transition-all shadow-xl"
            >
                📊 Stats
            </button>
        );
    }

    return (
        <div className="absolute bottom-6 right-4 z-10 w-[200px] bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-800/60 border-b border-slate-700/50">
                <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">Portfolio Analytics</span>
                <button onClick={() => setCollapsed(true)} className="text-slate-600 hover:text-slate-300 text-xs transition-colors">—</button>
            </div>

            <div className="p-3 space-y-3">
                <StatRow label="Active Nodes" value={stats.count.toString()} color="text-green-400" />
                <StatRow label="Total Value" value={`$${(stats.totalValue / 1e6).toFixed(1)}M`} color="text-cyan-400" />
                <StatRow label="Avg Price" value={`$${(stats.avgPrice / 1e6).toFixed(2)}M`} color="text-slate-200" />
                <StatRow label="Highest" value={`$${(stats.maxP / 1e6).toFixed(1)}M`} color="text-green-400" />
                <StatRow label="Lowest" value={`$${(stats.minP / 1e3).toFixed(0)}K`} color="text-yellow-400" />
                <StatRow label="Avg Sqft" value={`${stats.avgSqft.toFixed(0)}`} color="text-slate-300" />

                <div className="pt-2 border-t border-slate-700/50">
                    <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1.5">Price Distribution</div>
                    <PriceDistribution stats={stats} />
                </div>
            </div>
        </div>
    );
}

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
            <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
        </div>
    );
}

function PriceDistribution({ stats }: { stats: StatsPanelProps["stats"] }) {
    const ranges = [
        { label: "<1M", pct: stats.minP < 1e6 ? 35 : 10 },
        { label: "1-5M", pct: 40 },
        { label: "5-10M", pct: 15 },
        { label: ">10M", pct: stats.maxP > 10e6 ? 20 : 5 },
    ];

    return (
        <div className="space-y-1.5">
            {ranges.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="text-[8px] text-slate-600 w-8 font-mono">{r.label}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-700"
                            style={{ width: `${r.pct}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
