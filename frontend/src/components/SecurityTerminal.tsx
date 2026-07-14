"use client";
import React, { useState, useEffect, useRef } from "react";

const SYSTEM_MESSAGES = [
    "[SYSTEM] Connecting to Supabase PostGIS Shield...",
    "[SYSTEM] PostGIS Spatial Index: GIST activated.",
    "[SYSTEM] Redis rate-limiter online. Window: 60s / 100 req.",
    "[MONITOR] Scanning Wall Street Tower Alpha: Price $5,500,000 | ROI 6.2%",
    "[MONITOR] Scanning Times Square Penthouse: Price $12,500,000 | ROI 5.8%",
    "[MONITOR] Scanning Empire Sector Node: Price $8,000,000 | ROI 7.1%",
    "[SYSTEM] Cyber-Physical Scanner initialized (Shodan/Censys bridge).",
    "[WARNING] Open RTSP port (554) detected at Financial District Hub.",
    "[MONITOR] Scanning Cyber Node Alpha: Price $1,200,000 | ROI 8.5%",
    "[WARNING] Structural Crack detected (88%) at Union Square Condo.",
    "[SYSTEM] FEMA Flood Zone data loaded for NYC Metropolitan Area.",
    "[MONITOR] Scanning Neon Heights: Price $2,500,000 | ROI 6.8%",
    "[WARNING] Water Damage detected (94%) at Grid Sector 7.",
    "[SYSTEM] Gemini Pro Vision: Structural analysis pipeline ready.",
    "[MONITOR] Scanning MoMA Sky-Loft: Price $9,500,000 | ROI 5.4%",
    "[SYSTEM] IPv6 tunnel to Supabase established successfully.",
    "[WARNING] High Crime Index (72) near SoHo Art District Hub.",
    "[MONITOR] Scanning Pace University Node: Price $3,400,000 | ROI 7.8%",
    "[SYSTEM] PDF Sovereign Audit Engine: ReportLab initialized.",
    "[MONITOR] Global bounding-box query executed: 11 properties found.",
    "[SYSTEM] Rate limit check: 0/100 requests in current window.",
    "[WARNING] Mold Growth detected (91%) at MoMA Sky-Loft.",
    "[SYSTEM] Seismic safety scores computed for all active nodes.",
    "[MONITOR] Scanning Financial District Hub: Price $18,000,000 | ROI 4.2%",
    "[SYSTEM] Property tax engine: NYC rate 1.92% applied.",
];

export default function SecurityTerminal() {
    const [lines, setLines] = useState<string[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);
    const indexRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const msg = SYSTEM_MESSAGES[indexRef.current % SYSTEM_MESSAGES.length];
            const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
            setLines((prev) => {
                const next = [...prev, `${timestamp} ${msg}`];
                return next.length > 50 ? next.slice(-50) : next;
            });
            indexRef.current += 1;
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div className="absolute bottom-6 left-6 z-10 w-[420px] max-h-[160px] bg-slate-950/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border-b border-slate-800">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">Sentinel Terminal</span>
                <span className="text-[9px] text-slate-600 ml-auto font-mono">v2.0.0</span>
            </div>
            <div
                ref={terminalRef}
                className="p-2 overflow-y-auto max-h-[130px] scrollbar-thin"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}
            >
                {lines.map((line, i) => {
                    let textColor = "text-slate-500";
                    if (line.includes("[WARNING]")) textColor = "text-yellow-400";
                    else if (line.includes("[MONITOR]")) textColor = "text-green-400/70";
                    else if (line.includes("[SYSTEM]")) textColor = "text-cyan-400/60";

                    return (
                        <div key={i} className={`text-[10px] font-mono leading-relaxed ${textColor} ${i === lines.length - 1 ? "terminal-cursor" : ""}`}>
                            {line}
                        </div>
                    );
                })}
                {lines.length === 0 && (
                    <div className="text-[10px] font-mono text-slate-600 terminal-cursor">
                        Initializing PropTech Nexus Sentinel...
                    </div>
                )}
            </div>
        </div>
    );
}
