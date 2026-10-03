import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Eye, Phone, Mail, Car, Calendar } from 'lucide-react'
import { getLeads } from '../../lib/api'
import { formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, count } = await getLeads(page, 20)
      setLeads(data || [])
      setTotal(count || 0)
    } catch {
      toast.error('Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  return (
    <>
      <Helmet><title>Leads - Admin RR Autos</title></Helmet>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Leads</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>{total} contatos recebidos</p>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>Contatos Recebidos</h2>
        </div>

        {loading ? (
          <div className="loading-container" style={{ color: 'rgba(255,255,255,0.4)', padding: 60 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th style={{ width: 140, whiteSpace: 'nowrap' }}>Telefone</th>
                  <th>Email</th>
                  <th>Veículo de Interesse</th>
                  <th style={{ width: 130, whiteSpace: 'nowrap' }}>Data</th>
                  <th style={{ width: 140, textAlign: 'right', whiteSpace: 'nowrap' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>
                      Nenhum lead recebido ainda
                    </td>
                  </tr>
                ) : leads.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600, color: 'white' }}>{l.nome}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <a href={`tel:${l.telefone}`} style={{ color: '#34D399', fontWeight: 600 }}>
                        {l.telefone}
                      </a>
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.55)' }}>{l.email || '-'}</td>
                    <td>
                      {l.veiculos ? (
                        <span style={{ color: '#4D8FFF', fontSize: '0.82rem', fontWeight: 600 }}>
                          {l.veiculos.marca} {l.veiculos.modelo} {l.veiculos.ano}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{formatDate(l.created_at)}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="table-action-btn view" onClick={() => setSelected(l)} title="Ver detalhes">
                          <Eye size={14} />
                        </button>
                        <a href={`tel:${l.telefone}`} className="table-action-btn edit" title="Ligar">
                          <Phone size={14} />
                        </a>
                        {l.email && (
                          <a href={`mailto:${l.email}`} className="table-action-btn" style={{ color: '#A78BFA', background: 'rgba(167,139,250,0.1)' }} title="Enviar email">
                            <Mail size={14} />
                          </a>
                        )}
                        {l.telefone && (
                          <a
                            href={`https://wa.me/55${l.telefone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="table-action-btn"
                            style={{ color: '#34D399', background: 'rgba(52,211,153,0.1)' }}
                            title="WhatsApp"
                          >
                            💬
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="admin-modal-overlay">
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-xl)', padding: 28, maxWidth: 480, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: 'white', fontWeight: 700 }}>Detalhes do Lead</h3>
              <button onClick={() => setSelected(null)} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '👤', label: 'Nome', value: selected.nome },
                { icon: '📱', label: 'Telefone', value: selected.telefone },
                { icon: '📧', label: 'E-mail', value: selected.email || '-' },
                { icon: '🚗', label: 'Veículo', value: selected.veiculos ? `${selected.veiculos.marca} ${selected.veiculos.modelo} ${selected.veiculos.ano}` : '-' },
                { icon: '📅', label: 'Data', value: formatDate(selected.created_at) },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                  <span>{icon}</span>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>{label}</div>
                    <div style={{ color: 'white', fontSize: '0.9rem' }}>{value}</div>
                  </div>
                </div>
              ))}
              {selected.mensagem && (
                <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>💬 Mensagem</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.mensagem}</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <a href={`https://wa.me/55${selected.telefone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ flex: 1, justifyContent: 'center' }}>
                💬 WhatsApp
              </a>
              <a href={`tel:${selected.telefone}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Phone size={15} /> Ligar
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
