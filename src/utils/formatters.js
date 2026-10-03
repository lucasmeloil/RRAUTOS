export const formatPrice = (value) => {
  if (!value && value !== 0) return 'Sob consulta'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatKm = (value) => {
  if (!value && value !== 0) return '-'
  return new Intl.NumberFormat('pt-BR').format(value) + ' km'
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const generateVehicleSlug = (marca, modelo, ano) => {
  return slugify(`${marca} ${modelo} ${ano}`)
}

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

export const WHATSAPP_NUMBER = '5579999999999'
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export const getWhatsAppLink = (message = '') => {
  const defaultMsg = 'Olá, vi um veículo no site da RR Autos e gostaria de mais informações.'
  const encoded = encodeURIComponent(message || defaultMsg)
  return `${WHATSAPP_BASE_URL}?text=${encoded}`
}

export const getVehicleWhatsAppLink = (veiculo) => {
  const msg = `Olá, tenho interesse no ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano} que vi no site da RR Autos! Poderia me dar mais informações?`
  return getWhatsAppLink(msg)
}
