require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./db');
const authRoutes = require('./routes/auth');
const transacaoRoutes = require('./routes/transacao');
const categoriasRoutes = require('./routes/categorias');
const dashboardRoutes = require('./routes/dashboard');
const exportRoutes = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/transacoes', transacaoRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicializa banco e depois inicia servidor
async function startServer() {
  try {
    await db.initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📝 API endpoints:`);
      console.log(`   - POST /api/auth/register`);
      console.log(`   - POST /api/auth/login`);
      console.log(`   - GET  /api/auth/me (requer token)`);
      console.log(`   - GET  /api/transacoes`);
      console.log(`   - POST /api/transacoes`);
      console.log(`   - GET  /api/categorias`);
      console.log(`   - POST /api/categorias`);
      console.log(`   - GET  /api/dashboard`);
    });
  } catch (err) {
    console.error('❌ Erro ao inicializar banco de dados:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
