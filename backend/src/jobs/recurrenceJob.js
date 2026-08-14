import schedule from 'node-schedule';
import { dbAll, dbRun, dbGet } from '../db.js';

/**
 * Gera transações de recorrência mensal.
 *
 * IMPORTANTE:
 * Parcelamentos com quantidade definida já são criados
 * integralmente no momento do cadastro.
 *
 * Este job é utilizado somente para recorrências
 * sem quantidade definida de parcelas.
 */
const gerarRecorrenciasDoMes = async () => {
  try {
    const agora = new Date();

    const mesAtual = agora.getMonth() + 1;
    const anoAtual = agora.getFullYear();

    console.log(
      `⏰ Verificando recorrências para ${mesAtual}/${anoAtual}...`
    );

    /*
     * Buscar somente recorrências sem quantidade definida.
     *
     * num_parcelas IS NULL = recorrência contínua.
     *
     * Parcelamentos com:
     * num_parcelas = 10
     *
     * NÃO entram aqui, pois já possuem suas 10 parcelas
     * criadas pelo controller.
     */
    const transacoesRecorrentes = await dbAll(
      `SELECT *
       FROM transactions
       WHERE recorrente = 1
         AND periodo_recorrencia = 'mensal'
         AND ativo = 1
         AND parcela_numero = 1
         AND num_parcelas IS NULL`
    );

    console.log(
      `🔎 ${transacoesRecorrentes.length} recorrência(s) contínua(s) encontrada(s).`
    );

    for (const transacao of transacoesRecorrentes) {
      try {
        /*
         * Verificar se já existe uma geração desta recorrência
         * para o mês atual.
         */
        const jaGerada = await dbGet(
          `SELECT id
           FROM recurrence_log
           WHERE transaction_id = ?
             AND mes = ?
             AND ano = ?`,
          [
            transacao.id,
            mesAtual,
            anoAtual
          ]
        );

        if (jaGerada) {
          console.log(
            `ℹ️ Recorrência ${transacao.id} já foi gerada para ${mesAtual}/${anoAtual}.`
          );

          continue;
        }

        /*
         * Evitar criar a própria transação original novamente
         * no mesmo mês.
         */
        const dataOriginal = new Date(
          `${transacao.data}T12:00:00`
        );

        const diaOriginal = dataOriginal.getDate();

        /*
         * Ajustar o dia para meses que não possuem aquele dia.
         *
         * Exemplo:
         * uma recorrência cadastrada no dia 31
         * será criada no último dia de fevereiro.
         */
        const ultimoDiaDoMes = new Date(
          anoAtual,
          mesAtual,
          0
        ).getDate();

        const dia = Math.min(
          diaOriginal,
          ultimoDiaDoMes
        );

        const novaData =
          `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        /*
         * Se a transação original já pertence ao mês atual,
         * não criar uma cópia.
         */
        if (
          transacao.data === novaData &&
          transacao.id === transacao.transacao_original_id
        ) {
          await dbRun(
            `INSERT OR IGNORE INTO recurrence_log
             (transaction_id, mes, ano)
             VALUES (?, ?, ?)`,
            [
              transacao.id,
              mesAtual,
              anoAtual
            ]
          );

          console.log(
            `ℹ️ Recorrência ${transacao.id} já possui lançamento em ${novaData}.`
          );

          continue;
        }

        /*
         * Criar a nova ocorrência mensal.
         */
        const resultado = await dbRun(
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
            transacao_original_id
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            transacao.tipo,
            transacao.categoria,
            transacao.descricao,
            transacao.valor,
            novaData,
            1,
            'mensal',
            null,
            null,
            1,
            transacao.id
          ]
        );

        /*
         * Registrar que a recorrência foi processada.
         */
        await dbRun(
          `INSERT OR IGNORE INTO recurrence_log
           (transaction_id, mes, ano)
           VALUES (?, ?, ?)`,
          [
            transacao.id,
            mesAtual,
            anoAtual
          ]
        );

        console.log(
          `✅ Recorrência gerada: ${transacao.categoria} ` +
          `(${transacao.valor}) para ${novaData} ` +
          `[ID ${resultado.lastID}]`
        );

      } catch (erroTransacao) {
        console.error(
          `❌ Erro ao processar recorrência ${transacao.id}:`,
          erroTransacao
        );
      }
    }

    console.log(
      '✅ Verificação de recorrências concluída'
    );

  } catch (erro) {
    console.error(
      '❌ Erro ao gerar recorrências:',
      erro
    );
  }
};

/**
 * Inicializa o job de recorrências.
 *
 * Executa imediatamente ao iniciar o servidor
 * e depois diariamente às 00:01.
 */
export const iniciarJobRecorrencia = () => {

  // Executar imediatamente ao iniciar o backend.
  gerarRecorrenciasDoMes();

  // Executar todos os dias às 00:01.
  schedule.scheduleJob(
    '1 0 * * *',
    () => {
      console.log(
        '🔄 Executando job de recorrências...'
      );

      gerarRecorrenciasDoMes();
    }
  );

  console.log(
    '📅 Job de recorrências agendado (diariamente às 00:01)'
  );
};