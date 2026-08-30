/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark-Warm Industrial Charcoal Base
        charcoal: {
          950: '#0B0F14', // Main canvas background (dark charcoal)
          900: '#10151C', // Console & Sidebar primary surface
          850: '#151B23', // Standard neutral card & panel surface
          800: '#1A232E', // Elevated interactive surface
          750: '#222D3A', // Subtle structural hairline borders
          700: '#2D3A4B', // Interactive hover borders
          600: '#4A5B70', // Inactive icons & subtle dividers
          500: '#8E9EAE', // Technical metadata & secondary labels
        },
        obsidian: {
          950: '#0B0F14',
          900: '#10151C',
          850: '#151B23',
          800: '#1A232E',
          750: '#222D3A',
          700: '#2D3A4B',
          600: '#4A5B70',
          500: '#8E9EAE',
        },
        // 1. AMBER / GOLD — COMMAND / ACTION / PRIMARY IDENTITY
        amber: {
          300: '#FFE082',
          400: '#FFC247',
          500: '#FFB000',
          600: '#F5A400',
          700: '#D48B00',
        },
        gold: {
          300: '#FFE082',
          400: '#FFC247',
          500: '#FFB000',
          600: '#F5A400',
          700: '#D48B00',
        },
        manganese: {
          400: '#FFC247',
          500: '#FFB000',
          600: '#F5A400',
          700: '#D48B00',
        },
        // 2. CYAN / TEAL — INTELLIGENCE / DATA / TELEMETRY / SATELLITE
        cyan: {
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#21D4C5',
          600: '#19C3D1',
          700: '#0D9488',
        },
        intel: {
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#21D4C5',
          600: '#19C3D1',
          700: '#0D9488',
        },
        oper: {
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#21D4C5',
          600: '#19C3D1',
          700: '#0D9488',
        },
        radar: {
          400: '#2DD4BF',
          500: '#21D4C5',
          600: '#19C3D1',
        },
        // 3. GREEN / EMERALD — HEALTH / SUCCESS / OPTIMAL / AVAILABLE
        emerald: {
          300: '#86EFAC',
          400: '#34D399',
          500: '#22C55E',
          600: '#20C997',
          700: '#15803D',
        },
        telemetry: {
          400: '#34D399',
          500: '#22C55E',
          600: '#20C997',
        },
        // 4. ORANGE — WARNING / ATTENTION / DEGRADED / AT-RISK
        orange: {
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FFB020',
          600: '#F59E0B',
          700: '#C2410C',
        },
        // 5. RED / CORAL — CRITICAL / THREAT / SEVERE SHORTFALL
        coral: {
          300: '#FDA4AF',
          400: '#FF5A67',
          500: '#F0445E',
          600: '#E11D48',
          700: '#BE123C',
        },
        hazard: {
          400: '#FF5A67',
          500: '#F0445E',
          600: '#EF4444',
        },
        // 6. VIOLET / INDIGO — AI PREDICTION / ML REASONING / SHAP
        violet: {
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#9B8AFB',
          600: '#8B7CFF',
          700: '#6D28D9',
        },
        ai: {
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#9B8AFB',
          600: '#8B7CFF',
          700: '#6D28D9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
        'card-elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.60)',
        'glow-amber': '0 0 20px -3px rgba(245, 164, 0, 0.30)',
        'glow-cyan': '0 0 20px -3px rgba(33, 212, 197, 0.30)',
        'glow-green': '0 0 20px -3px rgba(34, 197, 94, 0.30)',
        'glow-violet': '0 0 20px -3px rgba(139, 124, 255, 0.30)',
        'glow-red': '0 0 20px -3px rgba(240, 68, 94, 0.30)',
      }
    },
  },
  plugins: [],
}
