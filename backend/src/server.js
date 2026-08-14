import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db.js';
import { iniciarJobRecorrencia } from './jobs/recurrenceJob.js';
import transacaoRoutes from './routes/transacao.js';
import dashboardRoutes from './routes/dashboard.js';
import exportRoutes from './routes/export.js';
import categoriasRoutes from './routes/categorias.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/receitas', transacaoRoutes);
app.use('/api/despesas', transacaoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/categorias', categoriasRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Inicializar banco e iniciar servidor
const iniciarServidor = async () => {
  try {
    await initializeDatabase();
    console.log('✅ Banco de dados inicializado');

    // Iniciar job de recorrências
    iniciarJobRecorrencia();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error('❌ Erro ao inicializar servidor:', erro);
    process.exit(1);
  }
};

iniciarServidor();
