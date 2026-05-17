import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Inter", "sans-serif"],
        mono: ["SF Mono", "JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        glass: {
          dark: "rgba(18, 18, 20, 0.82)",
          border: "rgba(255,255,255,0.08)",
          titlebar: "rgba(28, 28, 32, 0.90)",
        },
        mac: {
          red: "#FF5F57",
          yellow: "#FFBD2E",
          green: "#28C840",
          bg: "#EFEFE8",
        },
      },
      backdropBlur: { xl2: "40px" },
      boxShadow: {
        window: "0 32px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
        dock: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "cursor-blink": "blink 1s step-end infinite",
        "typing": "typing 0.8s steps(20) forwards",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px) scale(0.96)" }, to: { opacity: "1", transform: "translateY(0) scale(1)" } },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
        typing: { from: { width: "0" }, to: { width: "100%" } },
      },
    },
  },
  plugins: [],
};

export default config;
