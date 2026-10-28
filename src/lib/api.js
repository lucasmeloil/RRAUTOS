import { supabase } from '../lib/supabase'
import { sanitizeInput } from '../utils/formatters'
import { MOCK_VEHICLES } from '../data/mockVehicles'

// ─── Local in-memory store for fallback leads ───────────────────────────────
let localLeads = [
  {
    id: 'lead-01',
    nome: 'Carlos Alberto Silva',
    telefone: '(79) 99876-5432',
    email: 'carlos.alberto@email.com',
    mensagem: 'Olá, tenho interesse no Toyota Corolla Altis Hybrid. Aceitam Corolla 2018 na troca?',
    veiculo_id: 'c1b48b78-43d9-485e-990a-995c73950e01',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    veiculos: { marca: 'Toyota', modelo: 'Corolla', ano: 2023 }
  }
]

// ─── Vehicles ───────────────────────────────────────────────────────────────

export const getVehicles = async (filters = {}, sort = 'created_at', order = 'desc', page = 1, limit = 12) => {
  try {
    let query = supabase
      .from('veiculos')
      .select(`*, imagens(url, ordem)`, { count: 'exact' })
      .eq('status', 'ativo')

    if (filters.marca) query = query.ilike('marca', `%${sanitizeInput(filters.marca)}%`)
    if (filters.modelo) query = query.ilike('modelo', `%${sanitizeInput(filters.modelo)}%`)
    if (filters.ano) query = query.eq('ano', parseInt(filters.ano))
    if (filters.combustivel) query = query.eq('combustivel', sanitizeInput(filters.combustivel))
    if (filters.cambio) query = query.eq('cambio', sanitizeInput(filters.cambio))
    if (filters.cor) query = query.ilike('cor', `%${sanitizeInput(filters.cor)}%`)
    if (filters.preco_min) query = query.gte('preco', parseFloat(filters.preco_min))
    if (filters.preco_max) query = query.lte('preco', parseFloat(filters.preco_max))
    if (filters.busca) {
      const term = sanitizeInput(filters.busca)
      query = query.or(`marca.ilike.%${term}%,modelo.ilike.%${term}%,versao.ilike.%${term}%`)
    }

    if (sort === 'preco_asc') query = query.order('preco', { ascending: true })
    else if (sort === 'preco_desc') query = query.order('preco', { ascending: false })
    else if (sort === 'ano_desc') query = query.order('ano', { ascending: false })
    else if (sort === 'visualizacoes') query = query.order('visualizacoes', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    if (error) throw error
    if (data && data.length > 0) return { data, count: count || data.length }
    // If empty result from db, return empty or mock if zero total in db
    return { data: data || [], count: count || 0 }
  } catch (err) {
    console.warn('Usando dados locais de veículos como fallback:', err.message)
    // Filter MOCK_VEHICLES
    let filtered = [...MOCK_VEHICLES].filter(v => v.status === 'ativo')
    if (filters.marca) filtered = filtered.filter(v => v.marca.toLowerCase().includes(filters.marca.toLowerCase()))
    if (filters.modelo) filtered = filtered.filter(v => v.modelo.toLowerCase().includes(filters.modelo.toLowerCase()))
    if (filters.ano) filtered = filtered.filter(v => String(v.ano) === String(filters.ano))
    if (filters.combustivel) filtered = filtered.filter(v => v.combustivel === filters.combustivel)
    if (filters.cambio) filtered = filtered.filter(v => v.cambio === filters.cambio)
    if (filters.preco_min) filtered = filtered.filter(v => v.preco >= parseFloat(filters.preco_min))
    if (filters.preco_max) filtered = filtered.filter(v => v.preco <= parseFloat(filters.preco_max))
    if (filters.busca) {
      const b = filters.busca.toLowerCase()
      filtered = filtered.filter(v =>
        v.marca.toLowerCase().includes(b) ||
        v.modelo.toLowerCase().includes(b) ||
        (v.versao && v.versao.toLowerCase().includes(b))
      )
    }

    if (sort === 'preco_asc') filtered.sort((a, b) => a.preco - b.preco)
    else if (sort === 'preco_desc') filtered.sort((a, b) => b.preco - a.preco)
    else if (sort === 'ano_desc') filtered.sort((a, b) => b.ano - a.ano)
    else if (sort === 'visualizacoes') filtered.sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))

    const from = (page - 1) * limit
    const paginated = filtered.slice(from, from + limit)
    return { data: paginated, count: filtered.length }
  }
}

// ─── Hero Slides (Slider Principal) ────────────────────────────────────────

