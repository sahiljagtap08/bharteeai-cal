// frontend/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/router'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUserFromLocalStorage() {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            localStorage.removeItem('token')
          }
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      }
      setLoading(false)
    }
    loadUserFromLocalStorage()
  }, [])

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (response.ok) {
      const { token, user } = await response.json()
      localStorage.setItem('token', token)
      setUser(user)
      router.push('/dashboard')
    } else {
      throw new Error('Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)