const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-teste-123456789';

app.use(cors());
app.use(express.json());

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// AUTH - LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, nome: user.nome, email: user.email }, token });
  } catch (error) {
    console.error('Erro login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// AUTH - REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email já cadastrado' });
    const hashed = await bcrypt.hash(senha, 10);
    const user = await prisma.user.create({ data: { nome, email, senha: hashed } });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user.id, nome: user.nome, email: user.email }, token });
  } catch (error) {
    console.error('Erro registro:', error);
    res.status(500).json({ error: 'Erro ao registrar' });
  }
});

// DASHBOARD
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const { mes, ano } = req.query;
    
    let where = { userId: req.userId };
    
    if (mes && ano) {
      const inicioMes = new Date(parseInt(ano), parseInt(mes) - 1, 1);
      const fimMes = new Date(parseInt(ano), parseInt(mes), 0, 23, 59, 59);
      where.data = {
        gte: inicioMes,
        lte: fimMes
      };
    }
    
    const transacoes = await prisma.transacao.findMany({
      where,
      orderBy: { data: 'desc' }
    });
    
    const receitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const despesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const saldo = receitas - despesas;
    
    const maxValor = Math.max(receitas, despesas, 1);
    const grafico = {
      receitas,
      despesas,
      receitasPorcentagem: (receitas / maxValor) * 100,
      despesasPorcentagem: (despesas / maxValor) * 100
    };
    
    res.json({
      receitas,
      despesas,
      saldo,
      transacoes,
      grafico
    });
  } catch (error) {
    console.error('Erro dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dashboard' });
  }
});

// TRANSAÇÕES
app.post('/api/transacoes', authMiddleware, async (req, res) => {
  try {
    const { descricao, valor, tipo, categoria, data, recorrente, frequencia, parcelas } = req.body;
    
    console.log('=== DADOS RECEBIDOS ===');
    console.log('descricao:', descricao);
    console.log('valor:', valor);
    console.log('tipo:', tipo);
    console.log('categoria:', categoria);
    console.log('data:', data);
    console.log('recorrente:', recorrente, 'tipo:', typeof recorrente);
    console.log('frequencia:', frequencia);
    console.log('parcelas:', parcelas, 'tipo:', typeof parcelas);
    console.log('======================');
    
    // ✅ Verifica se é recorrente E tem parcelas > 1
    if (recorrente && parcelas && parseInt(parcelas) > 1) {
      console.log('>>> Criando parcelas:', parcelas);
      
      // Criar múltiplas parcelas
      const dataBase = new Date(data);
      const transacoes = [];
      
      for (let i = 0; i < parseInt(parcelas); i++) {
        let novaData = new Date(dataBase);
        
        if (frequencia === 'diaria') {
          novaData.setDate(novaData.getDate() + i);
        } else if (frequencia === 'semanal') {
          novaData.setDate(novaData.getDate() + (i * 7));
        } else if (frequencia === 'mensal') {
          novaData.setMonth(novaData.getMonth() + i);
        }
        
        console.log(`>>> Criando parcela ${i + 1}/${parcelas} para ${novaData}`);
        
        const transacao = await prisma.transacao.create({
          data: {
            descricao: `${descricao} (${i + 1}/${parcelas})`,
            valor: parseFloat(valor),
            tipo,
            categoria,
            data: novaData,
            recorrente: true,
            frequencia,
            parcelas: parseInt(parcelas),
            parcelaAtual: i + 1,
            userId: req.userId
          }
        });
        transacoes.push(transacao);
      }
      
      console.log(`>>> ${parcelas} parcelas criadas!`);
      res.status(201).json({ 
        mensagem: `${parcelas} parcelas criadas com sucesso!`,
        transacoes 
      });
    } else {
      console.log('>>> Criando transação única');
      // Criar transação única
      const t = await prisma.transacao.create({ 
        data: { 
          descricao, 
          valor: parseFloat(valor), 
          tipo, 
          categoria, 
          data: data ? new Date(data) : new Date(),
          recorrente: recorrente || false,
          frequencia: frequencia || null,
          parcelas: parcelas ? parseInt(parcelas) : null,
          parcelaAtual: 1,
          userId: req.userId 
        } 
      });
      res.status(201).json(t);
    }
  } catch (error) { 
    console.error('Erro criar transacao:', error);
    res.status(500).json({ error: 'Erro ao criar transação' }); 
  }
});

