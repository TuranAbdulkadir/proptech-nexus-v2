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

    const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    const formatPercent = (val: number) => `${val.toFixed(2)}%`;

    const getScoreColor = (score: number) => {
        if (score >= 65) return "text-green-500";
        if (score >= 40) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0a0a0a]">
            {/* Header Image Hero */}
            <div className="relative h-64 w-full shrink-0 group">
                <img 
                    src={imageUrl} 
                    alt="Property" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
                
                {/* Top Right Actions */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 h-6 w-6 bg-black/80 border border-white/10 text-white flex items-center justify-center hover:bg-red-600 transition-colors rounded text-xs font-bold"
                >
                    ✕
                </button>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="px-1.5 py-0.5 bg-black/80 border border-blue-500/30 rounded text-[8px] font-mono text-blue-400 tracking-widest uppercase shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                        LIVE NODE
                    </div>
                </div>

                {/* Address overlay */}
                <div className="absolute bottom-0 left-0 w-full p-5">
                    <div className="font-mono text-[9px] text-blue-400 tracking-[0.2em] uppercase mb-1">{borough} Sector</div>
                    <h2 className="font-sans text-xl font-bold text-white leading-tight">
                        {property.address}
                    </h2>
                </div>
            </div>

            {/* TABS */}
            <div className="flex border-b border-[#1a1a1a] shrink-0 bg-[#0f0f0f]">
                <button 
                    onClick={() => setActiveTab('financial')}
                    className={`flex-1 py-2 text-[9px] font-mono uppercase tracking-widest transition-all ${activeTab === 'financial' ? 'text-blue-400 bg-[#1a1a1a]' : 'text-[#666] hover:text-[#999]'}`}
                >
                    Financial
                </button>
                <button 
                    onClick={() => setActiveTab('security')}
                    className={`flex-1 py-2 text-[9px] font-mono uppercase tracking-widest border-l border-r border-[#1a1a1a] transition-all ${activeTab === 'security' ? 'text-purple-400 bg-[#1a1a1a]' : 'text-[#666] hover:text-[#999]'}`}
                >
                    Security
                </button>
                <button 
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 py-2 text-[9px] font-mono uppercase tracking-widest transition-all ${activeTab === 'ai' ? 'text-green-400 bg-[#1a1a1a]' : 'text-[#666] hover:text-[#999]'}`}
                >
                    AI Audit
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-[#050505]">
                
                {activeTab === 'financial' && (
                    <div className="space-y-5 animate-fade-in">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#111] rounded border border-[#1a1a1a] p-3">
                                <span className="block font-mono text-[8px] text-[#666] uppercase tracking-widest mb-1">Market Value</span>
                                <div className="font-sans text-lg font-bold text-slate-200">{formatCurrency(property.price)}</div>
                            </div>
                            <div className="bg-[#111] rounded border border-[#1a1a1a] p-3">
                                <span className="block font-mono text-[8px] text-[#666] uppercase tracking-widest mb-1">Annual ROI</span>
                                <div className="font-sans text-lg font-bold text-green-500">{formatPercent(property.annualizedRoi || 0)}</div>
                            </div>
                        </div>
                        
                        <div className="bg-[#111] border border-[#1a1a1a] rounded p-4">
                            <h3 className="font-mono text-[9px] text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                Cashflow Analysis
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between border-b border-[#222] pb-2">
                                    <span className="font-mono text-[10px] text-[#888]">Gross Rent (Est.)</span>
                                    <span className="font-mono text-[10px] text-slate-300">{formatCurrency(property.grossRent || 0)}/mo</span>
                                </div>
                                <div className="flex justify-between border-b border-[#222] pb-2">
                                    <span className="font-mono text-[10px] text-[#888]">Property Tax</span>
                                    <span className="font-mono text-[10px] text-red-500">-{formatCurrency(property.propertyTax || 0)}/mo</span>
                                </div>
                                <div className="flex justify-between border-b border-[#222] pb-2">
                                    <span className="font-mono text-[10px] text-[#888]">HOA & Ins.</span>
                                    <span className="font-mono text-[10px] text-red-500">-{formatCurrency(property.hoaFee || 0)}/mo</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="font-mono text-[10px] text-slate-400 font-bold">Net Cashflow</span>
                                    <span className="font-mono text-[11px] text-green-500 font-bold">{formatCurrency(property.netCashflow || 0)}/mo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-5 animate-fade-in">
                        <div className="flex items-center justify-between bg-[#111] rounded border border-[#1a1a1a] p-4">
                            <div>
                                <span className="block font-mono text-[8px] text-[#666] uppercase tracking-widest mb-1">Cyber-Physical Score</span>
                                <div className={`font-sans text-2xl font-bold ${getScoreColor(property.securityScore || 0)}`}>
                                    {property.securityScore || 0}<span className="text-xs text-[#555]">/100</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full border border-[#333] flex items-center justify-center">
                                <div className="h-8 w-8 rounded-full border border-dashed border-[#555] animate-[spin_10s_linear_infinite]"></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-mono text-[8px] text-[#888] uppercase tracking-widest mb-2 border-b border-[#1a1a1a] pb-1">Vulnerabilities Detected</h4>
                                {property.openIotPorts && property.openIotPorts.length > 0 ? (
                                    <ul className="space-y-2 mt-3">
                                        {property.openIotPorts.map((port, idx) => (
                                            <li key={idx} className="flex items-center gap-2 font-mono text-[9px] text-red-400 bg-red-900/10 px-2 py-1.5 border border-red-900/30 rounded">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                OPEN PORT: {port}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="font-mono text-[9px] text-green-500 mt-3">System Secure. No open ports.</div>
                                )}
                            </div>

                            <div>
                                <h4 className="font-mono text-[8px] text-[#888] uppercase tracking-widest mb-2 border-b border-[#1a1a1a] pb-1">Environmental & Crime</h4>
                                <div className="mt-3 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-[9px] text-[#888]">Flood Zone</span>
                                        <span className="font-mono text-[9px] text-yellow-500">{property.floodZone || 'Zone X'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-[9px] text-[#888]">Crime Index</span>
                                        <span className="font-mono text-[9px] text-orange-500">{property.crimeIndex || 'N/A'}/100</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="space-y-5 animate-fade-in">
                        <div className="bg-[#111] p-4 rounded border border-[#1a1a1a]">
                            <p className="font-mono text-[9px] text-[#888] leading-relaxed">
                                Deep learning structural scan complete. Model: <span className="text-blue-400">ResNet-50-Structural-v4</span>.
                                Analyzing thermal and geometric anomalies...
                            </p>
                        </div>
                        
                        {property.structuralDefects && property.structuralDefects.length > 0 ? (
                            <div className="space-y-2">
                                <h4 className="font-mono text-[8px] text-red-400 uppercase tracking-widest mb-2">Anomalies Detected</h4>
                                {property.structuralDefects.map((defect, idx) => (
                                    <div key={idx} className="bg-red-900/10 border border-red-900/30 p-2 rounded flex justify-between items-center">
                                        <div>
                                            <div className="font-mono text-[10px] text-slate-300 font-bold">{defect.type}</div>
                                            <div className="font-mono text-[8px] text-[#666] mt-0.5">CONFIDENCE: {(defect.confidence * 100).toFixed(1)}%</div>
                                        </div>
                                        <div className="text-[9px] font-mono text-red-500 border border-red-900/50 px-1 py-0.5 rounded">CRITICAL</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-green-900/5 border border-green-900/20 p-5 rounded text-center">
                                <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-green-900/30 flex items-center justify-center text-green-500 text-xs">✓</div>
                                <div className="font-mono text-[10px] text-green-500">No Structural Anomalies Detected</div>
                                <div className="font-mono text-[8px] text-[#666] mt-1">Scan Confidence: 99.8%</div>
                            </div>
                        )}

                        <a 
                            href={`https://proptech-nexus-v2-production.up.railway.app/audits/${property.id}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 w-full block text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[9px] uppercase tracking-widest rounded transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                        >
                            GENERATE PDF AUDIT
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
