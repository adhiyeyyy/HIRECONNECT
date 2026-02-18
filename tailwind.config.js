/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./frontend/**/*.{html,js}",
        "./frontend/*.{html,js}"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#14b8a6',
                secondary: '#1e293b',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
