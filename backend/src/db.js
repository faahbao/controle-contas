import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../database.sqlite');

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('✅ Conectado ao SQLite:', DB_PATH);
  }
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

/**
 * Inicializa o schema do banco de dados
 */
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {

      // =====================================================
      // TABELA DE TRANSAÇÕES
      // =====================================================

      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
          categoria TEXT NOT NULL,
          descricao TEXT,
          valor REAL NOT NULL,
          data TEXT NOT NULL,
          recorrente BOOLEAN DEFAULT 0,
          periodo_recorrencia TEXT CHECK(periodo_recorrencia IN ('mensal', null)),
          num_parcelas INTEGER,
          data_termino TEXT,
          parcela_numero INTEGER,
          transacao_original_id INTEGER,
          ativo BOOLEAN DEFAULT 1,
          criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
          atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {

        if (err) {
          console.error('Erro ao criar tabela transactions:', err);
          reject(err);
          return;
        }

        console.log('✅ Tabela transactions criada');

        // ===================================================
        // MIGRAÇÕES DA TABELA TRANSACTIONS
        // ===================================================

        const columnMigrations = [
          'ALTER TABLE transactions ADD COLUMN num_parcelas INTEGER',
          'ALTER TABLE transactions ADD COLUMN data_termino TEXT',
          'ALTER TABLE transactions ADD COLUMN parcela_numero INTEGER',
          'ALTER TABLE transactions ADD COLUMN transacao_original_id INTEGER'
        ];

        let completedMigrations = 0;

        columnMigrations.forEach((migration) => {

          db.run(migration, (err) => {

            // Ignorar erro quando a coluna já existir
            if (
              err &&
              !err.message.toLowerCase().includes('duplicate column')
            ) {
              console.error(
                'Erro em migração:',
                err.message
              );
            }

            completedMigrations++;

            if (
              completedMigrations ===
              columnMigrations.length
            ) {
              criarTabelasComplementares();
            }
          });

        });

        // ===================================================
        // TABELAS COMPLEMENTARES
        // ===================================================

        function criarTabelasComplementares() {

          // -------------------------------------------------
          // LOG DE RECORRÊNCIAS
          // -------------------------------------------------

          db.run(`
            CREATE TABLE IF NOT EXISTS recurrence_log (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              transaction_id INTEGER NOT NULL,
              mes INTEGER NOT NULL,
              ano INTEGER NOT NULL,
              gerada_em TEXT DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (transaction_id)
                REFERENCES transactions(id)
                ON DELETE CASCADE,
              UNIQUE(transaction_id, mes, ano)
            )
          `, (err) => {

            if (err) {
              console.error(
                'Erro ao criar tabela recurrence_log:',
                err
              );

              reject(err);
              return;
            }

            console.log(
              '✅ Tabela recurrence_log criada'
            );

            // -------------------------------------------------
            // TABELA DE CATEGORIAS
            // -------------------------------------------------

            db.run(`
              CREATE TABLE IF NOT EXISTS categorias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo TEXT NOT NULL
                  CHECK(tipo IN ('receita', 'despesa')),
                nome TEXT NOT NULL,
                ativo BOOLEAN DEFAULT 1,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(tipo, nome)
              )
            `, (err) => {

              if (err) {
                console.error(
                  'Erro ao criar tabela categorias:',
                  err
                );

                reject(err);
                return;
              }

              console.log(
                '✅ Tabela categorias criada'
              );

              inserirCategoriasPadrao();
            });

          });

        }

        // ===================================================
        // CATEGORIAS PADRÃO
        // ===================================================

        function inserirCategoriasPadrao() {

          const categorias = [

            // -------------------------------
            // RECEITAS
            // -------------------------------

            {
              tipo: 'receita',
              nome: 'Adiantamento'
            },

            {
              tipo: 'receita',
              nome: 'Salário'
            },

            {
              tipo: 'receita',
              nome: 'Outras rendas'
            },

            // -------------------------------
            // DESPESAS
            // -------------------------------

            {
              tipo: 'despesa',
              nome: 'Cartão Itau'
            },

            {
              tipo: 'despesa',
              nome: 'Cartão PicPay'
            },

            {
              tipo: 'despesa',
              nome: 'Cartão Mercado Pago'
            },

            {
              tipo: 'despesa',
              nome: 'Vivo Internet'
            },

            {
              tipo: 'despesa',
              nome: 'Vivo Celular Mãe'
            },

            {
              tipo: 'despesa',
              nome: 'Empréstimo Shopee'
            },

            {
              tipo: 'despesa',
              nome: 'Empréstimo MP'
            },

            {
              tipo: 'despesa',
              nome: 'Empréstimo Itau'
            },

            {
              tipo: 'despesa',
              nome: 'Empréstimo PicPay'
            },

            {
              tipo: 'despesa',
              nome: 'Cartão Pai'
            }

          ];

          let concluidas = 0;

          if (categorias.length === 0) {
            finalizarInicializacao();
            return;
          }

          categorias.forEach((categoria) => {

            db.run(
              `
                INSERT OR IGNORE INTO categorias (
                  tipo,
                  nome,
                  ativo
                )
                VALUES (?, ?, 1)
              `,
              [
                categoria.tipo,
                categoria.nome
              ],
              (err) => {

                if (err) {
                  console.error(
                    'Erro ao inserir categoria padrão:',
                    err
                  );

                  reject(err);
                  return;
                }

                concluidas++;

                if (
                  concluidas ===
                  categorias.length
                ) {
                  finalizarInicializacao();
                }

              }
            );

          });

        }

        // ===================================================
        // FINALIZAÇÃO
        // ===================================================

        function finalizarInicializacao() {

          console.log(
            '✅ Categorias padrão verificadas'
          );

          console.log(
            '✅ Schema migrado com sucesso'
          );

          resolve();

        }

      });

    });
  });
};

/**
 * Promisify para db.run
 */
export const dbRun = (sql, params = []) => {

  return new Promise((resolve, reject) => {

    db.run(
      sql,
      params,
      function (err) {

        if (err) {
          reject(err);
        } else {
          resolve(this);
        }

      }
    );

  });

};

/**
 * Promisify para db.get
 */
export const dbGet = (sql, params = []) => {

  return new Promise((resolve, reject) => {

    db.get(
      sql,
      params,
      (err, row) => {

        if (err) {
          reject(err);
        } else {
          resolve(row);
        }

      }
    );

  });

};

/**
 * Promisify para db.all
 */
export const dbAll = (sql, params = []) => {

  return new Promise((resolve, reject) => {

    db.all(
      sql,
      params,
      (err, rows) => {

        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }

      }
    );

  });

};