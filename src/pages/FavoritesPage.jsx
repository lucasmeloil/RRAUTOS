import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Heart, Car } from 'lucide-react'
import Layout from '../components/layout/Layout'
import VehicleCard from '../components/vehicles/VehicleCard'
import { useFavorites } from '../context/FavoritesContext'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!favorites.length) { setLoading(false); return }
    supabase
      .from('veiculos')
      .select('*, imagens(url, ordem)')
      .in('id', favorites)
      .then(({ data }) => { setVehicles(data || []); setLoading(false) })
  }, [favorites])

  return (
    <Layout>
      <Helmet>
        <title>Meus Favoritos - RR Autos</title>
      </Helmet>
      <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', padding: '100px 0 48px', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800 }}>
            <Heart style={{ display: 'inline', marginRight: 10 }} size={32} fill="white" />
            Meus Favoritos
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>{favorites.length} veículo(s) salvo(s)</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-container"><div className="spinner" /><span>Carregando...</span></div>
          ) : vehicles.length > 0 ? (
            <div className="vehicles-grid">
              {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Heart size={36} /></div>
              <h3>Nenhum favorito ainda</h3>
              <p>Salve veículos que te interessam para comparar depois.</p>
              <Link to="/veiculos" className="btn btn-primary">
                <Car size={16} /> Explorar Veículos
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
