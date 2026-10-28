import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, MessageCircle, ShieldCheck } from 'lucide-react'
import { formatPrice, formatKm, generateVehicleSlug, getWhatsAppLink } from '../../utils/formatters'
import { useFavorites } from '../../context/FavoritesContext'

const getFirstImage = (vehicle) => {
  if (!vehicle.imagens?.length) return null
  const sorted = [...vehicle.imagens].sort((a, b) => a.ordem - b.ordem)
  return sorted[0]?.url
}

export default function VehicleCard({ vehicle, style }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const slug = generateVehicleSlug(vehicle.marca, vehicle.modelo, vehicle.ano)
  const imgUrl = getFirstImage(vehicle)
  const fav = isFavorite(vehicle.id)
  const totalImgs = vehicle.imagens?.length || (imgUrl ? 1 : 0)

  const handleFav = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(vehicle.id)
  }

  const handleWpp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const msg = `Olá! Vi o ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} (${formatPrice(vehicle.preco)}) no catálogo da RR Autos e gostaria de mais informações.`
    window.open(getWhatsAppLink(msg), '_blank', 'noopener,noreferrer')
  }

  return (
    <Link to={`/veiculo/${slug}/${vehicle.id}`} className="vehicle-card" style={style}>
      <div className="vehicle-card-image">
        {imgUrl ? (
          <img
            className="vehicle-card-img"
            src={imgUrl}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            loading="lazy"
          />
        ) : (
          <div className="vehicle-card-placeholder">
            <span>🚗</span>
          </div>
        )}
        <div className="vehicle-card-overlay" />

        {/* Badges superiores */}
        <div className="vehicle-card-badges-top">
          {vehicle.destaque && <span className="vehicle-card-badge">Destaque</span>}
          <span className="vehicle-card-guarantee-badge">
            <ShieldCheck size={12} />
            Laudo Aprovado
          </span>
        </div>

        {/* Contador de fotos estilo app nativo */}
        {totalImgs > 1 && (
          <div className="vehicle-card-img-count">
            📸 {totalImgs} fotos
          </div>
        )}

        <button
          className={`vehicle-card-fav${fav ? ' active' : ''}`}
          onClick={handleFav}
          aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={16} fill={fav ? '#EF4444' : 'transparent'} />
        </button>
      </div>

      <div className="vehicle-card-body">
        <div className="vehicle-card-top-row">
          <span className="vehicle-card-brand">{vehicle.marca}</span>
          <span className="vehicle-card-year-tag">{vehicle.ano}</span>
        </div>

        <h3 className="vehicle-card-name">
          {vehicle.modelo} {vehicle.versao ? `· ${vehicle.versao}` : ''}
        </h3>

        {/* Pílulas de especificações no estilo Mobile Nativo */}
        <div className="vehicle-card-specs">
          <span className="spec-pill-item">
            <span className="spec-icon">📍</span>
            {formatKm(vehicle.km)}
          </span>
          {vehicle.cambio && (
            <span className="spec-pill-item">
              <span className="spec-icon">⚙️</span>
              {vehicle.cambio}
            </span>
          )}
          {vehicle.combustivel && (
            <span className="spec-pill-item">
              <span className="spec-icon">⛽</span>
              {vehicle.combustivel}
            </span>
          )}
        </div>

        <div className="vehicle-card-footer">
          <div className="vehicle-card-price-wrap">
            <div className="vehicle-card-price">{formatPrice(vehicle.preco)}</div>
            <div className="vehicle-card-price-small">100% Online · Com Garantia</div>
          </div>

          <div className="vehicle-card-actions">
            <button
              type="button"
              className="vehicle-card-wpp-btn"
              onClick={handleWpp}
              title="Negociar pelo WhatsApp"
              aria-label="Negociar pelo WhatsApp"
            >
              <MessageCircle size={15} />
              <span className="btn-label-desktop">Negociar</span>
            </button>
            <div className="vehicle-card-cta" aria-hidden="true">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
