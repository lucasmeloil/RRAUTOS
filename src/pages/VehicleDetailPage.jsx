import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, X, Heart, Share2,
  Calendar, Gauge, Fuel, Settings, Palette, Car,
  MessageCircle, Phone, CalendarCheck
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import { getVehicleById, getVehicleBySlug, incrementViews, createLead } from '../lib/api'
import { formatPrice, formatKm, getVehicleWhatsAppLink } from '../utils/formatters'
import { useFavorites } from '../context/FavoritesContext'
import toast from 'react-hot-toast'

export default function VehicleDetailPage() {
  const { slug, id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadData, setLeadData] = useState({ nome: '', telefone: '', email: '', mensagem: '' })
  const [sending, setSending] = useState(false)
  const { toggleFavorite, isFavorite } = useFavorites()

  const targetId = id || slug

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!targetId) return
      setLoading(true)
      try {
        const data = await getVehicleById(targetId)
        if (data) {
          setVehicle(data)
          incrementViews(targetId).catch(() => {})
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [targetId])

  const images = vehicle?.imagens?.length
    ? [...vehicle.imagens]
        .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
        .map(i => (typeof i === 'string' ? i : i.url))
        .filter(Boolean)
    : []

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length)
  const nextImg = () => setActiveImg(i => (i + 1) % images.length)

  useEffect(() => {
    const onKey = (e) => {
      if (!lightbox) return
      if (e.key === 'ArrowLeft') prevImg()
      if (e.key === 'ArrowRight') nextImg()
      if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, images.length])

  const handleLead = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await createLead({ ...leadData, veiculo_id: vehicle?.id })
      toast.success('Mensagem enviada! Entraremos em contato em breve. 🎉')
      setShowLeadForm(false)
      setLeadData({ nome: '', telefone: '', email: '', mensagem: '' })
    } catch {
      toast.error('Erro ao enviar. Tente pelo WhatsApp.')
    } finally {
      setSending(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${vehicle?.marca} ${vehicle?.modelo}`, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copiado!')
    }
  }

  if (loading) return (
    <Layout>
      <div className="loading-container">
        <div className="spinner" />
        <span>Carregando veículo...</span>
      </div>
    </Layout>
  )

  if (!vehicle) return (
    <Layout>
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="empty-state-icon"><Car size={36} /></div>
        <h3>Veículo não encontrado</h3>
        <p>O veículo pode ter sido vendido ou removido.</p>
        <Link to="/veiculos" className="btn btn-primary">Ver outros veículos</Link>
      </div>
    </Layout>
  )

  const specs = [
    { icon: Calendar, key: 'Ano', val: vehicle.ano },
    { icon: Gauge, key: 'Quilometragem', val: formatKm(vehicle.km) },
    { icon: Fuel, key: 'Combustível', val: vehicle.combustivel },
    { icon: Settings, key: 'Câmbio', val: vehicle.cambio },
    { icon: Car, key: 'Motor', val: vehicle.motor },
    { icon: Palette, key: 'Cor', val: vehicle.cor },
  ].filter(s => s.val)

  const optionals = vehicle.opcionais
    ? (typeof vehicle.opcionais === 'string'
        ? vehicle.opcionais.split(',').map(s => s.trim()).filter(Boolean)
        : vehicle.opcionais)
    : []

  const isFav = isFavorite(vehicle.id)

  return (
    <Layout>
      <Helmet>
        <title>{`${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} - RR Autos`}</title>
        <meta name="description" content={`${vehicle.marca} ${vehicle.modelo} ${vehicle.versao || ''} ${vehicle.ano} - ${formatKm(vehicle.km)} - ${formatPrice(vehicle.preco)}. Compre com segurança na RR Autos em Itabaiana-SE.`} />
      </Helmet>

      {/* Header */}
      <div className="vehicle-detail-header">
        <div className="container">
          <div className="vehicle-detail-breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/veiculos">Veículos</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>{vehicle.marca} {vehicle.modelo}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h1 className="vehicle-detail-title">
                {vehicle.marca} {vehicle.modelo} {vehicle.versao || ''}
              </h1>
              <p className="vehicle-detail-subtitle">
                {vehicle.ano} · {formatKm(vehicle.km)} · {vehicle.combustivel} · {vehicle.cambio}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => toggleFavorite(vehicle.id)}
                style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isFav ? '#EF4444' : 'white', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                aria-label="Favoritar"
              >
                <Heart size={18} fill={isFav ? '#EF4444' : 'transparent'} />
              </button>
              <button
                onClick={handleShare}
                style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                aria-label="Compartilhar"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container vehicle-detail-layout">
        {/* Left: Gallery + Info */}
        <div>
          {/* Gallery */}
          {images.length > 0 ? (
            <>
              <div className="gallery-main" onClick={() => setLightbox(true)}>
                <img
                  className="gallery-main-img"
                  src={images[activeImg]}
                  alt={`${vehicle.marca} ${vehicle.modelo} - Foto ${activeImg + 1}`}
                />
                {images.length > 1 && (
                  <>
                    <button className="gallery-nav gallery-nav-prev" onClick={(e) => { e.stopPropagation(); prevImg() }}><ChevronLeft size={20} /></button>
                    <button className="gallery-nav gallery-nav-next" onClick={(e) => { e.stopPropagation(); nextImg() }}><ChevronRight size={20} /></button>
                    <div className="gallery-counter">{activeImg + 1} / {images.length}</div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="gallery-thumbs">
                  {images.map((url, i) => (
                    <div
                      key={i}
                      className={`gallery-thumb${i === activeImg ? ' active' : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={url} alt={`Foto ${i + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-lg)', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🚗</div>
          )}

          {/* Description */}
          {vehicle.descricao && (
            <div className="vehicle-optionals" style={{ marginTop: 20 }}>
              <h3>Descrição</h3>
              <p style={{ fontSize: '0.93rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>{vehicle.descricao}</p>
            </div>
          )}

          {/* Optionals */}
          {optionals.length > 0 && (
            <div className="vehicle-optionals">
              <h3>Opcionais</h3>
              <div className="optionals-grid">
                {optionals.map((opt, i) => (
                  <div key={i} className="optional-item">
                    <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>✓</span>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* YouTube Video */}
          {vehicle.video_url && (
            <div className="vehicle-optionals">
              <h3>Vídeo do Veículo</h3>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src={vehicle.video_url.replace('watch?v=', 'embed/')}
                  title="Vídeo do veículo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Info Panel */}
        <div>
          <div className="vehicle-info-panel">
            <div className="vehicle-info-price-block">
              <div className="vehicle-price-label">Preço</div>
              <div className="vehicle-price">{formatPrice(vehicle.preco)}</div>
              <div className="vehicle-price-note">ou consulte condições de financiamento</div>
            </div>

            <div className="vehicle-info-actions">
              <a
                href={getVehicleWhatsAppLink(vehicle)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <MessageCircle size={17} />
                Quero este veículo!
              </a>
              <a href="tel:+5579999901176" className="btn btn-primary">
                <Phone size={17} />
                Ligar agora
              </a>
              <button
                className="btn btn-outline"
                onClick={() => setShowLeadForm(true)}
              >
                <CalendarCheck size={17} />
                Agendar Visita
              </button>
            </div>

            <div className="vehicle-info-specs">
              <div className="vehicle-specs-title">Especificações</div>
              {specs.map(({ icon: Icon, key, val }) => (
                <div key={key} className="vehicle-spec-row">
                  <span className="spec-key"><Icon size={14} />{key}</span>
                  <span className="spec-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ background: 'white', border: '1px solid var(--gray-200)', maxWidth: 480 }}>
            <div className="admin-modal-header" style={{ background: 'white' }}>
              <h2 style={{ color: 'var(--gray-900)' }}>Agendar Visita</h2>
              <button className="admin-modal-close" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }} onClick={() => setShowLeadForm(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleLead}>
              <div className="admin-modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Nome completo *</label>
                    <input
                      className="form-control"
                      required
                      value={leadData.nome}
                      onChange={e => setLeadData(d => ({ ...d, nome: e.target.value }))}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone / WhatsApp *</label>
                    <input
                      className="form-control"
                      required
                      value={leadData.telefone}
                      onChange={e => setLeadData(d => ({ ...d, telefone: e.target.value }))}
                      placeholder="(79) 99999-9999"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input
                      className="form-control"
                      type="email"
                      value={leadData.email}
                      onChange={e => setLeadData(d => ({ ...d, email: e.target.value }))}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mensagem</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={leadData.mensagem}
                      onChange={e => setLeadData(d => ({ ...d, mensagem: e.target.value }))}
                      placeholder={`Tenho interesse no ${vehicle?.marca} ${vehicle?.modelo} ${vehicle?.ano}...`}
                    />
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer" style={{ background: 'transparent' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowLeadForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && images.length > 0 && (
        <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
          <button className="gallery-nav" style={{ left: 20, position: 'absolute' }} onClick={(e) => { e.stopPropagation(); prevImg() }}>
            <ChevronLeft size={24} />
          </button>
          <img
            className="lightbox-img"
            src={images[activeImg]}
            alt={`Foto ${activeImg + 1}`}
            onClick={e => e.stopPropagation()}
          />
          <button className="gallery-nav" style={{ right: 20, position: 'absolute' }} onClick={(e) => { e.stopPropagation(); nextImg() }}>
            <ChevronRight size={24} />
          </button>
          <button className="lightbox-close" onClick={() => setLightbox(false)}>
            <X size={20} />
          </button>
          <div style={{ position: 'absolute', bottom: 20, color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
            {activeImg + 1} / {images.length}
          </div>
        </div>
      )}
    </Layout>
  )
}
