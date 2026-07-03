import { Link, NavLink, useLocation } from 'react-router-dom'

const links = [
  { to: '/digital', label: 'Digital' },
  { to: '/film', label: 'Film' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const { pathname } = useLocation()
  const dark = ['/film', '/digital'].some((p) => pathname.startsWith(p))

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-500 ${
        dark ? 'border-dark-line bg-dark/85 text-dark-text' : 'border-line bg-paper/85 text-ink'
      }`}
    >
      <div className="mx-auto flex max-w-site items-baseline justify-between gap-4 px-5 py-4 md:px-10 md:py-5">
        <Link to="/" className="group flex items-baseline gap-3 md:gap-4">
          <span className="font-display text-lg font-medium leading-none tracking-tight md:text-xl">
            Steven Matson
          </span>
          <span
            className={`label hidden pb-px sm:inline ${dark ? 'text-dark-soft' : 'text-ink-soft'}`}
          >
            Field Archive
          </span>
        </Link>
        <nav className="flex items-baseline gap-5 md:gap-8">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `label pb-1 transition-colors ${
                  isActive
                    ? `border-b ${dark ? 'border-ochre text-dark-text' : 'border-moss text-ink'}`
                    : dark
                      ? 'text-dark-soft hover:text-dark-text'
                      : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
