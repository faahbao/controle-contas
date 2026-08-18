require('dotenv').config()

const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const PDFDocument = require('pdfkit')

const app = express()
const prisma = new PrismaClient()

const PORT = Number(process.env.PORT || 3000)
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('ERRO: defina JWT_SECRET com pelo menos 32 caracteres em backend/.env')
  process.exit(1)
}

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001'
  'http://localhost:3001'
]

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

app.use(cors({
  origin(origin, callback) {
    // Permite chamadas sem Origin: curl, Postman e testes locais.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`Origem não permitida pelo CORS: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '20kb' }))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente mais tarde.' }
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas de login. Aguarde 15 minutos.' }
})

app.use('/api', apiLimiter)

const cadastroSchema = Joi.object({
  nome: Joi.string().trim().min(3).max(100).required(),
  email: Joi.string().trim().lowercase().email().max(254).required(),
  senha: Joi.string().min(6).max(128).required()
})

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().max(254).required(),
  senha: Joi.string().max(128).required()
})

const transacaoSchema = Joi.object({
  descricao: Joi.string().trim().min(1).max(100).required(),
  valor: Joi.number().positive().precision(2).required(),
  tipo: Joi.string().valid('receita', 'despesa').required(),
  categoria: Joi.string().trim().min(1).max(50).required(),
  data: Joi.date().iso().required(),
  recorrente: Joi.boolean().default(false),
  frequencia: Joi.string().valid('diaria', 'semanal', 'mensal').allow(null).default(null),
  parcelas: Joi.number().integer().min(1).max(120).allow(null).default(null)
}).custom((value, helpers) => {
  if (value.recorrente && !value.frequencia) {
    return helpers.error('any.custom', {
      message: 'Frequência é obrigatória para uma transação recorrente.'
    })
  }

  if (value.recorrente && !value.parcelas) {
    return helpers.error('any.custom', {
      message: 'Quantidade de parcelas é obrigatória para uma transação recorrente.'
    })
  }

  return value
}).messages({
  'any.custom': '{{#message}}'
})

const categoriaSchema = Joi.object({
  nome: Joi.string().trim().min(1).max(50).required(),
  tipo: Joi.string().valid('receita', 'despesa').required()
})

function validarId(valor) {
  const id = Number.parseInt(valor, 10)
  return Number.isInteger(id) && id > 0 ? id : null
}

function criarIntervaloMes(mes, ano) {
  const mesNumero = Number.parseInt(mes, 10)
  const anoNumero = Number.parseInt(ano, 10)

  if (
    !Number.isInteger(mesNumero) ||
    !Number.isInteger(anoNumero) ||
    mesNumero < 1 ||
    mesNumero > 12 ||
    anoNumero < 2000 ||
    anoNumero > 2100
  ) {
    return null
  }

  const inicio = new Date(anoNumero, mesNumero - 1, 1, 0, 0, 0, 0)
  const fim = new Date(anoNumero, mesNumero, 1, 0, 0, 0, 0)

  return { inicio, fim }
}

function somarValores(transacoes, tipo) {
  return transacoes
    .filter((transacao) => transacao.tipo === tipo)
    .reduce((total, transacao) => total + Number(transacao.valor), 0)
}

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization || ''
  const [tipo, token] = authorization.split(' ')

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token não fornecido.' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.userId
    return next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

function obterWherePorMes(userId, mes, ano) {
  const where = { userId }

  if (!mes && !ano) {
    return { where }
  }

  if (!mes || !ano) {
    return { error: 'Informe mês e ano juntos.' }
  }

  const intervalo = criarIntervaloMes(mes, ano)

  if (!intervalo) {
    return { error: 'Mês ou ano inválido.' }
  }

  where.data = {
    gte: intervalo.inicio,
    lt: intervalo.fim
  }

  return { where }
}

