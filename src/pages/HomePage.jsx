import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Search, ChevronDown, CheckCircle, Shield, Star,
  Award, Wrench, ThumbsUp, Car, ArrowRight,
  ChevronLeft, ChevronRight, CheckCircle2, MessageCircle
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import VehicleCard from '../components/vehicles/VehicleCard'
import HeroSlider from '../components/home/HeroSlider'
import { getFeaturedVehicles } from '../lib/api'
import { getWhatsAppLink } from '../utils/formatters'

const DIFERENCIAIS = [
  { icon: CheckCircle, title: 'Financiamento Facilitado', desc: 'Parcelas que cabem no seu bolso, aprovação rápida.' },
  { icon: Wrench, title: 'Veículos Revisados', desc: 'Todos os veículos passam por inspeção rigorosa.' },
  { icon: Shield, title: 'Garantia', desc: 'Compramos com segurança e garantia total.' },
  { icon: Star, title: 'Procedência', desc: 'Histórico documentado de cada veículo.' },
  { icon: ThumbsUp, title: 'Atendimento', desc: 'Especialistas prontos para te ajudar.' },
]

const TESTIMONIALS = [
  {
    name: 'João Souza',
    role: 'Comprou um Honda Civic · Itabaiana/SE',
    rating: 5,
    text: 'Atendimento de primeira! Fiz toda a negociação pelo WhatsApp e recebi o carro revisado, higienizado, com laudo cautelar aprovado e garantia. Recomendo a todos!',
  },
  {
    name: 'Maria Santos',
    role: 'Comprou um Toyota Corolla · Aracaju/SE',
    rating: 5,
    text: 'A RR Autos superou todas as minhas expectativas. Processo 100% online, financiamento aprovado em menos de 2 horas e entrega pontual na porta de casa.',
  },
  {
    name: 'Carlos Lima',
    role: 'Comprou um Jeep Compass · Lagarto/SE',
    rating: 5,
    text: 'Melhor loja de seminovos de Sergipe! Profissionais honestos, perícia transparente e veículos de procedência impecável. Já é o segundo negócio que fecho.',
  },
  {
    name: 'Fernanda Oliveira',
    role: 'Comprou um VW Nivus · Itabaiana/SE',
    rating: 5,
    text: 'Enviam vídeo detalhado de cada canto do automóvel antes de fecharmos. O carro chegou igualzinho ao vídeo, impecável e cheirando a novo!',
  },
  {
    name: 'Rafael Costa',
    role: 'Comprou uma Fiat Toro · Estância/SE',
    rating: 5,
    text: 'Avaliaram o meu seminovo na troca com o valor mais justo da região e ainda parcelaram a diferença com taxa baixa. Atendimento nota 10!',
  },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false)
  const navigate = useNavigate()
  const testimonialTimerRef = useRef(null)
  const testimonialTouchStartX = useRef(null)

  useEffect(() => {
    getFeaturedVehicles()
      .then(setFeatured)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Passagem automática de slides da direita para a esquerda a cada 3.8s
  const nextTestimonial = () => {
    setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonial(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  useEffect(() => {
    if (isTestimonialPaused) return
    testimonialTimerRef.current = setInterval(() => {
      nextTestimonial()
    }, 3800)
    return () => clearInterval(testimonialTimerRef.current)
  }, [activeTestimonial, isTestimonialPaused])

  const handleTestimonialTouchStart = (e) => {
    testimonialTouchStartX.current = e.touches[0].clientX
  }

  const handleTestimonialTouchEnd = (e) => {
    if (testimonialTouchStartX.current === null) return
    const diff = testimonialTouchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextTestimonial()
      } else {
        prevTestimonial()
      }
    }
    testimonialTouchStartX.current = null
  }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/veiculos${busca ? `?busca=${encodeURIComponent(busca)}` : ''}`)
  }

  return (
    <Layout>
      <Helmet>
        <title>RR Autos - Veículos Seminovos em Itabaiana, Sergipe</title>
        <meta name="description" content="RR Autos: melhor concessionária de seminovos em Itabaiana-SE. Veículos revisados, financiamento facilitado, garantia e procedência. Compre com segurança!" />
        <meta name="keywords" content="carros Itabaiana, veículos Sergipe, comprar carro Itabaiana, RR Autos, seminovos Itabaiana, concessionária Sergipe" />
      </Helmet>

      {/* ─── Modern Hero Slider ────────────────────────────────────────── */}
      <HeroSlider />

      {/* ─── Diferenciais ────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Por que escolher a RR Autos?</h2>
            <p className="section-subtitle">Referência em qualidade e confiança em toda região</p>
          </div>
          <div className="diferenciais-grid">
            {DIFERENCIAIS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="diferencial-card">
                <div className="diferencial-icon">
                  <Icon size={26} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Veículos em Destaque ────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 className="section-title">Veículos em Destaque</h2>
                <p className="section-subtitle">Selecionados especialmente para você</p>
              </div>
              <Link to="/veiculos" className="btn btn-outline">
                Ver todos <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ width: 56, height: 4, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: 2, marginTop: 14 }} />
          </div>

          {loading ? (
            <div className="vehicles-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card" style={{ overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: 180 }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 16, width: '60%' }} />
                    <div className="skeleton" style={{ height: 20, width: '80%' }} />
                    <div className="skeleton" style={{ height: 14, width: '100%' }} />
                    <div className="skeleton" style={{ height: 28, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="vehicles-grid">
              {featured.map(v => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Car size={36} /></div>
              <h3>Estoque sendo atualizado</h3>
              <p>Novos veículos em breve. Entre em contato para saber disponibilidade.</p>
              <a href={getWhatsAppLink('Olá, gostaria de saber sobre a disponibilidade de veículos na RR Autos!')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                💬 Consultar via WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ─── Depoimentos: Carrossel Automático de 1 Card Único (Tema Claro) ─── */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-primary" style={{ marginBottom: 10, display: 'inline-flex' }}>
              Experiência Comprovada
            </span>
            <h2 className="section-title">O que nossos clientes dizem</h2>
            <p className="section-subtitle">
              Mais de 500 clientes satisfeitos em toda Sergipe com a compra presencial e 100% online
            </p>
          </div>

          <div
            className="testimonial-slider-wrapper"
            onMouseEnter={() => setIsTestimonialPaused(true)}
            onMouseLeave={() => setIsTestimonialPaused(false)}
            onTouchStart={handleTestimonialTouchStart}
            onTouchEnd={handleTestimonialTouchEnd}
          >
            {/* Botão Anterior */}
            <button
              type="button"
              className="testimonial-nav-btn testimonial-nav-prev"
              onClick={prevTestimonial}
              aria-label="Depoimento anterior"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Container do Card Único com Transição */}
            <div className="testimonial-single-track">
              {TESTIMONIALS.map((t, i) => {
                if (i !== activeTestimonial) return null
                return (
                  <div key={i} className="testimonial-single-card">
                    <div className="testimonial-quote-icon">“</div>
                    <div className="testimonial-stars">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} size={18} fill="#F59E0B" stroke="#F59E0B" />
                      ))}
                      <span className="testimonial-verified-badge">
                        <CheckCircle2 size={13} /> Compra Verificada
                      </span>
                    </div>
                    <p className="testimonial-text">"{t.text}"</p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">{t.name[0]}</div>
                      <div>
                        <div className="testimonial-name">{t.name}</div>
                        <div className="testimonial-role">{t.role}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Botão Próximo */}
            <button
              type="button"
              className="testimonial-nav-btn testimonial-nav-next"
              onClick={nextTestimonial}
              aria-label="Próximo depoimento"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Indicadores de Pontos (Dots) */}
          <div className="testimonial-dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`testimonial-dot${i === activeTestimonial ? ' active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`Ir para depoimento ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Final (Tema Claro & Sofisticado) ─────────────────────────── */}
      <section className="section home-cta-section">
        <div className="container">
          <div className="home-cta-card">
            <span className="badge badge-accent" style={{ marginBottom: 12, display: 'inline-flex' }}>
              Atendimento Imediato & Entrega em Sergipe
            </span>
            <h2 className="home-cta-title">
              Pronto para encontrar seu veículo ideal?
            </h2>
            <p className="home-cta-subtitle">
              Explore nosso catálogo online com laudo cautelar aprovado ou venha tomar um café em nosso showroom físico na Av. Manoel Francisco Téles, 236 em Itabaiana.
            </p>
            <div className="home-cta-actions">
              <Link to="/veiculos" className="btn btn-primary btn-lg">
                <Car size={18} />
                Ver Todo o Estoque
              </Link>
              <a
                href={getWhatsAppLink('Olá, vim pela página inicial da RR Autos e gostaria de atendimento!')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} /> Falar no WhatsApp
              </a>
            </div>

            <div className="home-cta-trust-tags">
              <span>🛡️ Procedência Garantida</span>
              <span>📄 Laudo Cautelar 100% Aprovado</span>
              <span>⚡ Financiamento Facilitado</span>
              <span>🚚 Entrega na Sua Porta</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
