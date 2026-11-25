import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Pegeps design tokens
        brand: {
          primary: '#FF7A00',
          accent: '#A84300',
          cream: '#FAF8F4',
          peach: '#FFF0E3',
          yellow: '#FFCC00',
          green: '#1F6B4A',
          text: '#2A2420',
          // Orange scale
          50: '#FFF4EA',
          100: '#FFE4C4',
          200: '#FFCC94',
          300: '#FFB060',
          400: '#FF9630',
          500: '#FF7A00',
          600: '#D96500',
          700: '#A84300',
          800: '#7A3000',
          900: '#4D1E00',
        },
        cream: '#FAF8F4',
        peach: '#FFF0E3',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(42,36,32,0.08)',
        'card-hover': '0 8px 32px 0 rgba(255,122,0,0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
