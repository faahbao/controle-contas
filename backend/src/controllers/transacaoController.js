import { dbRun, dbGet, dbAll } from '../db.js';

/**
 * Criar nova transação com suporte a parcelamento
 */
export const criarTransacao = async (req, res) => {
  try {
    const { tipo, categoria, descricao, valor, data, recorrente, periodo_recorrencia, num_parcelas } = req.body;

    // Validações básicas
    if (!tipo || !categoria || !valor || !data) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    if (tipo !== 'receita' && tipo !== 'despesa') {
      return res.status(400).json({ erro: 'Tipo inválido' });
    }

    if (valor <= 0) {
      return res.status(400).json({ erro: 'Valor deve ser maior que zero' });
    }

    // Calcular data de término se for parcelado
    let dataTermino = null;
    if (recorrente && num_parcelas && num_parcelas > 1) {
      const dataInicio = new Date(data);
      dataInicio.setMonth(dataInicio.getMonth() + (num_parcelas - 1));
      dataTermino = dataInicio.toISOString().split('T')[0];
    }

    // Inserir transação original (mãe) com informações de parcelamento
    const result = await dbRun(
      `INSERT INTO transactions (tipo, categoria, descricao, valor, data, recorrente, periodo_recorrencia, num_parcelas, data_termino, parcela_numero, transacao_original_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tipo, categoria, descricao, valor, data, recorrente ? 1 : 0, recorrente ? 'mensal' : null, num_parcelas || null, dataTermino, 1, null]
    );

    res.status(201).json({
      id: result.lastID,
      message: `Transação criada com sucesso${num_parcelas ? ` (${num_parcelas} parcelas)` : ''}`,
      num_parcelas: num_parcelas || 1,
      data_termino: dataTermino
    });
  } catch (erro) {
    console.error('Erro ao criar transação:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

/**
 * Listar transações com filtros
 */
export const listarTransacoes = async (req, res) => {
  try {
    const { tipo, categoria, data_inicio, data_fim, recorrente, page = 1, limit = 50 } = req.query;

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
      params.push(recorrente === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY data DESC';

    // Paginação
    const offset = (page - 1) * limit;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const transacoes = await dbAll(sql, params);

    res.json({
      transacoes,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (erro) {
    console.error('Erro ao listar transações:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

/**
 * Obter uma transação por ID
 */
export const obterTransacao = async (req, res) => {
  try {
    const { id } = req.params;

    const transacao = await dbGet(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );

    if (!transacao) {
      return res.status(404).json({ erro: 'Transação não encontrada' });
    }

    res.json(transacao);
  } catch (erro) {
    console.error('Erro ao obter transação:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

/**
 * Atualizar transação
 */
export const atualizarTransacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoria, descricao, valor, data, recorrente, periodo_recorrencia, num_parcelas } = req.body;

    // Verificar se transação existe
    const transacao = await dbGet(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );

    if (!transacao) {
      return res.status(404).json({ erro: 'Transação não encontrada' });
    }

    const novoValor = valor ?? transacao.valor;
    const novaData = data ?? transacao.data;
    const novaRecorrente = recorrente !== undefined ? recorrente : transacao.recorrente;
    const novoPeriodo = novaRecorrente ? (periodo_recorrencia ?? 'mensal') : null;
    const novasParc = num_parcelas ?? transacao.num_parcelas;

    // Calcular data de término se for parcelado
    let novaDataTermino = transacao.data_termino;
    if (novaRecorrente && novasParc && novasParc > 1) {
      const dataInicio = new Date(novaData);
      dataInicio.setMonth(dataInicio.getMonth() + (novasParc - 1));
      novaDataTermino = dataInicio.toISOString().split('T')[0];
    }

    await dbRun(
      `UPDATE transactions 
       SET categoria = ?, descricao = ?, valor = ?, data = ?, recorrente = ?, periodo_recorrencia = ?, num_parcelas = ?, data_termino = ?, atualizado_em = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [categoria ?? transacao.categoria, descricao ?? transacao.descricao, novoValor, novaData, novaRecorrente ? 1 : 0, novoPeriodo, novasParc, novaDataTermino, id]
    );

    res.json({ message: 'Transação atualizada com sucesso' });
  } catch (erro) {
    console.error('Erro ao atualizar transação:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

/**
 * Deletar transação
 */
export const deletarTransacao = async (req, res) => {
  try {
    const { id } = req.params;

    const transacao = await dbGet(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );

    if (!transacao) {
      return res.status(404).json({ erro: 'Transação não encontrada' });
    }

    await dbRun('DELETE FROM transactions WHERE id = ?', [id]);

    res.json({ message: 'Transação deletada com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar transação:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
