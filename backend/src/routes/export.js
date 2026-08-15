const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/csv', async (req, res) => {
  try {
    const transacoes = await db('transacoes').where({ user_id: req.userId }).orderBy('data', 'desc');
    let csv = 'ID,Descricao,Valor,Tipo,Data\n';
    transacoes.forEach(t => {
      csv += `${t.id},"${t.descricao}",${t.valor},${t.tipo},${t.data}\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transacoes.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao exportar' });
  }
});

module.exports = router;
