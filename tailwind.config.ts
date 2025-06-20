import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class", '[data-mode="dark"]'],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        wiggle: {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(1px, 1px) rotate(0.1deg)" },
          "50%": { transform: "translate(0, 0) rotate(0eg)" },
          "75%": { transform: "translate(-1px, 1px) rotate(-0.1deg)" },
          "100%": { transform: "translate(0, 0) rotate(0deg)" },
        },
        wiggle2: {
          "0%": { transform: "translate(1px, 1px) rotate(0.1deg)" },
          "25%": { transform: "translate(0, 0) rotate(0eg)" },
          "50%": { transform: "translate(-1px, 1px) rotate(-0.1deg)" },
          "75%": { transform: "translate(0, 0) rotate(0deg)" },
          "100%": { transform: "translate(0, 0) rotate(0deg)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(20%)", opacity: "0.5" },
          "50%": { opacity: "0.5" },
          "100%": { transform: "translateX(0%)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: "wiggle 0.1s infinite",
        wiggle2: "wiggle2 0.1s infinite",
        "spin-slow": "spin 3s linear infinite",
        fade: "fadeIn .5s ease-in-out",
        "slide-in": "slideIn 0.5s ease-out forwards",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
