"use client";
import React, { useState } from 'react';
import { PropertyExtended } from '@/types';

interface AuditSidebarProps {
    property: PropertyExtended | null;
    onClose: () => void;
}

export default function AuditSidebar({ property, onClose }: AuditSidebarProps) {
    const [activeTab, setActiveTab] = useState<'financials' | 'threats' | 'climate' | 'ai'>('financials');
    const [isDownloading, setIsDownloading] = useState(false);

    if (!property) return null;

    const handleDownloadReport = async () => {
        try {
            setIsDownloading(true);
            // Call our FastAPI PDF generation streaming endpoint
            const res = await fetch(`http://localhost:8000/audits/${property.id}/pdf`);
            if (res.ok) {
                const blob = await res.blob();
                // Create an invisible anchor to trigger browser download
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

    return (
        <aside className="absolute top-0 right-0 h-full w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-20 flex flex-col transform transition-transform duration-300 ease-in-out">
            <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-slate-100">{property.address}</h2>
                    <p className="text-slate-400 font-mono text-sm mt-1">${property.price.toLocaleString()} | {property.sqft} sqft</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div className="flex bg-slate-800/50">
                <TabButton active={activeTab === 'financials'} onClick={() => setActiveTab('financials')} label="Financials" />
                <TabButton active={activeTab === 'threats'} onClick={() => setActiveTab('threats')} label="Threat Intel" />
                <TabButton active={activeTab === 'climate'} onClick={() => setActiveTab('climate')} label="Hazards" />
                <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} label="AI Audit" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-slate-200">
                {activeTab === 'financials' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                            <span className="text-slate-400">Net Cashflow / mo</span>
                            <span className="text-2xl font-bold text-green-400">${property.netCashflow.toFixed(2)}</span>
                        </div>
                        <div className="space-y-2 text-sm font-mono">
                            <Row label="Gross Rent" value={`$${property.grossRent.toFixed(2)}`} />
                            <Row label="Property Tax" value={`-$${property.propertyTax.toFixed(2)}`} />
                            <Row label="HOA Fee" value={`-$${property.hoaFee.toFixed(2)}`} />
                            <Row label="Vacancy Buffer" value={`-$${property.vacancyBuffer.toFixed(2)}`} />
                            <div className="h-px bg-slate-700 my-2" />
                            <Row label="Annualized ROI" value={`${property.annualizedRoi.toFixed(2)}%`} valueColor="text-green-400" />
                        </div>
                        
                        <button 
                            onClick={handleDownloadReport} 
                            disabled={isDownloading}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-slate-950 font-bold rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all uppercase tracking-widest text-xs flex justify-center items-center disabled:opacity-50"
                        >
                            {isDownloading ? "Generating Sovereign Audit..." : "Download Audit Report (PDF)"}
                        </button>
                    </div>
                )}
                
                {activeTab === 'threats' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                         <div className="p-4 bg-slate-800 rounded-lg border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <span className="text-slate-400 block mb-2">Cyber-Physical Security Score</span>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${100 - property.securityScore}%` }}></div>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm font-mono">
                            <Row label="Crime Index" value={property.crimeIndex.toString()} />
                            <Row label="Open IoT Ports" value={property.openIotPorts.join(', ') || 'None'} valueColor={property.openIotPorts.length > 0 ? "text-red-400" : "text-green-400"} />
                            <Row label="Distance to Police" value={`${property.distanceToPolice} mi`} />
                        </div>
                    </div>
                )}
                
                {activeTab === 'climate' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                         <div className="p-4 bg-slate-800 rounded-lg border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                            <span className="text-slate-400 block mb-2">FEMA Flood Zone</span>
                            <span className="text-xl font-bold text-yellow-400">{property.floodZone}</span>
                        </div>
                        <div className="space-y-2 text-sm font-mono">
                            <Row label="Seismic Safety" value={`${property.seismicSafety}/100`} />
                        </div>
                    </div>
                )}
                
                {activeTab === 'ai' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Dynamic Bounding Box Image Canvas */}
                        <div className="relative w-full h-56 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-inner">
                            {/* In production, replace src with the actual property image URL */}
                            <img 
                                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" 
                                alt="Property Visual Audit" 
                                className="object-cover w-full h-full opacity-80 mix-blend-luminosity"
                            />
                            
                            {/* Overlay Gemini Bounding Boxes Dynamically */}
                            {property.structuralDefects.map((defect, i) => {
                                const [ymin, xmin, ymax, xmax] = defect.box;
                                return (
                                    <div 
                                        key={i}
                                        className="absolute border-2 border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"
                                        style={{
                                            top: `${ymin * 100}%`,
                                            left: `${xmin * 100}%`,
                                            height: `${(ymax - ymin) * 100}%`,
                                            width: `${(xmax - xmin) * 100}%`,
                                        }}
                                    >
                                        <span className="absolute -top-5 left-0 text-[9px] uppercase font-bold bg-red-500 text-white px-1 tracking-widest whitespace-nowrap">
                                            {defect.type} ({(defect.confidence * 100).toFixed(0)}%)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="space-y-2 text-sm font-mono mt-4">
                            {property.structuralDefects.map((defect, i) => (
                                <Row key={i} label={`Defect ${i+1}`} value={defect.type.toUpperCase()} valueColor="text-red-400" />
                            ))}
                            {property.structuralDefects.length === 0 && <span className="text-green-400 font-bold block mt-4">No structural defects detected by Gemini Pro.</span>}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors border-b-2 ${active ? 'text-green-400 border-green-400 bg-slate-800' : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800/50'}`}
        >
            {label}
        </button>
    );
}

function Row({ label, value, valueColor = "text-slate-100" }: { label: string, value: string, valueColor?: string }) {
    return (
        <div className="flex justify-between py-2 border-b border-slate-800/50">
            <span className="text-slate-500">{label}</span>
            <span className={`${valueColor} font-semibold text-right max-w-[60%]`}>{value}</span>
        </div>
    );
}
