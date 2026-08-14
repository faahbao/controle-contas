import React, { useState, useEffect } from 'react';
import { obterDashboard } from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import '../styles/Dashboard.css';

function Dashboard() {
  const agora = new Date();

  const anoAtual = agora.getFullYear();

  const mesAtualNumero = String(
    agora.getMonth() + 1
  ).padStart(2, '0');

  const [mesSelecionado, setMesSelecionado] = useState(
    `${anoAtual}-${mesAtualNumero}`
  );

  const [dashboard, setDashboard] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // =========================================================
  // MESES DO ANO
  // =========================================================

  const meses = [
    {
      valor: `${anoAtual}-01`,
      nome: 'Janeiro'
    },
    {
      valor: `${anoAtual}-02`,
      nome: 'Fevereiro'
    },
    {
      valor: `${anoAtual}-03`,
      nome: 'Março'
    },
    {
      valor: `${anoAtual}-04`,
      nome: 'Abril'
    },
    {
      valor: `${anoAtual}-05`,
      nome: 'Maio'
    },
    {
      valor: `${anoAtual}-06`,
      nome: 'Junho'
    },
    {
      valor: `${anoAtual}-07`,
      nome: 'Julho'
    },
    {
      valor: `${anoAtual}-08`,
      nome: 'Agosto'
    },
    {
      valor: `${anoAtual}-09`,
      nome: 'Setembro'
    },
    {
      valor: `${anoAtual}-10`,
      nome: 'Outubro'
    },
    {
      valor: `${anoAtual}-11`,
      nome: 'Novembro'
    },
    {
      valor: `${anoAtual}-12`,
      nome: 'Dezembro'
    }
  ];

  // =========================================================
  // CARREGAR DASHBOARD
  // =========================================================

  useEffect(() => {
    carregarDashboard(mesSelecionado);
  }, [mesSelecionado]);

  const carregarDashboard = async (mes = mesSelecionado) => {
    try {
      setCarregando(true);
      setErro(null);

      const response = await obterDashboard({
        mes
      });

      setDashboard(response.data);

    } catch (erro) {

      console.error(
        'Erro ao carregar dashboard:',
        erro
      );

      setErro(
        'Erro ao carregar dados do dashboard.'
      );

    } finally {
      setCarregando(false);
    }
  };

  // =========================================================
  // ALTERAR MÊS
  // =========================================================

  const handleMesChange = (event) => {
    setMesSelecionado(event.target.value);
  };

  // =========================================================
  // CONVERSÃO PARA NÚMERO
  // =========================================================

  const numero = (valor) => {
    const resultado = Number(valor);

    return Number.isFinite(resultado)
      ? resultado
      : 0;
  };

  // =========================================================
  // FORMATAÇÃO DE VALOR
  // =========================================================

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numero(valor));
  };

  // =========================================================
  // MÊS FORMATADO
  // =========================================================

  const obterNomeMes = () => {
    const mes = meses.find(
      item => item.valor === mesSelecionado
    );

    return mes
      ? `${mes.nome} ${anoAtual}`
      : mesSelecionado;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (carregando) {
    return (
      <div className="dashboard-container">

        <div className="dashboard-header">

          <div>
            <h1>📊 Dashboard</h1>

            <p>
              Visão geral das suas receitas e despesas.
            </p>
          </div>

        </div>

        <div className="dashboard-loading">
          Carregando dados de {obterNomeMes()}...
        </div>

      </div>
    );
  }

  // =========================================================
  // ERRO
  // =========================================================

  if (erro) {
    return (
      <div className="dashboard-container">

        <div className="dashboard-header">

          <div>
            <h1>📊 Dashboard</h1>

            <p>
              Visão geral das suas receitas e despesas.
            </p>
          </div>

        </div>

        <div className="erro">
          {erro}
        </div>

        <button
          type="button"
          className="btn-atualizar-dashboard"
          onClick={() =>
            carregarDashboard(mesSelecionado)
          }
        >
          ↻ Tentar novamente
        </button>

      </div>
    );
  }

  // =========================================================
  // SEM DADOS
  // =========================================================

  if (!dashboard) {
    return (
      <div className="dashboard-container">

        <div className="dashboard-vazio">
          Nenhum dado disponível.
        </div>

      </div>
    );
  }

  // =========================================================
  // TOTAIS
  // =========================================================

  const totalReceitas = numero(
    dashboard.totalReceitas
  );

  const totalDespesas = numero(
    dashboard.totalDespesas
  );

  const saldo = numero(
    dashboard.saldo
  );

  // =========================================================
  // CORES DOS GRÁFICOS
  // =========================================================

  const CORES = [
    '#2563eb',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899'
  ];

  // =========================================================
  // RECEITAS X DESPESAS
  // =========================================================

  const dadosReceitasDespesas = [
    {
      name: 'Receitas',
      value: totalReceitas
    },
    {
      name: 'Despesas',
      value: totalDespesas
    }
  ];

  // =========================================================
  // CATEGORIAS
  // =========================================================

  const receitasPorCategoria =
    Array.isArray(
      dashboard.receitasPorCategoria
    )
      ? dashboard.receitasPorCategoria
      : [];

  const despesasPorCategoria =
    Array.isArray(
      dashboard.despesasPorCategoria
    )
      ? dashboard.despesasPorCategoria
      : [];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="dashboard-container">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="dashboard-header">

        <div>

          <h1>
            📊 Dashboard
          </h1>

          <p>
            Visão financeira de {obterNomeMes()}.
          </p>

        </div>

        <button
          type="button"
          className="btn-atualizar-dashboard"
          onClick={() =>
            carregarDashboard(mesSelecionado)
          }
        >
          ↻ Atualizar
        </button>

      </div>

      {/* =====================================================
          SELETOR DE MÊS
      ===================================================== */}

      <div className="dashboard-filtro">

        <div className="dashboard-filtro-conteudo">

          <label htmlFor="mes-dashboard">
            Mês para visualizar
          </label>

          <select
            id="mes-dashboard"
            value={mesSelecionado}
            onChange={handleMesChange}
          >

            {meses.map((mes) => (
              <option
                key={mes.valor}
                value={mes.valor}
              >
                {mes.nome} {anoAtual}
              </option>
            ))}

          </select>

        </div>

        <div className="dashboard-mes-atual">

          <span>
            Visualizando:
          </span>

          <strong>
            {obterNomeMes()}
          </strong>

        </div>

      </div>

      {/* =====================================================
          CARDS DE RESUMO
      ===================================================== */}

      <div className="cards-resumo">

        {/* RECEITAS */}

        <div className="card receitas">

          <div className="card-icone">
            ↑
          </div>

          <div className="card-conteudo">

            <h3>
              Receitas
            </h3>

            <p className="valor">
              {formatarValor(totalReceitas)}
            </p>

          </div>

        </div>

        {/* DESPESAS */}

        <div className="card despesas">

          <div className="card-icone">
            ↓
          </div>

          <div className="card-conteudo">

            <h3>
              Despesas
            </h3>

            <p className="valor">
              {formatarValor(totalDespesas)}
            </p>

          </div>

        </div>

        {/* SALDO */}

        <div
          className={`card saldo ${
            saldo >= 0
              ? 'positivo'
              : 'negativo'
          }`}
        >

          <div className="card-icone">
            {saldo >= 0 ? '✓' : '!'}
          </div>

          <div className="card-conteudo">

            <h3>
              Saldo
            </h3>

            <p className="valor">
              {formatarValor(saldo)}
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          GRÁFICOS
      ===================================================== */}

      <div className="graficos">

        {/* ===================================================
            RECEITAS X DESPESAS
        =================================================== */}

        <div className="grafico">

          <h3>
            Receitas x Despesas
          </h3>

          {totalReceitas === 0 &&
          totalDespesas === 0 ? (

            <div className="grafico-vazio">
              Nenhuma movimentação em {obterNomeMes()}.
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={dadosReceitasDespesas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: ${formatarValor(value)}`
                  }
                  outerRadius={105}
                  dataKey="value"
                >

                  {dadosReceitasDespesas.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          CORES[
                            index %
                            CORES.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  formatter={(value) =>
                    formatarValor(value)
                  }
                />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          )}

        </div>

        {/* ===================================================
            RECEITAS POR CATEGORIA
        =================================================== */}

        <div className="grafico">

          <h3>
            Receitas por categoria
          </h3>

          {receitasPorCategoria.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={receitasPorCategoria}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 80
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="categoria"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    formatarValor(value)
                  }
                />

                <Bar
                  dataKey="total"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div className="grafico-vazio">
              Sem receitas em {obterNomeMes()}.
            </div>

          )}

        </div>

        {/* ===================================================
            DESPESAS POR CATEGORIA
        =================================================== */}

        <div className="grafico">

          <h3>
            Despesas por categoria
          </h3>

          {despesasPorCategoria.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={despesasPorCategoria}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 80
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="categoria"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    formatarValor(value)
                  }
                />

                <Bar
                  dataKey="total"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div className="grafico-vazio">
              Sem despesas em {obterNomeMes()}.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;