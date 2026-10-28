import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Car, Eye, MessageSquare, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import { getDashboardStats } from '../../lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { icon: Car, label: 'Total de Veículos', value: stats.total, color: '#7AA0FF', bg: 'rgba(77,143,255,0.12)' },
    { icon: CheckCircle, label: 'Veículos Ativos', value: stats.ativos, color: '#34D399', bg: 'rgba(52,211,153,0.12)' },
    { icon: XCircle, label: 'Veículos Vendidos', value: stats.vendidos, color: '#F87171', bg: 'rgba(248,113,113,0.12)' },
    { icon: Eye, label: 'Visualizações', value: stats.visualizacoes, color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
    { icon: MessageSquare, label: 'Leads Recebidos', value: stats.leads, color: '#FBBF24', bg: 'rgba(251,191,36,0.12)' },
  ] : []

  return (
    <>
      <Helmet><title>Dashboard - Admin RR Autos</title></Helmet>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>Visão geral do desempenho da RR Autos</p>
      </div>

      {loading ? (
        <div className="loading-container" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <div className="spinner" />
          <span>Carregando estatísticas...</span>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {statCards.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="stat-card">
                <div className="stat-card-icon" style={{ background: bg }}>
                  <Icon size={22} color={color} />
                </div>
                <div className="stat-card-value" style={{ color }}>{value?.toLocaleString('pt-BR')}</div>
                <div className="stat-card-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 28 }}>
            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>⚡ Ações Rápidas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="/admin/veiculos" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(30,94,255,0.15)', borderRadius: 8, color: '#7AA0FF', fontWeight: 600, fontSize: '0.88rem', border: '1px solid rgba(30,94,255,0.2)' }}>
                  <Car size={16} /> Cadastrar novo veículo
                </a>
                <a href="/admin/leads" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(251,191,36,0.1)', borderRadius: 8, color: '#FBBF24', fontWeight: 600, fontSize: '0.88rem', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <MessageSquare size={16} /> Ver leads recebidos
                </a>
                <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(52,211,153,0.1)', borderRadius: 8, color: '#34D399', fontWeight: 600, fontSize: '0.88rem', border: '1px solid rgba(52,211,153,0.2)' }}>
                  <Eye size={16} /> Visualizar site público
                </a>
              </div>
            </div>

            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>📊 Resumo</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Taxa de ocupação</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
                    {stats?.total > 0 ? Math.round((stats.ativos / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #7AA0FF, #1E5EFF)', borderRadius: 3, width: `${stats?.total > 0 ? (stats.ativos / stats.total) * 100 : 0}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
                  <span>{stats?.ativos} ativos</span>
                  <span>{stats?.total} total</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
