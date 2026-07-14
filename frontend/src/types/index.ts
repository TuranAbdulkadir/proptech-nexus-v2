export interface Property {
    id: string;
    address: string;
    price: number;
    sqft: number;
    bedrooms: number;
    bathrooms: number;
    latitude: number;
    longitude: number;
}

export interface AiDefect {
    type: string;
    box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] coordinates as percentages 0.0-1.0
    confidence: number;
}

export interface PropertyExtended extends Property {
    opportunityScore: number;
    securityScore: number;
    hazardScore: number;
    grossRent: number;
    propertyTax: number;
    hoaFee: number;
    vacancyBuffer: number;
    netCashflow: number;
    annualizedRoi: number;
    openIotPorts: string[];
    crimeIndex: number;
    distanceToPolice: number;
    floodZone: string;
    seismicSafety: number;
    structuralDefects: AiDefect[];
}

export interface FilterState {
    minPrice: number;
    maxPrice: number;
    minRoi: number;
    minSecurityScore: number;
    hideFloodZones: boolean;
}
