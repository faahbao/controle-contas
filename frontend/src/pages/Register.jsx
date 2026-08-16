import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Auth.css'

function Register() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    
    const result = await register(nome, email, senha)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      // Mensagens de erro mais claras
      if (result.error.includes('Email ja cadastrado')) {
        setError('Este email já está cadastrado. Tente outro email ou faça login.')
      } else if (result.error.includes('Email e senha sao obrigatorios')) {
        setError('Preencha todos os campos obrigatórios')
      } else {
        setError(result.error)
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>📝 Registrar</h1>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>
          
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
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">Registrar</button>
        </form>
        
        <p className="auth-link">
          Já tem conta? <Link to="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register