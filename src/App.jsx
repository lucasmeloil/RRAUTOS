import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import ScrollToTop from './components/ui/ScrollToTop'

// Public Pages
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FavoritesPage from './pages/FavoritesPage'

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminVehicles from './pages/admin/AdminVehicles'
import AdminLeads from './pages/admin/AdminLeads'
import AdminHeroSlider from './pages/admin/AdminHeroSlider'

// Styles
import './index.css'
import './styles/layout.css'
import './styles/home.css'
import './styles/catalog.css'
import './styles/admin.css'
import './styles/pages.css'

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1E293B',
                  color: '#F8FAFF',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                },
                success: {
                  iconTheme: { primary: '#10B981', secondary: 'white' },
                },
                error: {
                  iconTheme: { primary: '#EF4444', secondary: 'white' },
                },
              }}
            />

            <Routes>
              {/* ─── Public Routes ─────────────────────────────────── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/veiculos" element={<CatalogPage />} />
              <Route path="/veiculo/:slug/:id" element={<VehicleDetailPage />} />
              <Route path="/veiculo/:id" element={<VehicleDetailPage />} />
              <Route path="/quem-somos" element={<AboutPage />} />
              <Route path="/contato" element={<ContactPage />} />
              <Route path="/favoritos" element={<FavoritesPage />} />

              {/* ─── Admin Routes ──────────────────────────────────── */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="veiculos" element={<AdminVehicles />} />
                <Route path="hero" element={<AdminHeroSlider />} />
                <Route path="leads" element={<AdminLeads />} />
              </Route>

              {/* ─── 404 ──────────────────────────────────────────── */}
              <Route path="*" element={
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--bg)' }}>
                  <div style={{ fontSize: '5rem' }}>🚗</div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>Página não encontrada</h1>
                  <p style={{ color: 'var(--gray-500)' }}>A página que você procura não existe.</p>
                  <a href="/" className="btn btn-primary">Voltar à Home</a>
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}
