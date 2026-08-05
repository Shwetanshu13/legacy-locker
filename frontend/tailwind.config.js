/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#F5F7F2",
                surface: "#FFFFFF",
                ink: "#152420",
                "ink-muted": "#5B6B62",
                forest: "#173A2E",
                emerald: "#2E7D5B",
                "emerald-soft": "#DCEEE3",
                brass: "#B08D3E",
                danger: "#B3492F",
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                display: ['var(--font-fraunces)', 'serif'],
                mono: ['var(--font-plex-mono)', 'monospace'],
            },
        },
    },
    plugins: [],
};