export const DEFAULT_HERO_SLIDES = [
  {
    id: 'c1b48b78-43d9-485e-990a-995c73950e06',
    marca: 'BMW',
    modelo: '320i M Sport',
    ano: 2023,
    versao: '2.0 TwinPower Turbo 184cv',
    preco: 'R$ 289.900',
    tagline: 'O ápice da esportividade e elegância premium',
    badge: 'Destaque Exclusivo',
    km: '16.800 km',
    cambio: 'Automático 8M',
    combustivel: 'Flex',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=85',
    link: '/veiculo/bmw-320i-2023/c1b48b78-43d9-485e-990a-995c73950e06',
    ordem: 0,
    ativo: true,
  },
  {
    id: 'c1b48b78-43d9-485e-990a-995c73950e01',
    marca: 'Toyota',
    modelo: 'Corolla Altis',
    ano: 2023,
    versao: 'Hybrid 1.8 16V Automático',
    preco: 'R$ 159.900',
    tagline: 'Máxima economia, conforto e segurança para você',
    badge: 'Mais Desejado',
    km: '24.500 km',
    cambio: 'CVT',
    combustivel: 'Híbrido',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1920&q=85',
    link: '/veiculo/toyota-corolla-2023/c1b48b78-43d9-485e-990a-995c73950e01',
    ordem: 1,
    ativo: true,
  },
  {
    id: 'c1b48b78-43d9-485e-990a-995c73950e02',
    marca: 'Jeep',
    modelo: 'Compass Limited',
    ano: 2022,
    versao: 'T270 Turbo Flex 185cv',
    preco: 'R$ 148.500',
    tagline: 'O SUV líder em tecnologia, robustez e presença',
    badge: 'Oportunidade',
    km: '38.900 km',
    cambio: 'Automático',
    combustivel: 'Flex',
    image: 'https://images.unsplash.com/photo-1542362567-b07e5359815e?auto=format&fit=crop&w=1920&q=85',
    link: '/veiculo/jeep-compass-2022/c1b48b78-43d9-485e-990a-995c73950e02',
    ordem: 2,
    ativo: true,
  },
  {
    id: 'c1b48b78-43d9-485e-990a-995c73950e03',
    marca: 'Honda',
    modelo: 'Civic Touring',
    ano: 2021,
    versao: '1.5 Turbo 173cv',
    preco: 'R$ 139.900',
    tagline: 'Design esportivo com motorização turbo impecável',
    badge: 'Seleção Premium',
    km: '45.000 km',
    cambio: 'CVT',
    combustivel: 'Gasolina',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1920&q=85',
    link: '/veiculo/honda-civic-2021/c1b48b78-43d9-485e-990a-995c73950e03',
    ordem: 3,
    ativo: true,
  }
]

const getLocalHeroSlides = () => {
  try {
    const raw = localStorage.getItem('rr_autos_hero_slides')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return [...DEFAULT_HERO_SLIDES]
}

const setLocalHeroSlides = (slides) => {
  try {
    localStorage.setItem('rr_autos_hero_slides', JSON.stringify(slides))
  } catch {}
}

export const getHeroSlides = async () => {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true })

    if (error) throw error
    if (data && data.length > 0) {
      setLocalHeroSlides(data)
      return data
    }
  } catch (err) {
    console.warn('Usando hero_slides local/fallback:', err.message)
  }
  return getLocalHeroSlides().filter(s => s.ativo !== false)
}

export const getAllHeroSlidesAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('ordem', { ascending: true })

    if (error) throw error
    if (data && data.length > 0) {
      setLocalHeroSlides(data)
      return data
    }
  } catch (err) {
    console.warn('Carregando hero_slides localmente:', err.message)
  }
  return getLocalHeroSlides()
}

export const createHeroSlide = async (slideData) => {
  const newSlide = {
    ...slideData,
    ativo: slideData.ativo ?? true,
    ordem: slideData.ordem ?? 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .insert([newSlide])
      .select()
      .single()

    if (error) throw error
    if (data) {
      const current = getLocalHeroSlides()
      setLocalHeroSlides([...current, data])
      return data
    }
  } catch (err) {
    console.warn('Erro ao inserir hero_slide no Supabase, salvando localmente:', err.message)
    const localSlide = {
      ...newSlide,
      id: `hero-${Date.now()}`
    }
    const current = getLocalHeroSlides()
    current.push(localSlide)
    setLocalHeroSlides(current)
    return localSlide
  }
}

export const updateHeroSlide = async (id, slideData) => {
  const updatedData = {
    ...slideData,
    updated_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .update(updatedData)
      .eq('id', id)
      .select()

    if (error) throw error
    if (data && data.length > 0) {
      const updated = data[0]
      const current = getLocalHeroSlides().map(s => s.id === id ? updated : s)
      setLocalHeroSlides(current)
      return updated
    }
  } catch (err) {
    console.warn('Erro ao atualizar hero_slide no Supabase, salvando localmente:', err.message)
    const current = getLocalHeroSlides().map(s => s.id === id ? { ...s, ...updatedData } : s)
    setLocalHeroSlides(current)
    return current.find(s => s.id === id)
  }
}

