import { useLocation } from 'react-router-dom'

export default function Footer() {
  const dark = useLocation().pathname.startsWith('/film')

  return (
    <footer
      className={`border-t transition-colors duration-500 ${
        dark ? 'border-dark-line bg-dark text-dark-soft' : 'border-line bg-paper text-ink-soft'
      }`}
    >
      <div className="mx-auto flex max-w-site flex-col gap-2 px-5 py-8 md:flex-row md:items-baseline md:justify-between md:px-10">
        <p className="label">© {new Date().getFullYear()} Steven Matson — Jersey, Channel Islands</p>
        <p className="label">Macro · Natural history · 35mm film</p>
      </div>
    </footer>
  )
}
