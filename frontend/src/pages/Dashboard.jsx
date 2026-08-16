import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import '../styles/Dashboard.css'

const dataHoje = () => new Date().toISOString().split('T')[0]

const meses = [
  { valor: '01', nome: 'Janeiro' },
  { valor: '02', nome: 'Fevereiro' },
  { valor: '03', nome: 'Março' },
  { valor: '04', nome: 'Abril' },
  { valor: '05', nome: 'Maio' },
  { valor: '06', nome: 'Junho' },
  { valor: '07', nome: 'Julho' },
  { valor: '08', nome: 'Agosto' },
  { valor: '09', nome: 'Setembro' },
  { valor: '10', nome: 'Outubro' },
  { valor: '11', nome: 'Novembro' },
  { valor: '12', nome: 'Dezembro' }
]

const categoriasPreDefinidas = {
  receita: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  despesa: [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Vestuário',
    'Outros'
  ]
}

function criarTransacaoInicial() {
  return {
    descricao: '',
    valor: '',
    tipo: 'despesa',
    categoria: '',
    data: dataHoje(),
    recorrente: false,
    frequencia: 'mensal',
    parcelas: ''
  }
}

function formatarMoeda(valor) {
  return Number(valor || 0).toFixed(2)
}

function formatarData(data) {
  if (!data) return ''

  const [ano, mes, dia] = String(data).slice(0, 10).split('-')

  if (ano && mes && dia) {
    return `${dia}/${mes}/${ano}`
  }

  return new Date(data).toLocaleDateString('pt-BR')
}

