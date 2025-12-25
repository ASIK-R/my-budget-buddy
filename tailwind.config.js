/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFDEE',
          100: '#FFF9D6',
          200: '#FFF5BE',
          300: '#FFF1A6',
          400: '#FFED8E',
          500: '#E3EF26', // Bright yellow-green - primary color
          600: '#B0B81D',
          700: '#7D8114',
          800: '#4A4A0B',
          900: '#171302',
        },
        secondary: {
          50: '#E2FBCE',
          100: '#CAF3B6',
          200: '#B2EB9E',
          300: '#9AD386',
          400: '#82BB6E',
          500: '#076653', // Dark teal - secondary color
          600: '#054D3F',
          700: '#04342B',
          800: '#021B17',
          900: '#000203',
        },
        brand: {
          dark: '#0C342C',
          accent: '#076653',
          text: '#06231D',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'inner-glass': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
