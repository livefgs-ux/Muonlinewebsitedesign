/**
 * 🔒 SECURE LOGGER SYSTEM
 * V606 - Security Fix
 * 
 * ❌ NUNCA exibir logs em produção (segurança)
 * ✅ Apenas em desenvolvimento local
 */

// 🔒 Detectar ambiente
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

/**
 * Logger seguro - APENAS EM DESENVOLVIMENTO
 */
export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    // ✅ Erros SEMPRE mostrar (mas sem dados sensíveis)
    console.error(...args);
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

/**
 * Log condicional para produção
 * Apenas mensagens genéricas, NUNCA dados sensíveis
 */
export const productionLog = {
  error: (message: string) => {
    // ✅ Em produção, apenas mensagem genérica
    console.error(`[Error] ${message}`);
  }
};
