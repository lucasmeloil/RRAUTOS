import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Sparkles, Plus, Pencil, Trash2, Eye, Upload, Image as ImageIcon,
  ArrowUp, ArrowDown, ExternalLink, Check, X, Search, Zap, RefreshCw
} from 'lucide-react'
import {
  getAllHeroSlidesAdmin, createHeroSlide, updateHeroSlide, deleteHeroSlide,
  uploadHeroImage, getAllVehiclesAdmin
} from '../../lib/api'
import { generateVehicleSlug, formatPrice, formatKm } from '../../utils/formatters'
import toast from 'react-hot-toast'

const BADGE_OPTIONS = [
  'Destaque Exclusivo',
  'Mais Desejado',
  'Oportunidade',
  'Seleção Premium',
  'Recém Chegado',
  'Preço Especial',
  'Seminovo Garantido'
]

const CAMBIOS = ['Automático', 'Automático 8M', 'CVT', 'Manual', 'Semi-automático']
const COMBUSTIVEIS = ['Flex', 'Gasolina', 'Etanol', 'Diesel', 'Híbrido', 'Elétrico']

const EMPTY_SLIDE = {
  marca: '',
  modelo: '',
  versao: '',
  ano: new Date().getFullYear(),
  km: '',
  cambio: 'Automático',
  combustivel: 'Flex',
  preco: '',
  tagline: '',
  badge: 'Destaque Exclusivo',
  image: '',
  link: '/veiculos',
  ordem: 0,
  ativo: true
}

