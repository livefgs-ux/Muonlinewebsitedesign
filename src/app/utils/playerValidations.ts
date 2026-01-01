/**
 * 🛡️ PLAYER VALIDATIONS - V627
 * Sistema robusto de validações para ações do jogador
 * 
 * FUNCIONALIDADES:
 * - ✅ Validar se personagem pode executar ação
 * - ✅ Verificar cooldowns
 * - ✅ Validar nível mínimo
 * - ✅ Validar recursos (Zen, Credits)
 * - ✅ Retornar mensagens de erro específicas
 */

import { Character } from '../components/player/CharacterSelector';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
  details?: any;
}

export interface Account {
  cashCredits?: number;
  goblinPoints?: number;
}

/**
 * Verifica se personagem pode executar uma ação
 * @param character - Personagem a ser validado
 * @returns ValidationResult
 */
export function canPerformAction(character: Character | null): ValidationResult {
  // Verificar se personagem está selecionado
  if (!character) {
    return {
      valid: false,
      error: '⚠️ Por favor, selecione um personagem primeiro!',
      code: 'NO_CHARACTER_SELECTED'
    };
  }

  // Verificar se personagem está online
  if (character.online) {
    return {
      valid: false,
      error: `⚠️ O personagem ${character.name} está online! Desconecte do jogo para usar esta função.`,
      code: 'CHARACTER_ONLINE',
      details: {
        characterName: character.name
      }
    };
  }

  return {
    valid: true
  };
}

/**
 * Verifica cooldown de uma ação
 * @param character - Personagem
 * @param action - Nome da ação
 * @param cooldownMinutes - Tempo de cooldown em minutos
 * @param lastActionTime - Data/hora da última ação (opcional, buscar do backend)
 * @returns ValidationResult
 */
export async function checkCooldown(
  character: Character,
  action: string,
  cooldownMinutes: number,
  lastActionTime?: Date | null
): Promise<ValidationResult> {
  // Se não houver última ação, não há cooldown
  if (!lastActionTime) {
    return { valid: true };
  }

  const now = new Date();
  const diffMs = now.getTime() - lastActionTime.getTime();
  const diffMinutes = diffMs / 1000 / 60;

  // Se ainda está em cooldown
  if (diffMinutes < cooldownMinutes) {
    const remainingMinutes = Math.ceil(cooldownMinutes - diffMinutes);
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMins = remainingMinutes % 60;

    let timeString = '';
    if (remainingHours > 0) {
      timeString = `${remainingHours}h ${remainingMins}min`;
    } else {
      timeString = `${remainingMins} minuto${remainingMins > 1 ? 's' : ''}`;
    }

    return {
      valid: false,
      error: `⏱️ Cooldown ativo! Aguarde ${timeString} para usar ${action} novamente.`,
      code: 'COOLDOWN_ACTIVE',
      details: {
        action,
        remainingMinutes,
        remainingHours,
        nextAvailable: new Date(lastActionTime.getTime() + cooldownMinutes * 60 * 1000)
      }
    };
  }

  return { valid: true };
}

/**
 * Valida nível mínimo do personagem
 * @param character - Personagem
 * @param minLevel - Nível mínimo necessário
 * @returns ValidationResult
 */
export function validateLevel(character: Character, minLevel: number): ValidationResult {
  if (character.level < minLevel) {
    return {
      valid: false,
      error: `❌ Nível insuficiente! Seu personagem precisa estar no nível ${minLevel} (atual: ${character.level})`,
      code: 'LEVEL_TOO_LOW',
      details: {
        currentLevel: character.level,
        requiredLevel: minLevel,
        missing: minLevel - character.level
      }
    };
  }

  return { valid: true };
}

/**
 * Valida se personagem tem Zen suficiente
 * @param character - Personagem
 * @param cost - Custo em Zen
 * @returns ValidationResult
 */
