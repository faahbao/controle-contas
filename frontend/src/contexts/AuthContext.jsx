import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setLoading(false)
  }, [])

  async function login(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha })
      const { user: authenticatedUser, token } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(authenticatedUser))
      setUser(authenticatedUser)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login'
      }
    }
  }

  async function register(nome, email, senha) {
    try {
      const response = await api.post('/auth/cadastro', { nome, email, senha })
      const { user: registeredUser, token } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(registeredUser))
      setUser(registeredUser)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao registrar'
      }
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}