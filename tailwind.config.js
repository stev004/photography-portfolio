/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        film: {
          bg: '#FFFFFF',
          ink: '#0A0A0A',
          mid: '#6B6B6B',
          rule: '#E8E8E8',
        },
        digital: {
          bg: '#050505',
          surface: '#0D0D0D',
          border: 'rgba(255,255,255,0.08)',
          accent: '#00E5FF',
          dim: 'rgba(255,255,255,0.4)',
        },
      },
      maxWidth: {
        '8xl': '88rem',
      },
      letterSpacing: {
        superwide: '0.25em',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
