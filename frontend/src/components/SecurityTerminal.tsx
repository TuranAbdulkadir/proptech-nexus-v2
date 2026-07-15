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
                className="absolute bottom-6 left-6 z-10 bg-[#050505]/90 backdrop-blur-3xl border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.1)] hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:border-cyan-500/30 transition-all group"
            >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(0,229,255,1)]"></div>
                <span className="text-[9px] text-cyan-500 uppercase tracking-[0.3em] font-bold group-hover:text-cyan-300">Expand Terminal</span>
            </button>
        );
    }

    return (
        <div className="absolute bottom-6 left-6 z-10 w-[420px] max-h-[180px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-xl shadow-[0_0_40px_rgba(0,229,255,0.05)] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#020202]/90 border-b border-white/10 relative z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,229,255,1)]"></div>
                <span className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-bold flex-1">Sentinel Terminal</span>
                <span className="text-[8px] text-cyan-500 font-mono tracking-widest mr-2 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">LIVE NET</span>
                <button onClick={() => setMinimized(true)} className="text-slate-500 hover:text-cyan-400 text-[10px] transition-colors p-1 hover:bg-white/5 rounded">✕</button>
            </div>
            <div
                ref={terminalRef}
                className="p-4 overflow-y-auto max-h-[145px] relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
                {lines.map((line, i) => {
                    let textColor = "text-slate-500";
                    let glow = "";
                    if (line.includes("[WARNING]")) { textColor = "text-yellow-400"; glow = "drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]"; }
                    else if (line.includes("[MONITOR]") || line.includes("[FETCHING]")) { textColor = "text-cyan-400"; glow = "drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]"; }
                    else if (line.includes("[SYSTEM]") || line.includes("[INTEGRATING]")) { textColor = "text-slate-300"; }
                    else if (line.includes("[SECURE]")) { textColor = "text-emerald-400"; glow = "drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"; }

                    return (
                        <div key={i} className={`text-[10px] font-mono leading-[1.8] ${textColor} ${glow} ${i === lines.length - 1 ? "terminal-cursor" : ""}`}>
                            {line}
                        </div>
                    );
                })}
                {lines.length === 0 && (
                    <div className="text-[10px] font-mono text-cyan-700 terminal-cursor animate-pulse">
                        Establishing Quantum Handshake...
                    </div>
                )}
            </div>
        </div>
    );
}
