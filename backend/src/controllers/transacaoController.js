import { dbRun, dbGet, dbAll } from '../db.js';

/**
 * Calcula uma nova data adicionando meses à data inicial.
 *
 * Exemplo:
 * 13/08/2026 + 1 mês = 13/09/2026
 * 13/08/2026 + 2 meses = 13/10/2026
 */
const adicionarMeses = (dataString, meses) => {
  const data = new Date(`${dataString}T12:00:00`);

  if (Number.isNaN(data.getTime())) {
    throw new Error('Data inválida');
  }

  const diaOriginal = data.getDate();

  data.setDate(1);
  data.setMonth(data.getMonth() + meses);

  // Descobrir o último dia do mês de destino
  const ultimoDiaDoMes = new Date(
    data.getFullYear(),
    data.getMonth() + 1,
    0
  ).getDate();

  data.setDate(Math.min(diaOriginal, ultimoDiaDoMes));

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
};

/**
 * Calcula a data de término de um parcelamento.
 */
const calcularDataTermino = (dataInicial, numParcelas) => {
  if (!numParcelas || numParcelas <= 1) {
    return dataInicial;
  }

  return adicionarMeses(dataInicial, numParcelas - 1);
};

/**
 * Criar nova transação.
 *
 * Para transações parceladas:
 *
 * valor = valor de UMA parcela
 * num_parcelas = quantidade de parcelas
 *
 * Exemplo:
 *
 * R$ 250,00 x 3
 *
 * Banco:
 *
 * parcela 1 = R$ 250
 * parcela 2 = R$ 250
 * parcela 3 = R$ 250
 *
 * Total = R$ 750
 */