async function buscarResumo(userId, mes, ano) {
  const resultado = obterWherePorMes(userId, mes, ano)

  if (resultado.error) {
    const erro = new Error(resultado.error)
    erro.statusCode = 400
    throw erro
  }

  const transacoes = await prisma.transacao.findMany({
    where: resultado.where,
    orderBy: { data: 'desc' }
  })

  const receitas = somarValores(transacoes, 'receita')
  const despesas = somarValores(transacoes, 'despesa')
  const saldo = receitas - despesas
  const maiorValor = Math.max(receitas, despesas, 1)

  return {
    receitas,
    despesas,
    saldo,
    transacoes,
    grafico: {
      receitas,
      despesas,
      receitasPorcentagem: (receitas / maiorValor) * 100,
      despesasPorcentagem: (despesas / maiorValor) * 100
    }
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/auth/cadastro', loginLimiter, async (req, res, next) => {
  try {
    const { error, value } = cadastroSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true
    })

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const existente = await prisma.user.findUnique({
      where: { email: value.email }
    })

    if (existente) {
      return res.status(409).json({ error: 'Este email já está cadastrado.' })
    }

    const senhaHash = await bcrypt.hash(value.senha, 12)

    const user = await prisma.user.create({
      data: {
        nome: value.nome,
        email: value.email,
        senha: senhaHash
      }
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d'
    })

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    })
  } catch (error) {
    return next(error)
  }
})

app.post('/api/auth/login', loginLimiter, async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true
    })

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const user = await prisma.user.findUnique({
      where: { email: value.email }
    })

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' })
    }

    const senhaValida = await bcrypt.compare(value.senha, user.senha)

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d'
    })

    return res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    })
  } catch (error) {
    return next(error)
  }
})

app.get('/api/dashboard', authMiddleware, async (req, res, next) => {
  try {
    const resumo = await buscarResumo(req.userId, req.query.mes, req.query.ano)
    return res.json(resumo)
  } catch (error) {
    return next(error)
  }
})

app.get('/api/transacoes', authMiddleware, async (req, res, next) => {
  try {
    const resumo = await buscarResumo(req.userId, req.query.mes, req.query.ano)
    return res.json(resumo)
  } catch (error) {
    return next(error)
  }
})

app.post('/api/transacoes', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = transacaoSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true
    })

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const totalParcelas = value.recorrente ? value.parcelas : 1
    const dataBase = new Date(`${value.data}T12:00:00`)

    const transacoes = Array.from({ length: totalParcelas }, (_, indice) => {
      const novaData = new Date(dataBase)

      if (value.recorrente) {
        if (value.frequencia === 'diaria') {
          novaData.setDate(novaData.getDate() + indice)
        } else if (value.frequencia === 'semanal') {
          novaData.setDate(novaData.getDate() + indice * 7)
        } else {
          novaData.setMonth(novaData.getMonth() + indice)
        }
      }

      return {
        descricao: value.recorrente && totalParcelas > 1
          ? `${value.descricao} (${indice + 1}/${totalParcelas})`
          : value.descricao,
        valor: value.valor,
        tipo: value.tipo,
        categoria: value.categoria,
        data: novaData,
        recorrente: value.recorrente,
        frequencia: value.recorrente ? value.frequencia : null,
        parcelas: value.recorrente ? totalParcelas : null,
        parcelaAtual: value.recorrente ? indice + 1 : null,
        userId: req.userId
      }
    })

    const criadas = await prisma.$transaction(
      transacoes.map((transacao) => prisma.transacao.create({ data: transacao }))
    )

    return res.status(201).json({
      mensagem: criadas.length > 1
        ? `${criadas.length} parcelas criadas com sucesso!`
        : 'Transação criada com sucesso!',
      transacoes: criadas
    })
  } catch (error) {
    return next(error)
  }
})

