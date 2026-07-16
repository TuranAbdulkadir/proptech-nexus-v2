import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-space)', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        nexus: {
          900: '#030712',
          800: '#0b1324',
          700: '#152439',
          cyan: '#00f3ff',
          neon: '#00ff66',
          purple: '#b537f2',
          slate: '#1e293b'
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 243, 255, 0.3), 0 0 20px rgba(0, 243, 255, 0.1)',
        'neon-green': '0 0 10px rgba(0, 255, 102, 0.3), 0 0 20px rgba(0, 255, 102, 0.1)',
        'glass': 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
        'cyber-gradient': 'linear-gradient(135deg, rgba(3,7,18,0.9) 0%, rgba(11,19,36,0.95) 100%)',
      }
    },
  },
  plugins: [],
};

export default config;
