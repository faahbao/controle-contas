import express from 'express';
import { dbAll, dbGet, dbRun } from '../db.js';

const router = express.Router();

/**
 * GET /api/categorias
 *
 * Lista todas as categorias ativas.
 *
 * Pode receber:
 * ?tipo=receita
 * ?tipo=despesa
 */
router.get('/', async (req, res) => {
  try {
    const { tipo } = req.query;

    let sql = `
      SELECT
        id,
        tipo,
        nome,
        ativo,
        criado_em,
        atualizado_em
      FROM categorias
      WHERE ativo = 1
    `;

    const params = [];

    if (tipo === 'receita' || tipo === 'despesa') {
      sql += ' AND tipo = ?';
      params.push(tipo);
    }

    sql += ' ORDER BY nome COLLATE NOCASE ASC';

    const categorias = await dbAll(sql, params);

    res.json(categorias);

  } catch (erro) {
    console.error('Erro ao listar categorias:', erro);

    res.status(500).json({
      erro: 'Erro ao listar categorias'
    });
  }
});

/**
 * POST /api/categorias
 *
 * Cria uma nova categoria.
 *
 * Se a categoria existir, mas estiver inativa,
 * ela será reativada automaticamente.
 */
router.post('/', async (req, res) => {
  try {
    const { tipo, nome } = req.body;

    if (!tipo || !['receita', 'despesa'].includes(tipo)) {
      return res.status(400).json({
        erro: 'Tipo inválido. Use receita ou despesa.'
      });
    }

    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({
        erro: 'Nome da categoria é obrigatório.'
      });
    }

    const nomeNormalizado = nome.trim();

    if (!nomeNormalizado) {
      return res.status(400).json({
        erro: 'Nome da categoria não pode estar vazio.'
      });
    }

    if (nomeNormalizado.length > 100) {
      return res.status(400).json({
        erro: 'Nome da categoria deve ter no máximo 100 caracteres.'
      });
    }

    const existente = await dbGet(
      `
        SELECT
          id,
          tipo,
          nome,
          ativo,
          criado_em,
          atualizado_em
        FROM categorias
        WHERE tipo = ?
          AND LOWER(nome) = LOWER(?)
      `,
      [tipo, nomeNormalizado]
    );

    if (existente) {

      if (Number(existente.ativo) === 1) {
        return res.status(409).json({
          erro: 'Esta categoria já existe.'
        });
      }

      await dbRun(
        `
          UPDATE categorias
          SET
            ativo = 1,
            atualizado_em = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        [existente.id]
      );

      const categoriaReativada = await dbGet(
        `
          SELECT
            id,
            tipo,
            nome,
            ativo,
            criado_em,
            atualizado_em
          FROM categorias
          WHERE id = ?
        `,
        [existente.id]
      );

      console.log(
        `Categoria reativada: ${categoriaReativada.nome} (${categoriaReativada.tipo})`
      );

      return res.status(200).json(categoriaReativada);
    }

    const resultado = await dbRun(
      `
        INSERT INTO categorias (
          tipo,
          nome,
          ativo
        )
        VALUES (?, ?, 1)
      `,
      [tipo, nomeNormalizado]
    );

    const categoria = await dbGet(
      `
        SELECT
          id,
          tipo,
          nome,
          ativo,
          criado_em,
          atualizado_em
        FROM categorias
        WHERE id = ?
      `,
      [resultado.lastID]
    );

    console.log(
      `Categoria criada: ${categoria.nome} (${categoria.tipo})`
    );

    res.status(201).json(categoria);

  } catch (erro) {
    console.error('Erro ao criar categoria:', erro);

    if (
      erro.code === 'SQLITE_CONSTRAINT' &&
      erro.message.includes('UNIQUE')
    ) {
      return res.status(409).json({
        erro: 'Esta categoria já existe.'
      });
    }

    res.status(500).json({
      erro: 'Erro ao criar categoria'
    });
  }
});

/**
 * PUT /api/categorias/:id
 *
 * Edita o nome de uma categoria.
 *
 * Body:
 * {
 *   "nome": "Novo nome"
 * }
 */
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: 'ID da categoria inválido.'
      });
    }

    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({
        erro: 'Nome da categoria é obrigatório.'
      });
    }

    const nomeNormalizado = nome.trim();

    if (!nomeNormalizado) {
      return res.status(400).json({
        erro: 'Nome da categoria não pode estar vazio.'
      });
    }

    if (nomeNormalizado.length > 100) {
      return res.status(400).json({
        erro: 'Nome da categoria deve ter no máximo 100 caracteres.'
      });
    }

    const categoria = await dbGet(
      `
        SELECT
          id,
          tipo,
          nome,
          ativo
        FROM categorias
        WHERE id = ?
      `,
      [id]
    );

    if (!categoria) {
      return res.status(404).json({
        erro: 'Categoria não encontrada.'
      });
    }

    if (Number(categoria.ativo) !== 1) {
      return res.status(400).json({
        erro: 'Esta categoria está removida.'
      });
    }

    /**
     * Verificar se já existe outra categoria com
     * o mesmo nome e o mesmo tipo.
     */
    const duplicada = await dbGet(
      `
        SELECT
          id,
          nome
        FROM categorias
        WHERE tipo = ?
          AND LOWER(nome) = LOWER(?)
          AND id <> ?
          AND ativo = 1
      `,
      [categoria.tipo, nomeNormalizado, id]
    );

    if (duplicada) {
      return res.status(409).json({
        erro: 'Já existe outra categoria com este nome.'
      });
    }

    await dbRun(
      `
        UPDATE categorias
        SET
          nome = ?,
          atualizado_em = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [nomeNormalizado, id]
    );

    const categoriaAtualizada = await dbGet(
      `
        SELECT
          id,
          tipo,
          nome,
          ativo,
          criado_em,
          atualizado_em
        FROM categorias
        WHERE id = ?
      `,
      [id]
    );

    console.log(
      `Categoria editada: ${categoriaAtualizada.nome} (${categoriaAtualizada.tipo})`
    );

    res.json(categoriaAtualizada);

  } catch (erro) {
    console.error('Erro ao editar categoria:', erro);

    if (
      erro.code === 'SQLITE_CONSTRAINT' &&
      erro.message.includes('UNIQUE')
    ) {
      return res.status(409).json({
        erro: 'Já existe uma categoria com este nome.'
      });
    }

    res.status(500).json({
      erro: 'Erro ao editar categoria'
    });
  }
});

