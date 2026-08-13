import React, { useState, useEffect } from 'react';
import FormularioTransacao from '../components/FormularioTransacao';
import ListaTransacoes from '../components/ListaTransacoes';
import { criarTransacao, listarTransacoes, atualizarTransacao } from '../services/api';
import '../styles/Despesas.css';

const CATEGORIAS_DESPESA = [
  'Cartão Itau',
  'Cartão PicPay',
  'Cartão Mercado Pago',
  'Vivo Internet',
  'Vivo Celular Mãe',
  'Empréstimo Shopee',
  'Empréstimo MP',
  'Empréstimo Itau',
  'Empréstimo PicPay',
  'Cartão Pai'
];

function Despesas() {
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
      const params = { tipo: 'despesa', limit: 100 };
      if (filtros.categoria) params.categoria = filtros.categoria;
      if (filtros.recorrente !== '') params.recorrente = filtros.recorrente === 'true';
      
      const response = await listarTransacoes(params);
      setTransacoes(response.data.transacoes || []);
      setErro(null);
    } catch (erro) {
      console.error('Erro ao carregar despesas:', erro);
      setErro('Erro ao carregar despesas');
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionarDespesa = async (dados) => {
    try {
      await criarTransacao(dados);
      carregarTransacoes();
      alert('Despesa adicionada com sucesso!');
    } catch (erro) {
      console.error('Erro ao adicionar despesa:', erro);
      alert('Erro ao adicionar despesa: ' + erro.message);
    }
  };

  const handleAtualizar = async (id, dados) => {
    try {
      if (id) {
        await atualizarTransacao(id, dados);
      }
      carregarTransacoes();
    } catch (erro) {
      console.error('Erro ao atualizar:', erro);
      alert('Erro ao atualizar: ' + erro.message);
    }
  };

  return (
    <div className="despesas-container">
      <h1>💸 Despesas</h1>

      <FormularioTransacao
        onSubmit={handleAdicionarDespesa}
        tipoTransacao="despesa"
        categorias={CATEGORIAS_DESPESA}
      />

      {/* Filtros */}
      <div className="filtros">
        <select
          value={filtros.categoria}
          onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
        >
          <option value="">Todas as categorias</option>
          {CATEGORIAS_DESPESA.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filtros.recorrente}
          onChange={(e) => setFiltros({ ...filtros, recorrente: e.target.value })}
        >
          <option value="">Todas</option>
          <option value="true">Apenas recorrentes</option>
          <option value="false">Apenas não recorrentes</option>
        </select>
      </div>

      {erro && <div className="erro">{erro}</div>}
      {carregando && <div>Carregando...</div>}

      <ListaTransacoes
        transacoes={transacoes}
        onEditar={() => {}}
        onAtualizar={handleAtualizar}
      />
    </div>
  );
}

export default Despesas;