export default function AdminHeroSlider() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [search, setSearch] = useState('')

  // Modals state
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_SLIDE)
  const [submitting, setSubmitting] = useState(false)

  // Quick image edit modal
  const [quickImageModal, setQuickImageModal] = useState(null) // slide object
  const [quickImageUrl, setQuickImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [slidesData, vehiclesData] = await Promise.all([
        getAllHeroSlidesAdmin(),
        getAllVehiclesAdmin(1, 50).catch(() => ({ data: [] }))
      ])
      setSlides(slidesData || [])
      setVehicles(vehiclesData.data || [])
    } catch {
      toast.error('Erro ao carregar banners do hero')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openCreate = () => {
    setEditingId(null)
    setForm({
      ...EMPTY_SLIDE,
      ordem: slides.length
    })
    setShowModal(true)
  }

  const openEdit = (slide) => {
    setEditingId(slide.id)
    setForm({
      marca: slide.marca || '',
      modelo: slide.modelo || '',
      versao: slide.versao || '',
      ano: slide.ano || new Date().getFullYear(),
      km: slide.km || '',
      cambio: slide.cambio || 'Automático',
      combustivel: slide.combustivel || 'Flex',
      preco: slide.preco || '',
      tagline: slide.tagline || '',
      badge: slide.badge || 'Destaque Exclusivo',
      image: slide.image || '',
      link: slide.link || '/veiculos',
      ordem: slide.ordem ?? 0,
      ativo: slide.ativo ?? true
    })
    setShowModal(true)
  }

  const handlePullFromVehicle = (vehicleId) => {
    const v = vehicles.find(item => item.id === vehicleId)
    if (!v) return

    setForm(prev => ({
      ...prev,
      marca: v.marca,
      modelo: v.modelo,
      versao: v.versao || '',
      ano: v.ano || prev.ano,
      km: v.km ? formatKm(v.km) : prev.km,
      cambio: v.cambio || prev.cambio,
      combustivel: v.combustivel || prev.combustivel,
      preco: formatPrice(v.preco),
      tagline: v.descricao?.slice(0, 65) || prev.tagline || 'Qualidade e procedência garantida RR Autos',
      image: v.imagens?.[0]?.url || prev.image,
      link: `/veiculo/${generateVehicleSlug(v.marca, v.modelo, v.ano)}/${v.id}`
    }))
    toast.success(`Dados de ${v.marca} ${v.modelo} importados para o slide!`)
  }

  const handleFileUpload = async (file, isQuick = false) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem válido (JPG, PNG, WebP).')
      return
    }

    setUploadingImage(true)
    const toastId = toast.loading('Fazendo upload da imagem para o banco de dados...')
    try {
      const url = await uploadHeroImage(file)
      if (isQuick) {
        setQuickImageUrl(url)
      } else {
        setForm(prev => ({ ...prev, image: url }))
      }
      toast.success('Imagem carregada com sucesso!', { id: toastId })
    } catch (err) {
      toast.error('Erro no upload: ' + (err.message || 'Tente novamente'), { id: toastId })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveSlide = async (e) => {
    e.preventDefault()
    if (!form.marca.trim() || !form.modelo.trim()) {
      toast.error('Preencha a Marca e o Modelo.')
      return
    }
    if (!form.image.trim()) {
      toast.error('Insira a URL da imagem ou faça o upload de uma foto.')
      return
    }

    setSubmitting(true)
    try {
      if (editingId) {
        await updateHeroSlide(editingId, form)
        toast.success('Slide e imagem atualizados com sucesso no banco de dados!')
      } else {
        await createHeroSlide(form)
        toast.success('Novo slide cadastrado com sucesso no banco de dados!')
      }
      setShowModal(false)
      loadData()
    } catch (err) {
      toast.error('Erro ao salvar slide: ' + (err.message || 'Tente novamente'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveQuickImage = async () => {
    if (!quickImageModal || !quickImageUrl.trim()) {
      toast.error('Selecione ou informe uma URL de imagem válida.')
      return
    }

    setSubmitting(true)
    try {
      await updateHeroSlide(quickImageModal.id, { image: quickImageUrl.trim() })
      toast.success('Imagem do slide atualizada e salva no banco de dados!')
      setQuickImageModal(null)
      setQuickImageUrl('')
      loadData()
    } catch {
      toast.error('Erro ao salvar nova imagem')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (slide) => {
    const nextStatus = !slide.ativo
    try {
      await updateHeroSlide(slide.id, { ativo: nextStatus })
      toast.success(`Slide ${nextStatus ? 'ativado' : 'desativado'} no hero!`)
      setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, ativo: nextStatus } : s))
    } catch {
      toast.error('Erro ao alterar status')
    }
  }

  const handleMoveOrder = async (slide, direction) => {
    const currentIndex = slides.findIndex(s => s.id === slide.id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= slides.length) return

    const targetSlide = slides[targetIndex]
    const updatedCurrentOrdem = targetSlide.ordem ?? targetIndex
    const updatedTargetOrdem = slide.ordem ?? currentIndex

    try {
      await Promise.all([
        updateHeroSlide(slide.id, { ordem: updatedCurrentOrdem }),
        updateHeroSlide(targetSlide.id, { ordem: updatedTargetOrdem })
      ])
      loadData()
      toast.success('Ordem dos slides atualizada!')
    } catch {
      toast.error('Erro ao reordenar slides')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteHeroSlide(id)
      toast.success('Slide removido do banco de dados!')
      setDeleteConfirm(null)
      loadData()
    } catch {
      toast.error('Erro ao remover slide')
    }
  }

  const filtered = slides.filter(s =>
    `${s.marca} ${s.modelo} ${s.versao} ${s.tagline}`.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = slides.filter(s => s.ativo !== false).length

  return (
    <>
      <Helmet><title>Hero Slider - Admin RR Autos</title></Helmet>

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: 0 }}>
              Slider Principal (Hero)
            </h1>
            <span style={{ background: 'rgba(77,143,255,0.15)', color: '#4D8FFF', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>
              {activeCount} {activeCount === 1 ? 'ativo' : 'ativos'}
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: 4 }}>
            Gerencie, altere as imagens e edite os banners que passam no slider da página inicial. Tudo sincronizado com o banco de dados.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={loadData} title="Recarregar do banco">
            <RefreshCw size={15} /> Atualizar
          </button>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Novo Slide
          </button>
        </div>
      </div>

      {/* Database sync status pill banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(10,74,191,0.18), rgba(0,45,122,0.12))',
        border: '1px solid rgba(77,143,255,0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
          <span style={{ fontSize: '1.1rem' }}>💾</span>
          <div>
            <strong style={{ color: '#4D8FFF' }}>Persistência em Banco de Dados:</strong>{' '}
            As fotos e textos são gravados na tabela <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4, color: '#93C5FD' }}>hero_slides</code> do Supabase e refletidos em tempo real na página inicial.
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#60A5FA', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}
        >
          Ver Hero no site ao vivo <ExternalLink size={13} />
        </a>
      </div>

      {/* Main Table Wrapper */}
      <div className="admin-table-wrap">
        <div className="admin-table-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2>Slides Cadastrados ({slides.length})</h2>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              Clique na imagem para trocar a foto rapidamente
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input
              className="admin-form-control"
              placeholder="Buscar slides..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32, width: 220, padding: '7px 12px 7px 32px', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container" style={{ color: 'rgba(255,255,255,0.4)', padding: 60 }}>
            <div className="spinner" />
            <span style={{ marginTop: 12 }}>Carregando slides do banco de dados...</span>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 70, textAlign: 'center' }}>Ordem</th>
                  <th style={{ width: 150 }}>Imagem / Foto</th>
                  <th>Veículo / Título</th>
                  <th>Preço & Especificações</th>
                  <th>Destaque & Tagline</th>
                  <th>Link Destino</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ width: 140, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 50, color: 'rgba(255,255,255,0.3)' }}>
                      Nenhum slide cadastrado. Clique em "+ Novo Slide" para criar o primeiro!
                    </td>
                  </tr>
                ) : (
                  filtered.map((slide, index) => (
                    <tr key={slide.id}>
                      {/* Ordem & reorder buttons */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <button
                            type="button"
                            className="table-action-btn"
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(slide, 'up')}
                            title="Mover para cima"
                            style={{ width: 22, height: 22, opacity: index === 0 ? 0.3 : 0.8 }}
                          >
                            <ArrowUp size={13} />
                          </button>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93C5FD' }}>
                            #{index + 1}
                          </span>
                          <button
                            type="button"
                            className="table-action-btn"
                            disabled={index === filtered.length - 1}
                            onClick={() => handleMoveOrder(slide, 'down')}
                            title="Mover para baixo"
                            style={{ width: 22, height: 22, opacity: index === filtered.length - 1 ? 0.3 : 0.8 }}
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </td>

                      {/* Imagem (Clickable for quick edit) */}
                      <td>
                        <div
                          style={{
                            position: 'relative',
                            width: 120,
                            height: 68,
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: '1.5px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                            background: '#1F2937'
                          }}
                          onClick={() => {
                            setQuickImageModal(slide)
                            setQuickImageUrl(slide.image)
                          }}
                          title="Clique para trocar esta imagem"
                          className="hero-thumb-hover"
                        >
                          <img
                            src={slide.image}
                            alt={`${slide.marca} ${slide.modelo}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(0,0,0,0.5)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 2,
                              opacity: 0,
                              transition: 'opacity 0.2s ease',
                              color: 'white'
                            }}
                            className="hero-thumb-overlay"
                          >
                            <ImageIcon size={16} />
                            <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Trocar Foto</span>
                          </div>
                        </div>
                      </td>

                      {/* Veículo / Título */}
                      <td>
                        <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>
                          {slide.marca} <span style={{ color: '#60A5FA' }}>{slide.modelo}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                          {slide.versao || 'Versão não especificada'} • {slide.ano}
                        </div>
                      </td>

                      {/* Preço & Especificações */}
                      <td>
                        <div style={{ color: '#4D8FFF', fontWeight: 800, fontSize: '0.95rem' }}>
                          {slide.preco}
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                          {slide.km && (
                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: 4, color: 'rgba(255,255,255,0.7)' }}>
                              📍 {slide.km}
                            </span>
                          )}
                          {slide.cambio && (
                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: 4, color: 'rgba(255,255,255,0.7)' }}>
                              ⚙️ {slide.cambio}
                            </span>
                          )}
                          {slide.combustivel && (
                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: 4, color: 'rgba(255,255,255,0.7)' }}>
                              ⛽ {slide.combustivel}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Destaque & Tagline */}
                      <td>
                        {slide.badge && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, background: 'rgba(245,158,11,0.15)', color: '#FBBF24', fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>
                            <Zap size={11} /> {slide.badge}
                          </div>
                        )}
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={slide.tagline}>
                          "{slide.tagline || 'Sem frase de destaque'}"
                        </div>
                      </td>

                      {/* Link Destino */}
                      <td>
                        <a
                          href={slide.link || '/veiculos'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#93C5FD', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: 4, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          title={slide.link}
                        >
                          {slide.link || '/veiculos'} <ExternalLink size={12} />
                        </a>
                      </td>

                      {/* Status Toggle */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(slide)}
                          style={{
                            cursor: 'pointer',
                            border: 'none',
                            background: slide.ativo ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                            color: slide.ativo ? '#34D399' : '#F87171',
                            padding: '4px 10px',
                            borderRadius: 999,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            transition: 'var(--transition)'
                          }}
                          title="Clique para alternar ativação"
                        >
                          {slide.ativo ? <><Check size={12} /> Ativo</> : <><X size={12} /> Inativo</>}
                        </button>
                      </td>

                      {/* Ações */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="table-action-btn edit"
                            onClick={() => {
                              setQuickImageModal(slide)
                              setQuickImageUrl(slide.image)
                            }}
                            title="Trocar Foto"
                          >
                            <ImageIcon size={15} />
                          </button>
                          <button
                            className="table-action-btn edit"
                            onClick={() => openEdit(slide)}
                            title="Editar Dados Completos"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="table-action-btn delete"
                            onClick={() => setDeleteConfirm(slide)}
                            title="Excluir Slide"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL: Quick Change Image ────────────────────────────────────── */}
      {quickImageModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 560 }}>
            <div className="admin-modal-header">
              <h2>Trocar Imagem do Slide: {quickImageModal.marca} {quickImageModal.modelo}</h2>
              <button className="admin-modal-close" onClick={() => setQuickImageModal(null)}>✕</button>
            </div>

            <div className="admin-modal-body">
              {/* Preview Box */}
              <div style={{ marginBottom: 20 }}>
                <label className="admin-form-label">Prévia da Nova Imagem</label>
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: '#0B1120',
                  border: '2px solid rgba(255,255,255,0.1)',
                  position: 'relative'
                }}>
                  {quickImageUrl ? (
                    <img
                      src={quickImageUrl}
                      alt="Prévia"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        toast.error('Não foi possível carregar a imagem desta URL.')
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', gap: 8 }}>
                      <ImageIcon size={32} />
                      <span style={{ fontSize: '0.85rem' }}>Nenhuma imagem selecionada</span>
                    </div>
                  )}
                  {uploadingImage && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', gap: 10 }}>
                      <div className="spinner" />
                      <span>Enviando foto...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Zone */}
              <div style={{ marginBottom: 16 }}>
                <label className="admin-form-label">Opção 1: Enviar Foto do seu Computador / Celular</label>
                <label
                  className="upload-zone"
                  style={{ display: 'block', padding: 24, cursor: uploadingImage ? 'wait' : 'pointer' }}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={e => handleFileUpload(e.target.files?.[0], true)}
                    disabled={uploadingImage}
                  />
                  <Upload size={28} className="upload-zone-icon" />
                  <p>Clique ou arraste a nova imagem para cá</p>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                    Recomendado: 1920x1080 (16:9), formato JPG, PNG ou WebP
                  </span>
                </label>
              </div>

              {/* Direct URL */}
              <div>
                <label className="admin-form-label">Opção 2: Ou Cole a URL direta da Imagem</label>
                <input
                  className="admin-form-control"
                  type="url"
                  placeholder="https://exemplo.com/foto-do-carro.jpg"
                  value={quickImageUrl}
                  onChange={e => setQuickImageUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setQuickImageModal(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveQuickImage}
                disabled={submitting || uploadingImage || !quickImageUrl.trim()}
              >
                {submitting ? 'Salvando...' : '💾 Salvar Nova Imagem no Banco'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Full Slide Create / Edit ──────────────────────────────── */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 840 }}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Editar Slide do Hero' : 'Criar Novo Slide do Hero'}</h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveSlide}>
              <div className="admin-modal-body">
                {/* Autofill from vehicle helper */}
                {vehicles.length > 0 && (
                  <div style={{
                    background: 'rgba(77,143,255,0.08)',
                    border: '1px solid rgba(77,143,255,0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 16px',
                    marginBottom: 20
                  }}>
                    <label className="admin-form-label" style={{ color: '#93C5FD', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={14} /> Puxar dados de um veículo cadastrado (opcional):
                    </label>
                    <select
                      className="admin-form-control"
                      onChange={e => handlePullFromVehicle(e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Selecione um veículo para preencher os campos automaticamente...</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.marca} {v.modelo} {v.versao} ({v.ano}) — {formatPrice(v.preco)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Image Section */}
                <div style={{ marginBottom: 24, padding: 18, background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ImageIcon size={16} color="#60A5FA" /> Foto Principal do Slide
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 320px) 1fr', gap: 16 }}>
                    {/* Preview box */}
                    <div>
                      <div style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        background: '#0B1120',
                        border: '2px solid rgba(255,255,255,0.1)',
                        position: 'relative'
                      }}>
                        {form.image ? (
                          <img
                            src={form.image}
                            alt="Prévia"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', gap: 6 }}>
                            <ImageIcon size={28} />
                            <span style={{ fontSize: '0.8rem' }}>Sem foto definida</span>
                          </div>
                        )}
                        {uploadingImage && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', gap: 8, fontSize: '0.85rem' }}>
                            <div className="spinner" />
                            <span>Enviando...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload / URL controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label
                        className="upload-zone"
                        style={{ padding: '16px', display: 'block', cursor: 'pointer' }}
                      >
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          style={{ display: 'none' }}
                          onChange={e => handleFileUpload(e.target.files?.[0], false)}
                          disabled={uploadingImage}
                        />
                        <Upload size={20} style={{ color: '#60A5FA', margin: '0 auto 6px', display: 'block' }} />
                        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', display: 'block', fontWeight: 600 }}>
                          Fazer upload de foto local
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                          Envia para o storage do Supabase
                        </span>
                      </label>

                      <div>
                        <label className="admin-form-label">Ou URL direta da imagem:</label>
                        <input
                          className="admin-form-control"
                          type="url"
                          placeholder="https://exemplo.com/imagem-hero.jpg"
                          value={form.image}
                          onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form fields grid */}
                <div className="admin-form-grid">
                  <div>
                    <label className="admin-form-label">Marca *</label>
                    <input
                      className="admin-form-control"
                      placeholder="Ex: BMW, Toyota, Jeep..."
                      value={form.marca}
                      onChange={e => setForm(prev => ({ ...prev, marca: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Modelo *</label>
                    <input
                      className="admin-form-control"
                      placeholder="Ex: 320i M Sport, Corolla Altis..."
                      value={form.modelo}
                      onChange={e => setForm(prev => ({ ...prev, modelo: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Versão</label>
                    <input
                      className="admin-form-control"
                      placeholder="Ex: 2.0 TwinPower Turbo 184cv"
                      value={form.versao}
                      onChange={e => setForm(prev => ({ ...prev, versao: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Preço *</label>
                    <input
                      className="admin-form-control"
                      placeholder="Ex: R$ 289.900"
                      value={form.preco}
                      onChange={e => setForm(prev => ({ ...prev, preco: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Ano</label>
                    <input
                      className="admin-form-control"
                      type="number"
                      placeholder="2023"
                      value={form.ano}
                      onChange={e => setForm(prev => ({ ...prev, ano: parseInt(e.target.value) || 2024 }))}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Quilometragem (KM)</label>
                    <input
                      className="admin-form-control"
                      placeholder="Ex: 16.800 km"
                      value={form.km}
                      onChange={e => setForm(prev => ({ ...prev, km: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Câmbio</label>
                    <select
                      className="admin-form-control"
                      value={form.cambio}
                      onChange={e => setForm(prev => ({ ...prev, cambio: e.target.value }))}
                    >
                      {CAMBIOS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="admin-form-label">Combustível</label>
                    <select
                      className="admin-form-control"
                      value={form.combustivel}
                      onChange={e => setForm(prev => ({ ...prev, combustivel: e.target.value }))}
                    >
                      {COMBUSTIVEIS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="admin-form-label">Badge de Destaque</label>
                    <input
                      list="badge-suggestions"
                      className="admin-form-control"
                      placeholder="Ex: Destaque Exclusivo"
                      value={form.badge}
                      onChange={e => setForm(prev => ({ ...prev, badge: e.target.value }))}
                    />
                    <datalist id="badge-suggestions">
                      {BADGE_OPTIONS.map(b => <option key={b} value={b} />)}
                    </datalist>
                  </div>

                  <div>
                    <label className="admin-form-label">Ordem de Exibição</label>
                    <input
                      type="number"
                      className="admin-form-control"
                      value={form.ordem}
                      onChange={e => setForm(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="admin-form-full">
                    <label className="admin-form-label">Frase de Destaque / Tagline</label>
                    <input
                      className="admin-form-control"
                      placeholder="Ex: O ápice da esportividade e elegância premium"
                      value={form.tagline}
                      onChange={e => setForm(prev => ({ ...prev, tagline: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-full">
                    <label className="admin-form-label">Link de Destino</label>
                    <input
                      className="admin-form-control"
                      placeholder="Ex: /veiculo/bmw-320i-2023/... ou /veiculos"
                      value={form.link}
                      onChange={e => setForm(prev => ({ ...prev, link: e.target.value }))}
                    />
                  </div>

                  <div className="admin-form-full">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: 'white', fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={form.ativo}
                        onChange={e => setForm(prev => ({ ...prev, ativo: e.target.checked }))}
                        style={{ width: 18, height: 18, accentColor: 'var(--primary-light)' }}
                      />
                      <span>Slide Ativo (exibir no carrossel da home)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || uploadingImage}
                >
                  {submitting ? 'Salvando no banco...' : '💾 Salvar no Banco de Dados'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Delete Confirm ────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 440 }}>
            <div className="admin-modal-header">
              <h2>Excluir Slide</h2>
              <button className="admin-modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Tem certeza que deseja remover o slide{' '}
                <strong style={{ color: 'white' }}>{deleteConfirm.marca} {deleteConfirm.modelo}</strong> do hero slider?
              </p>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="btn btn-primary" style={{ background: '#EF4444', borderColor: '#EF4444' }} onClick={() => handleDelete(deleteConfirm.id)}>
                Excluir Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
