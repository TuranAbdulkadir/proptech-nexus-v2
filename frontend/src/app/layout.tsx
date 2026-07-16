import './globals.css';
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'PropTech Nexus | Enterprise Sentinel',
  description: 'Enterprise Grade PropTech Security Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} font-sans`}>
      <body className="bg-[#050505] text-[#ededed] selection:bg-blue-500/30 overflow-hidden">{children}</body>
    </html>
  )
}
