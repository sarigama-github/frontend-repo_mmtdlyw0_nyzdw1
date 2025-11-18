import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/orders', label: 'Orders' },
  { to: '/kitchen', label: 'Kitchen' },
  { to: '/reports', label: 'Reports' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
          <img src="/flame-icon.svg" alt="logo" className="w-6 h-6" />
          Bill Printing App
        </Link>
        <nav className="flex items-center gap-2">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                pathname === n.to ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              {n.label}
            </Link>
          ))}
          <a href="/test" className="px-3 py-1.5 rounded-md text-sm text-blue-200 hover:text-white hover:bg-slate-800">Test</a>
        </nav>
      </div>
    </header>
  )
}
