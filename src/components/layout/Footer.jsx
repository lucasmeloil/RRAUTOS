import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { GOOGLE_MAPS_LINK, PHONE_DISPLAY } from '../../utils/formatters'

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const YoutubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
)

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* ─── Contact Highlight Bar ─────────────────────────────────────────── */}
      <div className="footer-contact-bar">
        <div className="container">
          <div className="footer-contact-cards">
            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="footer-contact-card">
              <div className="footer-contact-card-icon">
                <MapPin size={20} />
              </div>
              <div>
                <div className="footer-contact-card-label">Showroom</div>
                <div className="footer-contact-card-value">Av. Manoel Francisco Téles, 236</div>
                <div className="footer-contact-card-sub">Itabaiana - SE</div>
              </div>
            </a>

            <a href="https://wa.me/5579999901176?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20RR%20Autos!" target="_blank" rel="noopener noreferrer" className="footer-contact-card footer-contact-card--whatsapp">
              <div className="footer-contact-card-icon footer-contact-card-icon--whatsapp">
                <WhatsAppIcon size={20} />
              </div>
              <div>
                <div className="footer-contact-card-label">WhatsApp</div>
                <div className="footer-contact-card-value">(79) 99990-1176</div>
                <div className="footer-contact-card-sub">Clique para conversar</div>
              </div>
            </a>

            <a href="https://www.instagram.com/rr.autosita/" target="_blank" rel="noopener noreferrer" className="footer-contact-card">
              <div className="footer-contact-card-icon footer-contact-card-icon--instagram">
                <InstagramIcon size={20} />
              </div>
              <div>
                <div className="footer-contact-card-label">Instagram</div>
                <div className="footer-contact-card-value">@rr.autosita</div>
                <div className="footer-contact-card-sub">Siga-nos</div>
              </div>
            </a>

            <div className="footer-contact-card">
              <div className="footer-contact-card-icon">
                <Clock size={20} />
              </div>
              <div>
                <div className="footer-contact-card-label">Horário</div>
                <div className="footer-contact-card-value">Seg a Sáb: 8h - 18h</div>
                <div className="footer-contact-card-sub">Atendimento online 24h</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Footer Content ────────────────────────────────────────────────── */}
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link
              to="/"
              className="footer-logo-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--brand-navy)',
                padding: '10px 18px',
                borderRadius: '12px',
                marginBottom: 16,
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 4px 14px rgba(0, 26, 77, 0.12)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <img
                src="/logo.png"
                alt="RR Autos"
                style={{
                  height: 38,
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Link>
            <p>
              Sua loja de seminovos com showroom físico em Itabaiana e atendimento 100% online em Sergipe.
              Veículos com laudo cautelar aprovado, financiamento facilitado e entrega na sua porta.
            </p>
            <div className="social-links">
              <a href="https://www.instagram.com/rr.autosseb/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <InstagramIcon size={16} />
              </a>
              <a href="https://www.facebook.com/rrautosita/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <FacebookIcon size={16} />
              </a>
              <a href="https://youtube.com/@rrautos" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                <YoutubeIcon size={16} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/veiculos">Catálogo de Veículos</Link></li>
              <li><Link to="/quem-somos">Quem Somos</Link></li>
              <li><Link to="/favoritos">Meus Favoritos</Link></li>
              <li><Link to="/contato">Contato & Endereço</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Serviços</h4>
            <ul>
              <li><Link to="/veiculos">Estoque Físico & Online</Link></li>
              <li><Link to="/contato">Financiamento Facilitado</Link></li>
              <li><Link to="/contato">Avaliação na Troca</Link></li>
              <li><Link to="/contato">Entrega em Domicílio</Link></li>
              <li><Link to="/contato">Garantia & Laudo Cautelar</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Atendimento</h4>
            <ul>
              <li>
                <div className="footer-contact-item">
                  <MapPin size={15} />
                  <span>Av. Manoel Francisco Téles, 236 • Itabaiana - SE</span>
                </div>
              </li>
              <li>
                <a href="tel:+5579999901176" className="footer-contact-item">
                  <Phone size={15} />
                  <span>(79) 99990-1176</span>
                </a>
              </li>
              <li>
                <a href="mailto:contato@rrautos.com.br" className="footer-contact-item">
                  <Mail size={15} />
                  <span>contato@rrautos.com.br</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} RR Autos. Todos os direitos reservados.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span>
              Desenvolvido por{' '}
              <a
                href="https://www.nexussofttech.com.br"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#38BDF8',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  letterSpacing: '0.02em'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#7DD3FC'}
                onMouseLeave={e => e.currentTarget.style.color = '#38BDF8'}
              >
                NEXUS SOFT TECH
              </a>
            </span>
            <Link to="/admin/login" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textDecoration: 'none' }}>
              Acesso Restrito
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
