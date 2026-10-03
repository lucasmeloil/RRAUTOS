import React from 'react'
import { Link } from 'react-router-dom'
import { Car, MapPin, Phone, Mail } from 'lucide-react'

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

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" style={{ display: 'inline-block', marginBottom: 16 }}>
              <img
                src="/logo.png"
                alt="RR Autos"
                style={{
                  height: 48,
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Link>
            <p>
              Sua loja de seminovos 100% online em Sergipe.
              Veículos revisados com laudo cautelar aprovado, financiamento facilitado e entrega garantida na sua porta.
            </p>
            <div className="social-links">
              <a href="https://instagram.com/rrautos" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <InstagramIcon size={16} />
              </a>
              <a href="https://facebook.com/rrautos" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
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
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Serviços</h4>
            <ul>
              <li><Link to="/veiculos">Comprar Online</Link></li>
              <li><Link to="/contato">Financiamento</Link></li>
              <li><Link to="/contato">Avaliação na Troca</Link></li>
              <li><Link to="/contato">Entrega em Domicílio</Link></li>
              <li><Link to="/contato">Garantia & Laudo</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Atendimento</h4>
            <ul>
              <li>
                <div className="footer-contact-item">
                  <MapPin size={15} />
                  <span>Itabaiana, Sergipe • Atendimento 100% Online</span>
                </div>
              </li>
              <li>
                <a href="tel:+5579999999999" className="footer-contact-item">
                  <Phone size={15} />
                  <span>(79) 99999-9999</span>
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
