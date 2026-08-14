import React, { useState } from 'react';
import { deletarTransacao } from '../services/api';
import '../styles/ListaTransacoes.css';

function ListaTransacoes({ transacoes, onEditar, onAtualizar }) {
  const [transacoesEditando, setTransacoesEditando] = useState({});

  const handleEditar = (transacao) => {
    setTransacoesEditando((prev) => ({
      ...prev,
      [transacao.id]: { ...transacao }
    }));
  };

  const handleCancelar = (id) => {
    setTransacoesEditando((prev) => {
      const novoEstado = { ...prev };
      delete novoEstado[id];
      return novoEstado;
    });
  };

  const handleSalvar = async (id) => {
    const transacao = transacoesEditando[id];

    try {
      await onAtualizar(id, transacao);

      setTransacoesEditando((prev) => {
        const novoEstado = { ...prev };
        delete novoEstado[id];
        return novoEstado;
      });
    } catch (erro) {
      console.error('Erro ao salvar alteração:', erro);
    }
  };

  const handleMudanca = (id, campo, valor) => {
    setTransacoesEditando((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta transação?')) {
      return;
    }

    try {
      await deletarTransacao(id);
      onAtualizar(null, null);
    } catch (erro) {
      console.error('Erro ao deletar:', erro);

      alert(
        'Erro ao deletar: ' +
          (erro.response?.data?.erro || erro.message)
      );
    }
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(valor) || 0);
  };

  const formatarData = (data) => {
    if (!data) return '-';

    const partes = String(data).split('-');

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return new Date(data).toLocaleDateString('pt-BR');
  };

  /*
   * Retorna somente:
   *
   * 1/3
   * 2/3
   * 3/3
   */
  const formatarParcela = (transacao) => {
    const numero = Number(transacao.parcela_numero);
    const total = Number(transacao.num_parcelas);

    if (
      !Number.isInteger(numero) ||
      !Number.isInteger(total) ||
      total <= 1
    ) {
      return '-';
    }

    return `${numero}/${total}`;
  };

  const isParcela = (transacao) => {
    return (
      Number(transacao.num_parcelas) > 1 &&
      Number(transacao.parcela_numero) >= 1
    );
  };

  if (!transacoes || transacoes.length === 0) {
    return (
      <div className="lista-vazia">
        Nenhuma transação encontrada
      </div>
    );
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
            <th>Parcela</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {transacoes.map((transacao) => {
            const editando = transacoesEditando[transacao.id];

            if (editando) {
              return (
                <tr
                  key={transacao.id}
                  className="editando"
                >
                  <td>
                    <input
                      type="date"
                      value={editando.data || ''}
                      onChange={(e) =>
                        handleMudanca(
                          transacao.id,
                          'data',
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={editando.categoria || ''}
                      onChange={(e) =>
                        handleMudanca(
                          transacao.id,
                          'categoria',
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={editando.descricao || ''}
                      onChange={(e) =>
                        handleMudanca(
                          transacao.id,
                          'descricao',
                          e.target.value
                        )
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editando.valor ?? ''}
                      onChange={(e) =>
                        handleMudanca(
                          transacao.id,
                          'valor',
                          e.target.value
                            ? parseFloat(e.target.value)
                            : ''
                        )
                      }
                    />
                  </td>

                  <td className="parcelas-cell">
                    {isParcela(transacao) ? (
                      <span className="parcela-indicador">
                        {formatarParcela(transacao)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>

                  <td className="acoes">
                    <button
                      type="button"
                      onClick={() =>
                        handleSalvar(transacao.id)
                      }
                      className="btn-salvar"
                      title="Salvar"
                    >
                      ✓
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleCancelar(transacao.id)
                      }
                      className="btn-cancelar"
                      title="Cancelar"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            }

            const numeroParcela = Number(
              transacao.parcela_numero
            );

            const totalParcelas = Number(
              transacao.num_parcelas
            );

            const possuiParcela =
              isParcela(transacao);

            const ultimaParcela =
              possuiParcela &&
              numeroParcela === totalParcelas;

            return (
              <tr key={transacao.id}>
                <td>
                  {formatarData(transacao.data)}
                </td>

                <td>
                  {transacao.categoria}
                </td>

                <td>
                  {transacao.descricao || '-'}
                </td>

                <td
                  className={
                    transacao.tipo === 'receita'
                      ? 'positivo'
                      : 'negativo'
                  }
                >
                  {transacao.tipo === 'receita'
                    ? '+'
                    : '-'}{' '}
                  {formatarValor(
                    Math.abs(transacao.valor)
                  )}
                </td>

                {/* ==================================
                    PARCELA
                    Mostra SOMENTE 1/3, 2/3, 3/3
                   ================================== */}
                <td className="parcelas-cell">
                  {possuiParcela ? (
                    <span
                      className="parcela-indicador"
                      data-parcela={numeroParcela}
                      data-ultima={
                        ultimaParcela ? 'true' : 'false'
                      }
                    >
                      {numeroParcela}/{totalParcelas}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>

                <td className="acoes">
                  <button
                    type="button"
                    onClick={() =>
                      handleEditar(transacao)
                    }
                    className="btn-editar"
                    title="Editar"
                  >
                    ✎
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeletar(transacao.id)
                    }
                    className="btn-deletar"
                    title="Excluir"
                  >
                    🗑
                  </button>
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