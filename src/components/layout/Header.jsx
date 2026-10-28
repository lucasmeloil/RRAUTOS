import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Car, PhoneCall } from 'lucide-react'
import { getWhatsAppLink } from '../../utils/formatters'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/veiculos', label: 'Veículos' },
  { to: '/quem-somos', label: 'Quem Somos' },
  { to: '/contato', label: 'Contato' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <>
      <header className={`header${isHome ? ' header-home' : ''}${scrolled ? ' scrolled' : ''}${drawerOpen ? ' drawer-open' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="header-logo" onClick={() => setDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/logo.png"
              alt="RR Autos"
              style={{
                height: 44,
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
              }}
            />
          </Link>

          <nav className="header-nav">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="header-btn-wpp"
            >
              <PhoneCall size={15} />
              (79) 99990-1176
            </a>
            <button
              className="header-menu-btn"
              onClick={() => setDrawerOpen(prev => !prev)}
              aria-label={drawerOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {drawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Slides from Top) */}
      {drawerOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <nav className="mobile-drawer">
            <div className="mobile-drawer-links">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ justifyContent: 'center', marginTop: 12, padding: '14px' }}
              onClick={() => setDrawerOpen(false)}
            >
              <PhoneCall size={18} />
              Falar com Consultor no WhatsApp
            </a>
          </nav>
        </>
      )}
    </>
  )
}
