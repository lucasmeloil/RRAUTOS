import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BottomNav from './BottomNav'
import WhatsAppFloat from './WhatsAppFloat'
import BackToTop from '../ui/BackToTop'

export default function Layout({ children, hideFooter = false, hasHero = false }) {
  const location = useLocation()
  const isHome = location.pathname === '/' || hasHero

  return (
    <>
      <Header />
      <main className={`page-content${isHome ? ' has-hero' : ''}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      <BottomNav />
      <WhatsAppFloat />
      <BackToTop />
    </>
  )
}
