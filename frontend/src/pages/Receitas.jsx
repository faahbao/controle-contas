import React, { useState, useEffect } from 'react';
import FormularioTransacao from '../components/FormularioTransacao';
import ListaTransacoes from '../components/ListaTransacoes';
import {
  criarTransacao,
  listarTransacoes,
  atualizarTransacao
} from '../services/api';
import '../styles/Receitas.css';

const CATEGORIAS_RECEITA = [
  'Adiantamento',
  'Salário',
  'Outras rendas'
];

function Receitas() {
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const [filtros, setFiltros] = useState({
    categoria: '',
    recorrente: ''
  });

  useEffect(() => {
    carregarTransacoes();
  }, [filtros]);

  const carregarTransacoes = async () => {
    try {
      setCarregando(true);

      const params = {
        tipo: 'receita',
        limit: 100
      };

      if (filtros.categoria) {
        params.categoria = filtros.categoria;
      }

      if (filtros.recorrente !== '') {
        params.recorrente =
          filtros.recorrente === 'true';
      }

      const response = await listarTransacoes(params);

      setTransacoes(response.data.transacoes || []);
      setErro(null);
    } catch (erro) {
      console.error(
        'Erro ao carregar receitas:',
        erro
      );

      setErro('Erro ao carregar receitas');
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionarReceita = async (dados) => {
    try {
      await criarTransacao(dados);

      await carregarTransacoes();

      alert('Receita adicionada com sucesso!');
    } catch (erro) {
      console.error(
        'Erro ao adicionar receita:',
        erro
      );

      alert(
        'Erro ao adicionar receita: ' +
        erro.message
      );
    }
  };

  const handleAtualizar = async (id, dados) => {
    try {
      if (id) {
        await atualizarTransacao(id, dados);
      }

      await carregarTransacoes();
    } catch (erro) {
      console.error(
        'Erro ao atualizar:',
        erro
      );

      alert(
        'Erro ao atualizar: ' +
        erro.message
      );
    }
  };

  return (
    <div className="receitas-container">

      <h1>💵 Receitas</h1>

      <FormularioTransacao
        onSubmit={handleAdicionarReceita}
        tipoTransacao="receita"
        categorias={CATEGORIAS_RECEITA}
      />

      {/* Filtros */}
      <div className="filtros">

        <select
          value={filtros.categoria}
          onChange={(e) =>
            setFiltros({
              ...filtros,
              categoria: e.target.value
            })
          }
        >
          <option value="">
            Todas as categorias
          </option>

          {CATEGORIAS_RECEITA.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>

        <select
          value={filtros.recorrente}
          onChange={(e) =>
            setFiltros({
              ...filtros,
              recorrente: e.target.value
            })
          }
        >
          <option value="">
            Todas
          </option>

          <option value="true">
            Apenas recorrentes
          </option>

          <option value="false">
            Apenas não recorrentes
          </option>
        </select>

      </div>

      {erro && (
        <div className="erro">
          {erro}
        </div>
      )}

      {carregando && (
        <div>
          Carregando...
        </div>
      )}

      <ListaTransacoes
        transacoes={transacoes}
        onEditar={() => {}}
        onAtualizar={handleAtualizar}
      />

    </div>
  );
}

export default Receitas;