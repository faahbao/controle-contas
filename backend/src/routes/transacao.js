const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const transacoes = await db('transacoes').where({ user_id: req.userId }).orderBy('data', 'desc');
    return res.json(transacoes);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar transacoes' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { descricao, valor, tipo, categoria_id, data } = req.body;
    if (!descricao || !valor || !tipo) {
      return res.status(400).json({ error: 'Descricao, valor e tipo sao obrigatorios' });
    }
    const [id] = await db('transacoes').insert({ user_id: req.userId, descricao, valor, tipo, categoria_id, data: data || new Date() });
    return res.status(201).json({ id, descricao, valor, tipo, categoria_id, data });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar transacao' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, valor, tipo, categoria_id, data } = req.body;
    const transacao = await db('transacoes').where({ id, user_id: req.userId }).first();
    if (!transacao) return res.status(404).json({ error: 'Transacao nao encontrada' });
    await db('transacoes').where({ id }).update({ descricao, valor, tipo, categoria_id, data });
    return res.json({ message: 'Transacao atualizada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar transacao' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transacao = await db('transacoes').where({ id, user_id: req.userId }).first();
    if (!transacao) return res.status(404).json({ error: 'Transacao nao encontrada' });
    await db('transacoes').where({ id }).del();
    return res.json({ message: 'Transacao deletada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar transacao' });
  }
});

module.exports = router;
