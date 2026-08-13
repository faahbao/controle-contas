import express from 'express';
import {
  criarTransacao,
  listarTransacoes,
  obterTransacao,
  atualizarTransacao,
  deletarTransacao
} from '../controllers/transacaoController.js';

const router = express.Router();

// Rotas para transações (recebem tipo na query ou passam via middleware)
router.post('/', criarTransacao);
router.get('/', listarTransacoes);
router.get('/:id', obterTransacao);
router.put('/:id', atualizarTransacao);
router.delete('/:id', deletarTransacao);

export default router;
