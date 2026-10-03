import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate } from 'react-router-dom'
import { Car, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const { signIn, user, isAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return (
    <div className="loading-container" style={{ height: '100vh' }}>
      <div className="spinner" />
    </div>
  )

  if (user && isAdmin) return <Navigate to="/admin/dashboard" replace />

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await signIn(email, password)
      toast.success('Login realizado com sucesso!')
    } catch (err) {
      toast.error(err.message || 'Email ou senha incorretos.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet><title>Admin Login - RR Autos</title></Helmet>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0E1A 0%, #0F172A 50%, #001A4D 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 400,
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 36px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img
              src="/logo.png"
              alt="RR Autos"
              style={{
                height: 56,
                width: 'auto',
                margin: '0 auto 12px',
                display: 'block',
                objectFit: 'contain'
              }}
            />
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: 4 }}>Painel Administrativo</div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="admin-form-label">E-mail</label>
              <input
                className="admin-form-control"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@rrautos.com.br"
              />
            </div>

            <div className="form-group">
              <label className="admin-form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="admin-form-control"
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ marginTop: 6, justifyContent: 'center', padding: '13px' }}
            >
              {submitting ? (
                <><span className="spinner spinner-sm" />Entrando...</>
              ) : (
                <><Lock size={16} />Entrar no Painel</>
              )}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>← Voltar ao site</a>
          </div>
        </div>
      </div>
    </>
  )
}
