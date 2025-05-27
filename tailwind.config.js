/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f0',
          100: '#ccefe1',
          200: '#99dfc3',
          300: '#66cfa5',
          400: '#33bf87',
          500: '#00af69',
          600: '#008c54',
          700: '#00693f',
          800: '#00462a',
          900: '#002315',
        },
        secondary: {
          50: '#fdf7e2',
          100: '#fbefc5',
          200: '#f7df8b',
          300: '#f3cf51',
          400: '#efbf17',
          500: '#d4a800',
          600: '#a98600',
          700: '#7e6500',
          800: '#544300',
          900: '#2a2200',
        },
        emerald: {
          DEFAULT: '#00513a', // Verde esmeralda escuro
          light: '#006d4e',
          dark: '#003c2b',
          50: '#e6f0ed',
          100: '#cce1db',
          200: '#99c3b7',
          300: '#66a593',
          400: '#33876f',
          500: '#00694b',
          600: '#00513a', // Base
          700: '#003c2b',
          800: '#00281d',
          900: '#00140e',
        },
        gold: {
          DEFAULT: '#d4af37', // Dourado
          light: '#e6c860',
          dark: '#b39030',
          50: '#fdf9e6',
          100: '#fbf3cd',
          200: '#f7e79b',
          300: '#f3db69',
          400: '#efcf37',
          500: '#d4af37', // Base
          600: '#a98c2c',
          700: '#7e6921',
          800: '#544616',
          900: '#2a230b',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(212, 175, 55, 0.3)',
        'emerald': '0 4px 14px 0 rgba(0, 81, 58, 0.3)',
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #00513a 0%, #006d4e 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #e6c860 100%)',
      },
    },
  },
  plugins: [],
}