/**
 * DELETE /api/categorias/:id
 *
 * Remove uma categoria.
 *
 * A categoria não é apagada fisicamente.
 * Ela apenas fica inativa.
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: 'ID da categoria inválido.'
      });
    }

    const categoria = await dbGet(
      `
        SELECT
          id,
          tipo,
          nome,
          ativo
        FROM categorias
        WHERE id = ?
      `,
      [id]
    );

    if (!categoria) {
      return res.status(404).json({
        erro: 'Categoria não encontrada.'
      });
    }

    if (!categoria.ativo) {
      return res.status(400).json({
        erro: 'Esta categoria já está removida.'
      });
    }

    const transacoes = await dbGet(
      `
        SELECT COUNT(*) AS quantidade
        FROM transactions
        WHERE tipo = ?
          AND categoria = ?
      `,
      [categoria.tipo, categoria.nome]
    );

    if (Number(transacoes?.quantidade || 0) > 0) {
      return res.status(409).json({
        erro: 'Não é possível remover esta categoria porque ela já está sendo utilizada em transações.',
        quantidadeTransacoes: Number(transacoes.quantidade)
      });
    }

    await dbRun(
      `
        UPDATE categorias
        SET
          ativo = 0,
          atualizado_em = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [id]
    );

    console.log(
      `Categoria removida: ${categoria.nome} (${categoria.tipo})`
    );

    res.json({
      mensagem: 'Categoria removida com sucesso.'
    });

  } catch (erro) {
    console.error('Erro ao remover categoria:', erro);

    res.status(500).json({
      erro: 'Erro ao remover categoria'
    });
  }
});

export default router;