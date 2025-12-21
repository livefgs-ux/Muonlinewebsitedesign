/**
 * Middleware de Tratamento de Erros
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro:', err);

  // Erro de validação do express-validator
  if (err.array) {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: err.array()
    });
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expirado'
    });
  }

  // Erro de banco de dados
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      error: 'Registro duplicado'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      error: 'Referência inválida'
    });
  }

  // Erro genérico
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware para rota não encontrada
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
};

module.exports = {
  errorHandler,
  notFound
};
