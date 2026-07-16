import React, { useState } from "react";
import { PropertyExtended } from "../types";

export default function AuditSidebar({
    property,
    borough,
    imageUrl,
    onClose
}: {
    property: PropertyExtended | null;
    borough: string;
    imageUrl: string;
    onClose: () => void;
}) {
    const [activeTab, setActiveTab] = useState<'financial' | 'security' | 'ai'>('financial');

    if (!property) return null;

    // Helper functions
    const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    const formatPercent = (val: number) => `${val.toFixed(2)}%`;

    const getScoreColor = (score: number) => {
        if (score >= 65) return "text-nexus-neon";
        if (score >= 40) return "text-yellow-400";
        return "text-red-500";
    };

    return (
        <div className="absolute top-6 right-6 bottom-6 w-[450px] z-[1000] pointer-events-none flex flex-col">
            
            <div className="flex-1 pointer-events-auto bg-nexus-800/90 backdrop-blur-2xl border-l border-t border-b border-nexus-700/60 rounded-l-3xl rounded-tr-3xl shadow-glass flex flex-col overflow-hidden relative">
                
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-cyan/10 blur-[100px] pointer-events-none"></div>

                {/* Header Image Hero */}
                <div className="relative h-72 w-full shrink-0 group">
                    <img 
                        src={imageUrl} 
                        alt="Property" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-nexus-800/90 via-nexus-800/20 to-transparent"></div>
                    
                    {/* Top Right Actions */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        ✕
                    </button>
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="px-2 py-1 bg-black/50 backdrop-blur-md border border-nexus-cyan/30 rounded text-[9px] font-mono text-nexus-cyan tracking-widest uppercase">
                            LIVE NODE
                        </div>
                    </div>

                    {/* Address overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6">
                        <div className="font-mono text-[10px] text-nexus-cyan tracking-[0.2em] uppercase mb-1">{borough} Sector</div>
                        <h2 className="font-display text-2xl font-bold text-white leading-tight shadow-black drop-shadow-md">
                            {property.address}
                        </h2>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex border-b border-nexus-700/60 shrink-0 bg-nexus-900/50">
                    <button 
                        onClick={() => setActiveTab('financial')}
                        className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-[0.15em] transition-all relative ${activeTab === 'financial' ? 'text-nexus-cyan' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Financial
                        {activeTab === 'financial' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-nexus-cyan shadow-neon-cyan"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-[0.15em] transition-all relative ${activeTab === 'security' ? 'text-nexus-purple' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Security
                        {activeTab === 'security' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-nexus-purple shadow-[0_0_10px_rgba(181,55,242,0.5)]"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('ai')}
                        className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-[0.15em] transition-all relative ${activeTab === 'ai' ? 'text-nexus-neon' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        AI Audit
                        {activeTab === 'ai' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-nexus-neon shadow-neon-green"></div>}
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    
                    {activeTab === 'financial' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-nexus-900/50 rounded-xl p-4 border border-nexus-700/30">
                                    <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1">Fair Market Value</span>
                                    <div className="font-display text-2xl font-bold text-white">{formatCurrency(property.price)}</div>
                                </div>
                                <div className="bg-nexus-900/50 rounded-xl p-4 border border-nexus-700/30">
                                    <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1">Annual ROI</span>
                                    <div className="font-display text-2xl font-bold text-nexus-neon">{formatPercent(property.annualizedRoi || 0)}</div>
                                </div>
                            </div>
                            
                            <div className="bg-nexus-900/30 border border-nexus-700/20 rounded-xl p-4">
                                <h3 className="font-mono text-[10px] text-nexus-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-nexus-cyan rounded-full"></span>
                                    Cashflow Analysis
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-nexus-700/30 pb-2">
                                        <span className="font-mono text-[10px] text-slate-400">Gross Rent (Est.)</span>
                                        <span className="font-mono text-xs text-white">{formatCurrency(property.grossRent || 0)}/mo</span>
                                    </div>
                                    <div className="flex justify-between border-b border-nexus-700/30 pb-2">
                                        <span className="font-mono text-[10px] text-slate-400">Property Tax</span>
                                        <span className="font-mono text-xs text-red-400">-{formatCurrency(property.propertyTax || 0)}/mo</span>
                                    </div>
                                    <div className="flex justify-between border-b border-nexus-700/30 pb-2">
                                        <span className="font-mono text-[10px] text-slate-400">HOA & Ins.</span>
                                        <span className="font-mono text-xs text-red-400">-{formatCurrency(property.hoaFee || 0)}/mo</span>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <span className="font-mono text-[10px] text-slate-300 font-bold">Net Cashflow</span>
                                        <span className="font-mono text-sm text-nexus-neon font-bold">{formatCurrency(property.netCashflow || 0)}/mo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between bg-nexus-900/50 rounded-xl p-4 border border-nexus-700/30">
                                <div>
                                    <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1">Cyber-Physical Score</span>
                                    <div className={`font-display text-3xl font-bold ${getScoreColor(property.securityScore || 0)}`}>
                                        {property.securityScore || 0}<span className="text-sm text-slate-600">/100</span>
                                    </div>
                                </div>
                                <div className="h-16 w-16 rounded-full border border-nexus-700/50 flex items-center justify-center">
                                    <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-600 animate-[spin_10s_linear_infinite]"></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-2 border-b border-nexus-700/30 pb-1">Vulnerabilities Detected</h4>
                                    {property.openIotPorts && property.openIotPorts.length > 0 ? (
                                        <ul className="space-y-2 mt-3">
                                            {property.openIotPorts.map((port, idx) => (
                                                <li key={idx} className="flex items-center gap-3 font-mono text-[10px] text-slate-300 bg-red-500/5 px-3 py-2 border border-red-500/10 rounded">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                    OPEN PORT: {port}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="font-mono text-[10px] text-nexus-neon mt-3">System Secure. No open ports.</div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-2 border-b border-nexus-700/30 pb-1">Environmental & Crime</h4>
                                    <div className="mt-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-mono text-[10px] text-slate-400">Flood Zone</span>
                                            <span className="font-mono text-[10px] text-yellow-500">{property.floodZone || 'Zone X'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-mono text-[10px] text-slate-400">Crime Index</span>
                                            <span className="font-mono text-[10px] text-orange-400">{property.crimeIndex || 'N/A'}/100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-nexus-900/50 p-4 rounded-xl border border-nexus-700/30">
                                <p className="font-mono text-[10px] text-slate-400 leading-relaxed">
                                    Deep learning structural scan complete. Model: <span className="text-nexus-cyan">ResNet-50-Structural-v4</span>.
                                    Analyzing thermal and geometric anomalies...
                                </p>
                            </div>
                            
                            {property.structuralDefects && property.structuralDefects.length > 0 ? (
                                <div className="space-y-3">
                                    <h4 className="font-mono text-[9px] text-nexus-neon uppercase tracking-widest mb-2">Anomalies Detected</h4>
                                    {property.structuralDefects.map((defect, idx) => (
                                        <div key={idx} className="bg-red-500/5 border border-red-500/20 p-3 rounded-lg flex justify-between items-center">
                                            <div>
                                                <div className="font-mono text-[11px] text-white font-bold">{defect.type}</div>
                                                <div className="font-mono text-[9px] text-slate-500 mt-1">CONFIDENCE: {(defect.confidence * 100).toFixed(1)}%</div>
                                            </div>
                                            <div className="text-[10px] font-mono text-red-400">CRITICAL</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-nexus-neon/5 border border-nexus-neon/20 p-6 rounded-lg text-center">
                                    <div className="w-8 h-8 mx-auto mb-3 rounded-full bg-nexus-neon/20 flex items-center justify-center text-nexus-neon">✓</div>
                                    <div className="font-mono text-[11px] text-nexus-neon">No Structural Anomalies Detected</div>
                                    <div className="font-mono text-[9px] text-slate-500 mt-1">Scan Confidence: 99.8%</div>
                                </div>
                            )}

                            {/* Download Button */}
                            <a 
                                href={`https://proptech-nexus-v2-production.up.railway.app/audits/${property.id}/pdf`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-8 w-full block text-center py-3 bg-nexus-cyan/10 hover:bg-nexus-cyan/20 border border-nexus-cyan/50 text-nexus-cyan font-mono text-[10px] uppercase tracking-widest rounded-lg transition-colors shadow-neon-cyan"
                            >
                                GENERATE PDF AUDIT
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
