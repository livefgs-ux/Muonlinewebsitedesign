/**
 * Middleware de Logs
 */

const morgan = require('morgan');

// Formato customizado de logs
morgan.token('user', (req) => {
  return req.user ? req.user.accountId : 'guest';
});

// Log format: :method :url :status :response-time ms - :user
const logFormat = ':method :url :status :response-time ms - user: :user';

// Logger para desenvolvimento
const devLogger = morgan('dev');

// Logger para produção
const prodLogger = morgan(logFormat);

// Exportar logger baseado no ambiente
const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

module.exports = logger;
