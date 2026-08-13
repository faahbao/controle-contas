import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Criar nova transação
 */
export const criarTransacao = (transacao) => {
  return api.post('/receitas', transacao); // Ambas as rotas recebem via POST
};

/**
 * Listar transações
 */
export const listarTransacoes = (params) => {
  return api.get('/receitas', { params });
};

/**
 * Obter uma transação
 */
export const obterTransacao = (id) => {
  return api.get(`/receitas/${id}`);
};

/**
 * Atualizar transação
 */
export const atualizarTransacao = (id, dados) => {
  return api.put(`/receitas/${id}`, dados);
};

/**
 * Deletar transação
 */
export const deletarTransacao = (id) => {
  return api.delete(`/receitas/${id}`);
};

/**
 * Obter dashboard
 */
export const obterDashboard = (params) => {
  return api.get('/dashboard', { params });
};

/**
 * Exportar em CSV
 */
export const exportarCSV = (filtros) => {
  return api.post('/export/csv', filtros, {
    responseType: 'blob'
  });
};

export default api;
