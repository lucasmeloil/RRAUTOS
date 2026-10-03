import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart } from 'lucide-react'
import { formatPrice, formatKm, generateVehicleSlug } from '../../utils/formatters'
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

  const handleFav = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(vehicle.id)
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
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gray-300)', fontSize: '3rem',
          }}>🚗</div>
        )}
        <div className="vehicle-card-overlay" />
        {vehicle.destaque && <span className="vehicle-card-badge">Destaque</span>}
        <button
          className={`vehicle-card-fav${fav ? ' active' : ''}`}
          onClick={handleFav}
          aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={16} fill={fav ? '#EF4444' : 'transparent'} />
        </button>
      </div>

      <div className="vehicle-card-body">
        <div className="vehicle-card-brand">{vehicle.marca}</div>
        <div className="vehicle-card-name">
          {vehicle.modelo} {vehicle.versao ? `· ${vehicle.versao}` : ''}
        </div>
        <div className="vehicle-card-specs">
          <span className="spec-item">
            <span>📅</span>
            {vehicle.ano}
          </span>
          <span className="spec-item">
            <span>📍</span>
            {formatKm(vehicle.km)}
          </span>
          {vehicle.combustivel && (
            <span className="spec-item">
              <span>⛽</span>
              {vehicle.combustivel}
            </span>
          )}
          {vehicle.cambio && (
            <span className="spec-item">
              <span>⚙️</span>
              {vehicle.cambio}
            </span>
          )}
        </div>
        <div className="vehicle-card-footer">
          <div>
            <div className="vehicle-card-price">{formatPrice(vehicle.preco)}</div>
            <div className="vehicle-card-price-small">100% Online · Com Garantia</div>
          </div>
          <div className="vehicle-card-cta">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  )
}
