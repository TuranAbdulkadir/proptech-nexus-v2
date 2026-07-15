"use client";
import React, { useState } from 'react';
import { PropertyExtended } from '../types';

interface AuditSidebarProps {
    property: PropertyExtended | null;
    borough: string;
    imageUrl: string;
    onClose: () => void;
}

export default function AuditSidebar({ property, borough, imageUrl, onClose }: AuditSidebarProps) {
    const [activeTab, setActiveTab] = useState<'financials' | 'threats' | 'climate' | 'ai'>('financials');
    const [isDownloading, setIsDownloading] = useState(false);
    const [selectedDefect, setSelectedDefect] = useState<number | null>(null);

    if (!property) return null;

    const REPAIR_COSTS: Record<string, { cost: string; roiImpact: string; action: string }> = {
        "Structural Crack": { cost: "$12,500", roiImpact: "-0.8%", action: "Immediate epoxy injection and carbon fiber reinforcement required." },
        "Water Damage": { cost: "$8,200", roiImpact: "-0.5%", action: "Waterproofing membrane installation and dehumidification cycle needed." },
        "Mold Growth": { cost: "$6,800", roiImpact: "-0.4%", action: "Professional mold remediation and HVAC sanitization recommended." },
        "Roof Sag": { cost: "$18,000", roiImpact: "-1.2%", action: "Structural truss replacement and load redistribution engineering." },
        "Foundation Shift": { cost: "$35,000", roiImpact: "-2.5%", action: "Underpinning with helical piers. Immediate geotechnical assessment." },
        "Electrical Fault": { cost: "$4,500", roiImpact: "-0.3%", action: "Complete rewiring of affected circuit. Arc-fault breaker installation." },
    };

    const handleDownloadReport = async () => {
        try {
            setIsDownloading(true);
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://proptech-nexus-v2-production.up.railway.app";
            const res = await fetch(`${BACKEND_URL}/audits/${property.id}/pdf`);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `PropTech_Sentinel_Audit_${property.id}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                console.error("Failed to generate PDF audit report.");
            }
        } catch (error) {
            console.error("Download error:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const securityColor = property.securityScore >= 70 ? 'text-emerald-400' : property.securityScore >= 40 ? 'text-yellow-400' : 'text-red-400';
    const roiColor = property.annualizedRoi >= 6 ? 'text-cyan-400' : property.annualizedRoi >= 3 ? 'text-yellow-400' : 'text-red-400';
    const cashflowColor = property.netCashflow >= 0 ? 'text-cyan-400' : 'text-red-400';

    return (
        <aside className="absolute top-0 right-0 h-full w-[450px] bg-[#020202]/90 backdrop-blur-3xl border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-20 flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-cyan-500/5 to-transparent h-40"></div>
            
            {/* Header */}
            <div className="p-8 pb-6 border-b border-white/5 flex justify-between items-start relative z-10">
                <div className="flex-1 mr-4">
                    <span className="text-[10px] text-cyan-400 uppercase tracking-[0.3em] font-bold mb-2 block flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,229,255,1)]"></span>
                        {borough}
                    </span>
                    <h2 className="text-2xl font-bold text-white leading-tight tracking-wide">{property.address}</h2>
                    <p className="text-slate-400 font-mono text-xs mt-2 flex items-center gap-2">
                        <span className="text-cyan-100">${property.price.toLocaleString()}</span>
                        <span className="text-white/20">|</span>
                        <span>{property.sqft?.toLocaleString() || 'N/A'} SQFT</span>
                        <span className="text-white/20">|</span>
                        <span>{property.bedrooms}B/{property.bathrooms}B</span>
                    </p>
                    <div className="flex gap-3 mt-5">
                        <ScoreBadge label="OPPORTUNITY" value={property.opportunityScore} max={10} color="cyan" />
                        <ScoreBadge label="SECURITY" value={property.securityScore} max={100} color={property.securityScore >= 70 ? 'emerald' : property.securityScore >= 40 ? 'yellow' : 'red'} />
                        <ScoreBadge label="HAZARD" value={property.hazardScore} max={100} color={property.hazardScore <= 30 ? 'emerald' : property.hazardScore <= 60 ? 'yellow' : 'red'} />
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-cyan-400 transition-colors p-2 hover:bg-white/5 rounded-full backdrop-blur-md border border-transparent hover:border-white/10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-black/40 border-b border-white/5 relative z-10">
                <TabButton active={activeTab === 'financials'} onClick={() => setActiveTab('financials')} label="Financials" icon="💰" />
                <TabButton active={activeTab === 'threats'} onClick={() => setActiveTab('threats')} label="Threats" icon="🛡️" />
                <TabButton active={activeTab === 'climate'} onClick={() => setActiveTab('climate')} label="Hazards" icon="🌊" />
                <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} label="AI Audit" icon="🤖" />
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 text-slate-200 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {activeTab === 'financials' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center justify-between p-5 bg-gradient-to-br from-black to-[#050505] rounded-xl border border-cyan-500/20 shadow-[0_0_30px_rgba(0,229,255,0.05)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <div>
                                <span className="text-slate-500 text-[9px] uppercase tracking-[0.2em] block">Net Cashflow / Month</span>
                                <span className={`text-3xl font-light tracking-tight mt-1 block ${cashflowColor}`}>${property.netCashflow.toFixed(2)}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-slate-500 text-[9px] uppercase tracking-[0.2em] block">Annual ROI</span>
                                <span className={`text-3xl font-light tracking-tight mt-1 block ${roiColor}`}>{property.annualizedRoi.toFixed(2)}%</span>
                            </div>
                        </div>

                        <div className="space-y-1.5 text-xs font-mono bg-black/30 p-4 rounded-xl border border-white/5">
                            <Row label="Gross Rent" value={`$${property.grossRent.toFixed(2)}`} valueColor="text-emerald-400" />
                            <Row label="Property Tax (NYC)" value={`-$${property.propertyTax.toFixed(2)}`} valueColor="text-red-400" />
                            <Row label="HOA Fee" value={`-$${property.hoaFee.toFixed(2)}`} valueColor="text-red-400" />
                            <Row label="Vacancy Buffer (5%)" value={`-$${property.vacancyBuffer.toFixed(2)}`} valueColor="text-red-400" />
                        </div>

                        <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">Price per sqft</span>
                                <span className="text-cyan-50 font-mono">${property.sqft ? (property.price / property.sqft).toFixed(0) : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">Monthly per sqft</span>
                                <span className="text-cyan-50 font-mono">${property.sqft ? (property.grossRent / property.sqft).toFixed(2) : 'N/A'}</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleDownloadReport} 
                            disabled={isDownloading}
                            className="w-full mt-6 py-4 bg-black border border-cyan-500/50 hover:bg-cyan-950/30 text-cyan-400 font-bold rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all uppercase tracking-[0.2em] text-[10px] flex justify-center items-center disabled:opacity-50 active:scale-95 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {isDownloading ? (
                                <span className="flex items-center gap-3 relative z-10">
                                    <svg className="animate-spin h-4 w-4 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    EXECUTING NEURAL EXPORT...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 relative z-10">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    INITIATE AUDIT EXTRACTION
                                </span>
                            )}
                        </button>
                    </div>
                )}
                
                {activeTab === 'threats' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="p-5 bg-black/40 rounded-xl border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-400 text-[9px] uppercase tracking-[0.2em]">Cyber-Physical Security Core</span>
                                <span className={`font-mono text-lg ${securityColor}`}>{property.securityScore}<span className="text-xs text-slate-600">/100</span></span>
                            </div>
                            <div className="w-full bg-black border border-white/5 rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${property.securityScore >= 70 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : property.securityScore >= 40 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}
                                    style={{ width: `${property.securityScore}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="space-y-1.5 text-xs font-mono bg-black/30 p-4 rounded-xl border border-white/5">
                            <Row label="Nypd Crime Index" value={property.crimeIndex.toString()} valueColor={property.crimeIndex > 50 ? 'text-red-400' : 'text-emerald-400'} />
                            <Row label="Distance to Police" value={`${property.distanceToPolice} mi`} valueColor={property.distanceToPolice > 2 ? 'text-yellow-400' : 'text-emerald-400'} />
                        </div>

                        <div className="mt-4 p-4 bg-black/30 rounded-xl border border-white/5">
                            <span className="text-slate-500 text-[9px] uppercase tracking-[0.2em] block mb-3">IoT Vulnerability Scan (Shodan)</span>
                            {property.openIotPorts.length > 0 ? (
                                <div className="space-y-2">
                                    {property.openIotPorts.map((port, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2.5 bg-red-950/20 border border-red-500/20 rounded-lg group hover:border-red-500/40 transition-colors">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]"></span>
                                            <span className="text-red-400 text-xs font-mono tracking-widest">{port}</span>
                                            <span className="ml-auto text-[8px] text-red-500/50 uppercase tracking-widest group-hover:text-red-400/80">Exposed</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex items-center gap-2">
                                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span className="text-emerald-400 text-[10px] uppercase tracking-[0.2em]">Secure - No vulnerable nodes</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {activeTab === 'climate' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="p-5 bg-black/40 rounded-xl border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.05)]">
                            <span className="text-slate-400 block mb-2 text-[9px] uppercase tracking-[0.2em]">FEMA Flood Zone</span>
                            <span className={`text-xl font-light tracking-wide ${property.floodZone.includes('High') || property.floodZone.includes('Coastal') ? 'text-red-400' : property.floodZone.includes('Moderate') ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                {property.floodZone}
                            </span>
                        </div>

                        <div className="p-5 bg-black/40 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-400 text-[9px] uppercase tracking-[0.2em]">Seismic Integrity Rating</span>
                                <span className={`font-mono text-lg ${property.seismicSafety >= 70 ? 'text-emerald-400' : property.seismicSafety >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{property.seismicSafety}<span className="text-xs text-slate-600">/100</span></span>
                            </div>
                            <div className="w-full bg-black border border-white/5 rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${property.seismicSafety >= 70 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : property.seismicSafety >= 40 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}
                                    style={{ width: `${property.seismicSafety}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="p-4 bg-black/30 rounded-xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                            <span className="text-slate-500 text-[9px] uppercase tracking-[0.2em] block mb-2 ml-2">Risk Assessment Vector</span>
                            <div className="text-[11px] text-slate-400 leading-relaxed ml-2 font-mono">
                                {property.floodZone.includes('High') || property.floodZone.includes('Coastal') ? (
                                    <p className="text-red-300/80">⚠ CRITICAL: High-risk inundation zone detected. Mandatory flood insurance protocols active. Expected ROI degradation likely.</p>
                                ) : (
                                    <p className="text-emerald-300/80">✓ CLEAR: Moderate-to-low inundation probability. Standard protective protocols suffice. No anomalous risk modifiers applied.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'ai' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="relative w-full h-56 bg-black rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,1)]">
                            <img 
                                src={imageUrl} 
                                alt="Property Visual Audit" 
                                className="object-cover w-full h-full opacity-60 mix-blend-luminosity grayscale contrast-125"
                            />
                            <div className="absolute inset-0 bg-cyan-900/10 mix-blend-color"></div>
                            
                            {property.structuralDefects.map((defect, i) => {
                                const [ymin, xmin, ymax, xmax] = defect.box;
                                return (
                                    <div 
                                        key={i}
                                        onClick={() => setSelectedDefect(selectedDefect === i ? null : i)}
                                        className={`absolute border cursor-pointer transition-all duration-300 ${selectedDefect === i ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(0,229,255,0.6)]' : 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.4)]'}`}
                                        style={{
                                            top: `${ymin * 100}%`,
                                            left: `${xmin * 100}%`,
                                            height: `${(ymax - ymin) * 100}%`,
                                            width: `${(xmax - xmin) * 100}%`,
                                        }}
                                    >
                                        <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-current"></div>
                                        <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-current"></div>
                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-current"></div>
                                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-current"></div>
                                        <span className={`absolute -top-6 left-0 text-[7px] uppercase font-bold px-1.5 py-0.5 tracking-widest whitespace-nowrap rounded-sm backdrop-blur-md ${selectedDefect === i ? 'bg-cyan-500/80 text-black' : 'bg-red-500/80 text-white'}`}>
                                            {defect.type} // {(defect.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                );
                            })}

                            <div className="absolute inset-0 pointer-events-none">
                                <div className="w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20"></div>
                                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/40 shadow-[0_0_20px_rgba(0,229,255,1)] animate-[scan_3s_linear_infinite]"></div>
                            </div>
                        </div>

                        {selectedDefect !== null && property.structuralDefects[selectedDefect] && (
                            <div className="p-5 bg-[#050505] rounded-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.1)] animate-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-cyan-400 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                        {property.structuralDefects[selectedDefect].type}
                                    </span>
                                    <button onClick={() => setSelectedDefect(null)} className="text-slate-600 hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                <div className="space-y-1.5 text-xs font-mono">
                                    <div className="flex justify-between py-1.5 border-b border-white/5">
                                        <span className="text-slate-500">Est. Protocol Cost</span>
                                        <span className="text-red-400">{(REPAIR_COSTS[property.structuralDefects[selectedDefect].type] || REPAIR_COSTS["Structural Crack"]).cost}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-white/5">
                                        <span className="text-slate-500">Vector Impact (ROI)</span>
                                        <span className="text-red-400">{(REPAIR_COSTS[property.structuralDefects[selectedDefect].type] || REPAIR_COSTS["Structural Crack"]).roiImpact}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-white/5">
                                        <span className="text-slate-500">Neural Confidence</span>
                                        <span className="text-cyan-400">{(property.structuralDefects[selectedDefect].confidence * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-lg">
                                    <span className="text-[8px] text-cyan-500 uppercase tracking-[0.2em] block mb-1.5 font-bold">Recommended Sentinel Action</span>
                                    <p className="text-slate-300 text-[10px] leading-relaxed font-mono">{(REPAIR_COSTS[property.structuralDefects[selectedDefect].type] || REPAIR_COSTS["Structural Crack"]).action}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-2 text-sm font-mono mt-4">
                            {property.structuralDefects.length > 0 ? (
                                property.structuralDefects.map((defect, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => setSelectedDefect(selectedDefect === i ? null : i)}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${selectedDefect === i ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'bg-black border-white/5 hover:border-white/10 hover:bg-white/5'}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${selectedDefect === i ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,1)]' : 'bg-red-500'}`}></span>
                                        <span className={`text-[10px] uppercase tracking-widest flex-1 ${selectedDefect === i ? 'text-cyan-300' : 'text-slate-400'}`}>{defect.type}</span>
                                        <span className={`text-[10px] ${selectedDefect === i ? 'text-cyan-400' : 'text-slate-600'}`}>{(defect.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-center">
                                    <svg className="w-6 h-6 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    <span className="text-emerald-400 text-[10px] uppercase tracking-[0.2em] block">No Anomalies Detected</span>
                                    <p className="text-emerald-500/50 text-[9px] uppercase tracking-widest mt-1">Deep Scan Complete</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <style jsx>{`
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </aside>
    );
}

function ScoreBadge({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]',
        yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]',
        red: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
    };
    return (
        <div className={`px-2 py-1.5 rounded-lg border text-[8px] uppercase tracking-[0.2em] font-bold text-center flex-1 ${colorMap[color] || colorMap.emerald} backdrop-blur-sm`}>
            <span className="block opacity-70 mb-0.5">{label}</span>
            <span className="text-sm font-mono">{typeof value === 'number' ? value.toFixed(1) : value}/{max}</span>
        </div>
    );
}

function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: string }) {
    return (
        <button 
            onClick={onClick}
            className={`flex-1 py-4 text-[9px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 flex flex-col items-center justify-center gap-1 ${active ? 'text-cyan-400 border-cyan-400 bg-cyan-500/5' : 'text-slate-500 border-transparent hover:text-cyan-100 hover:bg-white/5 hover:border-white/10'}`}
        >
            <span className={`block text-sm ${active ? 'opacity-100 filter drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]' : 'opacity-50 grayscale'}`}>{icon}</span>
            {label}
        </button>
    );
}

function Row({ label, value, valueColor = "text-slate-100" }: { label: string, value: string, valueColor?: string }) {
    return (
        <div className="flex justify-between py-2 border-b border-white/5 last:border-0">
            <span className="text-slate-500 text-[10px] tracking-widest uppercase">{label}</span>
            <span className={`${valueColor} font-bold text-right max-w-[60%] text-[11px]`}>{value}</span>
        </div>
    );
}
