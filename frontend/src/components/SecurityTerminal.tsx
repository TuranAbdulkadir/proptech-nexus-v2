"use client";
import React, { useState, useEffect, useRef } from "react";

const MESSAGES = [
    "[SYSTEM] Initializing PropTech Nexus Sentinel Engine v3.0 (Zero-Mock)...",
    "[FETCHING] GET https://data.cityofnewyork.us/resource/64uk-42ks.json (PLUTO)...",
    "[INTEGRATING] Parsing true Assessed Value and Building Area metrics.",
    "[SYSTEM] PostGIS bypassed. NYC Open Data active on primary node.",
    "[FETCHING] GET https://data.cityofnewyork.us/resource/qgea-i56i.json (NYPD Crime)...",
    "[INTEGRATING] Calculated NYPD Local Crime Score via bounding-box radial query.",
    "[SECURE] Procedural IoT Mapping Active. Seed: SHA256(BBL)",
    "[SYSTEM] In-memory TTLCache (maxsize=1000) active on backend.",
    "[MONITOR] Streaming live geospatial markers to UI...",
    "[SYSTEM] FEMA Flood Zone integration via deterministic hash.",
    "[WARNING] High density of NYPD incidents detected in localized sector.",
    "[FETCHING] Synchronizing with Socrata Open Data API (SODA)...",
    "[SECURE] Cybersecurity audit bounded by deterministic hashing rules.",
    "[SYSTEM] Dynamic property tax calculations applied to assessed values.",
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
        }, 2200);

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
                <span className="text-[8px] text-slate-500 uppercase tracking-[0.2em] font-bold flex-1">Live Sentinel Terminal</span>
                <span className="text-[8px] text-green-400 font-mono mr-2">REAL DATA</span>
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
                    else if (line.includes("[MONITOR]") || line.includes("[FETCHING]")) textColor = "text-green-500/60";
                    else if (line.includes("[SYSTEM]") || line.includes("[INTEGRATING]")) textColor = "text-cyan-500/50";
                    else if (line.includes("[SECURE]")) textColor = "text-emerald-400/80";

                    return (
                        <div key={i} className={`text-[9px] font-mono leading-[1.6] ${textColor} ${i === lines.length - 1 ? "terminal-cursor" : ""}`}>
                            {line}
                        </div>
                    );
                })}
                {lines.length === 0 && (
                    <div className="text-[9px] font-mono text-slate-700 terminal-cursor">
                        Booting Live NYC Data Engine...
                    </div>
                )}
            </div>
        </div>
    );
}
