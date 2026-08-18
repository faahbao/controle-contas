exports.up = function(knex) {
  return knex.schema.createTable('transacoes', (table) => {
    table.increments('id').primary()
    table.string('descricao').notNullable()
    table.decimal('valor', 10, 2).notNullable()
    table.enum('tipo', ['receita', 'despesa']).notNullable()
    table.string('categoria').notNullable()
    table.date('data').notNullable()
    table.boolean('recorrente').defaultTo(false)
    table.enum('frequencia', ['diaria', 'semanal', 'mensal'])
    table.integer('parcelas')
    table.integer('parcelaAtual')
    table.uuid('grupoParcelasId')
    table.boolean('paga').defaultTo(false).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('transacoes')
}