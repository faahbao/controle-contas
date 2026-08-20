import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    if (submitting) {
      return
    }

    setError('')
    setSubmitting(true)

    const result = await login(email.trim(), senha)

    setSubmitting(false)

    if (result.success) {
      navigate('/dashboard')
      return
    }

    const message = result.error || 'Erro ao fazer login'

    if (
      message.toLowerCase().includes('email ou senha') ||
      message.toLowerCase().includes('credenciais')
    ) {
      setError('Email ou senha incorretos.')
      return
    }

    setError(message)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
              disabled={submitting}
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="******"
              autoComplete="current-password"
              required
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-link">
          Nao tem conta? <Link to="/register">Registrar-se</Link>
        </p>
      </div>
    </div>
  )
}

export default Login