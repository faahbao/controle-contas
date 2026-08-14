import express from 'express';
import { dbAll, dbGet } from '../db.js';

const router = express.Router();

/**
 * Dashboard financeiro
 *
 * Permite consultar um mês específico através de:
 *
 * /api/dashboard?mes=2026-08
 *
 * Quando o parâmetro "mes" não é informado,
 * utiliza o mês atual.
 *
 * Retorna:
 * - total de receitas do mês selecionado
 * - total de despesas do mês selecionado
 * - saldo do mês selecionado
 * - totais por categoria do mês
 * - resumo mensal
 * - informações sobre parcelamentos
 * - próximas parcelas
 * - parcelas do mês selecionado
 */
router.get('/', async (req, res) => {
  try {
    const agora = new Date();

    const anoAtual = agora.getFullYear();

    const mesAtualNumero = String(
      agora.getMonth() + 1
    ).padStart(2, '0');

    const mesAtual = `${anoAtual}-${mesAtualNumero}`;

    // ---------------------------------------------------------
    // Mês selecionado
    // ---------------------------------------------------------

    let mesSelecionado = req.query.mes || mesAtual;

    /**
     * Aceita somente o formato YYYY-MM.
     */
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mesSelecionado)) {
      return res.status(400).json({
        erro: 'Mês inválido. Utilize o formato YYYY-MM.'
      });
    }

    const anoSelecionado = Number(
      mesSelecionado.substring(0, 4)
    );

    /**
     * O seletor do Dashboard trabalha somente
     * com os meses do ano corrente.
     */
    if (anoSelecionado !== anoAtual) {
      return res.status(400).json({
        erro: `É permitido consultar somente os meses do ano ${anoAtual}.`
      });
    }

    const mesNumero = Number(
      mesSelecionado.substring(5, 7)
    );

    const ultimoDia = new Date(
      anoSelecionado,
      mesNumero,
      0
    ).getDate();

    const dataInicio =
      `${mesSelecionado}-01`;

    const dataFim =
      `${mesSelecionado}-${String(ultimoDia).padStart(2, '0')}`;

    // ---------------------------------------------------------
    // Filtro do mês selecionado
    // ---------------------------------------------------------

    const filtroMes = `
      AND data >= ?
      AND data <= ?
    `;

    const paramsMes = [
      dataInicio,
      dataFim
    ];

    // ---------------------------------------------------------
    // Totais de receitas do mês
    // ---------------------------------------------------------

    const receitasResult = await dbGet(
      `SELECT
        COALESCE(SUM(valor), 0) AS total,
        COUNT(*) AS quantidade
       FROM transactions
       WHERE tipo = 'receita'
       ${filtroMes}`,
      paramsMes
    );

    // ---------------------------------------------------------
    // Totais de despesas do mês
    // ---------------------------------------------------------

    const despesasResult = await dbGet(
      `SELECT
        COALESCE(SUM(valor), 0) AS total,
        COUNT(*) AS quantidade
       FROM transactions
       WHERE tipo = 'despesa'
       ${filtroMes}`,
      paramsMes
    );

    const totalReceitas = Number(
      receitasResult?.total || 0
    );

    const totalDespesas = Number(
      despesasResult?.total || 0
    );

    const saldo =
      totalReceitas - totalDespesas;

    // ---------------------------------------------------------
    // Receitas por categoria do mês selecionado
    // ---------------------------------------------------------

    const receitasPorCategoria = await dbAll(
      `SELECT
        categoria,
        SUM(valor) AS total,
        COUNT(*) AS quantidade
       FROM transactions
       WHERE tipo = 'receita'
       ${filtroMes}
       GROUP BY categoria
       ORDER BY total DESC`,
      paramsMes
    );

    // ---------------------------------------------------------
    // Despesas por categoria do mês selecionado
    // ---------------------------------------------------------

    const despesasPorCategoria = await dbAll(
      `SELECT
        categoria,
        SUM(valor) AS total,
        COUNT(*) AS quantidade
       FROM transactions
       WHERE tipo = 'despesa'
       ${filtroMes}
       GROUP BY categoria
       ORDER BY total DESC`,
      paramsMes
    );

    // ---------------------------------------------------------
    // Resumo mensal
    //
    // Mantém todos os meses existentes no banco.
    // Isso permite ao Dashboard continuar exibindo
    // a evolução mensal.
    // ---------------------------------------------------------

    const resumoMensal = await dbAll(
      `SELECT
        substr(data, 1, 7) AS mes,

        SUM(
          CASE
            WHEN tipo = 'receita'
            THEN valor
            ELSE 0
          END
        ) AS receitas,

        SUM(
          CASE
            WHEN tipo = 'despesa'
            THEN valor
            ELSE 0
          END
        ) AS despesas,

        SUM(
          CASE
            WHEN tipo = 'receita'
            THEN valor

            WHEN tipo = 'despesa'
            THEN -valor

            ELSE 0
          END
        ) AS saldo,

        COUNT(*) AS quantidade

       FROM transactions

       GROUP BY substr(data, 1, 7)

       ORDER BY mes ASC`
    );

    // ---------------------------------------------------------
    // Informações sobre parcelamentos
    // ---------------------------------------------------------

    const parcelamentos = await dbAll(
      `SELECT
        transacao_original_id,
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
        transacao_original_id,
        categoria,
        descricao,
        tipo,
        valor,
        num_parcelas

       ORDER BY primeira_data ASC`
    );

    // ---------------------------------------------------------
    // Próximas parcelas
    // ---------------------------------------------------------

    const proximasParcelas = await dbAll(
      `SELECT
        id,
        tipo,
        categoria,
        descricao,
        valor,
        data,
        parcela_numero,
        num_parcelas,
        data_termino,
        transacao_original_id

       FROM transactions

       WHERE num_parcelas > 1

       ORDER BY data ASC`
    );

    // ---------------------------------------------------------
    // Parcelas do mês selecionado
    // ---------------------------------------------------------

    const parcelasMesAtual = await dbAll(
      `SELECT
        id,
        tipo,
        categoria,
        descricao,
        valor,
        data,
        parcela_numero,
        num_parcelas,
        data_termino,
        transacao_original_id

       FROM transactions

       WHERE num_parcelas > 1
       AND data >= ?
       AND data <= ?

       ORDER BY data ASC, parcela_numero ASC`,
      paramsMes
    );

    // ---------------------------------------------------------
    // Totais dos parcelamentos
    // ---------------------------------------------------------

    const totalParcelamentos = parcelamentos.length;

    const valorTotalParcelamentos =
      parcelamentos.reduce(
        (total, item) =>
          total + Number(item.valor_total || 0),
        0
      );

    // ---------------------------------------------------------
    // Resposta
    // ---------------------------------------------------------

    res.json({

      // -------------------------------------------------------
      // Mês selecionado
      // -------------------------------------------------------

      mesAtual,

      mesSelecionado,

      anoAtual,

      dataInicio,

      dataFim,

      // -------------------------------------------------------
      // Totais do mês selecionado
      // -------------------------------------------------------

      totalReceitas,

      totalDespesas,

      saldo,

      quantidadeReceitas:
        Number(
          receitasResult?.quantidade || 0
        ),

      quantidadeDespesas:
        Number(
          despesasResult?.quantidade || 0
        ),

      // -------------------------------------------------------
      // Categorias do mês selecionado
      // -------------------------------------------------------

      receitasPorCategoria,

      despesasPorCategoria,

      // -------------------------------------------------------
      // Resumo mensal geral
      // -------------------------------------------------------

      resumoMensal,

      // -------------------------------------------------------
      // Parcelamentos
      // -------------------------------------------------------

      parcelamentos,

      totalParcelamentos,

      valorTotalParcelamentos,

      // -------------------------------------------------------
      // Próximas parcelas
      // -------------------------------------------------------

      proximasParcelas,

      // -------------------------------------------------------
      // Parcelas do mês selecionado
      // -------------------------------------------------------

      parcelasMesAtual

    });

  } catch (erro) {

    console.error(
      'Erro ao obter dashboard:',
      erro
    );

    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
});

export default router;