import React, { useState } from "react";
import { PropertyExtended } from "../types";

export default function AuditSidebar({
    property,
    onClose
}: {
    property: PropertyExtended | null;
    onClose: () => void;
}) {
    const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'security' | 'ai'>('overview');

    if (!property) return null;

    const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    const formatPercent = (val: number) => `${val.toFixed(2)}%`;

    const realEstateImages = [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687931-cebf108bc3e5?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18ef0221f?w=800&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?w=800&q=80",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
        "https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?w=800&q=80",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
    ];
    
    // Deterministic selection based on property ID
    const seedId = parseInt(property.id.replace(/\D/g, "") || "0", 10);
    const imageUrl = realEstateImages[seedId % realEstateImages.length];

    return (
        <div className="flex-1 flex flex-col h-full bg-[#030303] text-[#ededed] border-l border-[#222]">
            {/* Header Image Hero */}
            <div className="relative h-56 w-full shrink-0 group">
                <img 
                    src={imageUrl} 
                    alt="Property" 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent"></div>
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 h-6 w-6 bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors rounded text-xs"
                >
                    ✕
                </button>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] font-medium tracking-wide">
                        Verified Asset
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 pb-4">
                    <h2 className="font-semibold text-2xl text-white leading-tight tracking-tight">
                        {property.address}
                    </h2>
                    <div className="text-xs text-[#888] mt-1">{property.bedrooms} Beds • {property.bathrooms} Baths • {property.sqft} Sq.Ft.</div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex border-b border-[#222] shrink-0 px-6 gap-6">
                {['overview', 'financial', 'security', 'ai'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`py-4 text-[11px] font-medium tracking-wide capitalize transition-all relative ${activeTab === tab ? 'text-white' : 'text-[#666] hover:text-[#999]'}`}
                    >
                        {tab === 'ai' ? 'AI Analysis' : tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white"></div>}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#030303]">
                
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-[11px] text-[#666] mb-1">Market Value</span>
                                <div className="text-xl font-medium text-white">{formatCurrency(property.price)}</div>
                            </div>
                            <div>
                                <span className="block text-[11px] text-[#666] mb-1">Expected ROI</span>
                                <div className="text-xl font-medium text-white">{formatPercent(property.annualizedRoi || 0)}</div>
                            </div>
                        </div>

                        <div className="border-t border-[#222] pt-6">
                            <h3 className="text-[11px] text-[#888] mb-4">Property Characteristics</h3>
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <span className="block text-[11px] text-[#666] mb-0.5">Asset ID</span>
                                    <span className="text-[12px] font-mono text-white">{property.id.split('-')[0]}</span>
                                </div>
                                <div>
                                    <span className="block text-[11px] text-[#666] mb-0.5">Coordinates</span>
                                    <span className="text-[12px] font-mono text-white">{property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}</span>
                                </div>
                                <div>
                                    <span className="block text-[11px] text-[#666] mb-0.5">Building Type</span>
                                    <span className="text-[12px] text-white">Residential</span>
                                </div>
                                <div>
                                    <span className="block text-[11px] text-[#666] mb-0.5">Year Built</span>
                                    <span className="text-[12px] text-white">2019</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'financial' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="border border-[#222] rounded-lg p-5">
                            <h3 className="text-[12px] font-medium text-white mb-4">Cashflow Projection</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[12px] text-[#888]">Gross Rental Income</span>
                                    <span className="text-[13px] text-white">{formatCurrency(property.grossRent || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[12px] text-[#888]">Property Taxes</span>
                                    <span className="text-[13px] text-white">-{formatCurrency(property.propertyTax || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[12px] text-[#888]">HOA & Maintenance</span>
                                    <span className="text-[13px] text-white">-{formatCurrency(property.hoaFee || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-[#222]">
                                    <span className="text-[12px] text-white font-medium">Net Monthly Cashflow</span>
                                    <span className="text-[13px] text-white font-medium">{formatCurrency(property.netCashflow || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full border-4 border-[#222] flex items-center justify-center relative">
                                <div className="absolute inset-0 border-4 border-white rounded-full" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${(property.securityScore || 0)}%, 0 ${(property.securityScore || 0)}%)` }}></div>
                                <span className="text-xl font-medium text-white">{property.securityScore || 0}</span>
                            </div>
                            <div>
                                <h3 className="text-[14px] font-medium text-white">Security Rating</h3>
                                <p className="text-[11px] text-[#888] mt-1">Based on local crime index, network vulnerabilities, and physical hazard data.</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div>
                                <h4 className="text-[11px] text-[#666] mb-3">Vulnerabilities</h4>
                                {property.openIotPorts && property.openIotPorts.length > 0 ? (
                                    <ul className="space-y-2">
                                        {property.openIotPorts.map((port, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-[12px] text-white bg-[#111] px-3 py-2 border border-[#222] rounded-md">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                Open Port: <span className="font-mono">{port}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-[12px] text-[#888] bg-[#111] px-3 py-2 border border-[#222] rounded-md">No critical vulnerabilities detected.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-[#111] p-4 rounded-lg border border-[#222]">
                            <p className="text-[12px] text-[#888] leading-relaxed">
                                Automated structural evaluation completed via Deep Learning visual analysis.
                            </p>
                        </div>
                        
                        {property.structuralDefects && property.structuralDefects.length > 0 ? (
                            <div className="space-y-3">
                                <h4 className="text-[11px] text-[#666] mb-2">Detected Anomalies</h4>
                                {property.structuralDefects.map((defect, idx) => (
                                    <div key={idx} className="bg-[#111] border border-[#222] p-3 rounded-md flex justify-between items-center">
                                        <div>
                                            <div className="text-[12px] text-white font-medium">{defect.type}</div>
                                            <div className="text-[10px] text-[#666] mt-1">Confidence: {(defect.confidence * 100).toFixed(1)}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#111] border border-[#222] p-6 rounded-md text-center">
                                <div className="text-[13px] text-white font-medium">Clear Structural Scan</div>
                                <div className="text-[11px] text-[#666] mt-1">No anomalies detected.</div>
                            </div>
                        )}

                        <a 
                            href={`https://proptech-nexus-v2-production.up.railway.app/audits/${property.id}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 w-full flex items-center justify-center py-3 bg-white hover:bg-[#eaeaea] text-black text-[12px] font-medium rounded-md transition-colors"
                        >
                            Download Full Report
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
