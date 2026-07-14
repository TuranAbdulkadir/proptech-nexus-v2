import React from 'react';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
    // Server-side fetching for initial metrics payload.
    // This allows the initial shell to load instantly before the heavy map hydrates on the client.
    const initialMetrics = {
        globalInflationRate: 3.2,
        baseInterestRate: 5.25
    };
    
    return (
        <main className="w-screen h-screen overflow-hidden bg-slate-950 relative">
            <DashboardClient initialMetrics={initialMetrics} />
        </main>
    );
}
