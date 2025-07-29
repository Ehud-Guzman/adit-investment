module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.7 },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
      colors: {
        primary: '#00A651',
        accent: '#1e90ff',
        secondary: '#FFC72C',
        dark: '#1A1A1A',
        light: '#FFFFFF',
        muted: '#F5F5F5',
        text: '#333333',
        textLight: '#666666',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
