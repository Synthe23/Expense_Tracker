/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c5d5ff',
          300: '#9db3ff',
          400: '#7088ff',
          500: '#4f63f5',
          600: '#3d48e8',
          700: '#3135cc',
          800: '#2a2da6',
          900: '#272c84',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
