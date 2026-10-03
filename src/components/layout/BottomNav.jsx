import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Car, Users, Phone } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/veiculos', icon: Car, label: 'Veículos' },
  { to: '/quem-somos', icon: Users, label: 'Quem Somos' },
  { to: '/contato', icon: Phone, label: 'Contato' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
