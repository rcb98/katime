const colors = require('tailwindcss/colors')

module.exports = {
    // mode: 'jit',

    purge: ['./src/**/*.{html,ts}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            sans: ['Lato', 'sans-serif']
        },
        borderRadius: {
            'lg': '15px', // button
            'xl': '25px' // gray background
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            indigo: colors.indigo,
            red: colors.red,
            yellow: colors.yellow,
            purple: {
                DEFAULT: '#9889C2'
            }
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms'), require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')],
};
