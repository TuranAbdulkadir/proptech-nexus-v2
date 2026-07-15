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
                a.download = `PropTech_Sovereign_Audit_${property.id}.pdf`;
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

    // Determine color coding for scores
    const securityColor = property.securityScore >= 70 ? 'text-green-400' : property.securityScore >= 40 ? 'text-yellow-400' : 'text-red-400';
    const roiColor = property.annualizedRoi >= 6 ? 'text-green-400' : property.annualizedRoi >= 3 ? 'text-yellow-400' : 'text-red-400';
    const cashflowColor = property.netCashflow >= 0 ? 'text-green-400' : 'text-red-400';

    return (
        <aside className="absolute top-0 right-0 h-full w-[420px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-20 flex flex-col transform transition-transform duration-300 ease-in-out overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="flex-1 mr-4">
                    <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold mb-1 block">{borough}</span>
                    <h2 className="text-lg font-bold text-slate-100 leading-tight">{property.address}</h2>
                    <p className="text-slate-400 font-mono text-xs mt-1">
                        ${property.price.toLocaleString()} &bull; {property.sqft?.toLocaleString() || 'N/A'} sqft &bull; {property.bedrooms}BD / {property.bathrooms}BA
                    </p>
                    <div className="flex gap-2 mt-3">
                        <ScoreBadge label="OPPORTUNITY" value={property.opportunityScore} max={10} color="green" />
                        <ScoreBadge label="SECURITY" value={property.securityScore} max={100} color={property.securityScore >= 70 ? 'green' : property.securityScore >= 40 ? 'yellow' : 'red'} />
                        <ScoreBadge label="HAZARD" value={property.hazardScore} max={100} color={property.hazardScore <= 30 ? 'green' : property.hazardScore <= 60 ? 'yellow' : 'red'} />
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-slate-800/50">
                <TabButton active={activeTab === 'financials'} onClick={() => setActiveTab('financials')} label="Financials" icon="💰" />
                <TabButton active={activeTab === 'threats'} onClick={() => setActiveTab('threats')} label="Threats" icon="🛡️" />
                <TabButton active={activeTab === 'climate'} onClick={() => setActiveTab('climate')} label="Hazards" icon="🌊" />
                <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} label="AI Audit" icon="🤖" />
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 text-slate-200">
                {activeTab === 'financials' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-xl border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                            <div>
                                <span className="text-slate-500 text-[10px] uppercase tracking-widest block">Net Cashflow / Month</span>
                                <span className={`text-2xl font-bold ${cashflowColor}`}>${property.netCashflow.toFixed(2)}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-slate-500 text-[10px] uppercase tracking-widest block">Annual ROI</span>
                                <span className={`text-2xl font-bold ${roiColor}`}>{property.annualizedRoi.toFixed(2)}%</span>
                            </div>
                        </div>
                        <div className="space-y-1 text-sm font-mono">
                            <Row label="Gross Rent" value={`$${property.grossRent.toFixed(2)}`} valueColor="text-green-400" />
                            <Row label="Property Tax (NYC)" value={`-$${property.propertyTax.toFixed(2)}`} valueColor="text-red-400" />
                            <Row label="HOA Fee" value={`-$${property.hoaFee.toFixed(2)}`} valueColor="text-red-400" />
                            <Row label="Vacancy Buffer (5%)" value={`-$${property.vacancyBuffer.toFixed(2)}`} valueColor="text-red-400" />
                        </div>

                        {/* Price Per Sqft */}
                        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 mt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-xs uppercase tracking-wider">Price per sqft</span>
                                <span className="text-slate-100 font-bold font-mono">${property.sqft ? (property.price / property.sqft).toFixed(0) : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-slate-500 text-xs uppercase tracking-wider">Monthly per sqft</span>
                                <span className="text-slate-100 font-bold font-mono">${property.sqft ? (property.grossRent / property.sqft).toFixed(2) : 'N/A'}</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleDownloadReport} 
                            disabled={isDownloading}
                            className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-slate-950 font-bold rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all uppercase tracking-widest text-xs flex justify-center items-center disabled:opacity-50 active:scale-95"
                        >
                            {isDownloading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Generating Sovereign Audit...
                                </span>
                            ) : "⬇ Download Audit Report (PDF)"}
                        </button>
                    </div>
                )}
                
                {activeTab === 'threats' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Security Score Gauge */}
                        <div className="p-4 bg-slate-800 rounded-xl border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-slate-400 text-xs uppercase tracking-wider">Cyber-Physical Security Score</span>
                                <span className={`font-bold font-mono ${securityColor}`}>{property.securityScore}/100</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                <div 
                                    className={`h-3 rounded-full transition-all duration-1000 ${property.securityScore >= 70 ? 'bg-green-500' : property.securityScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${property.securityScore}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="space-y-1 text-sm font-mono">
                            <Row label="Crime Index" value={property.crimeIndex.toString()} valueColor={property.crimeIndex > 50 ? 'text-red-400' : 'text-green-400'} />
                            <Row label="Distance to Police" value={`${property.distanceToPolice} mi`} valueColor={property.distanceToPolice > 2 ? 'text-yellow-400' : 'text-green-400'} />
                        </div>

                        {/* Open Ports Table */}
                        <div className="mt-3">
                            <span className="text-slate-500 text-[10px] uppercase tracking-widest block mb-2">Detected Open IoT Ports (Shodan/Censys)</span>
                            {property.openIotPorts.length > 0 ? (
                                <div className="space-y-1">
                                    {property.openIotPorts.map((port, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                            <span className="text-red-400 text-xs font-mono">{port}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <span className="text-green-400 text-xs font-mono">✓ No vulnerable ports detected</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {activeTab === 'climate' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="p-4 bg-slate-800 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                            <span className="text-slate-400 block mb-1 text-[10px] uppercase tracking-widest">FEMA Flood Zone Classification</span>
                            <span className={`text-xl font-bold ${property.floodZone.includes('High') || property.floodZone.includes('Coastal') ? 'text-red-400' : property.floodZone.includes('Moderate') ? 'text-yellow-400' : 'text-green-400'}`}>
                                {property.floodZone}
                            </span>
                        </div>

                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400 text-xs uppercase tracking-wider">Seismic Safety</span>
                                <span className={`font-bold font-mono ${property.seismicSafety >= 70 ? 'text-green-400' : property.seismicSafety >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{property.seismicSafety}/100</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                <div 
                                    className={`h-3 rounded-full transition-all duration-1000 ${property.seismicSafety >= 70 ? 'bg-green-500' : property.seismicSafety >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${property.seismicSafety}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Risk Summary */}
                        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                            <span className="text-slate-500 text-[10px] uppercase tracking-widest block mb-2">Risk Assessment Summary</span>
                            <div className="text-xs text-slate-300 leading-relaxed">
                                {property.floodZone.includes('High') || property.floodZone.includes('Coastal') ? (
                                    <p className="text-red-400">⚠ This property is located in a high-risk flood zone. Flood insurance will be mandatory and may significantly impact investment returns.</p>
                                ) : (
                                    <p className="text-green-400">✓ This property is in a low to moderate flood risk zone. Standard homeowner insurance should suffice.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'ai' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="relative w-full h-48 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
                            <img 
                                src={imageUrl} 
                                alt="Property Visual Audit" 
                                className="object-cover w-full h-full opacity-80 mix-blend-luminosity"
                            />
                            
                            {property.structuralDefects.map((defect, i) => {
                                const [ymin, xmin, ymax, xmax] = defect.box;
                                return (
                                    <div 
                                        key={i}
                                        onClick={() => setSelectedDefect(selectedDefect === i ? null : i)}
                                        className={`absolute border-2 cursor-pointer transition-all ${selectedDefect === i ? 'border-yellow-400 bg-yellow-400/30 shadow-[0_0_25px_rgba(234,179,8,0.8)]' : 'border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse'}`}
                                        style={{
                                            top: `${ymin * 100}%`,
                                            left: `${xmin * 100}%`,
                                            height: `${(ymax - ymin) * 100}%`,
                                            width: `${(xmax - xmin) * 100}%`,
                                        }}
                                    >
                                        <span className="absolute -top-5 left-0 text-[8px] uppercase font-bold bg-red-500 text-white px-1 tracking-widest whitespace-nowrap rounded-sm">
                                            {defect.type} ({(defect.confidence * 100).toFixed(0)}%)
                                        </span>
                                    </div>
                                );
                            })}

                            <div className="absolute inset-0 pointer-events-none">
                                <div className="scan-line-anim absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>
                            </div>
                        </div>

                        {selectedDefect !== null && property.structuralDefects[selectedDefect] && (
                            <div className="p-4 bg-slate-800 rounded-xl border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)] animate-in fade-in duration-200">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                                        {property.structuralDefects[selectedDefect].type}
                                    </span>
                                    <button onClick={() => setSelectedDefect(null)} className="text-slate-500 hover:text-white text-xs">✕</button>
                                </div>
                                <div className="space-y-2 text-xs font-mono">
                                    <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                                        <span className="text-slate-500">Est. Repair Cost</span>
                                        <span className="text-red-400 font-bold">{(REPAIR_COSTS[property.structuralDefects[selectedDefect].type] || REPAIR_COSTS["Structural Crack"]).cost}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                                        <span className="text-slate-500">Impact on ROI</span>
                                        <span className="text-red-400 font-bold">{(REPAIR_COSTS[property.structuralDefects[selectedDefect].type] || REPAIR_COSTS["Structural Crack"]).roiImpact}</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                                        <span className="text-slate-500">AI Confidence</span>
                                        <span className="text-yellow-400 font-bold">{(property.structuralDefects[selectedDefect].confidence * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <span className="text-[9px] text-yellow-500 uppercase tracking-widest block mb-1">AI Recommended Action</span>
                                    <p className="text-yellow-300 text-xs leading-relaxed">{(REPAIR_COSTS[property.structuralDefects[selectedDefect].type] || REPAIR_COSTS["Structural Crack"]).action}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-2 text-sm font-mono mt-2">
                            {property.structuralDefects.length > 0 ? (
                                property.structuralDefects.map((defect, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => setSelectedDefect(selectedDefect === i ? null : i)}
                                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${selectedDefect === i ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-red-500/10 border border-red-500/20 hover:bg-red-500/20'}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${selectedDefect === i ? 'bg-yellow-400' : 'bg-red-500 animate-pulse'}`}></span>
                                        <span className={`text-xs flex-1 ${selectedDefect === i ? 'text-yellow-400' : 'text-red-400'}`}>{defect.type.toUpperCase()}</span>
                                        <span className={`text-xs font-bold ${selectedDefect === i ? 'text-yellow-300' : 'text-red-300'}`}>{(defect.confidence * 100).toFixed(0)}%</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                                    <span className="text-green-400 font-bold text-sm">✓ No structural defects detected</span>
                                    <p className="text-green-400/60 text-xs mt-1">Gemini Pro Vision scan complete</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

function ScoreBadge({ label, value, max, color }: { label: string, value: number, max: number, color: string }) {
    const colorMap: Record<string, string> = {
        green: 'bg-green-500/20 text-green-400 border-green-500/30',
        yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        red: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return (
        <div className={`px-2 py-1 rounded border text-[9px] uppercase tracking-widest font-bold text-center ${colorMap[color] || colorMap.green}`}>
            <span className="block">{label}</span>
            <span className="text-sm">{typeof value === 'number' ? value.toFixed(1) : value}/{max}</span>
        </div>
    );
}

function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: string }) {
    return (
        <button 
            onClick={onClick}
            className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest transition-all border-b-2 ${active ? 'text-green-400 border-green-400 bg-slate-800' : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800/50'}`}
        >
            <span className="block text-sm mb-0.5">{icon}</span>
            {label}
        </button>
    );
}

function Row({ label, value, valueColor = "text-slate-100" }: { label: string, value: string, valueColor?: string }) {
    return (
        <div className="flex justify-between py-2.5 border-b border-slate-800/50">
            <span className="text-slate-500 text-xs">{label}</span>
            <span className={`${valueColor} font-semibold text-right max-w-[60%] text-xs`}>{value}</span>
        </div>
    );
}