export const criarTransacao = async (req, res) => {
  try {
    const {
      tipo,
      categoria,
      descricao,
      valor,
      data,
      recorrente,
      periodo_recorrencia,
      num_parcelas
    } = req.body;

    // ============================================
    // VALIDAÇÕES
    // ============================================

    if (!tipo) {
      return res.status(400).json({
        erro: 'Tipo da transação é obrigatório'
      });
    }

    if (!categoria) {
      return res.status(400).json({
        erro: 'Categoria é obrigatória'
      });
    }

    if (valor === undefined || valor === null || valor === '') {
      return res.status(400).json({
        erro: 'Valor é obrigatório'
      });
    }

    if (!data) {
      return res.status(400).json({
        erro: 'Data é obrigatória'
      });
    }

    if (tipo !== 'receita' && tipo !== 'despesa') {
      return res.status(400).json({
        erro: 'Tipo inválido'
      });
    }

    const valorNumerico = Number(valor);

    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      return res.status(400).json({
        erro: 'Valor deve ser maior que zero'
      });
    }

    // ============================================
    // PARCELAMENTO
    // ============================================

    const possuiParcelamento =
      recorrente === true ||
      recorrente === 1 ||
      recorrente === 'true';

    let quantidadeParcelas = Number(num_parcelas);

    if (!possuiParcelamento) {
      quantidadeParcelas = 1;
    } else {
      if (!Number.isInteger(quantidadeParcelas)) {
        return res.status(400).json({
          erro: 'Número de parcelas deve ser um número inteiro'
        });
      }

      if (quantidadeParcelas < 1 || quantidadeParcelas > 360) {
        return res.status(400).json({
          erro: 'Número de parcelas deve estar entre 1 e 360'
        });
      }
    }

    const dataTermino = calcularDataTermino(
      data,
      quantidadeParcelas
    );

    // ============================================
    // TRANSAÇÃO SIMPLES
    // ============================================

    if (quantidadeParcelas === 1) {
      const result = await dbRun(
        `INSERT INTO transactions (
          tipo,
          categoria,
          descricao,
          valor,
          data,
          recorrente,
          periodo_recorrencia,
          num_parcelas,
          data_termino,
          parcela_numero,
          transacao_original_id,
          ativo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tipo,
          categoria,
          descricao || null,
          valorNumerico,
          data,
          0,
          null,
          null,
          null,
          1,
          null,
          1
        ]
      );

      return res.status(201).json({
        id: result.lastID,
        message: 'Transação criada com sucesso',
        tipo,
        valor: valorNumerico,
        num_parcelas: 1,
        valor_total: valorNumerico,
        data_primeira_parcela: data,
        data_ultima_parcela: data
      });
    }

    // ============================================
    // TRANSAÇÃO PARCELADA
    // ============================================

    /**
     * Primeiro criamos a parcela 1.
     *
     * IMPORTANTE:
     * transacao_original_id = NULL
     *
     * Ela é a transação original.
     */

    const primeiraParcela = await dbRun(
      `INSERT INTO transactions (
        tipo,
        categoria,
        descricao,
        valor,
        data,
        recorrente,
        periodo_recorrencia,
        num_parcelas,
        data_termino,
        parcela_numero,
        transacao_original_id,
        ativo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tipo,
        categoria,
        descricao || null,
        valorNumerico,
        data,
        0,
        null,
        quantidadeParcelas,
        dataTermino,
        1,
        null,
        1
      ]
    );

    const transacaoOriginalId = primeiraParcela.lastID;

    /**
     * Criar as demais parcelas.
     *
     * Exemplo:
     *
     * primeira parcela:
     * id = 20
     * parcela = 1
     * transacao_original_id = NULL
     *
     * segunda:
     * parcela = 2
     * transacao_original_id = 20
     *
     * terceira:
     * parcela = 3
     * transacao_original_id = 20
     */

    for (let numeroParcela = 2; numeroParcela <= quantidadeParcelas; numeroParcela++) {
      const dataParcela = adicionarMeses(
        data,
        numeroParcela - 1
      );

      await dbRun(
        `INSERT INTO transactions (
          tipo,
          categoria,
          descricao,
          valor,
          data,
          recorrente,
          periodo_recorrencia,
          num_parcelas,
          data_termino,
          parcela_numero,
          transacao_original_id,
          ativo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tipo,
          categoria,
          descricao || null,
          valorNumerico,
          dataParcela,
          0,
          null,
          quantidadeParcelas,
          dataTermino,
          numeroParcela,
          transacaoOriginalId,
          1
        ]
      );
    }

    // ============================================
    // RESPOSTA
    // ============================================

    const valorTotal =
      valorNumerico * quantidadeParcelas;

    return res.status(201).json({
      id: transacaoOriginalId,

      message:
        `Transação criada com sucesso (${quantidadeParcelas} parcelas)`,

      tipo,

      valor: valorNumerico,

      valor_parcela: valorNumerico,

      num_parcelas: quantidadeParcelas,

      valor_total: valorTotal,

      data_primeira_parcela: data,

      data_ultima_parcela: dataTermino
    });

  } catch (erro) {
    console.error('Erro ao criar transação:', erro);

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};


/**
 * Listar transações com filtros.
 */
export const listarTransacoes = async (req, res) => {
  try {
    const {
      tipo,
      categoria,
      data_inicio,
      data_fim,
      recorrente,
      page = 1,
      limit = 50
    } = req.query;

    let sql = `
      SELECT *
      FROM transactions
      WHERE 1=1
    `;

    const params = [];

    // Tipo
    if (tipo) {
      sql += ' AND tipo = ?';
      params.push(tipo);
    }

    // Categoria
    if (categoria) {
      sql += ' AND categoria = ?';
      params.push(categoria);
    }

    // Data inicial
    if (data_inicio) {
      sql += ' AND data >= ?';
      params.push(data_inicio);
    }

    // Data final
    if (data_fim) {
      sql += ' AND data <= ?';
      params.push(data_fim);
    }

    // Recorrente
    if (recorrente !== undefined) {
      sql += ' AND recorrente = ?';

      params.push(
        recorrente === 'true' || recorrente === true
          ? 1
          : 0
      );
    }

    sql += `
      ORDER BY data DESC, parcela_numero DESC
    `;

    // ============================================
    // PAGINAÇÃO
    // ============================================

    const pagina = Math.max(
      1,
      parseInt(page, 10) || 1
    );

    const limite = Math.min(
      500,
      Math.max(1, parseInt(limit, 10) || 50)
    );

    const offset = (pagina - 1) * limite;

    sql += ' LIMIT ? OFFSET ?';

    params.push(limite, offset);

    const transacoes = await dbAll(
      sql,
      params
    );

    return res.json({
      transacoes,
      page: pagina,
      limit: limite
    });

  } catch (erro) {
    console.error(
      'Erro ao listar transações:',
      erro
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};


/**
 * Obter uma transação por ID.
 */
export const obterTransacao = async (req, res) => {
  try {
    const { id } = req.params;

    const transacao = await dbGet(
      `SELECT *
       FROM transactions
       WHERE id = ?`,
      [id]
    );

    if (!transacao) {
      return res.status(404).json({
        erro: 'Transação não encontrada'
      });
    }

    return res.json(transacao);

  } catch (erro) {
    console.error(
      'Erro ao obter transação:',
      erro
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};


/**
 * Atualizar transação.
 *
 * Para manter a integridade do parcelamento,
 * se a transação fizer parte de um parcelamento,
 * atualizamos os dados de todas as parcelas.
 */
export const atualizarTransacao = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      categoria,
      descricao,
      valor,
      data,
      recorrente,
      periodo_recorrencia,
      num_parcelas
    } = req.body;

    // ============================================
    // BUSCAR TRANSAÇÃO
    // ============================================

    const transacao = await dbGet(
      `SELECT *
       FROM transactions
       WHERE id = ?`,
      [id]
    );

    if (!transacao) {
      return res.status(404).json({
        erro: 'Transação não encontrada'
      });
    }

    // ============================================
    // IDENTIFICAR TRANSAÇÃO ORIGINAL
    // ============================================

    const transacaoOriginalId =
      transacao.transacao_original_id || transacao.id;

    const original = await dbGet(
      `SELECT *
       FROM transactions
       WHERE id = ?`,
      [transacaoOriginalId]
    );

    if (!original) {
      return res.status(404).json({
        erro: 'Transação original não encontrada'
      });
    }

    // ============================================
    // NOVOS VALORES
    // ============================================

    const novaCategoria =
      categoria ?? original.categoria;

    const novaDescricao =
      descricao ?? original.descricao;

    const novoValor =
      valor !== undefined
        ? Number(valor)
        : original.valor;

    const novaData =
      data ?? original.data;

    if (
      !Number.isFinite(novoValor) ||
      novoValor <= 0
    ) {
      return res.status(400).json({
        erro: 'Valor deve ser maior que zero'
      });
    }

    let novaQuantidadeParcelas =
      num_parcelas !== undefined
        ? Number(num_parcelas)
        : (original.num_parcelas || 1);

    if (!Number.isInteger(novaQuantidadeParcelas)) {
      return res.status(400).json({
        erro: 'Número de parcelas inválido'
      });
    }

    if (
      novaQuantidadeParcelas < 1 ||
      novaQuantidadeParcelas > 360
    ) {
      return res.status(400).json({
        erro: 'Número de parcelas deve estar entre 1 e 360'
      });
    }

    const novaDataTermino =
      calcularDataTermino(
        novaData,
        novaQuantidadeParcelas
      );

    // ============================================
    // BUSCAR PARCELAS EXISTENTES
    // ============================================

    const parcelasExistentes = await dbAll(
      `SELECT *
       FROM transactions
       WHERE id = ?
          OR transacao_original_id = ?
       ORDER BY parcela_numero ASC`,
      [
        transacaoOriginalId,
        transacaoOriginalId
      ]
    );

    // ============================================
    // SE A QUANTIDADE DE PARCELAS NÃO MUDOU
    // ============================================

    if (
      parcelasExistentes.length ===
      novaQuantidadeParcelas
    ) {
      for (
        let i = 0;
        i < parcelasExistentes.length;
        i++
      ) {
        const parcela = parcelasExistentes[i];

        const numeroParcela =
          i + 1;

        const dataParcela =
          adicionarMeses(
            novaData,
            numeroParcela - 1
          );

        await dbRun(
          `UPDATE transactions
           SET
             categoria = ?,
             descricao = ?,
             valor = ?,
             data = ?,
             recorrente = 0,
             periodo_recorrencia = NULL,
             num_parcelas = ?,
             data_termino = ?,
             parcela_numero = ?,
             atualizado_em = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [
            novaCategoria,
            novaDescricao,
            novoValor,
            dataParcela,
            novaQuantidadeParcelas,
            novaDataTermino,
            numeroParcela,
            parcela.id
          ]
        );
      }

      return res.json({
        message:
          'Parcelamento atualizado com sucesso',

        id: transacaoOriginalId,

        valor_parcela: novoValor,

        num_parcelas:
          novaQuantidadeParcelas,

        valor_total:
          novoValor *
          novaQuantidadeParcelas,

        data_primeira_parcela:
          novaData,

        data_ultima_parcela:
          novaDataTermino
      });
    }

    // ============================================
    // SE A QUANTIDADE MUDOU
    // ============================================

    /**
     * Apagar todas as parcelas antigas.
     *
     * Depois recriamos o parcelamento inteiro.
     */

    await dbRun(
      `DELETE FROM transactions
       WHERE id = ?
          OR transacao_original_id = ?`,
      [
        transacaoOriginalId,
        transacaoOriginalId
      ]
    );

    // ============================================
    // CRIAR NOVA PARCELA 1
    // ============================================

    const novaOriginal = await dbRun(
      `INSERT INTO transactions (
        tipo,
        categoria,
        descricao,
        valor,
        data,
        recorrente,
        periodo_recorrencia,
        num_parcelas,
        data_termino,
        parcela_numero,
        transacao_original_id,
        ativo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        original.tipo,
        novaCategoria,
        novaDescricao,
        novoValor,
        novaData,
        0,
        null,
        novaQuantidadeParcelas,
        novaDataTermino,
        1,
        null,
        1
      ]
    );

    const novoOriginalId =
      novaOriginal.lastID;

    // ============================================
    // CRIAR DEMAIS PARCELAS
    // ============================================

    for (
      let numeroParcela = 2;
      numeroParcela <= novaQuantidadeParcelas;
      numeroParcela++
    ) {
      const dataParcela =
        adicionarMeses(
          novaData,
          numeroParcela - 1
        );

      await dbRun(
        `INSERT INTO transactions (
          tipo,
          categoria,
          descricao,
          valor,
          data,
          recorrente,
          periodo_recorrencia,
          num_parcelas,
          data_termino,
          parcela_numero,
          transacao_original_id,
          ativo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          original.tipo,
          novaCategoria,
          novaDescricao,
          novoValor,
          dataParcela,
          0,
          null,
          novaQuantidadeParcelas,
          novaDataTermino,
          numeroParcela,
          novoOriginalId,
          1
        ]
      );
    }

    return res.json({
      message:
        'Parcelamento atualizado com sucesso',

      id: novoOriginalId,

      valor_parcela:
        novoValor,

      num_parcelas:
        novaQuantidadeParcelas,

      valor_total:
        novoValor *
        novaQuantidadeParcelas,

      data_primeira_parcela:
        novaData,

      data_ultima_parcela:
        novaDataTermino
    });

  } catch (erro) {
    console.error(
      'Erro ao atualizar transação:',
      erro
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};


/**
 * Deletar transação.
 *
 * Se for uma transação parcelada, todas as parcelas
 * relacionadas serão removidas.
 */
export const deletarTransacao = async (req, res) => {
  try {
    const { id } = req.params;

    const transacao = await dbGet(
      `SELECT *
       FROM transactions
       WHERE id = ?`,
      [id]
    );

    if (!transacao) {
      return res.status(404).json({
        erro: 'Transação não encontrada'
      });
    }

    const transacaoOriginalId =
      transacao.transacao_original_id ||
      transacao.id;

    // Apagar todas as parcelas
    await dbRun(
      `DELETE FROM transactions
       WHERE id = ?
          OR transacao_original_id = ?`,
      [
        transacaoOriginalId,
        transacaoOriginalId
      ]
    );

    // Limpar logs relacionados
    await dbRun(
      `DELETE FROM recurrence_log
       WHERE transaction_id = ?`,
      [transacaoOriginalId]
    );

    return res.json({
      message:
        'Transação e suas parcelas deletadas com sucesso'
    });

  } catch (erro) {
    console.error(
      'Erro ao deletar transação:',
      erro
    );

    return res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
};