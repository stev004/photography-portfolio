import { fileURLToPath } from 'node:url'

// Pin the Tailwind config to this directory so the build works even when the
// dev server is launched from outside the project root (e.g. a git worktree).
export default {
  plugins: {
    tailwindcss: { config: fileURLToPath(new URL('./tailwind.config.js', import.meta.url)) },
    autoprefixer: {},
  },
}
