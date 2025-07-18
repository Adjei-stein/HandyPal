/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
      },
      fontSize: {
        '2xl': 24, // NativeWind uses numeric sizes in pixels
        'xl': 20,
        'lg': 18,
        'base': 16,
        'sm': 14,
      },
    },
  },
  plugins: [],
}