// Rota de transação
app.post('/api/transacoes', authMiddleware, async (req, res) => {
  try {
    const { descricao, valor, tipo, categoria, data, recorrente, frequencia, parcelas } = req.body;
    
    console.log('Dados recebidos:', { descricao, valor, tipo, categoria, data, recorrente, frequencia, parcelas });
    
    // ✅ Verifica se é recorrente E tem parcelas > 1
    if (recorrente === true && parcelas && parseInt(parcelas) > 1) {
      console.log('Criando parcelas:', parcelas);
      
      // Criar múltiplas parcelas
      const dataBase = new Date(data);
      const transacoes = [];
      
      for (let i = 0; i < parseInt(parcelas); i++) {
        let novaData = new Date(dataBase);
        
        if (frequencia === 'diaria') {
          novaData.setDate(novaData.getDate() + i);
        } else if (frequencia === 'semanal') {
          novaData.setDate(novaData.getDate() + (i * 7));
        } else if (frequencia === 'mensal') {
          novaData.setMonth(novaData.getMonth() + i);
        }
        
        console.log(`Criando parcela ${i + 1}/${parcelas} para ${novaData}`);
        
        const transacao = await prisma.transacao.create({
          data: {
            descricao: `${descricao} (${i + 1}/${parcelas})`,
            valor: parseFloat(valor),
            tipo,
            categoria,
            data: novaData,
            recorrente: true,
            frequencia,
            parcelas: parseInt(parcelas),
            parcelaAtual: i + 1,
            userId: req.userId
          }
        });
        transacoes.push(transacao);
      }
      
      console.log(`${parcelas} parcelas criadas!`);
      res.status(201).json({ 
        mensagem: `${parcelas} parcelas criadas com sucesso!`,
        transacoes 
      });
    } else {
      console.log('Criando transação única');
      // Criar transação única
      const t = await prisma.transacao.create({ 
        data: { 
          descricao, 
          valor: parseFloat(valor), 
          tipo, 
          categoria, 
          data: data ? new Date(data) : new Date(),
          recorrente: recorrente || false,
          frequencia: frequencia || null,
          parcelas: parcelas || null,
          parcelaAtual: 1,
          userId: req.userId 
        } 
      });
      res.status(201).json(t);
    }
  } catch (error) { 
    console.error('Erro criar transacao:', error);
    res.status(500).json({ error: 'Erro ao criar transação' }); 
  }
});

// Rota de Update
app.put('/api/transacoes/:id', authMiddleware, async (req, res) => {
  try {
    const { descricao, valor, tipo, categoria, data, recorrente, frequencia } = req.body;
    const t = await prisma.transacao.update({ 
      where: { id: parseInt(req.params.id) }, 
      data: { 
        descricao, 
        valor: parseFloat(valor), 
        tipo, 
        categoria,
        data: data ? new Date(data) : undefined,
        recorrente: recorrente || false,
        frequencia: frequencia || null
      } 
    });
    res.json(t);
  } catch (error) { 
    console.error('Erro atualizar transacao:', error);
    res.status(500).json({ error: 'Erro ao atualizar transação' }); 
  }
});

app.delete('/api/transacoes/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.transacao.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (error) { res.status(500).json({ error: 'Erro' }); }
});

// CATEGORIAS
app.get('/api/categorias', authMiddleware, async (req, res) => {
  try {
    const cats = await prisma.categoria.findMany({ where: { userId: req.userId } });
    res.json(cats);
  } catch (error) { res.status(500).json({ error: 'Erro' }); }
});

app.post('/api/categorias', authMiddleware, async (req, res) => {
  try {
    const { nome, tipo } = req.body;
    const c = await prisma.categoria.create({ data: { nome, tipo, userId: req.userId } });
    res.status(201).json(c);
  } catch (error) { res.status(500).json({ error: 'Erro' }); }
});

// PDF
app.get('/api/relatorio/pdf', authMiddleware, async (req, res) => {
  try {
    const PDFDocument = require('pdfkit');
    const { mes, ano } = req.query;
    let where = { userId: req.userId };
    if (mes && ano) {
      where.data = { gte: new Date(ano, mes - 1, 1), lte: new Date(ano, mes, 0, 23, 59, 59) };
    }
    const transacoes = await prisma.transacao.findMany({ where });
    const receitas = transacoes.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0);
    const despesas = transacoes.filter(t => t.tipo === 'despesa').reduce((s, t) => s + t.valor, 0);
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-${ano}-${mes}.pdf`);
    doc.pipe(res);
    doc.fontSize(20).text('Relatório Financeiro', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Período: ${mes}/${ano}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text('Resumo', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Receitas: R$ ${receitas.toFixed(2)}`);
    doc.text(`Despesas: R$ ${despesas.toFixed(2)}`);
    doc.text(`Saldo: R$ ${(receitas - despesas).toFixed(2)}`);
    doc.end();
  } catch (error) {
    res.status(500).json({ error: 'Erro PDF' });
  }
});

async function startServer() {
  await prisma.$connect();
  console.log('✅ Banco conectado');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
    console.log('📝 Endpoints: /api/auth/login, /api/auth/register, /api/dashboard, /api/transacoes, /api/categorias');
  });
}

startServer();