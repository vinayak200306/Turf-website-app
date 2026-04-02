import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        ink: "#1E293B",
        accent: "#FF7A00",
        surface: "#FFFFFF",
        muted: "#64748B",
        soft: "#FFF3E8"
      },
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        "soft-xl": "0 20px 40px -24px rgba(255, 122, 0, 0.28)",
        glass: "0 18px 40px -26px rgba(15, 23, 42, 0.22)",
        panel: "0 24px 60px -30px rgba(148, 163, 184, 0.45)"
      },
      backgroundImage: {
        "page-gradient": "radial-gradient(circle at top left, rgba(255, 122, 0, 0.18), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.8s linear infinite",
        pulseGlow: "pulseGlow 2.2s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 18px 40px -26px rgba(255, 122, 0, 0.35)" },
          "50%": { boxShadow: "0 22px 50px -20px rgba(255, 122, 0, 0.48)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
