"use client";
import React, { useState, useEffect, useRef } from "react";

const MESSAGES = [
    "[SYSTEM] Initializing PropTech Nexus Sentinel Engine v2.0...",
    "[SYSTEM] PostGIS Spatial Index: GIST activated on 48 nodes.",
    "[SYSTEM] Redis rate-limiter online. Window: 60s / 100 req.",
    "[MONITOR] Scanning Wall Street Tower: Price $5.5M | Security 72/100",
    "[MONITOR] Scanning TriBeCa Penthouse: Price $15M | ROI 4.8%",
    "[WARNING] Open RTSP port (554) detected at Financial District Hub.",
    "[MONITOR] Scanning Brooklyn Heights: Price $3.2M | Security 58/100",
    "[SYSTEM] FEMA Flood Zone data loaded for NYC Metro (5 boroughs).",
    "[WARNING] Mold Growth detected (91%) at Harlem Renaissance.",
    "[MONITOR] Scanning Hudson Yards: Price $22M | ROI 3.2%",
    "[SYSTEM] Gemini Pro Vision pipeline ready for structural analysis.",
    "[WARNING] Foundation Shift (85%) at Bronx River Tower.",
    "[MONITOR] Scanning Upper East Side: Price $12.5M | Security 88/100",
    "[SYSTEM] IPv6 tunnel to Supabase established successfully.",
    "[MONITOR] Scanning Williamsburg Loft: Price $2.1M | ROI 7.4%",
    "[WARNING] High Crime Index (68) near Bushwick Creative.",
    "[SYSTEM] Property tax engine: NYC rate 1.92% applied to all nodes.",
    "[MONITOR] Scanning DUMBO Studio: Price $4.5M | Security 61/100",
    "[SYSTEM] PDF Sovereign Audit Engine initialized (ReportLab).",
    "[MONITOR] Scanning Park Slope Villa: Price $2.8M | ROI 6.1%",
    "[WARNING] Water Damage (94%) at Red Hook Yard.",
    "[MONITOR] Scanning LIC Waterfront: Price $3.6M | Security 75/100",
    "[SYSTEM] Bounding-box query: 48 properties indexed across NYC.",
    "[MONITOR] Scanning Chelsea Market Unit: Price $3.8M | ROI 5.9%",
    "[WARNING] Zone AE Flood Risk at Battery Park City.",
    "[MONITOR] Scanning Cobble Hill: Price $3.5M | Security 82/100",
    "[SYSTEM] Shodan/Censys cyber-physical scanner active.",
    "[MONITOR] Scanning Riverdale Estate: Price $1.8M | ROI 8.2%",
    "[WARNING] Electrical Fault (76%) at Fordham Heights.",
    "[MONITOR] Scanning Prospect Park W: Price $4.8M | Security 71/100",
    "[SYSTEM] Seismic safety scores computed for all active nodes.",
    "[MONITOR] Scanning Flatiron Loft: Price $5.6M | ROI 5.5%",
    "[WARNING] Roof Sag detected (82%) at City Island Dock.",
    "[MONITOR] Scanning NoHo Gallery: Price $6.1M | Security 64/100",
    "[SYSTEM] Climate hazard assessment complete for 48 properties.",
    "[MONITOR] Scanning Astoria Complex: Price $1.5M | ROI 9.1%",
];

export default function SecurityTerminal() {
    const [lines, setLines] = useState<string[]>([]);
    const [minimized, setMinimized] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    const indexRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const msg = MESSAGES[indexRef.current % MESSAGES.length];
            const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
            setLines(prev => {
                const next = [...prev, `${timestamp} ${msg}`];
                return next.length > 80 ? next.slice(-80) : next;
            });
            indexRef.current += 1;
        }, 1800);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [lines]);

    if (minimized) {
        return (
            <button
                onClick={() => setMinimized(false)}
                className="absolute bottom-6 left-6 z-10 bg-slate-900/85 backdrop-blur-xl border border-slate-700/40 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl hover:border-green-500/30 transition-all"
            >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] text-slate-500 uppercase tracking-[0.15em] font-bold">Terminal</span>
            </button>
        );
    }

    return (
        <div className="absolute bottom-6 left-6 z-10 w-[380px] max-h-[150px] bg-slate-950/92 backdrop-blur-xl border border-slate-700/40 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/70 border-b border-slate-800/60">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[8px] text-slate-500 uppercase tracking-[0.2em] font-bold flex-1">Sentinel Terminal</span>
                <span className="text-[8px] text-slate-700 font-mono mr-2">v2.0</span>
                <button onClick={() => setMinimized(true)} className="text-slate-600 hover:text-slate-300 text-[10px] transition-colors">—</button>
            </div>
            <div
                ref={terminalRef}
                className="p-2 overflow-y-auto max-h-[120px]"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}
            >
                {lines.map((line, i) => {
                    let textColor = "text-slate-600";
                    if (line.includes("[WARNING]")) textColor = "text-yellow-400/80";
                    else if (line.includes("[MONITOR]")) textColor = "text-green-500/60";
                    else if (line.includes("[SYSTEM]")) textColor = "text-cyan-500/50";

                    return (
                        <div key={i} className={`text-[9px] font-mono leading-[1.6] ${textColor} ${i === lines.length - 1 ? "terminal-cursor" : ""}`}>
                            {line}
                        </div>
                    );
                })}
                {lines.length === 0 && (
                    <div className="text-[9px] font-mono text-slate-700 terminal-cursor">
                        Booting Sentinel Engine...
                    </div>
                )}
            </div>
        </div>
    );
}
