const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');

const app = express();
const prisma = new PrismaClient();

// ✅ SEGURANÇA: Headers HTTP
app.use(helmet());

// ✅ SEGURANÇA: CORS configurado
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// ✅ SEGURANÇA: Sanitização XSS
app.use(xss());

// ✅ SEGURANÇA: Rate limiting geral
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições, tente novamente mais tarde'
});
app.use('/api/', limiter);

// ✅ SEGURANÇA: Rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login'
});

// ✅ SEGURANÇA: JWT Secret forte
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-muito-forte-aleatoria-32-caracteres-minimo';

// ✅ SEGURANÇA: Schema de validação
const authSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required()
});

const transacaoSchema = Joi.object({
  descricao: Joi.string().min(3).max(100).required(),
  valor: Joi.number().positive().required(),
  tipo: Joi.string().valid('receita', 'despesa').required(),
  categoria: Joi.string().min(3).max(50).required(),
  data: Joi.date().iso().required(),
  recorrente: Joi.boolean().default(false),
  frequencia: Joi.string().valid('diaria', 'semanal', 'mensal').allow(null),
  parcelas: Joi.number().integer().min(1).max(120).allow(null)
});

const categoriaSchema = Joi.object({
  nome: Joi.string().min(3).max(50).required(),
  tipo: Joi.string().valid('receita', 'despesa').required()
});

// Middleware de autenticação
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Auth - Cadastro
app.post('/api/auth/cadastro', async (req, res) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { nome, email, senha } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // ✅ SEGURANÇA: Hash na senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: { nome, email, senha: senhaHash }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, nome: user.nome } });
  } catch (error) {
    console.error('Erro cadastro:', error.message);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Auth - Login
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { error } = Joi.object({
      email: Joi.string().email().required(),
      senha: Joi.string().required()
    }).validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, senha } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // ✅ SEGURANÇA: Comparar hash
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, nome: user.nome } });
  } catch (error) {
    console.error('Erro login:', error.message);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Transações - Listar
app.get('/api/transacoes', authMiddleware, async (req, res) => {
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
    console.error('Erro transacoes:', error.message);
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

// Transações - Criar
app.post('/api/transacoes', authMiddleware, async (req, res) => {
  try {
    const { error } = transacaoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { descricao, valor, tipo, categoria, data, recorrente, frequencia, parcelas } = req.body;
    
    console.log('Dados recebidos:', { descricao, valor, tipo, categoria, data, recorrente, frequencia, parcelas });
    
    if (recorrente === true && parcelas && parseInt(parcelas) > 1) {
      console.log('Criando parcelas:', parcelas);
      
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
    console.error('Erro criar transacao:', error.message);
    res.status(500).json({ error: 'Erro ao criar transação' }); 
  }
});

// Transações - Atualizar
app.put('/api/transacoes/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = transacaoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { descricao, valor, tipo, categoria, data, recorrente, frequencia, parcelas } = req.body;
    const t = await prisma.transacao.update({ 
      where: { id: parseInt(req.params.id) }, 
      data: { 
        descricao, 
        valor: parseFloat(valor), 
        tipo, 
        categoria,
        data: data ? new Date(data) : undefined,
        recorrente: recorrente || false,
        frequencia: frequencia || null,
        parcelas: parcelas || null
      } 
    });
    res.json(t);
  } catch (error) { 
    console.error('Erro atualizar transacao:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar transação' }); 
  }
});

// Transações - Deletar
app.delete('/api/transacoes/:id', authMiddleware, async (req, res) => {
  try {
    const t = await prisma.transacao.delete({ 
      where: { id: parseInt(req.params.id) } 
    });
    res.json(t);
  } catch (error) { 
    console.error('Erro deletar transacao:', error.message);
    res.status(500).json({ error: 'Erro ao deletar transação' }); 
  }
});

// Dashboard
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
    console.error('Erro dashboard:', error.message);
    res.status(500).json({ error: 'Erro ao buscar dashboard' });
  }
});

// Categorias - Listar
app.get('/api/categorias', authMiddleware, async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' }
    });
    res.json(categorias);
  } catch (error) {
    console.error('Erro categorias:', error.message);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Categorias - Criar
app.post('/api/categorias', authMiddleware, async (req, res) => {
  try {
    const { error } = categoriaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { nome, tipo } = req.body;
    const c = await prisma.categoria.create({ 
      data: { nome, tipo } 
    });
    res.status(201).json(c);
  } catch (error) { 
    console.error('Erro criar categoria:', error.message);
    res.status(500).json({ error: 'Erro ao criar categoria' }); 
  }
});

// Relatório PDF
app.get('/api/relatorio/pdf', authMiddleware, async (req, res) => {
  try {
    const PDFDocument = require('pdfkit');
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
      orderBy: { data: 'asc' }
    });
    
    const receitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const despesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const saldo = receitas - despesas;
    
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-${ano}-${mes}.pdf`);
    doc.pipe(res);
    
    doc.fontSize(20).text('Relatório Financeiro', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Período: ${mes}/${ano}`, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Receitas: R$ ${receitas.toFixed(2)}`, { align: 'center' });
    doc.text(`Despesas: R$ ${despesas.toFixed(2)}`, { align: 'center' });
    doc.text(`Saldo: R$ ${saldo.toFixed(2)}`, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text('Transações:', { underline: true });
    doc.moveDown();
    
    transacoes.forEach(t => {
      const sinal = t.tipo === 'receita' ? '+' : '-';
      doc.fontSize(10).text(`${sinal} R$ ${t.valor.toFixed(2)} - ${t.descricao} (${t.categoria}) - ${new Date(t.data).toLocaleDateString('pt-BR')}`);
    });
    
    doc.end();
  } catch (error) {
    console.error('Erro relatorio:', error.message);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

// Middleware global de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});