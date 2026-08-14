import express from 'express';
import { dbAll, dbGet } from '../db.js';

const router = express.Router();

/**
 * Dashboard financeiro
 *
 * Retorna:
 * - total de receitas
 * - total de despesas
 * - saldo
 * - totais por categoria
 * - totais mensais
 * - quantidade de transações
 * - informações sobre parcelamentos
 * - próximas parcelas
 */
router.get('/', async (req, res) => {
  try {
    const {
      data_inicio,
      data_fim
    } = req.query;

    // =========================================================
    // FILTRO DE DATA
    // =========================================================

    const params = [];

    let filtroData = '';

    if (data_inicio) {
      filtroData += ' AND data >= ?';
      params.push(data_inicio);
    }

    if (data_fim) {
      filtroData += ' AND data <= ?';
      params.push(data_fim);
    }

    // =========================================================
    // TOTAIS GERAIS
    // =========================================================

    const receitasResult = await dbGet(
      `
      SELECT
        COALESCE(SUM(valor), 0) AS total,
        COUNT(*) AS quantidade
      FROM transactions
      WHERE tipo = 'receita'
      ${filtroData}
      `,
      params
    );

    const despesasResult = await dbGet(
      `
      SELECT
        COALESCE(SUM(valor), 0) AS total,
        COUNT(*) AS quantidade
      FROM transactions
      WHERE tipo = 'despesa'
      ${filtroData}
      `,
      params
    );

    const totalReceitas =
      Number(receitasResult?.total || 0);

    const totalDespesas =
      Number(despesasResult?.total || 0);

    const saldo =
      totalReceitas - totalDespesas;

    // =========================================================
    // RECEITAS POR CATEGORIA
    // =========================================================

    const receitasPorCategoria = await dbAll(
      `
      SELECT
        categoria,
        COALESCE(SUM(valor), 0) AS total,
        COUNT(*) AS quantidade
      FROM transactions
      WHERE tipo = 'receita'
      ${filtroData}
      GROUP BY categoria
      ORDER BY total DESC
      `,
      params
    );

    // =========================================================
    // DESPESAS POR CATEGORIA
    // =========================================================

    const despesasPorCategoria = await dbAll(
      `
      SELECT
        categoria,
        COALESCE(SUM(valor), 0) AS total,
        COUNT(*) AS quantidade
      FROM transactions
      WHERE tipo = 'despesa'
      ${filtroData}
      GROUP BY categoria
      ORDER BY total DESC
      `,
      params
    );

    // =========================================================
    // RESUMO MENSAL
    //
    // Cada parcela pertence ao seu próprio mês.
    //
    // Exemplo:
    //
    // 13/08/2026 = R$ 250
    // 13/09/2026 = R$ 250
    // 13/10/2026 = R$ 250
    //
    // Portanto:
    //
    // 2026-08 = R$ 250
    // 2026-09 = R$ 250
    // 2026-10 = R$ 250
    // =========================================================

    const resumoMensal = await dbAll(
      `
      SELECT
        substr(data, 1, 7) AS mes,

        COALESCE(
          SUM(
            CASE
              WHEN tipo = 'receita'
              THEN valor
              ELSE 0
            END
          ),
          0
        ) AS receitas,

        COALESCE(
          SUM(
            CASE
              WHEN tipo = 'despesa'
              THEN valor
              ELSE 0
            END
          ),
          0
        ) AS despesas,

        COALESCE(
          SUM(
            CASE
              WHEN tipo = 'receita'
              THEN valor

              WHEN tipo = 'despesa'
              THEN -valor

              ELSE 0
            END
          ),
          0
        ) AS saldo,

        COUNT(*) AS quantidade

      FROM transactions

      WHERE 1 = 1
      ${filtroData}

      GROUP BY substr(data, 1, 7)

      ORDER BY mes ASC
      `,
      params
    );

    // =========================================================
    // PARCELAMENTOS
    //
    // IMPORTANTE:
    //
    // A primeira parcela possui:
    //
    // transacao_original_id = NULL
    //
    // As demais possuem:
    //
    // transacao_original_id = ID da primeira parcela
    //
    // Por isso usamos:
    //
    // COALESCE(transacao_original_id, id)
    //
    // para identificar corretamente o parcelamento inteiro.
    // =========================================================

    const parcelamentos = await dbAll(
      `
      SELECT
        COALESCE(
          transacao_original_id,
          id
        ) AS transacao_original_id,

        categoria,
        descricao,
        tipo,

        valor,

        num_parcelas,

        COUNT(*) AS parcelas_geradas,

        MIN(parcela_numero) AS primeira_parcela,

        MAX(parcela_numero) AS ultima_parcela,

        MIN(data) AS primeira_data,

        MAX(data) AS ultima_data,

        SUM(valor) AS valor_total

      FROM transactions

      WHERE num_parcelas > 1

      GROUP BY
        COALESCE(
          transacao_original_id,
          id
        ),
        categoria,
        descricao,
        tipo,
        valor,
        num_parcelas

      ORDER BY primeira_data ASC
      `
    );

    // =========================================================
    // PRÓXIMAS PARCELAS
    //
    // Retorna as parcelas individualmente.
    //
    // Exemplo:
    //
    // 1/3
    // 2/3
    // 3/3
    // =========================================================

    const proximasParcelas = await dbAll(
      `
      SELECT
        id,

        tipo,

        categoria,

        descricao,

        valor,

        data,

        parcela_numero,

        num_parcelas,

        data_termino,

        COALESCE(
          transacao_original_id,
          id
        ) AS transacao_original_id

      FROM transactions

      WHERE num_parcelas > 1

      ORDER BY
        data ASC,
        parcela_numero ASC

      LIMIT 100
      `
    );

    // =========================================================
    // RESUMO DOS PARCELAMENTOS
    // =========================================================

    const totalParcelamentos =
      parcelamentos.length;

    const valorTotalParcelamentos =
      parcelamentos.reduce(
        (total, parcelamento) =>
          total +
          Number(parcelamento.valor_total || 0),
        0
      );

    // =========================================================
    // RESPOSTA
    // =========================================================

    return res.json({

      // -------------------------------------------------------
      // TOTAIS
      // -------------------------------------------------------

      totalReceitas,

      totalDespesas,

      saldo,

      // -------------------------------------------------------
      // QUANTIDADES
      // -------------------------------------------------------

      quantidadeReceitas:
        Number(
          receitasResult?.quantidade || 0
        ),

      quantidadeDespesas:
        Number(
          despesasResult?.quantidade || 0
        ),

      // -------------------------------------------------------
      // CATEGORIAS
      // -------------------------------------------------------

      receitasPorCategoria,

      despesasPorCategoria,

      // -------------------------------------------------------
      // RESUMO MENSAL
      // -------------------------------------------------------

      resumoMensal,

      // -------------------------------------------------------
      // PARCELAMENTOS
      // -------------------------------------------------------

      parcelamentos,

      totalParcelamentos,

      valorTotalParcelamentos,

      // -------------------------------------------------------
      // PRÓXIMAS PARCELAS
      // -------------------------------------------------------

      proximasParcelas
    });

  } catch (erro) {

    console.error(
      'Erro ao obter dashboard:',
      erro
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
});

export default router;