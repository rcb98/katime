module.exports = {
    // mode: 'jit',
    purge: ['./src/**/*.{html,ts}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            sans: ['Lato', 'sans-serif']
        },
        borderRadius: {
            'xl': '25px'
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms'), require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')],
};