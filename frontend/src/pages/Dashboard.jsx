import React, { useState, useEffect } from 'react';
import { obterDashboard } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
      setErro('Erro ao carregar dados do dashboard');
    } finally {
      setCarregando(false);
    }
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (carregando) {
    return <div className="dashboard-container">Carregando...</div>;
  }

  if (erro) {
    return <div className="dashboard-container"><div className="erro">{erro}</div></div>;
  }

  if (!dashboard) {
    return <div className="dashboard-container">Nenhum dado disponível</div>;
  }

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Preparar dados para gráfico de receitas vs despesas
  const dadosReceitasDespesas = [
    { name: 'Receitas', value: dashboard.totalReceitas },
    { name: 'Despesas', value: dashboard.totalDespesas }
  ];

  return (
    <div className="dashboard-container">
      <h1>📊 Dashboard</h1>

      {/* Cards de resumo */}
      <div className="cards-resumo">
        <div className="card receitas">
          <h3>Receitas</h3>
          <p className="valor">{formatarValor(dashboard.totalReceitas)}</p>
        </div>

        <div className="card despesas">
          <h3>Despesas</h3>
          <p className="valor">{formatarValor(dashboard.totalDespesas)}</p>
        </div>

        <div className={`card saldo ${dashboard.saldo >= 0 ? 'positivo' : 'negativo'}`}>
          <h3>Saldo</h3>
          <p className="valor">{formatarValor(dashboard.saldo)}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="graficos">
        <div className="grafico">
          <h3>Receitas vs Despesas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosReceitasDespesas}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${formatarValor(value)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosReceitasDespesas.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatarValor(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico">
          <h3>Receitas por Categoria</h3>
          {dashboard.receitasPorCategoria && dashboard.receitasPorCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboard.receitasPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => formatarValor(value)} />
                <Bar dataKey="total" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Sem dados de receita</p>
          )}
        </div>

        <div className="grafico">
          <h3>Despesas por Categoria</h3>
          {dashboard.despesasPorCategoria && dashboard.despesasPorCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboard.despesasPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => formatarValor(value)} />
                <Bar dataKey="total" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Sem dados de despesa</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
