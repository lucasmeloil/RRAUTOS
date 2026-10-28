import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  Sparkles, ShieldCheck, Award, Trophy, Target,
  Compass, HeartHandshake, Car, CheckCircle2,
  FileCheck, Flame, ArrowRight, MessageCircle, Star,
  Smartphone, Video, CreditCard, Truck, MapPin,
  Store, PhoneCall, ExternalLink
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import fachadaLojaImg from '../assets/fachada-loja.png'
import {
  getWhatsAppLink,
  STORE_FULL_ADDRESS,
  PHONE_DISPLAY,
  GOOGLE_MAPS_LINK
} from '../utils/formatters'

export default function AboutPage() {
  return (
    <Layout>
      <Helmet>
        <title>Quem Somos - RR Autos | Loja Física e Seminovos Online em Itabaiana/SE</title>
        <meta
          name="description"
          content="Conheça a RR Autos: showroom físico moderno na Av. Manoel Francisco Téles, 236 em Itabaiana/SE e compra de seminovos online com entrega garantida para todo o Sergipe."
        />
      </Helmet>

      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-badge">
            <span className="page-hero-badge-dot" />
            <Sparkles size={14} style={{ color: '#38BDF8' }} />
            <span>Nossa Trajetória & Estrutura</span>
          </div>

          <h1 className="page-hero-title">
            Quem Somos
          </h1>

          <p className="page-hero-desc">
            Showroom físico moderno em Itabaiana e atendimento 100% online com entrega garantida para todo o estado de Sergipe.
          </p>
        </div>
      </div>

      {/* ─── Nossa História & Estrutura Híbrida (Física + Online) ─────────── */}
      <section className="section" style={{ background: 'var(--white)', padding: 'clamp(48px, 6vw, 84px) 0' }}>
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-content">
              <span className="badge badge-accent" style={{ marginBottom: 12, display: 'inline-flex' }}>
                Showroom Físico & Atendimento Online
              </span>
              <h2>A Solidez da Loja Física com a Agilidade do Atendimento Digital</h2>
              <div className="about-divider" />

              <p className="about-story-lead">
                A RR Autos une a credibilidade do showroom presencial com a comodidade da plataforma online, proporcionando uma experiência de compra transparente e sem complicações.
              </p>

              <p className="about-story-text">
                Contamos com sede própria e moderna na <strong>Av. Manoel Francisco Téles, 236</strong> em Itabaiana/SE, onde você pode conferir nossos veículos de perto, fazer um test drive e tomar um café com nossa equipe de consultores. E para quem busca a praticidade de comprar sem sair de casa, oferecemos consultoria online completa via WhatsApp no <strong>{PHONE_DISPLAY}</strong>, com tour em vídeo, laudo cautelar 100% aprovado, simulação de financiamento com os principais bancos e entrega na sua porta.
              </p>

              {/* Stats Cards Grid */}
              <div className="about-stats-grid">
                {[
                  { val: '+10', label: 'Anos no Mercado', icon: Trophy },
                  { val: 'Física & Online', label: 'Showroom & Delivery', icon: Store },
                  { val: '+500', label: 'Carros Entregues', icon: Car },
                  { val: '5.0★', label: 'Avaliação dos Clientes', icon: Award },
                ].map(({ val, label, icon: Icon }) => (
                  <div key={label} className="about-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: 6 }}>
                      <Icon size={18} />
                    </div>
                    <div className="about-stat-value">{val}</div>
                    <div className="about-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Imagem Real da Fachada Limpa */}
            <div className="about-image-box">
              <img
                src={fachadaLojaImg}
                alt="Fachada da loja física e showroom RR Autos - Av. Manoel Francisco Téles, 236, Itabaiana/SE"
                className="about-image-main"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Seção Especial: Presencial ou Online? Você Escolhe! ─────────── */}
      <section className="section" style={{ background: 'var(--bg)', padding: 'clamp(48px, 6vw, 84px) 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-primary" style={{ marginBottom: 10, display: 'inline-flex' }}>
              Duas Formas de Conquistar Seu Carro
            </span>
            <h2 className="section-title">Presencial ou Online: Você Decide Como Comprar</h2>
            <p className="section-subtitle">A mesma segurança, garantia cautelar e compromisso em qualquer canal que preferir</p>
          </div>

          <div className="about-hybrid-grid">
            {/* Card 1: Loja Física */}
            <div className="about-hybrid-card featured">
              <div className="about-hybrid-header">
                <div className="about-hybrid-icon" style={{ background: 'rgba(18, 84, 216, 0.12)', color: 'var(--primary)' }}>
                  <Store size={26} />
                </div>
                <div>
                  <h3 className="about-hybrid-title">Showroom Presencial</h3>
                  <div className="about-hybrid-subtitle">Av. Manoel Francisco Téles, 236 • Itabaiana/SE</div>
                </div>
              </div>

              <div className="about-hybrid-list">
                <div className="about-hybrid-item">
                  <CheckCircle2 size={18} />
                  <span>Espaço moderno, iluminado e climatizado no coração de Itabaiana.</span>
                </div>
                <div className="about-hybrid-item">
                  <CheckCircle2 size={18} />
                  <span>Estoque à pronta entrega disponível para test drive imediato.</span>
                </div>
                <div className="about-hybrid-item">
                  <CheckCircle2 size={18} />
                  <span>Avaliação presencial rápida e justa do seu carro usado na troca.</span>
                </div>
                <div className="about-hybrid-item">
                  <CheckCircle2 size={18} />
                  <span>Atendimento consultivo, transparente e cafezinho especial para você.</span>
                </div>
              </div>

              <div className="about-hybrid-footer">
                <a
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MapPin size={16} /> Ver Rota no Google Maps <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Card 2: Atendimento 100% Online */}
            <div className="about-hybrid-card">
              <div className="about-hybrid-header">
                <div className="about-hybrid-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#059669' }}>
                  <Smartphone size={26} />
                </div>
                <div>
                  <h3 className="about-hybrid-title">Compra & Entrega Online</h3>
                  <div className="about-hybrid-subtitle" style={{ color: '#059669' }}>Atendimento para todo o estado de Sergipe</div>
                </div>
              </div>

              <div className="about-hybrid-list">
                <div className="about-hybrid-item">
                  <CheckCircle2 size={18} />
                  <span>Vídeo tour gravado em alta definição para você ver cada detalhe do carro.</span>
                </div>
                <div className="about-hybrid-item">
                  <CheckCircle2 size={18} />
                  <span>Envio completo do laudo pericial cautelar aprovado pelo WhatsApp.</span>
                </div>
                <div className="about-hybrid-item">
                  <CheckCircle2 size={18} />
                  <span>Aprovação de financiamento bancário 100% remota com as menores taxas.</span>
                </div>
                <div className="about-hybrid-item">
                  <CheckCircle2 size={18} />
                  <span>Entrega segura em domicílio com garantia e documentação pronta.</span>
                </div>
              </div>

              <div className="about-hybrid-footer">
                <a
                  href={getWhatsAppLink(`Olá, vi o site da RR Autos e gostaria de falar com um consultor online!`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MessageCircle size={16} /> Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Como Funciona a Compra 100% Online ─────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)', padding: 'clamp(48px, 6vw, 84px) 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-primary" style={{ marginBottom: 10, display: 'inline-flex' }}>
              Experiência 100% Digital
            </span>
            <h2 className="section-title">Como Funciona a Compra Online?</h2>
            <p className="section-subtitle">Do primeiro clique até a chave na sua mão, sem complicações e com total segurança</p>
          </div>

          <div className="about-steps-grid">
            {[
              {
                step: '01',
                icon: Smartphone,
                title: 'Escolha no Catálogo',
                desc: 'Explore nosso estoque online com fotos detalhadas, histórico de procedência, quilometragem real e ficha técnica completa.',
              },
              {
                step: '02',
                icon: Video,
                title: 'Tour em Vídeo & Laudo',
                desc: 'Nossos consultores gravam vídeos detalhados de cada ângulo do veículo e compartilham o laudo cautelar oficial aprovado.',
              },
              {
                step: '03',
                icon: CreditCard,
                title: 'Aprovação Facilitada',
                desc: 'Simule o financiamento pelo WhatsApp com os melhores bancos ou passe seu seminovo na troca com avaliação justa.',
              },
              {
                step: '04',
                icon: Truck,
                title: 'Entrega na Sua Porta',
                desc: 'Receba seu carro novo revisado, higienizado, com tanque cheio e garantia legal de motor e câmbio onde você estiver.',
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="about-step-card">
                <span className="about-step-number">{step}</span>
                <div className="about-step-icon">
                  <Icon size={26} />
                </div>
                <h3 className="about-step-title">{title}</h3>
                <p className="about-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Missão, Visão e Valores ─────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--white)', padding: 'clamp(48px, 6vw, 84px) 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent" style={{ marginBottom: 10, display: 'inline-flex' }}>
              Nossa Identidade
            </span>
            <h2 className="section-title">Missão, Visão e Valores</h2>
            <p className="section-subtitle">Os princípios inegociáveis que orientam cada negociação</p>
          </div>

          <div className="about-mvv-grid">
            {[
              {
                icon: Compass,
                color: '#4A7DFF',
                bgGradient: 'linear-gradient(135deg, rgba(30,94,255,0.18), rgba(46,45,55,0.08))',
                title: 'Missão',
                text: 'Proporcionar a melhor e mais segura experiência na compra de seminovos online, unindo transparência honesta, atendimento humanizado e condições justas de financiamento.',
              },
              {
                icon: Target,
                color: '#059669',
                bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(5,150,105,0.08))',
                title: 'Visão',
                text: 'Ser a plataforma e loja de seminovos online mais admirada e recomendada de Sergipe, referência absoluta em procedência, segurança na compra digital e inovação no atendimento.',
              },
              {
                icon: HeartHandshake,
                color: '#E11D48',
                bgGradient: 'linear-gradient(135deg, rgba(244,63,94,0.18), rgba(225,29,72,0.08))',
                title: 'Valores',
                text: 'Ética incondicional, respeito ao cliente, paixão por automóveis, procedência checada item a item, pontualidade e o compromisso permanente com a satisfação de quem confia em nós.',
              },
            ].map(({ icon: Icon, color, bgGradient, title, text }) => (
              <div key={title} className="about-mvv-card">
                <div className="about-mvv-icon-box" style={{ background: bgGradient, color }}>
                  <Icon size={32} />
                </div>
                <h3 className="about-mvv-title">{title}</h3>
                <p className="about-mvv-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Nossos Pilares de Confiança ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)', padding: 'clamp(48px, 6vw, 84px) 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-primary" style={{ marginBottom: 10, display: 'inline-flex' }}>
              Diferenciais Exclusivos
            </span>
            <h2 className="section-title">Por Que Comprar na RR Autos?</h2>
            <p className="section-subtitle">Garantia e tranquilidade que só quem é líder na região pode oferecer</p>
          </div>

          <div className="about-pillars-grid">
            {[
              {
                icon: FileCheck,
                title: 'Perícia Cautelar Aprovada',
                desc: 'Histórico completo checado: sem sinistros, leilões ou pendências jurídicas.'
              },
              {
                icon: ShieldCheck,
                title: 'Garantia de Motor e Câmbio',
                desc: 'Todos os veículos contam com garantia legal e suporte dedicado após a entrega.'
              },
              {
                icon: Flame,
                title: 'As Melhores Taxas de Financiamento',
                desc: 'Parceria com os principais bancos para aprovação rápida e parcelas sob medida.'
              },
              {
                icon: CheckCircle2,
                title: 'Troca com Troco & Avaliação Justa',
                desc: 'A melhor avaliação do mercado para o seu seminovo entrar no negócio.'
              }
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="about-pillar-card">
                <div className="about-pillar-icon">
                  <Icon size={24} />
                </div>
                <h4 className="about-pillar-title">{title}</h4>
                <p className="about-pillar-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Call to Action ──────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg)', paddingTop: 0, paddingBottom: 64 }}>
        <div className="container">
          <div className="about-cta-box">
            <h3 className="about-cta-title">
              Pronto Para Conquistar Seu Novo Carro?
            </h3>
            <p className="about-cta-desc">
              Venha tomar um café em nosso showroom na {STORE_FULL_ADDRESS} ou fale agora mesmo com nossa equipe pelo WhatsApp no {PHONE_DISPLAY}.
            </p>
            <div className="about-cta-actions">
              <a
                href={getWhatsAppLink('Olá, vim pela página Quem Somos da RR Autos e gostaria de conhecer as opções de veículos disponíveis!')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} /> Chamar no WhatsApp ({PHONE_DISPLAY})
              </a>
              <Link to="/veiculos" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                Ver Todo o Estoque <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
