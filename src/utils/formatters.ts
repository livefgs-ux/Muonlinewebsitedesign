/**
 * 🔧 FORMATTERS - Funções utilitárias de formatação
 * Centraliza todas as formatações do projeto
 */

/**
 * Formata número em formato pt-BR
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('pt-BR');
}

/**
 * Formata moeda em formato pt-BR
 */
export function formatCurrency(num: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(num);
}

/**
 * Formata moeda de acordo com o idioma selecionado
 * @param num - Valor numérico a ser formatado
 * @param language - Código do idioma (pt-BR, en, es, de, zh, ru, fil, vi)
 * @returns String formatada com moeda localizada
 */
export function formatLocalizedCurrency(num: number, language: string = 'pt-BR'): string {
  // Mapeamento de idioma para locale e moeda
  const currencyMap: Record<string, { locale: string; currency: string }> = {
    'pt-BR': { locale: 'pt-BR', currency: 'BRL' }, // Real brasileiro
    'en': { locale: 'en-US', currency: 'USD' },     // Dólar americano
    'es': { locale: 'es-ES', currency: 'EUR' },     // Euro
    'de': { locale: 'de-DE', currency: 'EUR' },     // Euro
    'zh': { locale: 'zh-CN', currency: 'CNY' },     // Yuan chinês
    'ru': { locale: 'ru-RU', currency: 'RUB' },     // Rublo russo
    'fil': { locale: 'fil-PH', currency: 'PHP' },   // Peso filipino
    'vi': { locale: 'vi-VN', currency: 'VND' },     // Dong vietnamita
  };

  const config = currencyMap[language] || currencyMap['pt-BR'];
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formata data em formato pt-BR
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('pt-BR');
    case 'long':
      return dateObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'time':
      return dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    default:
      return dateObj.toLocaleDateString('pt-BR');
  }
}

/**
 * Formata timestamp relativo (ex: "há 2 horas")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
  if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return `há ${seconds} segundo${seconds > 1 ? 's' : ''}`;
}

/**
 * Formata bytes em tamanho legível
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Formata porcentagem
 */
export function formatPercentage(value: number, total: number, decimals: number = 1): string {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return percentage.toFixed(decimals) + '%';
}

/**
 * Trunca texto com reticências
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitaliza primeira letra
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formata nome de classe do MU Online
 */
export function formatClassName(classCode: number): string {
  const classNames: Record<number, string> = {
    0: 'Dark Wizard',
    1: 'Soul Master',
    2: 'Grand Master',
    16: 'Dark Knight',
    17: 'Blade Knight',
    18: 'Blade Master',
    32: 'Fairy Elf',
    33: 'Muse Elf',
    34: 'High Elf',
    48: 'Magic Gladiator',
    50: 'Duel Master',
    64: 'Dark Lord',
    66: 'Lord Emperor',
    80: 'Summoner',
    81: 'Bloody Summoner',
    82: 'Dimension Master',
    96: 'Rage Fighter',
    98: 'Fist Master',
    112: 'Grow Lancer',
    114: 'Mirage Lancer',
  };
  
  return classNames[classCode] || 'Unknown';
}