import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Pencil, Trash2, Eye, Search, X, Upload } from 'lucide-react'
import {
  getAllVehiclesAdmin, createVehicle, updateVehicle, deleteVehicle,
  uploadVehicleImage, saveVehicleImages, deleteVehicleImages
} from '../../lib/api'
import { formatPrice, formatKm } from '../../utils/formatters'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  marca: '', modelo: '', versao: '', ano: new Date().getFullYear(), km: '',
  cor: '', combustivel: '', motor: '', cambio: '', preco: '',
  descricao: '', observacoes: '', video_url: '', destaque: false, status: 'ativo',
}

const COMBUSTIVEIS = ['Flex', 'Gasolina', 'Etanol', 'Diesel', 'Elétrico', 'Híbrido']
const CAMBIOS = ['Manual', 'Automático', 'CVT', 'Semi-automático']
const STATUS = ['ativo', 'inativo', 'vendido']

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [images, setImages] = useState([]) // { file, preview, url (existing) }
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, count } = await getAllVehiclesAdmin(page, 20)
      setVehicles(data || [])
      setTotal(count || 0)
    } catch (err) {
      toast.error('Erro ao carregar veículos')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setImages([])
    setShowModal(true)
  }

  const openEdit = (v) => {
    setEditingId(v.id)
    setForm({
      marca: v.marca || '', modelo: v.modelo || '', versao: v.versao || '',
      ano: v.ano || new Date().getFullYear(), km: v.km || '',
      cor: v.cor || '', combustivel: v.combustivel || '', motor: v.motor || '',
      cambio: v.cambio || '', preco: v.preco || '', descricao: v.descricao || '',
      observacoes: v.observacoes || '', video_url: v.video_url || '',
      destaque: v.destaque || false, status: v.status || 'ativo',
    })
    const existingImgs = v.imagens
      ? [...v.imagens].sort((a, b) => a.ordem - b.ordem).map(i => ({ url: i.url, isExisting: true }))
      : []
    setImages(existingImgs)
    setShowModal(true)
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer?.files || e.target.files || [])
    const valid = files.filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024)
    if (images.length + valid.length > 30) {
      toast.error('Máximo de 30 imagens por veículo')
      return
    }
    const newImgs = valid.map(f => ({ file: f, preview: URL.createObjectURL(f), isExisting: false }))
    setImages(prev => [...prev, ...newImgs])
  }

  const removeImage = (index) => {
    setImages(prev => {
      const updated = [...prev]
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const vehicleData = {
        ...form,
        ano: parseInt(form.ano),
        km: parseInt(form.km) || 0,
        preco: parseFloat(form.preco) || null,
      }

      let vehicleId = editingId
      if (editingId) {
        await updateVehicle(editingId, vehicleData)
      } else {
        const created = await createVehicle(vehicleData)
        vehicleId = created.id
      }

      // Handle images
      const newImages = images.filter(i => !i.isExisting && i.file)
      if (newImages.length > 0 || editingId) {
        if (editingId) await deleteVehicleImages(vehicleId)
        const uploadedUrls = []
        // Keep existing URLs
        images.filter(i => i.isExisting).forEach(i => uploadedUrls.push(i.url))
        // Upload new ones
        for (const img of newImages) {
          try {
            const url = await uploadVehicleImage(img.file, vehicleId)
            uploadedUrls.push(url)
          } catch (err) {
            toast.error(`Erro no upload: ${err.message}`)
          }
        }
        if (uploadedUrls.length > 0) {
          await saveVehicleImages(vehicleId, uploadedUrls)
        }
      }

      toast.success(editingId ? 'Veículo atualizado!' : 'Veículo cadastrado!')
      setShowModal(false)
      load()
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar veículo')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteVehicleImages(id)
      await deleteVehicle(id)
      toast.success('Veículo excluído.')
      setDeleteConfirm(null)
      load()
    } catch {
      toast.error('Erro ao excluir.')
    }
  }

  const filtered = vehicles.filter(v =>
    `${v.marca} ${v.modelo} ${v.versao}`.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status) => {
    const map = {
      ativo: 'admin-badge admin-badge-active',
      inativo: 'admin-badge admin-badge-inactive',
      vendido: 'admin-badge admin-badge-sold',
    }
    return map[status] || 'admin-badge'
  }

  const getFirstImage = (v) => {
    if (!v.imagens || !v.imagens.length) return null
    const first = v.imagens[0]
    return typeof first === 'string' ? first : first.url
  }

  return (
    <>
      <Helmet><title>Veículos - Admin RR Autos</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Veículos</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>{total} veículos cadastrados</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Novo Veículo
        </button>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h2>Lista de Veículos</h2>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input
              className="admin-form-control"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32, width: 200, padding: '7px 12px 7px 32px', fontSize: '0.82rem' }}
            />
          </div>
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
                  <th style={{ width: 70 }}>Foto</th>
                  <th>Veículo</th>
                  <th style={{ width: 80, whiteSpace: 'nowrap' }}>Ano</th>
                  <th style={{ width: 110, whiteSpace: 'nowrap' }}>KM</th>
                  <th style={{ width: 130, whiteSpace: 'nowrap' }}>Preço</th>
                  <th style={{ width: 110, textAlign: 'center' }}>Status</th>
                  <th style={{ width: 100, textAlign: 'center' }}>Destaque</th>
                  <th style={{ width: 120, textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>
                      Nenhum veículo encontrado
                    </td>
                  </tr>
                ) : filtered.map(v => (
                  <tr key={v.id}>
                    <td>
                      {getFirstImage(v) ? (
                        <img
                          className="admin-table-img"
                          src={getFirstImage(v)}
                          alt={`${v.marca} ${v.modelo}`}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.parentElement?.querySelector('.admin-img-fallback')
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div
                        className="admin-table-img admin-img-fallback"
                        style={{
                          display: getFirstImage(v) ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255,255,255,0.05)',
                          fontSize: '1.2rem'
                        }}
                      >
                        🚗
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'white' }}>{v.marca} {v.modelo}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{v.versao}</div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{v.ano}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatKm(v.km)}</td>
                    <td style={{ color: '#4D8FFF', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatPrice(v.preco)}</td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <span className={getStatusBadge(v.status)}>{v.status}</span>
                    </td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {v.destaque ? (
                        <span style={{ color: '#FBBF24', fontSize: '0.78rem', fontWeight: 700 }}>⭐ Sim</span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>Não</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                        <a href={`/veiculo/${v.id}`} target="_blank" rel="noopener noreferrer" className="table-action-btn view" title="Ver no site">
                          <Eye size={14} />
                        </a>
                        <button className="table-action-btn edit" onClick={() => openEdit(v)} title="Editar">
                          <Pencil size={14} />
                        </button>
                        <button className="table-action-btn delete" onClick={() => setDeleteConfirm(v.id)} title="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vehicle Form Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editingId ? 'Editar Veículo' : 'Novo Veículo'}</h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  {/* Marca */}
                  <div className="form-group">
                    <label className="admin-form-label">Marca *</label>
                    <input className="admin-form-control" required value={form.marca}
                      onChange={e => setForm(f => ({ ...f, marca: e.target.value }))}
                      placeholder="Ex: Honda" list="marcas-list" />
                    <datalist id="marcas-list">
                      {['Chevrolet','Ford','Toyota','Honda','Volkswagen','Hyundai','Jeep','Nissan','Renault','Fiat','Mitsubishi'].map(m => <option key={m} value={m} />)}
                    </datalist>
                  </div>
                  {/* Modelo */}
                  <div className="form-group">
                    <label className="admin-form-label">Modelo *</label>
                    <input className="admin-form-control" required value={form.modelo}
                      onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))}
                      placeholder="Ex: Civic" />
                  </div>
                  {/* Versão */}
                  <div className="form-group">
                    <label className="admin-form-label">Versão</label>
                    <input className="admin-form-control" value={form.versao}
                      onChange={e => setForm(f => ({ ...f, versao: e.target.value }))}
                      placeholder="Ex: EXL 2.0 16v" />
                  </div>
                  {/* Ano */}
                  <div className="form-group">
                    <label className="admin-form-label">Ano *</label>
                    <input className="admin-form-control" type="number" required value={form.ano}
                      onChange={e => setForm(f => ({ ...f, ano: e.target.value }))}
                      min="1990" max={new Date().getFullYear() + 1} />
                  </div>
                  {/* KM */}
                  <div className="form-group">
                    <label className="admin-form-label">Quilometragem</label>
                    <input className="admin-form-control" type="number" value={form.km}
                      onChange={e => setForm(f => ({ ...f, km: e.target.value }))}
                      placeholder="0" />
                  </div>
                  {/* Cor */}
                  <div className="form-group">
                    <label className="admin-form-label">Cor</label>
                    <input className="admin-form-control" value={form.cor}
                      onChange={e => setForm(f => ({ ...f, cor: e.target.value }))}
                      placeholder="Ex: Prata" />
                  </div>
                  {/* Combustível */}
                  <div className="form-group">
                    <label className="admin-form-label">Combustível</label>
                    <select className="admin-form-control" value={form.combustivel}
                      onChange={e => setForm(f => ({ ...f, combustivel: e.target.value }))}>
                      <option value="">Selecione</option>
                      {COMBUSTIVEIS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Câmbio */}
                  <div className="form-group">
                    <label className="admin-form-label">Câmbio</label>
                    <select className="admin-form-control" value={form.cambio}
                      onChange={e => setForm(f => ({ ...f, cambio: e.target.value }))}>
                      <option value="">Selecione</option>
                      {CAMBIOS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Motor */}
                  <div className="form-group">
                    <label className="admin-form-label">Motor</label>
                    <input className="admin-form-control" value={form.motor}
                      onChange={e => setForm(f => ({ ...f, motor: e.target.value }))}
                      placeholder="Ex: 2.0 16V" />
                  </div>
                  {/* Preço */}
                  <div className="form-group">
                    <label className="admin-form-label">Preço (R$)</label>
                    <input className="admin-form-control" type="number" value={form.preco}
                      onChange={e => setForm(f => ({ ...f, preco: e.target.value }))}
                      placeholder="0.00" step="0.01" />
                  </div>
                  {/* Status */}
                  <div className="form-group">
                    <label className="admin-form-label">Status</label>
                    <select className="admin-form-control" value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {/* Destaque */}
                  <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                    <label className="admin-form-label" style={{ marginBottom: 8 }}>Destaque na Home?</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.destaque}
                        onChange={e => setForm(f => ({ ...f, destaque: e.target.checked }))}
                        style={{ width: 18, height: 18, accentColor: 'var(--primary-light)' }}
                      />
                      <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>Exibir em destaque</span>
                    </label>
                  </div>
                  {/* Descrição */}
                  <div className="form-group admin-form-full">
                    <label className="admin-form-label">Descrição</label>
                    <textarea className="admin-form-control" rows={3} value={form.descricao}
                      onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                      placeholder="Descrição detalhada do veículo..." />
                  </div>
                  {/* Observações */}
                  <div className="form-group admin-form-full">
                    <label className="admin-form-label">Observações</label>
                    <textarea className="admin-form-control" rows={2} value={form.observacoes}
                      onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                      placeholder="Observações adicionais..." />
                  </div>
                  {/* YouTube */}
                  <div className="form-group admin-form-full">
                    <label className="admin-form-label">URL do Vídeo (YouTube)</label>
                    <input className="admin-form-control" type="url" value={form.video_url}
                      onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..." />
                  </div>

                  {/* Image Upload */}
                  <div className="form-group admin-form-full">
                    <label className="admin-form-label">Fotos (até 30 imagens · máx 10MB cada)</label>
                    <div
                      className="upload-zone"
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleImageDrop}
                      onClick={() => document.getElementById('img-upload').click()}
                    >
                      <div className="upload-zone-icon"><Upload size={28} /></div>
                      <p>Arraste fotos aqui ou <strong>clique para selecionar</strong></p>
                      <p style={{ fontSize: '0.75rem', marginTop: 4 }}>JPG, PNG, WebP · Até 10MB cada</p>
                      <input
                        id="img-upload"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleImageDrop}
                      />
                    </div>

                    {images.length > 0 && (
                      <div className="upload-preview-grid">
                        {images.map((img, i) => (
                          <div key={i} className="upload-preview-item">
                            <img src={img.preview || img.url} alt={`Preview ${i + 1}`} />
                            <button
                              type="button"
                              className="upload-preview-remove"
                              onClick={() => removeImage(i)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <><span className="spinner spinner-sm" />Salvando...</> : (editingId ? 'Atualizar' : 'Cadastrar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="admin-modal-overlay">
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-xl)', padding: 32, maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
            <h3 style={{ color: 'white', fontWeight: 700, marginBottom: 8 }}>Excluir veículo?</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: 24 }}>Esta ação é irreversível e removerá o veículo e todas as suas fotos.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Sim, excluir</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
