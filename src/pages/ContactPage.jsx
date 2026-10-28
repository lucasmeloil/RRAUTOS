import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  MapPin, PhoneCall, MailCheck, Clock4,
  SendHorizontal, MessageCircle, Sparkles,
  ExternalLink, User, Phone, Mail, MessageSquare
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import { createLead } from '../lib/api'
import { getWhatsAppLink, GOOGLE_MAPS_LINK } from '../utils/formatters'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', mensagem: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.telefone.trim()) {
      toast.error('Por favor, informe seu nome e telefone.')
      return
    }

    setSending(true)
    try {
      await createLead(form)
      toast.success('Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve. 🎉')
      setForm({ nome: '', telefone: '', email: '', mensagem: '' })
    } catch {
      toast.error('Erro ao enviar mensagem. Chame-nos diretamente pelo WhatsApp!')
    } finally {
      setSending(false)
    }
  }

  return (
    <Layout>
      <Helmet>
        <title>Fale Conosco - RR Autos | Itabaiana, Sergipe</title>
        <meta
          name="description"
          content="Fale com a RR Autos em Itabaiana/SE. Tire suas dúvidas, simule seu financiamento ou agende uma visita ao nosso showroom."
        />
      </Helmet>

      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-badge">
            <span className="page-hero-badge-dot" />
            <Sparkles size={14} style={{ color: '#38BDF8' }} />
            <span>Canais de Atendimento</span>
          </div>

          <h1 className="page-hero-title">
            Fale Conosco
          </h1>

          <p className="page-hero-desc">
            Estamos prontos para tirar suas dúvidas, simular financiamentos ou avaliar seu seminovo na troca com atendimento ágil e especializado.
          </p>
        </div>
      </div>

      {/* ─── Seção Principal: Contatos & Formulário ──────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)', padding: 'clamp(44px, 6vw, 76px) 0' }}>
        <div className="container">
          <div className="contact-main-grid">
            {/* Canais de Comunicação */}
            <div>
              <span className="badge badge-primary" style={{ marginBottom: 12, display: 'inline-flex' }}>
                Atendimento Direto
              </span>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 6 }}>
                Como Prefere Conversar?
              </h2>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.92rem', marginBottom: 24, lineHeight: 1.6 }}>
                Escolha o canal mais prático para você ou envie sua mensagem no formulário ao lado.
              </p>

              <div className="contact-channels-wrap">
                {/* WhatsApp Card Highlight */}
                <a
                  href={getWhatsAppLink('Olá, vim pelo site da RR Autos e gostaria de tirar uma dúvida!')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-channel-card highlight"
                >
                  <div className="contact-channel-icon-box" style={{ background: '#25D366', color: 'white' }}>
                    <MessageCircle size={24} />
                  </div>
                  <div className="contact-channel-content">
                    <div className="contact-channel-label" style={{ color: '#16A34A' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                      WhatsApp Oficial (Mais Rápido)
                    </div>
                    <div className="contact-channel-value" style={{ color: '#0F172A' }}>(79) 99990-1176</div>
                    <div style={{ fontSize: '0.78rem', color: '#15803D', marginTop: 2 }}>Resposta imediata de nossa equipe</div>
                  </div>
                  <ExternalLink size={16} className="contact-channel-arrow" style={{ color: '#16A34A' }} />
                </a>

                {/* Loja Física e Showroom */}
                <a
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-channel-card"
                >
                  <div className="contact-channel-icon-box" style={{ background: 'rgba(18, 84, 216, 0.1)', color: 'var(--primary)' }}>
                    <MapPin size={22} />
                  </div>
                  <div className="contact-channel-content">
                    <div className="contact-channel-label">Loja Física & Showroom</div>
                    <div className="contact-channel-value" style={{ fontSize: '0.92rem' }}>
                      Av. Manoel Francisco Téles, 236
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 2 }}>Itabaiana - SE • Venha tomar um café conosco</div>
                  </div>
                  <ExternalLink size={16} className="contact-channel-arrow" />
                </a>

                {/* Telefone */}
                <a href="tel:+5579999901176" className="contact-channel-card">
                  <div className="contact-channel-icon-box" style={{ background: 'rgba(30, 94, 255, 0.1)', color: 'var(--primary)' }}>
                    <PhoneCall size={22} />
                  </div>
                  <div className="contact-channel-content">
                    <div className="contact-channel-label">Ligação Telefônica Direta</div>
                    <div className="contact-channel-value">(79) 99990-1176</div>
                  </div>
                  <span className="contact-channel-arrow">→</span>
                </a>

                {/* E-mail */}
                <a href="mailto:contato@rrautos.com.br" className="contact-channel-card">
                  <div className="contact-channel-icon-box" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
                    <MailCheck size={22} />
                  </div>
                  <div className="contact-channel-content">
                    <div className="contact-channel-label">E-mail Corporativo</div>
                    <div className="contact-channel-value">contato@rrautos.com.br</div>
                  </div>
                  <span className="contact-channel-arrow">→</span>
                </a>

                {/* Horário e Endereço */}
                <div className="contact-channel-card" style={{ cursor: 'default' }}>
                  <div className="contact-channel-icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}>
                    <Clock4 size={22} />
                  </div>
                  <div className="contact-channel-content">
                    <div className="contact-channel-label">Horário de Funcionamento</div>
                    <div className="contact-channel-value" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                      Segunda a Sexta: 08h às 18h • Sábado: 08h às 13h
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário de Mensagem */}
            <div className="contact-form-card">
              <div className="contact-form-header">
                <span className="badge badge-accent" style={{ marginBottom: 8, display: 'inline-flex' }}>
                  Atendimento Online
                </span>
                <h3 className="contact-form-title">Envie Sua Mensagem</h3>
                <p className="contact-form-desc">Preencha o formulário abaixo e retornaremos em instantes.</p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Nome Completo *</label>
                  <div className="contact-input-wrap">
                    <User size={18} className="contact-input-icon" />
                    <input
                      className="form-control contact-input-with-icon"
                      required
                      placeholder="Ex: Carlos Eduardo"
                      value={form.nome}
                      onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="contact-inputs-grid">
                  <div className="form-group">
                    <label className="form-label">WhatsApp / Telefone *</label>
                    <div className="contact-input-wrap">
                      <Phone size={18} className="contact-input-icon" />
                      <input
                        className="form-control contact-input-with-icon"
                        required
                        type="tel"
                        placeholder="(79) 99999-9999"
                        value={form.telefone}
                        onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">E-mail (opcional)</label>
                    <div className="contact-input-wrap">
                      <Mail size={18} className="contact-input-icon" />
                      <input
                        className="form-control contact-input-with-icon"
                        type="email"
                        placeholder="seu@email.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mensagem ou Dúvida *</label>
                  <div className="contact-input-wrap">
                    <MessageSquare size={18} className="contact-input-icon" style={{ top: 18, transform: 'none' }} />
                    <textarea
                      className="form-control contact-input-with-icon"
                      required
                      rows={4}
                      placeholder="Conte para nós como podemos te ajudar ou qual carro tem interesse..."
                      value={form.mensagem}
                      onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
                      style={{ paddingTop: 12 }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={sending}
                  style={{ justifyContent: 'center', marginTop: 4, padding: '14px 20px' }}
                >
                  {sending ? (
                    <><span className="spinner spinner-sm" /> Enviando...</>
                  ) : (
                    <><SendHorizontal size={18} /> Enviar Mensagem Agora</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Localização & Mapa ──────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--white)', padding: 'clamp(44px, 6vw, 76px) 0', borderTop: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-primary" style={{ marginBottom: 10, display: 'inline-flex' }}>
              Base Operacional & Entregas
            </span>
            <h2 className="section-title">Nossa Base em Itabaiana, Sergipe</h2>
            <p className="section-subtitle">Atendimento 100% digital com consultoria ágil e entrega segura em domicílio</p>
          </div>

          <div className="contact-map-grid">
            {/* Informações de Localização */}
            <div className="contact-address-card">
              <div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)', marginBottom: 4 }}>Base Operacional RR Autos</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
                      Itabaiana – SE, CEP: 49500-000<br />
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Operação 100% Online & Entregas para Sergipe</span>
                    </p>
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: 6 }}>
                    Como Funciona:
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>
                    Você escolhe e negocia seu veículo 100% pelo site e WhatsApp com laudo cautelar aprovado e recebe diretamente em sua residência com total segurança.
                  </div>
                </div>
              </div>

              <div>
                <a
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MapPin size={16} /> Abrir no Google Maps <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Iframe do Mapa */}
            <div className="contact-map-frame-box">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15600.123456789!2d-37.4263!3d-10.6857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQxJzA4LjUiUyAzN8KwMjUnMzQuNyJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 380, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização RR Autos - Itabaiana, Sergipe"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