export const deleteHeroSlide = async (id) => {
  try {
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (err) {
    console.warn('Erro ao deletar hero_slide no Supabase:', err.message)
  }
  const current = getLocalHeroSlides().filter(s => s.id !== id)
  setLocalHeroSlides(current)
}

export const uploadHeroImage = async (file) => {
  try {
    return await uploadVehicleImage(file, 'hero-banners')
  } catch (err) {
    console.warn('Falha no upload para o storage Supabase, usando conversão local:', err.message)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}

export const getHeroVehicles = async () => {
  try {
    const { data, error } = await supabase
      .from('veiculos')
      .select(`*, imagens(url, ordem)`)
      .eq('status', 'ativo')
      .eq('destaque_hero', true)
      .order('created_at', { ascending: false })
      .limit(6)
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Erro ao carregar veículos do hero:', err.message)
  }
  return getFeaturedVehicles()
}

export const setVehicleHeroStatus = async (id, destaque_hero) => {
  const { data, error } = await supabase
    .from('veiculos')
    .update({ destaque_hero })
    .eq('id', id)
    .select()
  if (error) throw error
  return data?.[0] || { id, destaque_hero }
}

export const getFeaturedVehicles = async () => {
  try {
    const { data, error } = await supabase
      .from('veiculos')
      .select(`*, imagens(url, ordem)`)
      .eq('status', 'ativo')
      .eq('destaque', true)
      .order('created_at', { ascending: false })
      .limit(8)
    if (error) throw error
    if (data && data.length > 0) return data
    return MOCK_VEHICLES.filter(v => v.destaque)
  } catch (err) {
    console.warn('Usando destaques locais como fallback:', err.message)
    return MOCK_VEHICLES.filter(v => v.destaque)
  }
}

export const getVehicleById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('veiculos')
      .select(`*, imagens(url, ordem)`)
      .eq('id', id)
      .eq('status', 'ativo')
      .single()
    if (error) throw error
    return data
  } catch {
    const found = MOCK_VEHICLES.find(v => String(v.id) === String(id))
    if (found) return found
    throw new Error('Veículo não encontrado')
  }
}

export const getVehicleBySlug = async (marca, modelo, ano) => {
  try {
    const { data, error } = await supabase
      .from('veiculos')
      .select(`*, imagens(url, ordem)`)
      .ilike('marca', marca.replace(/-/g, ' '))
      .ilike('modelo', modelo.replace(/-/g, ' '))
      .eq('status', 'ativo')
      .limit(5)
    if (error) throw error
    if (data?.length) {
      return data.find(v => String(v.ano) === String(ano)) || data[0]
    }
  } catch {
    // fallback
  }
  const cleanMarca = marca.toLowerCase().replace(/-/g, ' ')
  const cleanModelo = modelo.toLowerCase().replace(/-/g, ' ')
  return MOCK_VEHICLES.find(v =>
    v.marca.toLowerCase().includes(cleanMarca) ||
    v.modelo.toLowerCase().includes(cleanModelo)
  ) || MOCK_VEHICLES[0]
}

export const incrementViews = async (id) => {
  try {
    await supabase.rpc('increment_views', { vehicle_id: id })
  } catch {
    // Ignore if RPC does not exist yet
  }
}

// ─── Admin: Vehicles ─────────────────────────────────────────────────────────

