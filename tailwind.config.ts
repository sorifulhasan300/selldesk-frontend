import type { Config } from "tailwindcss";

/**
 * SellDesk Central Tailwind Configuration
 *
 * Architecture Rules:
 * - Zero Hardcoded Hex Policy: All colors mapped to CSS variables.
 * - Dynamic Alpha Transparency: Tokens use `hsl(var(--token) / <alpha-value>)` format.
 * - Multi-Tenant Storefront Support: Provides `store.*` token aliases that resolve
 *   to tenant CSS custom properties with automatic fallback to platform theme.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        // Base system surfaces
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",

        // Card & modal surfaces
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },

        // Core brand tokens (Default: Primary #7C3AEC / Secondary #ECE9FE)
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },

        // Feedback & state tokens
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },

        // Structural and form controls
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",

        // Dynamic multi-tenant storefront tokens (Runtime theme override)
        store: {
          primary: {
            DEFAULT:
              "hsl(var(--store-primary, var(--primary)) / <alpha-value>)",
            foreground:
              "hsl(var(--store-primary-foreground, var(--primary-foreground)) / <alpha-value>)",
          },
          bg: "hsl(var(--store-bg, var(--background)) / <alpha-value>)",
          text: "hsl(var(--store-text, var(--foreground)) / <alpha-value>)",
          border: "hsl(var(--store-border, var(--border)) / <alpha-value>)",
        },

        // Admin & Store dashboard sidebar tokens
        sidebar: {
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground":
            "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground":
            "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-jakarta)", "sans-serif"],
        bengali: ["var(--font-hind)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
