import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      
      animation: {  
        'moveUp': 'moveUp 500ms ease-in-out forwards',
      },
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        button: 'var(--button-color)',
      },
      keyframes: {
        'moveUp': {
          '0%': { height: '0' },
          '100%': { height: '100%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
