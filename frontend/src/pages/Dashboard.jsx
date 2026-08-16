import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import '../styles/Dashboard.css'

function Dashboard() {
  const { user, logout } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [novaTransacao, setNovaTransacao] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa',
    categoria: '',
    data: new Date().toISOString().split('T')[0],
    recorrente: false,
    frequencia: 'mensal',
    parcelas: ''
  })
  const [categorias, setCategorias] = useState([])
  const [novaCategoria, setNovaCategoria] = useState({ nome: '', tipo: 'despesa' })
  const [filtroMes, setFiltroMes] = useState('')
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear().toString())
  const [editandoTransacao, setEditandoTransacao] = useState(null)

  const categoriasPreDefinidas = {
    receita: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
    despesa: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Vestuário', 'Outros']
  }

  useEffect(() => {
    loadDashboard()
    loadCategorias()
    const now = new Date()
    setFiltroMes((now.getMonth() + 1).toString().padStart(2, '0'))
  }, [])

  useEffect(() => {
    if (filtroMes && filtroAno) {
      loadDashboard()
    }
  }, [filtroMes, filtroAno])

  async function loadDashboard() {
    try {
      const params = { mes: filtroMes, ano: filtroAno }
      const response = await api.get('/dashboard', { params })
      console.log('Dashboard:', response.data)
      setDashboard(response.data)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      alert('Erro ao carregar dados: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadCategorias() {
    try {
      const response = await api.get('/categorias')
      setCategorias(response.data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  async function adicionarTransacao(e) {
    e.preventDefault()
    
    try {
      const response = await api.post('/transacoes', {
        descricao: novaTransacao.descricao,
        valor: parseFloat(novaTransacao.valor),
        tipo: novaTransacao.tipo,
        categoria: novaTransacao.categoria,
        data: novaTransacao.data,
        recorrente: novaTransacao.recorrente,
        frequencia: novaTransacao.recorrente ? novaTransacao.frequencia : null,
        parcelas: novaTransacao.recorrente && novaTransacao.parcelas ? parseInt(novaTransacao.parcelas) : null
      })
      
      setNovaTransacao({
        descricao: '',
        valor: '',
        tipo: 'despesa',
        categoria: '',
        data: new Date().toISOString().split('T')[0],
        recorrente: false,
        frequencia: 'mensal',
        parcelas: ''
      })
      loadDashboard()
      loadCategorias()
      
      if (response.data.mensagem) {
        alert(response.data.mensagem)
      } else if (response.data.transacoes && response.data.transacoes.length > 0) {
        alert(`${response.data.transacoes.length} parcelas criadas com sucesso!`)
      } else {
        alert('Transação adicionada com sucesso!')
      }
    } catch (error) {
      alert('Erro ao adicionar transação: ' + (error.response?.data?.error || error.message))
    }
  }

  async function atualizarTransacao(e) {
    e.preventDefault()
    
    try {
      await api.put(`/transacoes/${editandoTransacao.id}`, {
        descricao: editandoTransacao.descricao,
        valor: parseFloat(editandoTransacao.valor),
        tipo: editandoTransacao.tipo,
        categoria: editandoTransacao.categoria,
        data: editandoTransacao.data,
        recorrente: editandoTransacao.recorrente,
        frequencia: editandoTransacao.recorrente ? editandoTransacao.frequencia : null,
        parcelas: editandoTransacao.recorrente && editandoTransacao.parcelas ? parseInt(editandoTransacao.parcelas) : null
      })
      
      setEditandoTransacao(null)
      loadDashboard()
      alert('Transação atualizada com sucesso!')
    } catch (error) {
      alert('Erro ao atualizar transação: ' + (error.response?.data?.error || error.message))
    }
  }

  async function adicionarCategoria(e) {
    e.preventDefault()
    
    try {
      await api.post('/categorias', novaCategoria)
      setNovaCategoria({ nome: '', tipo: 'despesa' })
      loadCategorias()
      alert('Categoria adicionada com sucesso!')
    } catch (error) {
      alert('Erro ao adicionar categoria: ' + (error.response?.data?.error || error.message))
    }
  }

  async function deletarTransacao(id) {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return
    
    try {
      await api.delete(`/transacoes/${id}`)
      loadDashboard()
      alert('Transação excluída com sucesso!')
    } catch (error) {
      alert('Erro ao excluir transação')
    }
  }

  async function gerarRelatorioPDF() {
    try {
      const response = await api.get('/relatorio/pdf', {
        params: { mes: filtroMes, ano: filtroAno },
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `relatorio-${filtroAno}-${filtroMes}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Erro ao gerar relatório PDF')
    }
  }

  function editarTransacao(transacao) {
    setEditandoTransacao({
      ...transacao,
      valor: transacao.valor.toString(),
      data: new Date(transacao.data).toISOString().split('T')[0],
      parcelas: transacao.parcelas ? transacao.parcelas.toString() : ''
    })
  }

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>💰 Controle de Contas</h1>
        <div className="user-info">
          <span>Olá, {user?.nome}</span>
          <button onClick={logout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="filtros-section">
          <div className="filtros">
            <label>Mês:</label>
            <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
            
            <label>Ano:</label>
            <select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)}>
              {[2024, 2025, 2026, 2027, 2028].map(ano => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
            
            <button onClick={gerarRelatorioPDF} className="btn-pdf">
              📄 Gerar PDF
            </button>
          </div>
        </section>

        <section className="cards">
          <div className="card receita">
            <h3>Receitas</h3>
            <p className="valor">R$ {dashboard?.receitas?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="card despesa">
            <h3>Despesas</h3>
            <p className="valor">R$ {dashboard?.despesas?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="card saldo">
            <h3>Saldo</h3>
            <p className="valor">R$ {dashboard?.saldo?.toFixed(2) || '0.00'}</p>
          </div>
        </section>

        {dashboard?.grafico && (
          <section className="grafico-section">
            <h2>📊 Receitas vs Despesas</h2>
            <div className="grafico">
              <div className="barra-container">
                <div className="barra receita" style={{ width: `${dashboard.grafico.receitasPorcentagem}%` }}>
                  R$ {dashboard.grafico.receitas?.toFixed(2)}
                </div>
              </div>
              <div className="barra-container">
                <div className="barra despesa" style={{ width: `${dashboard.grafico.despesasPorcentagem}%` }}>
                  R$ {dashboard.grafico.despesas?.toFixed(2)}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="form-section">
          <h2>➕ Nova Transação</h2>
          <form onSubmit={adicionarTransacao} className="transacao-form">
            <input
              type="text"
              placeholder="Descrição (ex: Salário, Aluguel)"
              value={novaTransacao.descricao}
              onChange={(e) => setNovaTransacao({...novaTransacao, descricao: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Valor"
              value={novaTransacao.valor}
              onChange={(e) => setNovaTransacao({...novaTransacao, valor: e.target.value})}
              step="0.01"
              min="0"
              required
            />
            <input
              type="date"
              value={novaTransacao.data}
              onChange={(e) => setNovaTransacao({...novaTransacao, data: e.target.value})}
              required
            />
            <select
              value={novaTransacao.tipo}
              onChange={(e) => setNovaTransacao({...novaTransacao, tipo: e.target.value})}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
            <select
              value={novaTransacao.categoria}
              onChange={(e) => setNovaTransacao({...novaTransacao, categoria: e.target.value})}
              required
            >
              <option value="">Selecione categoria</option>
              {categoriasPreDefinidas[novaTransacao.tipo].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {categorias.map(cat => (
                <option key={cat.id} value={cat.nome}>{cat.nome}</option>
              ))}
            </select>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={novaTransacao.recorrente}
                onChange={(e) => setNovaTransacao({...novaTransacao, recorrente: e.target.checked})}
              />
              Recorrente?
            </label>
            {novaTransacao.recorrente && (
              <>
                <select
                  value={novaTransacao.frequencia}
                  onChange={(e) => setNovaTransacao({...novaTransacao, frequencia: e.target.value})}
                >
                  <option value="diaria">Diária</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                </select>
                <input
                  type="number"
                  placeholder="Qtd. Parcelas (ex: 12)"
                  value={novaTransacao.parcelas}
                  onChange={(e) => setNovaTransacao({...novaTransacao, parcelas: e.target.value})}
                  min="1"
                  max="120"
                />
              </>
            )}
            <button type="submit" className="btn-add">Adicionar</button>
          </form>
        </section>

        <section className="categoria-section">
          <h2>📁 Nova Categoria</h2>
          <form onSubmit={adicionarCategoria} className="categoria-form">
            <input
              type="text"
              placeholder="Nome da categoria (ex: Alimentação, Transporte)"
              value={novaCategoria.nome}
              onChange={(e) => setNovaCategoria({...novaCategoria, nome: e.target.value})}
              required
            />
            <select
              value={novaCategoria.tipo}
              onChange={(e) => setNovaCategoria({...novaCategoria, tipo: e.target.value})}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
            <button type="submit" className="btn-add">Adicionar Categoria</button>
          </form>
          
          {categorias.length > 0 && (
            <div className="categorias-list">
              <h3>Categorias cadastradas:</h3>
              <div className="tags">
                {categorias.map(cat => (
                  <span key={cat.id} className={`tag ${cat.tipo}`}>
                    {cat.nome} ({cat.tipo})
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="transacoes-section">
          <h2>📋 Transações</h2>
          <div className="transacoes-list">
            {dashboard?.transacoes?.length === 0 ? (
              <p className="empty">Nenhuma transação cadastrada. Adicione uma acima!</p>
            ) : (
              dashboard?.transacoes?.map(transacao => (
                <div key={transacao.id} className={`transacao-item ${transacao.tipo}`}>
                  <div className="transacao-info">
                    <strong>{transacao.descricao}</strong>
                    <span className="categoria">{transacao.categoria}</span>
                    <span className="data">
                      {new Date(transacao.data).toLocaleDateString('pt-BR')}
                      {transacao.recorrente && (
                        <span className="recorrente-badge">
                          🔄 {transacao.frequencia} {transacao.parcelas ? `(${transacao.parcelaAtual}/${transacao.parcelas})` : ''}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="transacao-actions">
                    <div className={`transacao-valor ${transacao.tipo}`}>
                      {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toFixed(2)}
                    </div>
                    <div className="transacao-buttons">
                      <button 
                        onClick={() => editarTransacao(transacao)}
                        className="btn-edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deletarTransacao(transacao.id)}
                        className="btn-delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {editandoTransacao && (
          <div className="modal-overlay" onClick={() => setEditandoTransacao(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>✏️ Editar Transação</h2>
              <form onSubmit={atualizarTransacao} className="transacao-form modal-form">
                <input
                  type="text"
                  value={editandoTransacao.descricao}
                  onChange={(e) => setEditandoTransacao({...editandoTransacao, descricao: e.target.value})}
                  required
                />
                <input
                  type="number"
                  value={editandoTransacao.valor}
                  onChange={(e) => setEditandoTransacao({...editandoTransacao, valor: e.target.value})}
                  step="0.01"
                  min="0"
                  required
                />
                <input
                  type="date"
                  value={editandoTransacao.data}
                  onChange={(e) => setEditandoTransacao({...editandoTransacao, data: e.target.value})}
                  required
                />
                <select
                  value={editandoTransacao.tipo}
                  onChange={(e) => setEditandoTransacao({...editandoTransacao, tipo: e.target.value})}
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
                <input
                  type="text"
                  value={editandoTransacao.categoria}
                  onChange={(e) => setEditandoTransacao({...editandoTransacao, categoria: e.target.value})}
                  required
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editandoTransacao.recorrente || false}
                    onChange={(e) => setEditandoTransacao({...editandoTransacao, recorrente: e.target.checked})}
                  />
                  Recorrente?
                </label>
                {editandoTransacao.recorrente && (
                  <>
                    <select value={editandoTransacao.frequencia || 'mensal'} onChange={(e) => setEditandoTransacao({...editandoTransacao, frequencia: e.target.value})}>
                      <option value="diaria">Diária</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Qtd. Parcelas"
                      value={editandoTransacao.parcelas || ''}
                      onChange={(e) => setEditandoTransacao({...editandoTransacao, parcelas: e.target.value})}
                      min="1"
                      max="120"
                    />
                  </>
                )}
                <div className="modal-buttons">
                  <button type="button" onClick={() => setEditandoTransacao(null)} className="btn-cancel">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard