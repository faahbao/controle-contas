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
  const [dashboard, setDashboard] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      setCarregando(true);

      const response = await obterDashboard();

      setDashboard(response.data);
      setErro(null);
    } catch (erro) {
      console.error('Erro ao carregar dashboard:', erro);

      setErro('Erro ao carregar dados do dashboard.');
    } finally {
      setCarregando(false);
    }
  };

  /**
   * Converte qualquer valor para número.
   */
  const numero = (valor) => {
    const resultado = Number(valor);

    return Number.isFinite(resultado)
      ? resultado
      : 0;
  };

  /**
   * Formata valores em reais.
   */
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numero(valor));
  };

  /**
   * Evita problemas caso o backend retorne
   * valores como strings.
   */
  const totalReceitas = numero(
    dashboard?.totalReceitas
  );

  const totalDespesas = numero(
    dashboard?.totalDespesas
  );

  const saldo = numero(
    dashboard?.saldo
  );

  if (carregando) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          Carregando dashboard...
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="dashboard-container">
        <div className="erro">
          {erro}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-vazio">
          Nenhum dado disponível.
        </div>
      </div>
    );
  }

  const CORES = [
    '#2563eb',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899'
  ];

  /**
   * Dados do gráfico Receita x Despesa.
   */
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

  /**
   * Dados por categoria.
   */
  const receitasPorCategoria =
    Array.isArray(dashboard.receitasPorCategoria)
      ? dashboard.receitasPorCategoria
      : [];

  const despesasPorCategoria =
    Array.isArray(dashboard.despesasPorCategoria)
      ? dashboard.despesasPorCategoria
      : [];

  return (
    <div className="dashboard-container">

      {/* ==================================================
          CABEÇALHO
      ================================================== */}

      <div className="dashboard-header">

        <div>
          <h1>📊 Dashboard</h1>

          <p>
            Visão geral das suas receitas e despesas.
          </p>
        </div>

        <button
          type="button"
          className="btn-atualizar-dashboard"
          onClick={carregarDashboard}
        >
          ↻ Atualizar
        </button>

      </div>

      {/* ==================================================
          CARDS DE RESUMO
      ================================================== */}

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

      {/* ==================================================
          GRÁFICOS
      ================================================== */}

      <div className="graficos">

        {/* ==================================================
            RECEITAS X DESPESAS
        ================================================== */}

        <div className="grafico">

          <h3>
            Receitas x Despesas
          </h3>

          {totalReceitas === 0 &&
          totalDespesas === 0 ? (

            <div className="grafico-vazio">
              Nenhum dado disponível.
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

        {/* ==================================================
            RECEITAS POR CATEGORIA
        ================================================== */}

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
              Sem dados de receita.
            </div>

          )}

        </div>

        {/* ==================================================
            DESPESAS POR CATEGORIA
        ================================================== */}

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
              Sem dados de despesa.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;