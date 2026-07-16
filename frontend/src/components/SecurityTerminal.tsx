import React, { useState, useEffect } from "react";

const STARTUP_LOGS = [
    "[SYSTEM] Initializing PropTech Nexus Sentinel Engine v3.0 (Zero Hack)...",
    "[FETCHING] GET https://data.cityofnewyork.us/resource/84uk-42ks.json (PLUTO)...",
    "[INTEGRATING] Parsing true Assessed Value and Building Area metrics.",
    "[GEO-SPATIAL] Establishing secure UDP tunnel to PostGIS instances.",
    "[SEC-AUDIT] Running cyber-physical Shodan scan on open IoT ports.",
    "[CLIMATE] Querying FEMA flood zone topology (Zone X, Zone AE).",
    "[AI] Instantiating Deep Learning model for structural crack detection...",
    "[STATUS] Link Established. Data stream live. Encrypted."
];

export default function SecurityTerminal() {
    const [logs, setLogs] = useState<string[]>([]);
    
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < STARTUP_LOGS.length) {
                setLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', {hour12: false, hour: "numeric", minute: "numeric", second: "numeric"})}] ${STARTUP_LOGS[index]}`]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 800);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute bottom-6 left-6 w-96 z-[1000] pointer-events-none">
            <div className="bg-nexus-900/90 backdrop-blur-2xl border border-nexus-700/60 rounded-xl overflow-hidden shadow-glass flex flex-col pointer-events-auto">
                
                {/* Terminal Header */}
                <div className="bg-nexus-800/80 px-4 py-2.5 border-b border-nexus-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-nexus-cyan rounded-full animate-pulse shadow-neon-cyan"></div>
                        <span className="font-mono text-[9px] text-slate-300 uppercase tracking-[0.2em] font-bold">Sentinel Terminal</span>
                    </div>
                    <div className="px-2 py-0.5 border border-nexus-neon/40 bg-nexus-neon/10 rounded text-[8px] font-mono text-nexus-neon tracking-widest uppercase">
                        Live Net
                    </div>
                </div>

                {/* Terminal Body */}
                <div className="p-4 h-48 overflow-y-auto font-mono text-[10px] leading-relaxed relative">
                    <div className="absolute top-0 left-0 w-full h-full scan-line-anim bg-gradient-to-b from-transparent via-nexus-cyan/5 to-transparent pointer-events-none"></div>
                    <div className="text-slate-500 mb-2">Connected. Awaiting instructions...</div>
                    
                    {logs.map((log, i) => {
                        const isSystem = log.includes("[SYSTEM]");
                        const isFetch = log.includes("[FETCHING]");
                        const isWarning = log.includes("[SEC-AUDIT]") || log.includes("[CLIMATE]");
                        const isSuccess = log.includes("[STATUS]");

                        let colorClass = "text-slate-400";
                        if (isSystem) colorClass = "text-nexus-cyan";
                        if (isFetch) colorClass = "text-blue-400";
                        if (isWarning) colorClass = "text-orange-400";
                        if (isSuccess) colorClass = "text-nexus-neon";

                        return (
                            <div key={i} className={`mb-1.5 break-words ${colorClass}`}>
                                {log}
                            </div>
                        );
                    })}
                    
                    {logs.length === STARTUP_LOGS.length && (
                        <div className="text-nexus-neon mt-2 terminal-cursor flex items-center">
                            <span className="mr-2">&gt;</span>
                            <span>System Ready.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
