import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, Outlet, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Car, MessageSquare, LogOut,
  Menu, X, Globe, ChevronRight, Sparkles,
  PanelLeftClose, PanelLeftOpen, ChevronLeft
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/veiculos', icon: Car, label: 'Veículos' },
  { to: '/admin/hero', icon: Sparkles, label: 'Hero Slider' },
  { to: '/admin/leads', icon: MessageSquare, label: 'Leads' },
]

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })
  const navigate = useNavigate()

  useEffect(() => {
    try {
      localStorage.setItem('admin_sidebar_collapsed', String(collapsed))
    } catch {}
  }, [collapsed])

  if (loading) return (
    <div className="loading-container" style={{ height: '100vh', background: '#0F172A' }}>
      <div className="spinner" />
    </div>
  )

  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/admin/login')
      toast.success('Logout realizado.')
    } catch {
      toast.error('Erro ao sair.')
    }
  }

  const toggleCollapsed = () => {
    setCollapsed(prev => !prev)
  }

  return (
    <div className={`admin-wrapper${collapsed ? ' collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}${collapsed ? ' collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <img
              src="/logo.png"
              alt="RR Autos"
              className="admin-logo-img"
            />
            <div className="admin-logo-mini">
              RR
            </div>
            <div className="admin-logo-text-wrap">
              <span className="admin-logo-title">RR Autos</span>
              <span className="admin-logo-subtitle">Painel Admin</span>
            </div>
          </div>

          {/* Desktop Collapse Toggle in Sidebar Header */}
          <button
            type="button"
            className="admin-sidebar-toggle-btn"
            onClick={toggleCollapsed}
            title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            aria-label="Alternar menu lateral"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            className="admin-sidebar-close-mobile-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section-title">Menu Principal</div>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="admin-nav-icon" />
              <span className="admin-nav-label">{label}</span>
              {to === '/admin/hero' && (
                <span className="admin-nav-badge-dot" title="Slider Principal" />
              )}
            </NavLink>
          ))}

          <div className="admin-nav-section-title" style={{ marginTop: 16 }}>Externo</div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item"
            title={collapsed ? 'Ver Site' : undefined}
          >
            <Globe size={18} className="admin-nav-icon" />
            <span className="admin-nav-label">Ver Site</span>
            <ChevronRight size={14} className="admin-nav-arrow" />
          </a>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user-box">
            <div className="admin-user-avatar-small">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="admin-user-info-text">
              <div className="admin-user-info-role">Logado como</div>
              <div className="admin-user-info-email" title={user?.email}>
                {user?.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="admin-logout-btn"
            title={collapsed ? 'Sair do painel' : undefined}
          >
            <LogOut size={17} />
            <span className="admin-logout-label">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <main className={`admin-main${collapsed ? ' collapsed' : ''}`}>
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mobile Hamburger Menu */}
            <button
              className="admin-mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Retract Toggle Button */}
            <button
              className="admin-desktop-collapse-btn"
              onClick={toggleCollapsed}
              title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
              aria-label="Alternar recolhimento do menu"
            >
              {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
            </button>

            <span className="admin-topbar-title">RR Autos — Admin</span>
          </div>

          <div className="admin-topbar-user">
            <span className="admin-topbar-email" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
              {user?.email}
            </span>
            <div className="admin-topbar-avatar" title={user?.email}>
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
