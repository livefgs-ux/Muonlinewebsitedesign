/**
 * 🔐 VALIDATORS - Funções de validação centralizadas
 * Todas as validações do projeto em um único lugar
 */

/**
 * Valida email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida senha
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('A senha deve ter no mínimo 6 caracteres');
  }
  
  if (password.length > 20) {
    errors.push('A senha deve ter no máximo 20 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida username do MU Online
 */
export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (!username || username.length < 4) {
    return { isValid: false, error: 'Username deve ter no mínimo 4 caracteres' };
  }
  
  if (username.length > 10) {
    return { isValid: false, error: 'Username deve ter no máximo 10 caracteres' };
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return { isValid: false, error: 'Username deve conter apenas letras e números' };
  }
  
  return { isValid: true };
}

/**
 * Valida nome de personagem
 */
export function validateCharacterName(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name || name.length < 3) {
    return { isValid: false, error: 'Nome deve ter no mínimo 3 caracteres' };
  }
  
  if (name.length > 10) {
    return { isValid: false, error: 'Nome deve ter no máximo 10 caracteres' };
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(name)) {
    return { isValid: false, error: 'Nome deve conter apenas letras e números' };
  }
  
  return { isValid: true };
}

/**
 * Valida level do MU Online
 */
export function validateLevel(level: number, minLevel: number = 1, maxLevel: number = 400): {
  isValid: boolean;
  error?: string;
} {
  if (level < minLevel) {
    return { isValid: false, error: `Level mínimo é ${minLevel}` };
  }
  
  if (level > maxLevel) {
    return { isValid: false, error: `Level máximo é ${maxLevel}` };
  }
  
  return { isValid: true };
}

/**
 * Valida quantidade de Zen
 */
export function validateZen(zen: number, required: number): {
  isValid: boolean;
  error?: string;
} {
  if (zen < required) {
    return { 
      isValid: false, 
      error: `Zen insuficiente. Necessário: ${required.toLocaleString('pt-BR')}` 
    };
  }
  
  return { isValid: true };
}

/**
 * Valida pontos de atributo
 */
export function validateStatPoints(points: number, available: number): {
  isValid: boolean;
  error?: string;
} {
  if (points <= 0) {
    return { isValid: false, error: 'Você precisa adicionar pelo menos 1 ponto' };
  }
  
  if (points > available) {
    return { 
      isValid: false, 
      error: `Pontos insuficientes. Disponível: ${available}` 
    };
  }
  
  if (points > 500) {
    return { isValid: false, error: 'Máximo de 500 pontos por vez' };
  }
  
  return { isValid: true };
}

/**
 * Valida IP address
 */
export function validateIP(ip: string): boolean {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  
  if (!ipRegex.test(ip)) return false;
  
  const parts = ip.split('.');
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

/**
 * Valida padrão cron
 */
export function validateCronPattern(pattern: string): {
  isValid: boolean;
  error?: string;
} {
  // Formato básico: * * * * * (min hour day month weekday)
  const cronRegex = /^(\*|([0-9]|[1-5][0-9])|\*\/([0-9]|[1-5][0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|[12][0-9]|3[01])|\*\/([1-9]|[12][0-9]|3[01])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|[0-6]|\*\/[0-6])$/;
  
  if (!cronRegex.test(pattern)) {
    return { 
      isValid: false, 
      error: 'Padrão cron inválido. Use formato: * * * * * (min hour day month weekday)' 
    };
  }
  
  return { isValid: true };
}

/**
 * Valida range de números
 */
export function validateRange(value: number, min: number, max: number): {
  isValid: boolean;
  error?: string;
} {
  if (value < min || value > max) {
    return { 
      isValid: false, 
      error: `Valor deve estar entre ${min} e ${max}` 
    };
  }
  
  return { isValid: true };
}

/**
 * Sanitiza string (previne XSS)
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida file upload
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeMB: number
): {
  isValid: boolean;
  error?: string;
} {
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}` 
    };
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      isValid: false, 
      error: `Arquivo muito grande. Máximo: ${maxSizeMB}MB` 
    };
  }
  
  return { isValid: true };
}
