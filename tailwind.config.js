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
        paper: '#F8F7F4',
        parchment: '#EEECE7',
        ink: '#1D1B17',
        'ink-soft': '#6E6A61',
        line: '#E2DFD8',
        moss: '#4C5840',
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
