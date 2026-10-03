import React, { useState } from 'react'
import { MessageCircle, X, Send, PhoneCall } from 'lucide-react'
import { getWhatsAppLink, WHATSAPP_NUMBER } from '../../utils/formatters'
import { createLead } from '../../lib/api'
import toast from 'react-hot-toast'

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('Olá! Vi o site da RR Autos e gostaria de mais informações.')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nome.trim() || !telefone.trim()) {
      toast.error('Por favor, informe seu nome e telefone.')
      return
    }

    setSending(true)
    try {
      // Save lead to Supabase
      await createLead({
        nome: nome.trim(),
        telefone: telefone.trim(),
        mensagem: mensagem.trim(),
      })
    } catch (err) {
      console.warn('Erro ao salvar lead:', err)
    } finally {
      setSending(false)
    }

    // Format WhatsApp message with user details
    const fullMsg = `Olá, meu nome é *${nome.trim()}* (${telefone.trim()}).\n\n${mensagem.trim()}`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMsg)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
    toast.success('Iniciando atendimento no WhatsApp!')
  }

  return (
    <>
      {/* Floating Pulsing Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="whatsapp-float"
        aria-label={isOpen ? 'Fechar formulário de WhatsApp' : 'Falar no WhatsApp'}
        title="Falar no WhatsApp"
        type="button"
      >
        {isOpen ? <X size={26} color="white" /> : <MessageCircle size={26} fill="white" />}
      </button>

      {/* Floating Popup Form */}
      {isOpen && (
        <div className="whatsapp-popup animate-fadeInUp">
          <div className="whatsapp-popup-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PhoneCall size={20} color="white" />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                  Atendimento RR Autos
                </h4>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#86EFAC', display: 'inline-block' }} />
                  Online agora em Itabaiana/SE
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="whatsapp-popup-body">
            <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: 12, lineHeight: 1.4 }}>
              Preencha rapidinho para falarmos direto no seu WhatsApp:
            </p>

            <div className="form-group" style={{ marginBottom: 10 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                Seu Nome *
              </label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Ex: João Silva"
                value={nome}
                onChange={e => setNome(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '9px 12px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 10 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                Seu Telefone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                className="form-control"
                placeholder="(79) 99999-9999"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '9px 12px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 4 }}>
                Mensagem
              </label>
              <textarea
                rows={2}
                className="form-control"
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '8px 12px', resize: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn btn-whatsapp"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '11px',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '8px'
              }}
            >
              <Send size={15} />
              {sending ? 'Conectando...' : 'Iniciar Conversa no WhatsApp'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
