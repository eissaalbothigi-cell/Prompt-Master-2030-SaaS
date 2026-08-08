/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ... (إعداداتك الحالية)
    },
  },
  plugins: [
    require("tailwindcss-animate"), // 🔥 هذا السطر هو قلب الحل
  ],
};