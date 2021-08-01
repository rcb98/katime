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
            'xl': '25px', // gray background
            'full': 'border-radius: 50%'
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            purple: {
                DEFAULT: '#9889C2'
            },
            pink: {
                DEFAULT: '#F6838A'
            },
            red: {
                DEFAULT: '#F27D63'
            },
            orange: {
                DEFAULT: '#F2A463'
            },
            yellow: {
                DEFAULT: '#F2CA63'
            },
            green: {
                DEFAULT: '#8BC898'
            },
            blue: {
                DEFAULT: '#8EA1D1'
            },
            indigo: {
                DEFAULT: '#9395CA'
            }
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms'), require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')],
};