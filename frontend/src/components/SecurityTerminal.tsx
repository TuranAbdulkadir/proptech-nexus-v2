import React, { useEffect, useState } from 'react';

export default function SecurityTerminal() {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const logs = [
            "Initializing PropTech Nexus Security Daemon...",
            "Establishing secure connection to geospatial backend...",
            "PostGIS connection established. Awaiting queries.",
            "Live market data stream connected.",
            "Subscribing to county property tax updates...",
            "Scanning network for vulnerabilities..."
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                const logMsg = logs[i];
                if (logMsg) {
                    setLines(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,8)}] ${logMsg}`]);
                }
                i++;
            } else {
                clearInterval(interval);
            }
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full bg-[#030303] flex flex-col">
            <div className="p-3 border-b border-[#222] flex items-center justify-between">
                <div className="text-[10px] font-medium text-[#888] uppercase tracking-widest">System Logs</div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#333]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#333]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#444]"></div>
                </div>
            </div>
            <div className="flex-1 p-3 overflow-y-auto font-mono text-[10px] text-[#666] space-y-1.5 custom-scrollbar">
                {lines.map((line, idx) => (
                    <div key={idx} className="break-all">{line}</div>
                ))}
                <div className="animate-pulse">_</div>
            </div>
        </div>
    );
}
