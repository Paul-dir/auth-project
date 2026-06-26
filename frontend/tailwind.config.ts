import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0c0c1d",
          raised: "#12122a",
          overlay: "#181833",
          muted: "#1e1e3f",
        },
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        accent: {
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
        },
        glow: {
          violet: "#8b5cf6",
          rose: "#ec4899",
          cyan: "#22d3ee",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "aurora": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(236,72,153,0.12), transparent), radial-gradient(ellipse 50% 30% at 0% 100%, rgba(34,211,238,0.08), transparent)",
        "mesh": "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.08) 50%, rgba(34,211,238,0.06) 100%)",
        "brand-gradient": "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #ec4899 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(99,102,241,0.15) 50%, rgba(236,72,153,0.1) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(139, 92, 246, 0.15)",
        "glow-lg": "0 0 60px rgba(139, 92, 246, 0.25)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulseSoft: { "0%, 100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
    },
  },
  plugins: [],
};

export default config;
