/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                game: {
                    common: '#E2E8F0', // slate-200
                    uncommon: '#00FF66', // neon green
                    rare: '#00F0FF', // cyber blue
                    epic: '#B026FF', // amethyst
                    legendary: '#FFB800', // gold
                    mythic: '#FF003C', // crimson
                    bg: '#121212', // dark background
                    card: '#1A1A2E', // slightly lighter card bg
                    primary: '#6366F1', // indigo
                    secondary: '#EC4899', // pink
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Orbitron', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
