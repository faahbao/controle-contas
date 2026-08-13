import schedule from 'node-schedule';
import { dbAll, dbRun, dbGet } from '../db.js';

/**
 * Gera transações recorrentes para o mês atual
 */
const gerarRecorrenciasDoMes = async () => {
  try {
    const agora = new Date();
    const mesAtual = agora.getMonth() + 1; // 1-12
    const anoAtual = agora.getFullYear();

    console.log(`⏰ Verificando recorrências para ${mesAtual}/${anoAtual}...`);

    // Buscar todas as transações recorrentes ativas (parcela 1 = transação original)
    const transacoesRecorrentes = await dbAll(
      `SELECT * FROM transactions 
       WHERE recorrente = 1 AND periodo_recorrencia = 'mensal' AND ativo = 1 AND parcela_numero = 1`
    );

    for (const transacao of transacoesRecorrentes) {
      // Verificar se tem limite de parcelas
      const numParcelas = transacao.num_parcelas || 999; // 999 = infinito
      
      // Contar quantas parcelas já foram geradas
      const parcelajaGerada = await dbGet(
        'SELECT COUNT(*) as count FROM transactions WHERE transacao_original_id = ?',
        [transacao.id]
      );

      const parcelasGeradas = parcelajaGerada?.count || 0;

      // Se já atingiu o limite, pular
      if (parcelasGeradas >= numParcelas) {
        console.log(`ℹ️  Transação ${transacao.id} já atingiu ${numParcelas} parcelas. Pulando...`);
        continue;
      }

      // Verificar se já foi gerada para este mês
      const jaProcedida = await dbGet(
        'SELECT id FROM recurrence_log WHERE transaction_id = ? AND mes = ? AND ano = ?',
        [transacao.id, mesAtual, anoAtual]
      );

      if (!jaProcedida) {
        // Extrair dia da transação original
        const dataParts = transacao.data.split('-'); // YYYY-MM-DD
        const diaOriginal = dataParts[2];

        // Criar nova data para este mês
        const novaData = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${String(diaOriginal).padStart(2, '0')}`;

        // Número da próxima parcela
        const proximaParcela = parcelasGeradas + 2; // +1 para contar original, +1 para próxima

        // Inserir nova parcela
        const resultado = await dbRun(
          `INSERT INTO transactions (tipo, categoria, descricao, valor, data, recorrente, periodo_recorrencia, num_parcelas, data_termino, parcela_numero, transacao_original_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [transacao.tipo, transacao.categoria, transacao.descricao, transacao.valor, novaData, 1, 'mensal', transacao.num_parcelas, transacao.data_termino, proximaParcela, transacao.id]
        );

        // Registrar no log de recorrências
        await dbRun(
          'INSERT INTO recurrence_log (transaction_id, mes, ano) VALUES (?, ?, ?)',
          [transacao.id, mesAtual, anoAtual]
        );

        const infoParcel = transacao.num_parcelas ? ` (${proximaParcela}/${transacao.num_parcelas})` : '';
        console.log(`✅ Parcela gerada: ${transacao.categoria} (${transacao.valor})${infoParcel} para ${novaData}`);
      }
    }

    console.log('✅ Verificação de recorrências concluída');
  } catch (erro) {
    console.error('❌ Erro ao gerar recorrências:', erro);
  }
};

/**
 * Inicializa o job de recorrências
 * Roda diariamente à meia-noite
 */
export const iniciarJobRecorrencia = () => {
  // Executar imediatamente na primeira vez
  gerarRecorrenciasDoMes();

  // Agendar para rodas todos os dias à 00:01
  schedule.scheduleJob('1 0 * * *', () => {
    console.log('🔄 Executando job de recorrências...');
    gerarRecorrenciasDoMes();
  });

  console.log('📅 Job de recorrências agendado (diariamente às 00:01)');
};
