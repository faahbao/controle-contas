const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

/**
 * Rotas de Autenticacao
 * Base: /api/auth
 */

/**
 * @route POST /api/auth/register
 * @desc Registrar novo usuario
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login de usuario
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route GET /api/auth/me
 * @desc Obter dados do usuario logado
 * @access Private
 */
router.get('/me', authMiddleware, authController.me);

module.exports = router;
