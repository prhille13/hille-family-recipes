/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fdfaf4',
          100: '#faf3e0',
          200: '#f5e6c2',
        },
        ink: {
          DEFAULT: '#1a1a1a',
          light: '#4a4a4a',
          muted: '#7a7a7a',
        },
        rust: {
          DEFAULT: '#b5451b',
          light: '#d4602e',
          dark: '#8a3214',
        },
        sage: {
          DEFAULT: '#6b7c5c',
          light: '#8a9e78',
        }
      }
    },
  },
  plugins: [],
}
