const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

/**
 * Controller de Autenticacao
 * Responsavel por registro e login de usuarios
 */

/**
 * Registrar novo usuario
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    // Validacao basica
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha sao obrigatorios' });
    }

    // Valida email
    const emailRegex = /^[\w-\.]+@[\w-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email invalido' });
    }

    // Valida senha (minimo 6 caracteres)
    if (senha.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no minimo 6 caracteres' });
    }

    // Verifica se email ja existe
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Email ja cadastrado' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria usuario no banco
    const [userId] = await db('users').insert({
      nome,
      email,
      senha: senhaHash,
      created_at: new Date()
    });

    // Gera token JWT
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token valido por 7 dias
    );

    return res.status(201).json({
      message: 'Usuario registrado com sucesso',
      user: {
        id: userId,
        nome,
        email
      },
      token
    });
  } catch (err) {
    console.error('Erro ao registrar usuario:', err);
    return res.status(500).json({ error: 'Erro ao registrar usuario' });
  }
}

/**
 * Login de usuario
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    // Validacao basica
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha sao obrigatorios' });
    }

    // Busca usuario no banco
    const user = await db('users').where({ email }).first();

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha invalidos' });
    }

    // Verifica senha
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha invalidos' });
    }

    // Gera token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      },
      token
    });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

/**
 * Obter dados do usuario logado
 * GET /api/auth/me
 */
async function me(req, res) {
  try {
    // req.userId vem do middleware authMiddleware
    const user = await db('users').where({ id: req.userId }).first();

    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    return res.json({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error('Erro ao obter dados do usuario:', err);
    return res.status(500).json({ error: 'Erro ao obter dados do usuario' });
  }
}

module.exports = {
  register,
  login,
  me
};
