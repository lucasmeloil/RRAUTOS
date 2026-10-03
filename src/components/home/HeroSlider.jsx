import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Car, Search,
  ArrowRight, Zap, MessageCircle
} from 'lucide-react'
import { getWhatsAppLink, formatPrice, formatKm, generateVehicleSlug } from '../../utils/formatters'
import { getHeroSlides, DEFAULT_HERO_SLIDES } from '../../lib/api'

export default function HeroSlider() {
  const [slides, setSlides] = useState(DEFAULT_HERO_SLIDES)
  const [current, setCurrent] = useState(0)
  const [busca, setBusca] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const navigate = useNavigate()
  const timerRef = useRef(null)
  const touchStartX = useRef(null)

  useEffect(() => {
    getHeroSlides()
      .then(data => {
        if (data && data.length > 0) {
          setSlides(data)
        }
      })
      .catch(console.error)
  }, [])

  const nextSlide = () => {
    if (!slides.length) return
    setCurrent(prev => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (!slides.length) return
    setCurrent(prev => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (isPaused || !slides.length) return
    // Reduz o tempo de transição: 3.2s no mobile (mais ágil e dinâmico) e 4.5s no desktop
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const intervalTime = isMobile ? 3200 : 4500

    timerRef.current = setInterval(() => {
      nextSlide()
    }, intervalTime)
    return () => clearInterval(timerRef.current)
  }, [current, isPaused, slides.length])

  // Suporte a swipe para mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
    touchStartX.current = null
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (busca.trim()) {
      navigate(`/veiculos?busca=${encodeURIComponent(busca.trim())}`)
    } else {
      navigate('/veiculos')
    }
  }

  const activeSlide = slides[current] || slides[0] || DEFAULT_HERO_SLIDES[0]

  return (
    <section
      className="modern-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide-bg ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero-slide-overlay" />
        </div>
      ))}

      {/* Main Content Container */}
      <div className="container hero-slider-content">
        <div className="hero-slider-header">
          <div className="hero-badge animate-fadeIn">
            <span className="dot" />
            <img src="/logo.png" alt="RR Autos" style={{ height: 18, marginRight: 6, verticalAlign: 'middle' }} />
            <span>Itabaiana – Sergipe</span>
          </div>

          <div className="hero-slide-title-wrapper" key={activeSlide.id}>
            <span className="hero-tag-highlight animate-fadeInUp">
              <Zap size={14} /> {activeSlide.badge}
            </span>
            <h1 className="hero-slide-title animate-fadeInUp">
              {activeSlide.marca} <span>{activeSlide.modelo}</span>
            </h1>
            <p className="hero-slide-subtitle animate-fadeInUp">
              {activeSlide.tagline}
            </p>

            {/* Specs Pills */}
            <div className="hero-slide-specs animate-fadeInUp">
              <div className="spec-pill">
                <span>📅</span> {activeSlide.ano}
              </div>
              <div className="spec-pill">
                <span>📍</span> {activeSlide.km}
              </div>
              <div className="spec-pill">
                <span>⚙️</span> {activeSlide.cambio}
              </div>
              <div className="spec-pill">
                <span>⛽</span> {activeSlide.combustivel}
              </div>
              <div className="spec-pill price-pill">
                {activeSlide.preco}
              </div>
            </div>

            {/* CTAs */}
            <div className="hero-slide-actions animate-fadeInUp">
              <a
                href={getWhatsAppLink(`Olá, vi o ${activeSlide.marca} ${activeSlide.modelo} no site da RR Autos e gostaria de negociar!`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg hero-action-whatsapp"
              >
                <MessageCircle size={20} />
                <span>Negociar no WhatsApp</span>
              </a>
              <Link to="/veiculos" className="btn btn-outline btn-lg hero-action-catalog">
                <span>Ver Todo o Estoque</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Search Floating Bar */}
        <div className="hero-quick-search-box">
          <form onSubmit={handleSearch} className="hero-quick-search-form">
            <div className="search-field-group">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Qual veículo você procura?"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="hero-search-input-field"
              />
            </div>
            <button type="submit" className="hero-search-submit-btn" aria-label="Buscar Veículo">
              <span>Buscar</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Filters */}
          <div className="hero-quick-tags">
            <span className="tags-label">Buscas populares:</span>
            {['Toyota', 'Jeep', 'BMW', 'Honda', 'Chevrolet', 'Volkswagen'].map(marca => (
              <button
                key={marca}
                type="button"
                className="quick-tag-btn"
                onClick={() => navigate(`/veiculos?marca=${marca}`)}
              >
                {marca}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <button
        onClick={prevSlide}
        className="hero-nav-arrow hero-nav-prev"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="hero-nav-arrow hero-nav-next"
        aria-label="Próximo slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Progress Bars / Indicators */}
      <div className="hero-indicators">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            className={`hero-indicator-item ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir para ${s.marca} ${s.modelo}`}
          >
            <div className="indicator-progress" />
            <span className="indicator-label">{s.marca} {s.modelo}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
