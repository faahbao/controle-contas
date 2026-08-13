import React, { useState, useEffect } from 'react';
import { deletarTransacao } from '../services/api';
import '../styles/ListaTransacoes.css';

function ListaTransacoes({ transacoes, onEditar, onAtualizar }) {
  const [transacoesEditando, setTransacoesEditando] = useState({});

  const handleEditar = (transacao) => {
    setTransacoesEditando(prev => ({
      ...prev,
      [transacao.id]: { ...transacao }
    }));
  };

  const handleCancelar = (id) => {
    setTransacoesEditando(prev => {
      const novoEstado = { ...prev };
      delete novoEstado[id];
      return novoEstado;
    });
  };

  const handleSalvar = async (id) => {
    const transacao = transacoesEditando[id];
    await onAtualizar(id, transacao);
    setTransacoesEditando(prev => {
      const novoEstado = { ...prev };
      delete novoEstado[id];
      return novoEstado;
    });
  };

  const handleMudanca = (id, campo, valor) => {
    setTransacoesEditando(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  const handleDeletar = async (id) => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      try {
        await deletarTransacao(id);
        onAtualizar(null, null); // Trigger refresh
      } catch (erro) {
        alert('Erro ao deletar: ' + erro.message);
      }
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

  const formatarParcelas = (numParcelas, dataTermino) => {
    if (!numParcelas || numParcelas === 1) return '-';
    if (dataTermino) {
      return `${numParcelas}x até ${formatarData(dataTermino)}`;
    }
    return `${numParcelas}x`;
  };

  if (!transacoes || transacoes.length === 0) {
    return <div className="lista-vazia">Nenhuma transação encontrada</div>;
  }

  return (
    <div className="lista-transacoes">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Categoria</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Parcelas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map(transacao => {
            const editando = transacoesEditando[transacao.id];
            
            if (editando) {
              return (
                <tr key={transacao.id} className="editando">
                  <td>
                    <input
                      type="date"
                      value={editando.data}
                      onChange={(e) => handleMudanca(transacao.id, 'data', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editando.categoria}
                      onChange={(e) => handleMudanca(transacao.id, 'categoria', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editando.descricao}
                      onChange={(e) => handleMudanca(transacao.id, 'descricao', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={editando.valor}
                      onChange={(e) => handleMudanca(transacao.id, 'valor', parseFloat(e.target.value))}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={editando.num_parcelas || 1}
                      onChange={(e) => handleMudanca(transacao.id, 'num_parcelas', parseInt(e.target.value))}
                    />
                  </td>
                  <td className="acoes">
                    <button onClick={() => handleSalvar(transacao.id)} className="btn-salvar">✓</button>
                    <button onClick={() => handleCancelar(transacao.id)} className="btn-cancelar">✕</button>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={transacao.id}>
                <td>{formatarData(transacao.data)}</td>
                <td>{transacao.categoria}</td>
                <td>{transacao.descricao || '-'}</td>
                <td className={transacao.tipo === 'receita' ? 'positivo' : 'negativo'}>
                  {transacao.tipo === 'receita' ? '+' : '-'} {formatarValor(Math.abs(transacao.valor))}
                </td>
                <td className="parcelas-cell">
                  {formatarParcelas(transacao.num_parcelas, transacao.data_termino)}
                </td>
                <td className="acoes">
                  <button onClick={() => handleEditar(transacao)} className="btn-editar">✎</button>
                  <button onClick={() => handleDeletar(transacao.id)} className="btn-deletar">🗑</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ListaTransacoes;
