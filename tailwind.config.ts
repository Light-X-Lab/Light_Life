import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8F4EE',
        blush: '#F7E8EE',
        lavender: '#EDE4F7',
        sage: '#DCE8DF',
        gold: '#C8A978',
        ink: '#5B5563'
      },
      boxShadow: {
        soft: '0 12px 30px rgba(91,85,99,0.12)'
      }
    },
  },
  plugins: [],
};

export default config;