app.put('/api/transacoes/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = validarId(req.params.id)

    if (!id) {
      return res.status(400).json({ error: 'ID de transação inválido.' })
    }

    const { error, value } = transacaoSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true
    })

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const existente = await prisma.transacao.findFirst({
      where: {
        id,
        userId: req.userId
      }
    })

    if (!existente) {
      return res.status(404).json({ error: 'Transação não encontrada.' })
    }

    const atualizada = await prisma.transacao.update({
      where: { id },
      data: {
        descricao: value.descricao,
        valor: value.valor,
        tipo: value.tipo,
        categoria: value.categoria,
        data: new Date(`${value.data}T12:00:00`),
        recorrente: value.recorrente,
        frequencia: value.recorrente ? value.frequencia : null,
        parcelas: value.recorrente ? value.parcelas : null,
        parcelaAtual: value.recorrente ? existente.parcelaAtual || 1 : null
      }
    })

    return res.json(atualizada)
  } catch (error) {
    return next(error)
  }
})

app.delete('/api/transacoes/:id', authMiddleware, async (req, res, next) => {
  try {
    const id = validarId(req.params.id)

    if (!id) {
      return res.status(400).json({ error: 'ID de transação inválido.' })
    }

    const existente = await prisma.transacao.findFirst({
      where: {
        id,
        userId: req.userId
      }
    })

    if (!existente) {
      return res.status(404).json({ error: 'Transação não encontrada.' })
    }

    await prisma.transacao.delete({
      where: { id }
    })

    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
})

app.get('/api/categorias', authMiddleware, async (req, res, next) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' }
    })

    return res.json(categorias)
  } catch (error) {
    return next(error)
  }
})

app.post('/api/categorias', authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = categoriaSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true
    })

    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const categoria = await prisma.categoria.create({
      data: value
    })

    return res.status(201).json(categoria)
  } catch (error) {
    return next(error)
  }
})

app.get('/api/relatorio/pdf', authMiddleware, async (req, res, next) => {
  try {
    const { mes, ano } = req.query

    if (!mes || !ano) {
      return res.status(400).json({
        error: 'Informe mês e ano para gerar o relatório.'
      })
    }

    const resumo = await buscarResumo(req.userId, mes, ano)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="relatorio-${ano}-${String(mes).padStart(2, '0')}.pdf"`
    )

    const doc = new PDFDocument({ margin: 50 })
    doc.pipe(res)

    doc.fontSize(20).text('Relatório Financeiro', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(12).text(`Período: ${String(mes).padStart(2, '0')}/${ano}`, {
      align: 'center'
    })
    doc.moveDown()

    doc.fontSize(12).text(`Receitas: R$ ${resumo.receitas.toFixed(2)}`)
    doc.text(`Despesas: R$ ${resumo.despesas.toFixed(2)}`)
    doc.text(`Saldo: R$ ${resumo.saldo.toFixed(2)}`)
    doc.moveDown()

    doc.fontSize(14).text('Transações')
    doc.moveDown(0.5)

    if (resumo.transacoes.length === 0) {
      doc.fontSize(10).text('Nenhuma transação encontrada neste período.')
    } else {
      resumo.transacoes.forEach((transacao) => {
        const sinal = transacao.tipo === 'receita' ? '+' : '-'
        const dataFormatada = new Date(transacao.data).toLocaleDateString('pt-BR')

        doc
          .fontSize(10)
          .text(
            `${sinal} R$ ${Number(transacao.valor).toFixed(2)} — ` +
            `${transacao.descricao} | ${transacao.categoria} | ${dataFormatada}`
          )
      })
    }

    doc.end()
  } catch (error) {
    return next(error)
  }
})

app.use((req, res) => {
  return res.status(404).json({ error: 'Rota não encontrada.' })
})

app.use((error, req, res, next) => {
  console.error('Erro interno:', error.message)

  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message })
  }

  if (error.code === 'P2002') {
    return res.status(409).json({ error: 'Este registro já existe.' })
  }

  return res.status(500).json({ error: 'Erro interno do servidor.' })
})

async function iniciarServidor() {
  try {
    await prisma.$connect()

    app.listen(PORT, () => {
      console.log(`Backend rodando em http://localhost:${PORT}`)
      console.log(`CORS permitido para: ${allowedOrigins.join(', ')}`)
    })
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error.message)
    process.exit(1)
  }
}

iniciarServidor()