function Dashboard() {
  const { user, logout } = useAuth()

  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')
  const [novaTransacao, setNovaTransacao] = useState(criarTransacaoInicial)
  const [categorias, setCategorias] = useState([])
  const [novaCategoria, setNovaCategoria] = useState({
    nome: '',
    tipo: 'despesa'
  })
  const [filtroMes, setFiltroMes] = useState(
    String(new Date().getMonth() + 1).padStart(2, '0')
  )
  const [filtroAno, setFiltroAno] = useState(
    String(new Date().getFullYear())
  )
  const [editandoTransacao, setEditandoTransacao] = useState(null)

  useEffect(() => {
    loadCategorias()
  }, [])

  useEffect(() => {
    if (filtroMes && filtroAno) {
      loadDashboard()
    }
  }, [filtroMes, filtroAno])

  async function loadDashboard() {
    try {
      setErroCarregamento('')

      const response = await api.get('/dashboard', {
        params: {
          mes: filtroMes,
          ano: filtroAno
        }
      })

      setDashboard(response.data)
    } catch (error) {
      const mensagem =
        error.response?.data?.error ||
        'Não foi possível carregar os dados do dashboard.'

      console.error('Erro ao carregar dashboard:', error.response?.data || error.message)
      setErroCarregamento(mensagem)
      setDashboard(null)
    } finally {
      setLoading(false)
    }
  }

  async function loadCategorias() {
    try {
      const response = await api.get('/categorias')
      setCategorias(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error.response?.data || error.message)
      setCategorias([])
    }
  }

  function atualizarNovaTransacao(campo, valor) {
    setNovaTransacao((atual) => ({
      ...atual,
      [campo]: valor
    }))
  }

  function atualizarEdicao(campo, valor) {
    setEditandoTransacao((atual) => ({
      ...atual,
      [campo]: valor
    }))
  }

  async function adicionarTransacao(event) {
    event.preventDefault()

    const valor = Number(novaTransacao.valor)
    const parcelas = novaTransacao.recorrente
      ? Number.parseInt(novaTransacao.parcelas, 10)
      : null

    if (!Number.isFinite(valor) || valor <= 0) {
      alert('Informe um valor maior que zero.')
      return
    }

    if (
      novaTransacao.recorrente &&
      (!Number.isInteger(parcelas) || parcelas < 1)
    ) {
      alert('Informe uma quantidade válida de parcelas.')
      return
    }

    try {
      const response = await api.post('/transacoes', {
        descricao: novaTransacao.descricao.trim(),
        valor,
        tipo: novaTransacao.tipo,
        categoria: novaTransacao.categoria,
        data: novaTransacao.data,
        recorrente: novaTransacao.recorrente,
        frequencia: novaTransacao.recorrente
          ? novaTransacao.frequencia
          : null,
        parcelas
      })

      setNovaTransacao(criarTransacaoInicial())
      await Promise.all([loadDashboard(), loadCategorias()])

      alert(
        response.data?.mensagem ||
          (response.data?.transacoes?.length > 1
            ? `${response.data.transacoes.length} parcelas criadas com sucesso!`
            : 'Transação adicionada com sucesso!')
      )
    } catch (error) {
      alert(
        'Erro ao adicionar transação: ' +
          (error.response?.data?.error || error.message)
      )
    }
  }

  async function atualizarTransacao(event) {
    event.preventDefault()

    if (!editandoTransacao) return

    const valor = Number(editandoTransacao.valor)
    const parcelas = editandoTransacao.recorrente
      ? Number.parseInt(editandoTransacao.parcelas, 10)
      : null

    if (!Number.isFinite(valor) || valor <= 0) {
      alert('Informe um valor maior que zero.')
      return
    }

    if (
      editandoTransacao.recorrente &&
      (!Number.isInteger(parcelas) || parcelas < 1)
    ) {
      alert('Informe uma quantidade válida de parcelas.')
      return
    }

    try {
      await api.put(`/transacoes/${editandoTransacao.id}`, {
        descricao: editandoTransacao.descricao.trim(),
        valor,
        tipo: editandoTransacao.tipo,
        categoria: editandoTransacao.categoria.trim(),
        data: editandoTransacao.data,
        recorrente: editandoTransacao.recorrente,
        frequencia: editandoTransacao.recorrente
          ? editandoTransacao.frequencia
          : null,
        parcelas
      })

      setEditandoTransacao(null)
      await loadDashboard()
      alert('Transação atualizada com sucesso!')
    } catch (error) {
      alert(
        'Erro ao atualizar transação: ' +
          (error.response?.data?.error || error.message)
      )
    }
  }

  async function adicionarCategoria(event) {
    event.preventDefault()

    try {
      await api.post('/categorias', {
        nome: novaCategoria.nome.trim(),
        tipo: novaCategoria.tipo
      })

      setNovaCategoria({ nome: '', tipo: 'despesa' })
      await loadCategorias()
      alert('Categoria adicionada com sucesso!')
    } catch (error) {
      alert(
        'Erro ao adicionar categoria: ' +
          (error.response?.data?.error || error.message)
      )
    }
  }

  async function deletarTransacao(id) {
    const confirmou = window.confirm(
      'Tem certeza que deseja excluir esta transação?'
    )

    if (!confirmou) return

    try {
      await api.delete(`/transacoes/${id}`)
      await loadDashboard()
      alert('Transação excluída com sucesso!')
    } catch (error) {
      alert(
        'Erro ao excluir transação: ' +
          (error.response?.data?.error || error.message)
      )
    }
  }

  async function gerarRelatorioPDF() {
    try {
      const response = await api.get('/relatorio/pdf', {
        params: {
          mes: filtroMes,
          ano: filtroAno
        },
        responseType: 'blob'
      })

      const blob = new Blob([response.data], {
        type: 'application/pdf'
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = `relatorio-${filtroAno}-${filtroMes}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert(
        'Erro ao gerar relatório PDF: ' +
          (error.response?.data?.error || error.message)
      )
    }
  }

  function editarTransacao(transacao) {
    setEditandoTransacao({
      ...transacao,
      valor: String(transacao.valor ?? ''),
      data: String(transacao.data).slice(0, 10),
      recorrente: Boolean(transacao.recorrente),
      frequencia: transacao.frequencia || 'mensal',
      parcelas: transacao.parcelas ? String(transacao.parcelas) : ''
    })
  }

  const categoriasDisponiveis = [
    ...categoriasPreDefinidas[novaTransacao.tipo],
    ...categorias
      .filter((categoria) => categoria.tipo === novaTransacao.tipo)
      .map((categoria) => categoria.nome)
  ]

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>💰 Controle de Contas</h1>

        <div className="user-info">
          <span>Olá, {user?.nome}</span>
          <button onClick={logout} className="btn-logout">
            Sair
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {erroCarregamento && (
          <div className="error-message">
            Erro ao carregar dados: {erroCarregamento}
          </div>
        )}

        <section className="filtros-section">
          <div className="filtros">
            <label htmlFor="filtro-mes">Mês:</label>

            <select
              id="filtro-mes"
              value={filtroMes}
              onChange={(event) => setFiltroMes(event.target.value)}
            >
              {meses.map((mes) => (
                <option key={mes.valor} value={mes.valor}>
                  {mes.nome}
                </option>
              ))}
            </select>

            <label htmlFor="filtro-ano">Ano:</label>

            <select
              id="filtro-ano"
              value={filtroAno}
              onChange={(event) => setFiltroAno(event.target.value)}
            >
              {[2024, 2025, 2026, 2027, 2028].map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
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
            <p className="valor">
              R$ {formatarMoeda(dashboard?.receitas)}
            </p>
          </div>

          <div className="card despesa">
            <h3>Despesas</h3>
            <p className="valor">
              R$ {formatarMoeda(dashboard?.despesas)}
            </p>
          </div>

          <div className="card saldo">
            <h3>Saldo</h3>
            <p className="valor">
              R$ {formatarMoeda(dashboard?.saldo)}
            </p>
          </div>
        </section>

        {dashboard?.grafico && (
          <section className="grafico-section">
            <h2>📊 Receitas vs Despesas</h2>

            <div className="grafico">
              <div className="barra-container">
                <div
                  className="barra receita"
                  style={{
                    width: `${dashboard.grafico.receitasPorcentagem || 0}%`
                  }}
                >
                  R$ {formatarMoeda(dashboard.grafico.receitas)}
                </div>
              </div>

              <div className="barra-container">
                <div
                  className="barra despesa"
                  style={{
                    width: `${dashboard.grafico.despesasPorcentagem || 0}%`
                  }}
                >
                  R$ {formatarMoeda(dashboard.grafico.despesas)}
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
              onChange={(event) =>
                atualizarNovaTransacao('descricao', event.target.value)
              }
              maxLength="100"
              required
            />

            <input
              type="number"
              placeholder="Valor"
              value={novaTransacao.valor}
              onChange={(event) =>
                atualizarNovaTransacao('valor', event.target.value)
              }
              step="0.01"
              min="0.01"
              required
            />

            <input
              type="date"
              value={novaTransacao.data}
              onChange={(event) =>
                atualizarNovaTransacao('data', event.target.value)
              }
              required
            />

            <select
              value={novaTransacao.tipo}
              onChange={(event) => {
                const tipo = event.target.value

                setNovaTransacao((atual) => ({
                  ...atual,
                  tipo,
                  categoria: ''
                }))
              }}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>

            <select
              value={novaTransacao.categoria}
              onChange={(event) =>
                atualizarNovaTransacao('categoria', event.target.value)
              }
              required
            >
              <option value="">Selecione categoria</option>

              {categoriasDisponiveis.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={novaTransacao.recorrente}
                onChange={(event) => {
                  const recorrente = event.target.checked

                  setNovaTransacao((atual) => ({
                    ...atual,
                    recorrente,
                    frequencia: recorrente ? atual.frequencia || 'mensal' : 'mensal',
                    parcelas: recorrente ? atual.parcelas : ''
                  }))
                }}
              />
              Recorrente?
            </label>

            {novaTransacao.recorrente && (
              <>
                <select
                  value={novaTransacao.frequencia}
                  onChange={(event) =>
                    atualizarNovaTransacao('frequencia', event.target.value)
                  }
                >
                  <option value="diaria">Diária</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                </select>

                <input
                  type="number"
                  placeholder="Qtd. parcelas"
                  value={novaTransacao.parcelas}
                  onChange={(event) =>
                    atualizarNovaTransacao('parcelas', event.target.value)
                  }
                  min="1"
                  max="120"
                  required
                />
              </>
            )}

            <button type="submit" className="btn-add">
              Adicionar
            </button>
          </form>
        </section>

        <section className="categoria-section">
          <h2>📁 Nova Categoria</h2>

          <form onSubmit={adicionarCategoria} className="categoria-form">
            <input
              type="text"
              placeholder="Nome da categoria"
              value={novaCategoria.nome}
              onChange={(event) =>
                setNovaCategoria((atual) => ({
                  ...atual,
                  nome: event.target.value
                }))
              }
              maxLength="50"
              required
            />

            <select
              value={novaCategoria.tipo}
              onChange={(event) =>
                setNovaCategoria((atual) => ({
                  ...atual,
                  tipo: event.target.value
                }))
              }
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>

            <button type="submit" className="btn-add">
              Adicionar Categoria
            </button>
          </form>

          {categorias.length > 0 && (
            <div className="categorias-list">
              <h3>Categorias cadastradas:</h3>

              <div className="tags">
                {categorias.map((categoria) => (
                  <span
                    key={categoria.id}
                    className={`tag ${categoria.tipo}`}
                  >
                    {categoria.nome} ({categoria.tipo})
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="transacoes-section">
          <h2>📋 Transações</h2>

          <div className="transacoes-list">
            {!dashboard?.transacoes?.length ? (
              <p className="empty">
                Nenhuma transação cadastrada neste período.
              </p>
            ) : (
              dashboard.transacoes.map((transacao) => (
                <div
                  key={transacao.id}
                  className={`transacao-item ${transacao.tipo}`}
                >
                  <div className="transacao-info">
                    <strong>{transacao.descricao}</strong>

                    <span className="categoria">{transacao.categoria}</span>

                    <span className="data">
                      {formatarData(transacao.data)}

                      {transacao.recorrente && (
                        <span className="recorrente-badge">
                          🔄 {transacao.frequencia}{' '}
                          {transacao.parcelas
                            ? `(${transacao.parcelaAtual || 1}/${transacao.parcelas})`
                            : ''}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="transacao-actions">
                    <div className={`transacao-valor ${transacao.tipo}`}>
                      {transacao.tipo === 'receita' ? '+' : '-'} R${' '}
                      {formatarMoeda(transacao.valor)}
                    </div>

                    <div className="transacao-buttons">
                      <button
                        type="button"
                        onClick={() => editarTransacao(transacao)}
                        className="btn-edit"
                        aria-label="Editar transação"
                        title="Editar transação"
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        onClick={() => deletarTransacao(transacao.id)}
                        className="btn-delete"
                        aria-label="Excluir transação"
                        title="Excluir transação"
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
          <div
            className="modal-overlay"
            onClick={() => setEditandoTransacao(null)}
          >
            <div
              className="modal-content"
              onClick={(event) => event.stopPropagation()}
            >
              <h2>✏️ Editar Transação</h2>

              <form
                onSubmit={atualizarTransacao}
                className="transacao-form modal-form"
              >
                <input
                  type="text"
                  value={editandoTransacao.descricao}
                  onChange={(event) =>
                    atualizarEdicao('descricao', event.target.value)
                  }
                  maxLength="100"
                  required
                />

                <input
                  type="number"
                  value={editandoTransacao.valor}
                  onChange={(event) =>
                    atualizarEdicao('valor', event.target.value)
                  }
                  step="0.01"
                  min="0.01"
                  required
                />

                <input
                  type="date"
                  value={editandoTransacao.data}
                  onChange={(event) =>
                    atualizarEdicao('data', event.target.value)
                  }
                  required
                />

                <select
                  value={editandoTransacao.tipo}
                  onChange={(event) =>
                    atualizarEdicao('tipo', event.target.value)
                  }
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>

                <input
                  type="text"
                  value={editandoTransacao.categoria}
                  onChange={(event) =>
                    atualizarEdicao('categoria', event.target.value)
                  }
                  maxLength="50"
                  required
                />

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={Boolean(editandoTransacao.recorrente)}
                    onChange={(event) => {
                      const recorrente = event.target.checked

                      setEditandoTransacao((atual) => ({
                        ...atual,
                        recorrente,
                        frequencia: recorrente
                          ? atual.frequencia || 'mensal'
                          : 'mensal',
                        parcelas: recorrente ? atual.parcelas : ''
                      }))
                    }}
                  />
                  Recorrente?
                </label>

                {editandoTransacao.recorrente && (
                  <>
                    <select
                      value={editandoTransacao.frequencia || 'mensal'}
                      onChange={(event) =>
                        atualizarEdicao('frequencia', event.target.value)
                      }
                    >
                      <option value="diaria">Diária</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensal">Mensal</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Qtd. parcelas"
                      value={editandoTransacao.parcelas || ''}
                      onChange={(event) =>
                        atualizarEdicao('parcelas', event.target.value)
                      }
                      min="1"
                      max="120"
                      required
                    />
                  </>
                )}

                <div className="modal-buttons">
                  <button
                    type="button"
                    onClick={() => setEditandoTransacao(null)}
                    className="btn-cancel"
                  >
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