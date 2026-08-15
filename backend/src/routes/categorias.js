const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const categorias = await db('categorias').where({ user_id: req.userId }).orWhereNull('user_id');
    return res.json(categorias);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar categorias' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, cor, icone } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome e obrigatorio' });
    const [id] = await db('categorias').insert({ nome, cor, icone, user_id: req.userId });
    return res.status(201).json({ id, nome, cor, icone, user_id: req.userId });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cor, icone } = req.body;
    const categoria = await db('categorias').where({ id, user_id: req.userId }).first();
    if (!categoria) return res.status(404).json({ error: 'Categoria nao encontrada' });
    await db('categorias').where({ id }).update({ nome, cor, icone });
    return res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await db('categorias').where({ id, user_id: req.userId }).first();
    if (!categoria) return res.status(404).json({ error: 'Categoria nao encontrada' });
    await db('categorias').where({ id }).del();
    return res.json({ message: 'Categoria deletada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
});

module.exports = router;
