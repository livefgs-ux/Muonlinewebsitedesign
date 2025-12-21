/**
 * Validadores de Dados
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Validar resultados
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: errors.array()
    });
  }
  next();
};

/**
 * Validação de Login
 */
const validateLogin = [
  body('username')
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage('Username deve ter entre 4 e 10 caracteres')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Username deve conter apenas letras e números'),
  
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('Senha deve ter entre 6 e 20 caracteres'),
  
  validate
];

/**
 * Validação de Registro
 */
const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage('Username deve ter entre 4 e 10 caracteres')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Username deve conter apenas letras e números'),
  
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('Senha deve ter entre 6 e 20 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('personalId')
    .optional()
    .isLength({ min: 13, max: 13 })
    .withMessage('Personal ID deve ter 13 caracteres'),
  
  validate
];

/**
 * Validação de Distribuição de Pontos
 */
const validateDistributePoints = [
  body('strength')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Strength deve ser um número inteiro positivo'),
  
  body('agility')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Agility deve ser um número inteiro positivo'),
  
  body('vitality')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Vitality deve ser um número inteiro positivo'),
  
  body('energy')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Energy deve ser um número inteiro positivo'),
  
  body('command')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Command deve ser um número inteiro positivo'),
  
  validate
];

/**
 * Validação de Notícia
 */
const validateNews = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Título deve ter entre 5 e 200 caracteres'),
  
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Conteúdo deve ter no mínimo 10 caracteres'),
  
  body('category')
    .trim()
    .isIn(['update', 'event', 'maintenance', 'announcement'])
    .withMessage('Categoria inválida'),
  
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high'])
    .withMessage('Prioridade inválida'),
  
  validate
];

/**
 * Validação de parâmetros de ranking
 */
const validateRankingParams = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit deve ser entre 1 e 100'),
  
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset deve ser um número positivo'),
  
  validate
];

module.exports = {
  validate,
  validateLogin,
  validateRegister,
  validateDistributePoints,
  validateNews,
  validateRankingParams
};
