import React, { useState } from 'react';
import { exportarCSV } from '../services/api';
import '../styles/Exportar.css';

function Exportar() {
  const [filtros, setFiltros] = useState({
    tipo: '',
    categoria: '',
    data_inicio: '',
    data_fim: '',
    recorrente: ''
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleExportar = async () => {
    try {
      setCarregando(true);
      const filtrosFinal = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== '')
      );

      const response = await exportarCSV(filtrosFinal);
      
      // Criar download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transacoes-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setErro(null);
    } catch (erro) {
      console.error('Erro ao exportar:', erro);
      setErro('Erro ao exportar dados');
    } finally {
      setCarregando(false);
    }
  };

  const handleLimparFiltros = () => {
    setFiltros({
      tipo: '',
      categoria: '',
      data_inicio: '',
      data_fim: '',
      recorrente: ''
    });
  };

  return (
    <div className="exportar-container">
      <h1>📥 Exportar Dados</h1>

      <div className="exportar-card">
        <h2>Exportar em CSV</h2>
        <p>Configure os filtros desejados e exporte suas transações em formato CSV (compatível com Excel e Sheets)</p>

        <div className="filtros-exportar">
          <div className="form-group">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            >
              <option value="">Ambos</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria</label>
            <input
              type="text"
              id="categoria"
              placeholder="Filtrar por categoria (opcional)"
              value={filtros.categoria}
              onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="data_inicio">Data Início</label>
            <input
              type="date"
              id="data_inicio"
              value={filtros.data_inicio}
              onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="data_fim">Data Fim</label>
            <input
              type="date"
              id="data_fim"
              value={filtros.data_fim}
              onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="recorrente">Recorrência</label>
            <select
              id="recorrente"
              value={filtros.recorrente}
              onChange={(e) => setFiltros({ ...filtros, recorrente: e.target.value })}
            >
              <option value="">Ambas</option>
              <option value="true">Apenas recorrentes</option>
              <option value="false">Apenas não recorrentes</option>
            </select>
          </div>
        </div>

        {erro && <div className="erro">{erro}</div>}

        <div className="botoes-exportar">
          <button onClick={handleExportar} className="btn-exportar" disabled={carregando}>
            {carregando ? '⏳ Exportando...' : '📥 Exportar CSV'}
          </button>
          <button onClick={handleLimparFiltros} className="btn-limpar">
            🔄 Limpar Filtros
          </button>
        </div>

        <div className="info-exportar">
          <h3>ℹ️ Informações</h3>
          <ul>
            <li>O arquivo será gerado em formato CSV com as seguintes colunas: ID, Tipo, Categoria, Descrição, Valor, Data, Recorrente, Período, Data de Criação</li>
            <li>Você pode abrir o arquivo no Excel, Google Sheets ou qualquer aplicação que suporte CSV</li>
            <li>O nome do arquivo será: <code>transacoes-[data].csv</code></li>
            <li>Se nenhum filtro for aplicado, todas as transações serão exportadas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Exportar;
