import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: "#000000",
          deep: "#010208",
          blue: "#0066ff",
          cyan: "#00f5ff",
          purple: "#8b00ff",
          nebula: "#4b0082",
          red: "#ff2244",
          gold: "#ffd700",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
        exo: ["var(--font-exo)"],
        mono: ["var(--font-share-tech-mono)"],
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "glitch": "glitch 0.3s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        scan: {
          "from": { transform: "rotate(0deg)" },
          "to": { transform: "rotate(360deg)" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "33%": { transform: "translate(-2px, 1px)" },
          "66%": { transform: "translate(2px, -1px)" },
        },
      },
      backgroundImage: {
        "cosmic-radial": "radial-gradient(ellipse at center, #0066ff10 0%, transparent 70%)",
        "nebula-purple": "radial-gradient(ellipse at 30% 50%, #8b00ff15 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