export const getAllVehiclesAdmin = async (page = 1, limit = 20) => {
  try {
    const from = (page - 1) * limit
    const to = from + limit - 1
    const { data, error, count } = await supabase
      .from('veiculos')
      .select(`*, imagens(url, ordem)`, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    if (error) throw error
    return { data: data || [], count: count || 0 }
  } catch {
    return { data: MOCK_VEHICLES, count: MOCK_VEHICLES.length }
  }
}

export const createVehicle = async (vehicleData) => {
  const { imagens, ...cleanData } = vehicleData
  const { data, error } = await supabase
    .from('veiculos')
    .insert([cleanData])
    .select()
  if (error) throw error
  return data?.[0] || cleanData
}

export const updateVehicle = async (id, vehicleData) => {
  const { imagens, ...cleanData } = vehicleData

  // 1. Tenta atualizar pelo ID
  const { data, error } = await supabase
    .from('veiculos')
    .update(cleanData)
    .eq('id', id)
    .select()

  if (error) throw error

  // Se o registro não existia no banco (ex: veículo inicial do mock), grava via upsert
  if (!data || data.length === 0) {
    const { data: upsertData, error: upsertError } = await supabase
      .from('veiculos')
      .upsert({ ...cleanData, id })
      .select()

    if (upsertError) throw upsertError
    return upsertData?.[0] || { id, ...cleanData }
  }

  return data[0]
}

export const deleteVehicle = async (id) => {
  try {
    await supabase.from('imagens').delete().eq('veiculo_id', id)
  } catch (err) {
    console.warn('Erro ao remover imagens vinculadas:', err)
  }
  const { error } = await supabase
    .from('veiculos')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── Images ─────────────────────────────────────────────────────────────────

export const uploadVehicleImage = async (file, vehicleId) => {
  const ext = file.name.split('.').pop().toLowerCase()
  const allowed = ['jpg', 'jpeg', 'png', 'webp']
  if (!allowed.includes(ext)) throw new Error('Formato não permitido. Use JPG, PNG ou WebP.')
  if (file.size > 10 * 1024 * 1024) throw new Error('Arquivo muito grande. Máximo 10MB.')

  const fileName = `${vehicleId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`
  const { error } = await supabase.storage
    .from('veiculo-imagens')
    .upload(fileName, file, { contentType: file.type, upsert: false })
  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('veiculo-imagens')
    .getPublicUrl(fileName)

  return publicUrl
}

export const saveVehicleImages = async (vehicleId, urls) => {
  const images = urls.map((url, index) => ({
    veiculo_id: vehicleId,
    url,
    ordem: index,
  }))
  const { error } = await supabase.from('imagens').insert(images)
  if (error) throw error
}

export const deleteVehicleImages = async (vehicleId) => {
  const { error } = await supabase.from('imagens').delete().eq('veiculo_id', vehicleId)
  if (error) throw error
}

// ─── Contacts / Leads ────────────────────────────────────────────────────────

export const createLead = async (leadData) => {
  try {
    const { error } = await supabase.from('contatos').insert([{
      nome: sanitizeInput(leadData.nome),
      telefone: sanitizeInput(leadData.telefone),
      email: sanitizeInput(leadData.email || ''),
      mensagem: sanitizeInput(leadData.mensagem || ''),
      veiculo_id: leadData.veiculo_id || null,
    }])
    if (error) throw error
  } catch (err) {
    console.warn('Salvando lead localmente como fallback:', err.message)
    localLeads.unshift({
      id: `lead-${Date.now()}`,
      nome: sanitizeInput(leadData.nome),
      telefone: sanitizeInput(leadData.telefone),
      email: sanitizeInput(leadData.email || ''),
      mensagem: sanitizeInput(leadData.mensagem || ''),
      veiculo_id: leadData.veiculo_id || null,
      created_at: new Date().toISOString(),
      veiculos: null,
    })
  }
}

export const getLeads = async (page = 1, limit = 20) => {
  try {
    const from = (page - 1) * limit
    const to = from + limit - 1
    const { data, error, count } = await supabase
      .from('contatos')
      .select(`*, veiculos(marca, modelo, ano)`, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
    if (error) throw error
    return { data: data || [], count: count || 0 }
  } catch {
    return { data: localLeads, count: localLeads.length }
  }
}

export const updateLead = async (id, leadData) => {
  const { data, error } = await supabase
    .from('contatos')
    .update(leadData)
    .eq('id', id)
    .select()
  if (error) throw error
  return data?.[0] || leadData
}

export const deleteLead = async (id) => {
  const { error } = await supabase.from('contatos').delete().eq('id', id)
  if (error) throw error
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export const getDashboardStats = async () => {
  try {
    const [totalResult, ativoResult, vendidoResult, leadsResult, viewsResult] = await Promise.all([
      supabase.from('veiculos').select('id', { count: 'exact', head: true }),
      supabase.from('veiculos').select('id', { count: 'exact', head: true }).eq('status', 'ativo'),
      supabase.from('veiculos').select('id', { count: 'exact', head: true }).eq('status', 'vendido'),
      supabase.from('contatos').select('id', { count: 'exact', head: true }),
      supabase.from('veiculos').select('visualizacoes').eq('status', 'ativo'),
    ])
    const totalViews = viewsResult.data?.reduce((sum, v) => sum + (v.visualizacoes || 0), 0) || 0
    return {
      total: totalResult.count || 0,
      ativos: ativoResult.count || 0,
      vendidos: vendidoResult.count || 0,
      leads: leadsResult.count || 0,
      visualizacoes: totalViews,
    }
  } catch {
    return {
      total: MOCK_VEHICLES.length,
      ativos: MOCK_VEHICLES.filter(v => v.status === 'ativo').length,
      vendidos: 0,
      leads: localLeads.length,
      visualizacoes: MOCK_VEHICLES.reduce((acc, v) => acc + (v.visualizacoes || 0), 0),
    }
  }
}
