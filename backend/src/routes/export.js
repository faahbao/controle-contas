import express from 'express';
import { dbAll } from '../db.js';

const router = express.Router();

/**
 * Exportar transações em CSV
 */
router.post('/csv', async (req, res) => {
  try {
    const { tipo, categoria, data_inicio, data_fim, recorrente } = req.body;

    let sql = 'SELECT * FROM transactions WHERE 1=1';
    const params = [];

    if (tipo) {
      sql += ' AND tipo = ?';
      params.push(tipo);
    }

    if (categoria) {
      sql += ' AND categoria = ?';
      params.push(categoria);
    }

    if (data_inicio) {
      sql += ' AND data >= ?';
      params.push(data_inicio);
    }

    if (data_fim) {
      sql += ' AND data <= ?';
      params.push(data_fim);
    }

    if (recorrente !== undefined) {
      sql += ' AND recorrente = ?';
      params.push(recorrente ? 1 : 0);
    }

    sql += ' ORDER BY data DESC';

    const transacoes = await dbAll(sql, params);

    // Gerar CSV
    const headers = ['ID', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Data', 'Recorrente', 'Período', 'Criado em'];
    const rows = transacoes.map(t => [
      t.id,
      t.tipo,
      t.categoria,
      t.descricao || '',
      t.valor,
      t.data,
      t.recorrente ? 'Sim' : 'Não',
      t.periodo_recorrencia || '-',
      t.criado_em
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="transacoes.csv"');
    res.send(csv);
  } catch (erro) {
    console.error('Erro ao exportar CSV:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

export default router;
