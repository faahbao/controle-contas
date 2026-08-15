require('dotenv').config();

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: process.env.DATABASE_URL?.replace('file:', '') || './dev.db'
  },
  useNullAsDefault: true
});

// Cria tabela de usuarios se nao existir
async function initializeDatabase() {
  const hasTable = await knex.schema.hasTable('users');
  
  if (!hasTable) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('email').notNullable().unique();
      table.string('senha').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
    
    console.log('✅ Tabela "users" criada com sucesso');
  } else {
    console.log('📋 Tabela "users" ja existe');
  }

  // Verifica outras tabelas existentes
  const tables = ['categorias', 'transacoes'];
  for (const tableName of tables) {
    const exists = await knex.schema.hasTable(tableName);
    if (exists) {
      console.log(`📋 Tabela "${tableName}" ja existe`);
    }
  }
}

module.exports = knex;
module.exports.initializeDatabase = initializeDatabase;
