import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  Sparkles, ShieldCheck, Award, Trophy, Target,
  Compass, HeartHandshake, Car, CheckCircle2,
  FileCheck, Flame, ArrowRight, MessageCircle, Star,
  Smartphone, Video, CreditCard, Truck
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import { getWhatsAppLink } from '../utils/formatters'

export default function AboutPage() {
  return (
    <Layout>
      <Helmet>
        <title>Quem Somos - RR Autos | Loja de Seminovos 100% Online em Sergipe</title>
        <meta
          name="description"
          content="Conheça a RR Autos: compra e venda de veículos seminovos 100% online em Itabaiana e todo Sergipe. Procedência atestada, laudo cautelar e entrega na sua porta."
        />
      </Helmet>

      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-badge">
            <span className="page-hero-badge-dot" />
            <Sparkles size={14} style={{ color: '#38BDF8' }} />
            <span>Nossa Trajetória & Excelência</span>
          </div>

          <h1 className="page-hero-title">
            Quem Somos
          </h1>

          <p className="page-hero-desc">
            Mais de uma década conectando pessoas aos melhores seminovos de Itabaiana e Sergipe, com rigor técnico, procedência e garantia total.
          </p>
        </div>
      </div>

      {/* ─── Nossa História & Modelo 100% Online ─────────────────────────── */}
      <section className="section" style={{ background: 'var(--white)', padding: 'clamp(48px, 6vw, 84px) 0' }}>
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-content">
              <span className="badge badge-accent" style={{ marginBottom: 12, display: 'inline-flex' }}>
                Atendimento 100% Online em Sergipe
              </span>
              <h2>Uma Nova Forma de Comprar Seminovos: Segura, Ágil e 100% Digital</h2>
              <div className="about-divider" />

              <p className="about-story-lead">
                A RR Autos nasceu para revolucionar a forma como você adquire seu próximo veículo, combinando tecnologia de ponta, consultoria humanizada e comodidade absoluta.
              </p>

              <p className="about-story-text">
                Operamos com um modelo <strong>100% online</strong> sediado em Itabaiana/SE, permitindo que você escolha, negocie, simule financiamento e aprove seu cadastro sem sair de casa. Cada veículo do nosso estoque passa por uma rigorosa avaliação mecânica e perícia cautelar completa, garantindo procedência 100% atestada com entrega direta para você.
              </p>

              {/* Stats Cards Grid */}
              <div className="about-stats-grid">
                {[
                  { val: '+10', label: 'Anos de Mercado', icon: Trophy },
                  { val: '100%', label: 'Online & Seguro', icon: Sparkles },
                  { val: '+500', label: 'Carros Entregues', icon: Car },
                  { val: '5.0★', label: 'Avaliação dos Clientes', icon: Award },
                ].map(({ val, label, icon: Icon }) => (
                  <div key={label} className="about-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A4ABF', marginBottom: 6 }}>
                      <Icon size={18} />
                    </div>
                    <div className="about-stat-value">{val}</div>
                    <div className="about-stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Story Image with Floating Badge */}
            <div className="about-image-box">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=85"
                alt="Entrega e compra online RR Autos"
                className="about-image-main"
                loading="eager"
              />
              <div className="about-image-badge">
                <div className="about-image-badge-icon">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="about-image-badge-title">Laudo Cautelar 100% Aprovado</div>
                  <div className="about-image-badge-subtitle">Carros inspecionados com entrega direta</div>
                </div>
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
                color: '#0A4ABF',
                bgGradient: 'linear-gradient(135deg, rgba(10,74,191,0.18), rgba(0,45,122,0.08))',
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
              Explore nosso estoque 100% online ou fale agora com nossos consultores especialistas pelo WhatsApp para tirar dúvidas e simular seu financiamento com total comodidade.
            </p>
            <div className="about-cta-actions">
              <a
                href={getWhatsAppLink('Olá, vim pela página Quem Somos da RR Autos e gostaria de conhecer as opções de veículos disponíveis!')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} /> Falar no WhatsApp
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
