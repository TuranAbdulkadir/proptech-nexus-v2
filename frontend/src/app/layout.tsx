import './globals.css';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata = {
  title: 'PropTech Nexus | Global Sentinel',
  description: 'Enterprise Grade PropTech Security Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} font-sans`}>
      <body className="bg-black text-slate-200 selection:bg-cyan-500/30 overflow-hidden">{children}</body>
    </html>
  )
}
