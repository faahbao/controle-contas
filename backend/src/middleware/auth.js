const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticacao JWT
 * Verifica se o token foi enviado no header Authorization
 */
function authMiddleware(req, res, next) {
  try {
    // Pega o token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token nao fornecido' });
    }

    // Formato esperado: "Bearer <token>"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Formato de token invalido' });
    }

    const [scheme, token] = parts;

    if (scheme !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token invalido' });
    }

    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona o userId do token ao request
    req.userId = decoded.userId;
    
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalido ou expirado' });
  }
}

module.exports = authMiddleware;
