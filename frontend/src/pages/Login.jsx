import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    const result = await login(email, senha)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      // Mensagens de erro mais claras
      if (result.error.includes('Credenciais invalidas')) {
        setError('Email ou senha incorretos')
      } else {
        setError(result.error)
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🔐 Login</h1>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="******"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">Entrar</button>
        </form>
        
        <p className="auth-link">
          Não tem conta? <Link to="/register">Registrar-se</Link>
        </p>
      </div>
    </div>
  )
}

export default Login