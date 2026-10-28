import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdminStatus = useCallback(async (targetUser) => {
    if (!targetUser) return false
    const email = (targetUser.email || '').toLowerCase().trim()

    // Regra prioritária para admin RR Autos (admin principal e contas corporativas)
    if (email === 'admin@rrautos.com.br' || email.endsWith('@rrautos.com.br')) {
      return true
    }

    // Metadados do Supabase Auth (caso configurado via Dashboard Auth)
    if (
      targetUser.app_metadata?.role === 'admin' ||
      targetUser.user_metadata?.role === 'admin' ||
      targetUser.user_metadata?.nivel === 'admin'
    ) {
      return true
    }

    // Consulta à tabela 'usuarios'
    if (targetUser.id) {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('nivel')
          .eq('id', targetUser.id)
          .maybeSingle()
        if (!error && data?.nivel === 'admin') {
          return true
        }
      } catch {
        // Fallback silencioso para RLS ou timeout
      }
    }

    return false
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        const admin = await checkAdminStatus(session.user)
        setIsAdmin(admin)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        const admin = await checkAdminStatus(session.user)
        setIsAdmin(admin)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [checkAdminStatus])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    if (data?.user) {
      setUser(data.user)
      setSession(data.session)
      const admin = await checkAdminStatus(data.user)
      setIsAdmin(admin)

      // Garante sincronização na tabela 'usuarios' se for admin
      if (admin) {
        try {
          await supabase.from('usuarios').upsert({
            id: data.user.id,
            email: data.user.email,
            nivel: 'admin',
            nome: data.user.user_metadata?.nome || 'Administrador RR Autos'
          }, { onConflict: 'id' })
        } catch {
          // Ignora se RLS do banco restringir upsert direto
        }
      }
    }

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
