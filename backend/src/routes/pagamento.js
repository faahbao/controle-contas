const express = require('express')
const router = express.Router()
const knex = require('../db')

/**
 * PATCH /transacoes/:id/pagamento
 * Atualiza o status de pagamento de uma transação
 */
router.patch('/transacoes/:id/pagamento', async (req, res) => {
  try {
    const { id } = req.params
    const { paga } = req.body

    if (typeof paga !== 'boolean') {
      return res.status(400).json({
        error: 'O campo "paga" deve ser um valor booleano (true ou false).'
      })
    }

    const transacao = await knex('transacoes').where({ id }).first()

    if (!transacao) {
      return res.status(404).json({
        error: 'Transação não encontrada.'
      })
    }

    await knex('transacoes').where({ id }).update({ paga })

    const transacaoAtualizada = await knex('transacoes').where({ id }).first()

    return res.json({
      mensagem: `Transação ${paga ? 'marcada como paga' : 'marcada como pendente'}.`,
      transacao: transacaoAtualizada
    })
  } catch (error) {
    console.error('Erro ao atualizar status de pagamento:', error)

    return res.status(500).json({
      error: 'Erro ao atualizar status de pagamento.'
    })
  }
})

module.exports = router