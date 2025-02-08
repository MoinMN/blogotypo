/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        theme_1: '#EDE8F5',
        theme_2: '#ADBBDA',
        theme_3: '#8697C4',
        theme_4: '#7091E6',
        theme_5: '#3D52A0',
      }
    },
  },
  plugins: [],
};
