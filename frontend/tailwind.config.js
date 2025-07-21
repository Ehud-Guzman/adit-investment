/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00A651', // ✅ Safaricom green
        accent: '#1e90ff',   // ✅ Blue accent for active states, links
        secondary: '#FFC72C', // Optional: Yellow for CTA or highlights
        dark: '#1A1A1A',      // For text/backgrounds
        light: '#FFFFFF',     // White background
        muted: '#F5F5F5',     // Soft gray bg
        text: '#333333',      // Main text
        textLight: '#666666', // Subtext
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Already in your global CSS
      },
    },
  },
  plugins: [],
};
