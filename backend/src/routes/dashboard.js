const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const [receitas] = await db('transacoes').where({ user_id: userId, tipo: 'receita' }).sum('valor as total');
    const [despesas] = await db('transacoes').where({ user_id: userId, tipo: 'despesa' }).sum('valor as total');
    const saldo = (receitas?.total || 0) - (despesas?.total || 0);
    const recentes = await db('transacoes').where({ user_id: userId }).orderBy('data', 'desc').limit(10);
    const porCategoria = await db('transacoes').select('categorias.nome', 'categorias.cor', db.raw('SUM(transacoes.valor) as total')).join('categorias', 'transacoes.categoria_id', 'categorias.id').where({ 'transacoes.user_id': userId }).groupBy('categorias.id', 'categorias.nome', 'categorias.cor');
    return res.json({ receitas: receitas?.total || 0, despesas: despesas?.total || 0, saldo, recentes, porCategoria });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar dashboard' });
  }
});

module.exports = router;
