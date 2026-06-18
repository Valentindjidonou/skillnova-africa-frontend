
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       "#0A0F1E",
        surface:  "#111827",
        surface2: "#1a2235",
        purple: {
          DEFAULT: "#7C3AED",
          light:   "#9F67FF",
          dark:    "#5B21B6",
        },
        amber: {
          DEFAULT: "#F59E0B",
          light:   "#FCD34D",
        },
        success: {
          DEFAULT: "#10B981",
          light:   "#34D399",
        },
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body:    ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl:  "0.875rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #7C3AED 0%, #F59E0B 100%)",
        "gradient-dark":  "linear-gradient(135deg, #0A0F1E 0%, #111827 100%)",
      },
      boxShadow: {
        purple: "0 8px 25px rgba(124,58,237,0.35)",
        amber:  "0 8px 25px rgba(245,158,11,0.25)",
        card:   "0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "bounce-slow": "bounce 3s infinite",
      },
    },
  },
  plugins: [],
}
