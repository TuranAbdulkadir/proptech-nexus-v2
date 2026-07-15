import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100">
      <h2 className="text-4xl font-bold text-green-400 mb-4 font-mono">404 - Not Found</h2>
      <p className="text-slate-400 mb-8 font-mono">The requested node could not be located in the grid.</p>
      <Link 
        href="/" 
        className="px-6 py-2 border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-all font-mono rounded"
      >
        Return to Nexus
      </Link>
    </div>
  );
}
