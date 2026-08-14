import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * =========================================================
 * TRANSAÇÕES
 * =========================================================
 */

export const criarTransacao = (transacao) => {
  return api.post('/receitas', transacao);
};

export const listarTransacoes = (params) => {
  return api.get('/receitas', { params });
};

export const obterTransacao = (id) => {
  return api.get(`/receitas/${id}`);
};

export const atualizarTransacao = (id, dados) => {
  return api.put(`/receitas/${id}`, dados);
};

export const deletarTransacao = (id) => {
  return api.delete(`/receitas/${id}`);
};

/**
 * =========================================================
 * DASHBOARD
 * =========================================================
 */

export const obterDashboard = (params) => {
  return api.get('/dashboard', { params });
};

/**
 * =========================================================
 * EXPORTAÇÃO
 * =========================================================
 */

export const exportarCSV = (filtros) => {
  return api.post('/export/csv', filtros, {
    responseType: 'blob'
  });
};

/**
 * =========================================================
 * CATEGORIAS
 * =========================================================
 */

/**
 * Listar categorias por tipo
 */
export const listarCategorias = (tipo) => {
  return api.get('/categorias', {
    params: {
      tipo
    }
  });
};

/**
 * Criar nova categoria
 */
export const criarCategoria = (tipo, nome) => {
  return api.post('/categorias', {
    tipo,
    nome
  });
};

/**
 * Atualizar categoria
 */
export const atualizarCategoria = (id, nome) => {
  return api.put(`/categorias/${id}`, {
    nome
  });
};

/**
 * Remover categoria
 */
export const removerCategoria = (id) => {
  return api.delete(`/categorias/${id}`);
};