import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import {
  SlidersHorizontal, X, Car, Search, RotateCcw,
  Sparkles, Check, ChevronDown, Filter
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import VehicleCard from '../components/vehicles/VehicleCard'
import { getVehicles } from '../lib/api'
import { formatPrice } from '../utils/formatters'

const COMBUSTIVEIS = ['Flex', 'Gasolina', 'Diesel', 'Elétrico', 'Híbrido', 'Etanol']
const CAMBIOS = ['Automático', 'Manual', 'CVT']
const MARCAS_POPULARES = ['Toyota', 'Jeep', 'BMW', 'Honda', 'Chevrolet', 'Volkswagen', 'Fiat', 'Hyundai', 'Ford', 'Renault', 'Nissan']
const ANOS = Array.from({ length: 12 }, (_, i) => String(new Date().getFullYear() - i))

const PRICE_PRESETS = [
  { label: 'Até R$ 70 mil', min: '', max: '70000' },
  { label: 'R$ 70k a 120k', min: '70000', max: '120000' },
  { label: 'R$ 120k a 200k', min: '120000', max: '200000' },
  { label: 'Acima de 200k', min: '200000', max: '' },
]

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Mais recentes' },
  { value: 'preco_asc', label: 'Menor preço' },
  { value: 'preco_desc', label: 'Maior preço' },
  { value: 'ano_desc', label: 'Mais novos' },
  { value: 'visualizacoes', label: 'Mais vistos' },
]

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const LIMIT = 12

  const [filters, setFilters] = useState({
    busca: searchParams.get('busca') || '',
    marca: searchParams.get('marca') || '',
    ano: searchParams.get('ano') || '',
    combustivel: searchParams.get('combustivel') || '',
    cambio: searchParams.get('cambio') || '',
    preco_min: searchParams.get('preco_min') || '',
    preco_max: searchParams.get('preco_max') || '',
  })
  const [sort, setSort] = useState('created_at')
  const [buscaInput, setBuscaInput] = useState(filters.busca)

  // Sincroniza parâmetros de URL quando navega de fora (ex: busca rápida no Hero)
  useEffect(() => {
    const qBusca = searchParams.get('busca') || ''
    const qMarca = searchParams.get('marca') || ''
    setFilters(f => ({
      ...f,
      busca: qBusca,
      marca: qMarca,
    }))
    setBuscaInput(qBusca)
  }, [searchParams])

  // Bloqueia rolagem do body quando drawer mobile está aberto
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileFilterOpen])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, count } = await getVehicles(filters, sort, 'desc', page, LIMIT)
      setVehicles(data || [])
      setTotal(count || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters, sort, page])

  useEffect(() => {
    load()
  }, [load])

  const setFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: f[key] === val ? '' : val }))
    setPage(1)
  }

  const handlePricePreset = (min, max) => {
    if (filters.preco_min === min && filters.preco_max === max) {
      setFilters(f => ({ ...f, preco_min: '', preco_max: '' }))
    } else {
      setFilters(f => ({ ...f, preco_min: min, preco_max: max }))
    }
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ busca: '', marca: '', ano: '', combustivel: '', cambio: '', preco_min: '', preco_max: '' })
    setBuscaInput('')
    setPage(1)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setFilters(f => ({ ...f, busca: buscaInput.trim() }))
    setPage(1)
  }

  const clearSearch = () => {
    setBuscaInput('')
    setFilters(f => ({ ...f, busca: '' }))
    setPage(1)
  }

  const totalPages = Math.ceil(total / LIMIT)

  // Conta filtros ativos (exceto busca vazia)
  const activeFilters = Object.entries(filters).filter(([_, v]) => Boolean(v))
  const hasFilters = activeFilters.length > 0

  const FilterSection = ({ title, children }) => (
    <div className="filter-section">
      <div className="filter-section-title">{title}</div>
      {children}
    </div>
  )

  const ToggleFilter = ({ label, filterKey, value }) => (
    <button
      type="button"
      className={`filter-option${filters[filterKey] === value ? ' selected' : ''}`}
      onClick={() => setFilter(filterKey, value)}
    >
      {label}
    </button>
  )

  const FilterFormBody = () => (
    <>
      <FilterSection title="Faixa de Preço">
        <div className="price-preset-grid">
          {PRICE_PRESETS.map((p) => {
            const isSel = filters.preco_min === p.min && filters.preco_max === p.max
            return (
              <button
                key={p.label}
                type="button"
                className={`price-preset-btn${isSel ? ' selected' : ''}`}
                onClick={() => handlePricePreset(p.min, p.max)}
              >
                {p.label}
              </button>
            )
          })}
        </div>
        <div className="price-range-inputs">
          <input
            className="form-control"
            placeholder="Min (R$)"
            type="number"
            value={filters.preco_min}
            onChange={e => { setFilters(f => ({ ...f, preco_min: e.target.value })); setPage(1) }}
            style={{ fontSize: '0.85rem', padding: '9px 12px' }}
          />
          <input
            className="form-control"
            placeholder="Max (R$)"
            type="number"
            value={filters.preco_max}
            onChange={e => { setFilters(f => ({ ...f, preco_max: e.target.value })); setPage(1) }}
            style={{ fontSize: '0.85rem', padding: '9px 12px' }}
          />
        </div>
      </FilterSection>

      <FilterSection title="Marca">
        <div className="filter-grid">
          {MARCAS_POPULARES.map(m => (
            <ToggleFilter key={m} label={m} filterKey="marca" value={m} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Câmbio">
        <div className="filter-grid">
          {CAMBIOS.map(c => (
            <ToggleFilter key={c} label={c} filterKey="cambio" value={c} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Combustível">
        <div className="filter-grid">
          {COMBUSTIVEIS.map(c => (
            <ToggleFilter key={c} label={c} filterKey="combustivel" value={c} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Ano">
        <div className="filter-grid">
          {ANOS.slice(0, 8).map(a => (
            <ToggleFilter key={a} label={a} filterKey="ano" value={a} />
          ))}
        </div>
      </FilterSection>
    </>
  )

  return (
    <Layout>
      <Helmet>
        <title>Catálogo de Veículos - RR Autos | Compra e Venda 100% Online</title>
        <meta
          name="description"
          content="Explore o catálogo completo de seminovos da RR Autos. Veículos revisados com perícia cautelar, laudo aprovado e financiamento online com entrega para Itabaiana e Sergipe."
        />
      </Helmet>

      {/* ─── Header do Catálogo ─────────────────────────────────────────── */}
      <div className="catalog-header">
        <div className="container">
          <div className="catalog-header-badge">
            <Sparkles size={13} />
            Seminovos Selecionados & Revisados
          </div>
          <h1>Catálogo de Veículos</h1>
          <p>{total > 0 ? `${total} veículos disponíveis com laudo cautelar aprovado e garantia` : 'Explore nosso estoque 100% online em Sergipe'}</p>
        </div>
      </div>

      {/* ─── Barra Sticky Estilo App Mobile (Busca + Filtros + Chips Rápidos) ─── */}
      <div className="catalog-pills-wrap">
        <div className="container">
          {/* Controles de Busca e Filtro específicos para Mobile */}
          <div className="catalog-mobile-controls">
            <form onSubmit={handleSearchSubmit} className="catalog-mobile-search-form">
              <Search size={17} className="catalog-mobile-search-icon" />
              <input
                type="text"
                placeholder="Buscar modelo, versão ou marca..."
                value={buscaInput}
                onChange={e => setBuscaInput(e.target.value)}
                className="catalog-mobile-search-input"
              />
              {buscaInput && (
                <button type="button" onClick={clearSearch} className="catalog-mobile-search-clear" aria-label="Limpar busca">
                  <X size={14} />
                </button>
              )}
            </form>
            <button
              type="button"
              className={`catalog-mobile-filter-trigger${hasFilters ? ' has-filters' : ''}`}
              onClick={() => setMobileFilterOpen(true)}
              aria-label="Abrir filtros avançados"
            >
              <SlidersHorizontal size={17} />
              <span className="trigger-label">Filtros</span>
              {activeFilters.length > 0 && (
                <span className="trigger-badge">{activeFilters.length}</span>
              )}
            </button>
          </div>

          {/* Carrossel de Chips Horizontais Touch-Friendly */}
          <div className="catalog-pills-scroll">
            <button
              type="button"
              className={`catalog-pill-btn${!filters.marca && !filters.cambio && !filters.preco_max ? ' active' : ''}`}
              onClick={clearFilters}
            >
              Todos os Veículos
            </button>

            {MARCAS_POPULARES.map(marca => (
              <button
                key={marca}
                type="button"
                className={`catalog-pill-btn${filters.marca === marca ? ' active' : ''}`}
                onClick={() => setFilter('marca', marca)}
              >
                {marca}
              </button>
            ))}

            <button
              type="button"
              className={`catalog-pill-btn${filters.cambio === 'Automático' ? ' active' : ''}`}
              onClick={() => setFilter('cambio', 'Automático')}
            >
              ⚙️ Automático
            </button>

            <button
              type="button"
              className={`catalog-pill-btn${filters.preco_max === '80000' && !filters.preco_min ? ' active' : ''}`}
              onClick={() => handlePricePreset('', '80000')}
            >
              💰 Até R$ 80k
            </button>

            <button
              type="button"
              className={`catalog-pill-btn${filters.preco_max === '130000' && !filters.preco_min ? ' active' : ''}`}
              onClick={() => handlePricePreset('', '130000')}
            >
              💰 Até R$ 130k
            </button>
          </div>
        </div>
      </div>

      <div className="container catalog-layout">
        {/* ─── Painel Desktop de Filtros (Sticky Lateral) ─────────────────── */}
        <aside className="filter-panel">
          <div className="filter-panel-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} />
              Filtros Avançados
            </h3>
            {hasFilters && (
              <button className="filter-clear-btn" onClick={clearFilters}>
                Limpar tudo
              </button>
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="catalog-search-wrap" style={{ marginBottom: 20 }}>
            <Search size={18} className="catalog-search-icon" />
            <input
              type="text"
              placeholder="Buscar modelo, versão..."
              value={buscaInput}
              onChange={e => setBuscaInput(e.target.value)}
              className="catalog-search-input"
            />
            {buscaInput && (
              <button type="button" onClick={clearSearch} className="catalog-search-clear" aria-label="Limpar busca">
                <X size={14} />
              </button>
            )}
          </form>

          <FilterFormBody />
        </aside>

        {/* ─── Conteúdo Principal do Catálogo ─────────────────────────────── */}
        <div className="catalog-main">
          {/* Chips de Filtros Ativos (com remoção individual rápida) */}
          {hasFilters && (
            <div className="catalog-active-chips">
              <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 600 }}>Ativos:</span>
              {filters.busca && (
                <span className="catalog-active-chip">
                  Busca: "{filters.busca}"
                  <button type="button" onClick={clearSearch} className="catalog-active-chip-remove" aria-label="Remover busca">
                    <X size={13} />
                  </button>
                </span>
              )}
              {filters.marca && (
                <span className="catalog-active-chip">
                  {filters.marca}
                  <button type="button" onClick={() => setFilter('marca', filters.marca)} className="catalog-active-chip-remove" aria-label="Remover marca">
                    <X size={13} />
                  </button>
                </span>
              )}
              {filters.cambio && (
                <span className="catalog-active-chip">
                  {filters.cambio}
                  <button type="button" onClick={() => setFilter('cambio', filters.cambio)} className="catalog-active-chip-remove" aria-label="Remover câmbio">
                    <X size={13} />
                  </button>
                </span>
              )}
              {filters.combustivel && (
                <span className="catalog-active-chip">
                  {filters.combustivel}
                  <button type="button" onClick={() => setFilter('combustivel', filters.combustivel)} className="catalog-active-chip-remove" aria-label="Remover combustível">
                    <X size={13} />
                  </button>
                </span>
              )}
              {filters.ano && (
                <span className="catalog-active-chip">
                  Ano: {filters.ano}
                  <button type="button" onClick={() => setFilter('ano', filters.ano)} className="catalog-active-chip-remove" aria-label="Remover ano">
                    <X size={13} />
                  </button>
                </span>
              )}
              {(filters.preco_min || filters.preco_max) && (
                <span className="catalog-active-chip">
                  {filters.preco_min && filters.preco_max
                    ? `R$ ${filters.preco_min} a R$ ${filters.preco_max}`
                    : filters.preco_max
                    ? `Até R$ ${filters.preco_max}`
                    : `A partir de R$ ${filters.preco_min}`}
                  <button type="button" onClick={() => setFilters(f => ({ ...f, preco_min: '', preco_max: '' }))} className="catalog-active-chip-remove" aria-label="Remover faixa de preço">
                    <X size={13} />
                  </button>
                </span>
              )}
              <button type="button" onClick={clearFilters} className="catalog-active-chips-clear">
                Limpar todos
              </button>
            </div>
          )}

          {/* Barra de Contagem e Ordenação */}
          <div className="catalog-toolbar">
            <div className="catalog-count">
              {loading ? (
                'Buscando veículos...'
              ) : (
                <><strong>{total}</strong> veículo{total === 1 ? '' : 's'} encontrado{total === 1 ? '' : 's'}</>
              )}
            </div>
            <div className="catalog-sort">
              <label>Ordenar:</label>
              <select
                className="sort-select"
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1) }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grade de Veículos */}
          {loading ? (
            <div className="vehicles-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card" style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                  <div className="skeleton" style={{ height: 210 }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 14, width: '40%' }} />
                    <div className="skeleton" style={{ height: 20, width: '80%' }} />
                    <div className="skeleton" style={{ height: 14, width: '100%' }} />
                    <div className="skeleton" style={{ height: 32, width: '50%', marginTop: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : vehicles.length > 0 ? (
            <>
              <div className="vehicles-grid">
                {vehicles.map(v => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={page === 1}
                    onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 200, behavior: 'smooth' }) }}
                    aria-label="Página anterior"
                  >
                    ‹
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = i + 1
                    return (
                      <button
                        key={p}
                        className={`pagination-btn${page === p ? ' active' : ''}`}
                        onClick={() => { setPage(p); window.scrollTo({ top: 200, behavior: 'smooth' }) }}
                      >
                        {p}
                      </button>
                    )
                  })}
                  <button
                    className="pagination-btn"
                    disabled={page === totalPages}
                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 200, behavior: 'smooth' }) }}
                    aria-label="Próxima página"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Car size={42} /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Nenhum veículo encontrado</h3>
              <p style={{ maxWidth: 440, margin: '0 auto 20px', color: 'var(--gray-500)' }}>
                Não encontramos automóveis com os critérios selecionados. Tente ajustar os filtros ou consulte nossa equipe online.
              </p>
              {hasFilters && (
                <button type="button" className="btn btn-primary" onClick={clearFilters} style={{ margin: '0 auto' }}>
                  <RotateCcw size={16} /> Limpar Todos os Filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Drawer / Bottom Sheet Modal de Filtros para Mobile ──────────── */}
      <div
        className={`catalog-drawer-overlay${mobileFilterOpen ? ' active' : ''}`}
        onClick={() => setMobileFilterOpen(false)}
      />

      <div className={`catalog-drawer${mobileFilterOpen ? ' active' : ''}`}>
        <div className="catalog-drawer-handle" />
        <div className="catalog-drawer-header">
          <div className="catalog-drawer-title">
            <SlidersHorizontal size={20} style={{ color: 'var(--primary)' }} />
            Filtros
            {activeFilters.length > 0 && (
              <span className="badge badge-primary" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                {activeFilters.length}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                style={{ fontSize: '0.82rem', color: '#EF4444', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Limpar
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--gray-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                color: 'var(--gray-700)',
                cursor: 'pointer'
              }}
              aria-label="Fechar filtros"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="catalog-drawer-body">
          <FilterFormBody />
        </div>

        <div className="catalog-drawer-footer">
          {hasFilters && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={clearFilters}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Limpar
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setMobileFilterOpen(false)}
            style={{ flex: 2, justifyContent: 'center', padding: '14px 20px', fontWeight: 700 }}
          >
            Ver {total} Veículo{total === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
