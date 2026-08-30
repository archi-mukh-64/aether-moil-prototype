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
        // AETHER Structural Mineral Base
        aether: {
          canvas: '#E8E1D5',
          canvasSecondary: '#DDD4C5',
          sidebar: '#202522',
          sidebarElevated: '#29302B',
          header: '#292E2A',
          primary: '#272A27',
          secondary: '#5F625C',
          muted: '#85877E',
          border: '#C8BFAF',
          surface: '#F0EBE2',
          surfaceElevated: '#F5F1E9',
        },
        // Semantic Mineral Accents
        copper: {
          50: '#FBF5F0',
          100: '#F6EAE1',
          200: '#EED5C2',
          300: '#E4BDA2',
          400: '#D59265',
          500: '#C46A32', // Oxidized Copper (Brand / Overview)
          600: '#B05924',
          700: '#8E441B',
          800: '#6C3214',
          900: '#4D220C',
        },
        ochre: {
          50: '#FAF7F0',
          100: '#F4EFE0',
          200: '#E9DFC2',
          300: '#DCCDA3',
          400: '#CCB067',
          500: '#B88A3B', // Mineral Ochre (Geology / Reserve)
          600: '#9E722C',
          700: '#7C571F',
          800: '#5C3F14',
          900: '#3D280B',
        },
        sage: {
          50: '#F3F6F2',
          100: '#E6ECE4',
          200: '#CDDAC9',
          300: '#B2C6AC',
          400: '#8FA888',
          500: '#71856B', // Mineral Sage (Environment / Fleet / Cockpit)
          600: '#5E7058',
          700: '#4A5845',
          800: '#364032',
          900: '#232A20',
        },
        teal: {
          50: '#F0F7F7',
          100: '#E1EFEF',
          200: '#C2DFDF',
          300: '#9ECFCF',
          400: '#68B2B0',
          500: '#3D8C8A', // Muted Teal (Earth Observation)
          600: '#327371',
          700: '#275B59',
          800: '#1D4241',
          900: '#132A29',
        },
        violet: {
          50: '#F4F3F9',
          100: '#EAE7F3',
          200: '#D4CEE7',
          300: '#BEB4DA',
          400: '#8F81BF',
          500: '#655C9F', // Indigo Violet (AI / Analytics)
          600: '#544A88',
          700: '#423A6D',
          800: '#302A50',
          900: '#201A34',
        },
        vermilion: {
          50: '#FAF2F1',
          100: '#F5E4E2',
          200: '#EAC8C4',
          300: '#DFABA5',
          400: '#D57367',
          500: '#C84B3F', // Vermilion (Safety / Alert)
          600: '#AB3B30',
          700: '#872C23',
          800: '#631E17',
          900: '#41120D',
        },
        burgundy: {
          50: '#F8F3F3',
          100: '#F1E6E6',
          200: '#E3CDCD',
          300: '#D4B2B2',
          400: '#A46868',
          500: '#7D4545', // Burgundy (Compliance / Protocols)
          600: '#683636',
          700: '#512828',
          800: '#3A1B1B',
          900: '#251010',
        },
        terracotta: {
          50: '#FAF4F1',
          100: '#F5E8E2',
          200: '#EBD1C5',
          300: '#E0B8A7',
          400: '#CF8769',
          500: '#B76543', // Terracotta (Simulation / Scenario Lab)
          600: '#9B5133',
          700: '#7B3E25',
          800: '#5A2C18',
          900: '#3B1B0D',
        },
        // Legacy fallbacks mapped to mineral palette
        charcoal: {
          950: '#202522',
          900: '#292E2A',
          850: '#29302B',
          800: '#323B34',
          750: '#3D473F',
          700: '#4D5850',
          600: '#5F625C',
          500: '#85877E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(39, 42, 39, 0.05)',
        'mineral-sm': '0 1px 3px 0 rgba(39, 42, 39, 0.08), 0 1px 2px -1px rgba(39, 42, 39, 0.08)',
        'mineral-md': '0 4px 6px -1px rgba(39, 42, 39, 0.10), 0 2px 4px -2px rgba(39, 42, 39, 0.08)',
        'mineral-lg': '0 10px 15px -3px rgba(39, 42, 39, 0.12), 0 4px 6px -4px rgba(39, 42, 39, 0.08)',
        'glow-copper': '0 0 20px -3px rgba(196, 106, 50, 0.35)',
        'glow-sage': '0 0 20px -3px rgba(113, 133, 107, 0.35)',
        'glow-teal': '0 0 20px -3px rgba(61, 140, 138, 0.35)',
        'glow-ochre': '0 0 20px -3px rgba(184, 138, 59, 0.35)',
        'glow-violet': '0 0 20px -3px rgba(101, 92, 159, 0.35)',
        'glow-vermilion': '0 0 20px -3px rgba(200, 75, 63, 0.35)',
      }
    },
  },
  plugins: [],
}