export function validateZen(character: Character, cost: number): ValidationResult {
  // Nota: Precisamos adicionar 'zen' ou 'money' ao Character interface
  // Por enquanto, vamos assumir que virá do backend
  // Esta é uma validação de exemplo

  const characterZen = (character as any).money || (character as any).zen || 0;

  if (characterZen < cost) {
    return {
      valid: false,
      error: `💰 Zen insuficiente! Você precisa de ${cost.toLocaleString('pt-BR')} Zen (você tem: ${characterZen.toLocaleString('pt-BR')})`,
      code: 'INSUFFICIENT_ZEN',
      details: {
        currentZen: characterZen,
        requiredZen: cost,
        missing: cost - characterZen
      }
    };
  }

  return { valid: true };
}

/**
 * Valida se conta tem Credits suficientes
 * @param account - Conta do jogador
 * @param cost - Custo em Credits
 * @returns ValidationResult
 */
export function validateCredits(account: Account, cost: number): ValidationResult {
  const currentCredits = account.cashCredits || 0;

  if (currentCredits < cost) {
    return {
      valid: false,
      error: `💎 Credits insuficientes! Você precisa de ${cost} WCoin (você tem: ${currentCredits})`,
      code: 'INSUFFICIENT_CREDITS',
      details: {
        currentCredits,
        requiredCredits: cost,
        missing: cost - currentCredits
      }
    };
  }

  return { valid: true };
}

/**
 * Valida Goblin Points
 * @param account - Conta do jogador
 * @param cost - Custo em Goblin Points
 * @returns ValidationResult
 */
export function validateGoblinPoints(account: Account, cost: number): ValidationResult {
  const currentPoints = account.goblinPoints || 0;

  if (currentPoints < cost) {
    return {
      valid: false,
      error: `🟢 Goblin Points insuficientes! Você precisa de ${cost} pontos (você tem: ${currentPoints})`,
      code: 'INSUFFICIENT_GOBLIN_POINTS',
      details: {
        currentPoints,
        requiredPoints: cost,
        missing: cost - currentPoints
      }
    };
  }

  return { valid: true };
}

/**
 * Valida pontos de atributos disponíveis
 * @param character - Personagem
 * @param pointsToUse - Pontos que serão usados
 * @returns ValidationResult
 */
export function validateAvailablePoints(character: Character, pointsToUse: number): ValidationResult {
  const availablePoints = character.stats?.points || 0;

  if (availablePoints < pointsToUse) {
    return {
      valid: false,
      error: `📊 Pontos insuficientes! Você tem ${availablePoints} pontos disponíveis (tentando usar: ${pointsToUse})`,
      code: 'INSUFFICIENT_POINTS',
      details: {
        availablePoints,
        requestedPoints: pointsToUse,
        missing: pointsToUse - availablePoints
      }
    };
  }

  return { valid: true };
}

/**
 * Valida reset de personagem
 * @param character - Personagem
 * @param minLevel - Nível mínimo (padrão: 400)
 * @param zenCost - Custo em Zen (padrão: 5.000.000)
 * @returns ValidationResult
 */
export function validateReset(
  character: Character,
  minLevel: number = 400,
  zenCost: number = 5000000
): ValidationResult {
  // Validar nível
  const levelValidation = validateLevel(character, minLevel);
  if (!levelValidation.valid) {
    return levelValidation;
  }

  // Validar Zen
  const zenValidation = validateZen(character, zenCost);
  if (!zenValidation.valid) {
    return zenValidation;
  }

  return { valid: true };
}

/**
 * Validação combinada para ações que requerem múltiplos requisitos
 * @param character - Personagem
 * @param validations - Array de funções de validação
 * @returns ValidationResult
 */
export function validateMultiple(...validations: ValidationResult[]): ValidationResult {
  for (const validation of validations) {
    if (!validation.valid) {
      return validation;
    }
  }

  return { valid: true };
}

/**
 * Helper: Formatar números grandes (Zen)
 * @param value - Valor numérico
 * @returns String formatada
 */
export function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Helper: Formatar tempo de cooldown
 * @param minutes - Minutos de cooldown
 * @returns String formatada
 */
export function formatCooldown(minutes: number): string {
  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    return `${days} dia${days > 1 ? 's' : ''}`;
  }
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }
  return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
}
