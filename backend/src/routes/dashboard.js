import express from 'express';
import { dbAll, dbGet } from '../db.js';

const router = express.Router();

/**
 * Dashboard: resumo de receitas, despesas e saldo
 */
router.get('/', async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;

    let sqlReceitas = 'SELECT SUM(valor) as total FROM transactions WHERE tipo = "receita"';
    let sqlDespesas = 'SELECT SUM(valor) as total FROM transactions WHERE tipo = "despesa"';
    const params = [];

    if (data_inicio) {
      sqlReceitas += ' AND data >= ?';
      sqlDespesas += ' AND data >= ?';
    }

    if (data_fim) {
      sqlReceitas += ' AND data <= ?';
      sqlDespesas += ' AND data <= ?';
    }

    if (data_inicio && data_fim) {
      const receitas = await dbGet(sqlReceitas, [data_inicio, data_fim]);
      const despesas = await dbGet(sqlDespesas, [data_inicio, data_fim]);
    } else if (data_inicio) {
      const receitas = await dbGet(sqlReceitas, [data_inicio]);
      const despesas = await dbGet(sqlDespesas, [data_inicio]);
    } else {
      const receitas = await dbGet(sqlReceitas);
      const despesas = await dbGet(sqlDespesas);
    }

    // Reexecutar para ter os valores corretos
    let receitasResult, despesasResult;

    if (data_inicio && data_fim) {
      receitasResult = await dbGet(
        'SELECT SUM(valor) as total FROM transactions WHERE tipo = "receita" AND data >= ? AND data <= ?',
        [data_inicio, data_fim]
      );
      despesasResult = await dbGet(
        'SELECT SUM(valor) as total FROM transactions WHERE tipo = "despesa" AND data >= ? AND data <= ?',
        [data_inicio, data_fim]
      );
    } else if (data_inicio) {
      receitasResult = await dbGet(
        'SELECT SUM(valor) as total FROM transactions WHERE tipo = "receita" AND data >= ?',
        [data_inicio]
      );
      despesasResult = await dbGet(
        'SELECT SUM(valor) as total FROM transactions WHERE tipo = "despesa" AND data >= ?',
        [data_inicio]
      );
    } else {
      receitasResult = await dbGet('SELECT SUM(valor) as total FROM transactions WHERE tipo = "receita"');
      despesasResult = await dbGet('SELECT SUM(valor) as total FROM transactions WHERE tipo = "despesa"');
    }

    const totalReceitas = receitasResult?.total || 0;
    const totalDespesas = despesasResult?.total || 0;
    const saldo = totalReceitas - totalDespesas;

    // Resumo por categoria (receitas)
    let receitasPorCategoria;
    if (data_inicio && data_fim) {
      receitasPorCategoria = await dbAll(
        'SELECT categoria, SUM(valor) as total FROM transactions WHERE tipo = "receita" AND data >= ? AND data <= ? GROUP BY categoria',
        [data_inicio, data_fim]
      );
    } else if (data_inicio) {
      receitasPorCategoria = await dbAll(
        'SELECT categoria, SUM(valor) as total FROM transactions WHERE tipo = "receita" AND data >= ? GROUP BY categoria',
        [data_inicio]
      );
    } else {
      receitasPorCategoria = await dbAll(
        'SELECT categoria, SUM(valor) as total FROM transactions WHERE tipo = "receita" GROUP BY categoria'
      );
    }

    // Resumo por categoria (despesas)
    let despesasPorCategoria;
    if (data_inicio && data_fim) {
      despesasPorCategoria = await dbAll(
        'SELECT categoria, SUM(valor) as total FROM transactions WHERE tipo = "despesa" AND data >= ? AND data <= ? GROUP BY categoria',
        [data_inicio, data_fim]
      );
    } else if (data_inicio) {
      despesasPorCategoria = await dbAll(
        'SELECT categoria, SUM(valor) as total FROM transactions WHERE tipo = "despesa" AND data >= ? GROUP BY categoria',
        [data_inicio]
      );
    } else {
      despesasPorCategoria = await dbAll(
        'SELECT categoria, SUM(valor) as total FROM transactions WHERE tipo = "despesa" GROUP BY categoria'
      );
    }

    res.json({
      totalReceitas,
      totalDespesas,
      saldo,
      receitasPorCategoria,
      despesasPorCategoria
    });
  } catch (erro) {
    console.error('Erro ao obter dashboard:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

export default router;
