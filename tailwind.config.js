/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "selector",
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],
    theme: {
        extend: {
            // Color palette - SRB Motors Design System
            colors: {
                // Primary Blue
                blue: {
                    50: "#F0F9FF",
                    100: "#E0F2FE",
                    200: "#BAE6FD",
                    300: "#7DD3FC",
                    400: "#38BDF8",
                    500: "#0EA5E9",
                    600: "#2563EB", // ← MAIN use this
                    700: "#1D4ED8",
                    800: "#1E40AF",
                    900: "#1E3A8A",
                },
                // Primary Brand Color
                primary: {
                    DEFAULT: "#2563EB",
                    light: "#60A5FA",
                    dark: "#1D4ED8",
                    darker: "#1E40AF",
                },
                // Neutral/Gray - exact from design system
                gray: {
                    50: "#F9FAFB",
                    100: "#F3F4F6",
                    200: "#E5E7EB",
                    300: "#D1D5DB",
                    400: "#9CA3AF",
                    500: "#6B7280",
                    600: "#4B5563",
                    700: "#374151",
                    800: "#1F2937",
                    900: "#111827",
                },
                // Success/Green
                green: {
                    50: "#ECFDF5",
                    100: "#D1FAE5",
                    200: "#A7F3D0",
                    300: "#6EE7B7",
                    400: "#34D399",
                    500: "#10B981", // ← MAIN use this
                    600: "#059669",
                    700: "#047857",
                    800: "#065F46",
                    900: "#064E3B",
                },
                // Warning/Amber
                yellow: {
                    50: "#FFFBEB",
                    100: "#FEF3C7",
                    200: "#FDE68A",
                    300: "#FCD34D",
                    400: "#FBBF24",
                    500: "#F59E0B",
                    600: "#D97706",
                    700: "#B45309",
                    800: "#92400E",
                    900: "#78350F",
                },
                // Danger/Red
                red: {
                    50: "#FEE2E2",
                    100: "#FECACA",
                    200: "#FCA5A5",
                    300: "#F87171",
                    400: "#F87171",
                    500: "#EF4444",
                    600: "#DC2626",
                    700: "#B91C1C",
                    800: "#991B1B",
                    900: "#7F1D1D",
                },
            },

            // Typography
            fontFamily: {
                sans: [
                    "Inter",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    "system-ui",
                    "sans-serif",
                ],
                mono: ["Monaco", "Menlo", "monospace"],
            },
            fontSize: {
                xs: ["12px", { lineHeight: "1.5", letterSpacing: "0.2px" }],
                sm: ["14px", { lineHeight: "1.5", letterSpacing: "0.25px" }],
                base: ["16px", { lineHeight: "1.5", letterSpacing: "0.3px" }],
                lg: ["18px", { lineHeight: "1.5", letterSpacing: "0.3px" }],
                xl: ["20px", { lineHeight: "1.4", letterSpacing: "0px" }],
                "2xl": ["24px", { lineHeight: "1.25", letterSpacing: "0px" }],
                "3xl": ["28px", { lineHeight: "1.2", letterSpacing: "-0.3px" }],
                "4xl": ["32px", { lineHeight: "1.2", letterSpacing: "-0.5px" }],
            },

            // Spacing - 8px base
            spacing: {
                px: "1px",
                0: "0",
                0.5: "2px",
                1: "4px",
                1.5: "6px",
                2: "8px",
                2.5: "10px",
                3: "12px",
                3.5: "14px",
                4: "16px",
                5: "20px",
                6: "24px",
                7: "28px",
                8: "32px",
                9: "36px",
                10: "40px",
                12: "48px",
                14: "56px",
                16: "64px",
                20: "80px",
                24: "96px",
                28: "112px",
                32: "128px",
                36: "144px",
                40: "160px",
                44: "176px",
                48: "192px",
                52: "208px",
                56: "224px",
                60: "240px",
                64: "256px",
                72: "288px",
                80: "320px",
                96: "384px",
            },

            // Border Radius
            borderRadius: {
                none: "0",
                sm: "2px",
                DEFAULT: "4px",
                md: "6px",
                lg: "8px",
                xl: "12px",
                "2xl": "16px",
                full: "9999px",
            },

            // Shadows
            boxShadow: {
                none: "none",
                sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                DEFAULT:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            },

            // Transitions
            transitionDuration: {
                100: "100ms",
                150: "150ms",
                200: "200ms",
                300: "300ms",
                500: "500ms",
                700: "700ms",
                1000: "1000ms",
            },
        },
    },
    plugins: [],
};
