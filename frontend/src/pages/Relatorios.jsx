import React, { useState } from 'react';
import { listarTransacoes } from '../services/api';
import '../styles/Relatorios.css';

function Relatorios() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [relatorio, setRelatorio] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleGerarRelatorio = async () => {
    try {
      if (!dataInicio || !dataFim) {
        setErro('Selecione data início e fim');
        return;
      }

      setCarregando(true);
      const params = { limit: 1000 };
      if (dataInicio) params.data_inicio = dataInicio;
      if (dataFim) params.data_fim = dataFim;

      const responseReceitas = await listarTransacoes({ ...params, tipo: 'receita' });
      const responseDespesas = await listarTransacoes({ ...params, tipo: 'despesa' });

      const receitas = responseReceitas.data.transacoes || [];
      const despesas = responseDespesas.data.transacoes || [];

      const totalReceitas = receitas.reduce((sum, t) => sum + t.valor, 0);
      const totalDespesas = despesas.reduce((sum, t) => sum + t.valor, 0);
      const saldo = totalReceitas - totalDespesas;

      setRelatorio({
        dataInicio,
        dataFim,
        totalReceitas,
        totalDespesas,
        saldo,
        quantidadeReceitas: receitas.length,
        quantidadeDespesas: despesas.length,
        receitas,
        despesas
      });

      setErro(null);
    } catch (erro) {
      console.error('Erro ao gerar relatório:', erro);
      setErro('Erro ao gerar relatório');
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

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="relatorios-container">
      <h1>📈 Relatórios</h1>

      <div className="filtro-relatorio">
        <div className="form-group">
          <label htmlFor="dataInicio">Data Início</label>
          <input
            type="date"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dataFim">Data Fim</label>
          <input
            type="date"
            id="dataFim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>

        <button onClick={handleGerarRelatorio} className="btn-gerar">
          {carregando ? 'Gerando...' : 'Gerar Relatório'}
        </button>
      </div>

      {erro && <div className="erro">{erro}</div>}

      {relatorio && (
        <div className="relatorio-resultado">
          <h2>Período: {formatarData(relatorio.dataInicio)} a {formatarData(relatorio.dataFim)}</h2>

          <div className="cards-relatorio">
            <div className="card receitas">
              <h3>Total Receitas</h3>
              <p className="valor">{formatarValor(relatorio.totalReceitas)}</p>
              <p className="quantidade">{relatorio.quantidadeReceitas} transações</p>
            </div>

            <div className="card despesas">
              <h3>Total Despesas</h3>
              <p className="valor">{formatarValor(relatorio.totalDespesas)}</p>
              <p className="quantidade">{relatorio.quantidadeDespesas} transações</p>
            </div>

            <div className={`card saldo ${relatorio.saldo >= 0 ? 'positivo' : 'negativo'}`}>
              <h3>Saldo</h3>
              <p className="valor">{formatarValor(relatorio.saldo)}</p>
            </div>
          </div>

          <div className="detalhes-relatorio">
            <div className="detalhes-coluna">
              <h3>Receitas Detalhadas</h3>
              {relatorio.receitas.length > 0 ? (
                <table className="tabela-detalhes">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Categoria</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorio.receitas.map(r => (
                      <tr key={r.id}>
                        <td>{formatarData(r.data)}</td>
                        <td>{r.categoria}</td>
                        <td>{r.descricao || '-'}</td>
                        <td className="positivo">{formatarValor(r.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Nenhuma receita neste período</p>
              )}
            </div>

            <div className="detalhes-coluna">
              <h3>Despesas Detalhadas</h3>
              {relatorio.despesas.length > 0 ? (
                <table className="tabela-detalhes">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Categoria</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorio.despesas.map(d => (
                      <tr key={d.id}>
                        <td>{formatarData(d.data)}</td>
                        <td>{d.categoria}</td>
                        <td>{d.descricao || '-'}</td>
                        <td className="negativo">{formatarValor(d.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Nenhuma despesa neste período</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Relatorios;
