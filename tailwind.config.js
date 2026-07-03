/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files: ['./index.html', './src/**/*.{js,jsx}'],
  },
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: '#F4F1E9',
        parchment: '#ECE7DA',
        ink: '#211E17',
        'ink-soft': '#6E6759',
        line: '#DBD4C3',
        moss: '#55603F',
        ochre: '#A87B2E',
        // darkroom (film section)
        dark: '#191712',
        'dark-2': '#211E18',
        'dark-line': '#37332A',
        'dark-soft': '#9A9382',
        'dark-text': '#EDE8DC',
      },
      letterSpacing: {
        label: '0.22em',
      },
      maxWidth: {
        site: '84rem',
      },
    },
  },
  plugins: [],
}
