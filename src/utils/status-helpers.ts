/**
 * 🎨 STATUS HELPERS - Funções para cores e ícones de status
 * Centraliza lógica de apresentação de status
 */

/**
 * Retorna cor baseada no status
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-green-400',
    online: 'text-green-400',
    success: 'text-green-400',
    paused: 'text-yellow-400',
    warning: 'text-yellow-400',
    pending: 'text-yellow-400',
    error: 'text-red-400',
    failed: 'text-red-400',
    offline: 'text-gray-400',
    inactive: 'text-gray-400',
    blocked: 'text-red-400',
    banned: 'text-red-400',
  };
  
  return colors[status.toLowerCase()] || 'text-gray-400';
}

/**
 * Retorna cor de background baseada no status
 */
export function getStatusBgColor(status: string): string {
  const bgColors: Record<string, string> = {
    active: 'bg-green-500/10',
    online: 'bg-green-500/10',
    success: 'bg-green-500/10',
    paused: 'bg-yellow-500/10',
    warning: 'bg-yellow-500/10',
    pending: 'bg-yellow-500/10',
    error: 'bg-red-500/10',
    failed: 'bg-red-500/10',
    offline: 'bg-gray-500/10',
    inactive: 'bg-gray-500/10',
    blocked: 'bg-red-500/10',
    banned: 'bg-red-500/10',
  };
  
  return bgColors[status.toLowerCase()] || 'bg-gray-500/10';
}

/**
 * Retorna cor de borda baseada no status
 */
export function getStatusBorderColor(status: string): string {
  const borderColors: Record<string, string> = {
    active: 'border-green-500/20',
    online: 'border-green-500/20',
    success: 'border-green-500/20',
    paused: 'border-yellow-500/20',
    warning: 'border-yellow-500/20',
    pending: 'border-yellow-500/20',
    error: 'border-red-500/20',
    failed: 'border-red-500/20',
    offline: 'border-gray-500/20',
    inactive: 'border-gray-500/20',
    blocked: 'border-red-500/20',
    banned: 'border-red-500/20',
  };
  
  return borderColors[status.toLowerCase()] || 'border-gray-500/20';
}

/**
 * Retorna texto traduzido do status
 */
export function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    active: 'Ativo',
    online: 'Online',
    success: 'Sucesso',
    paused: 'Pausado',
    warning: 'Aviso',
    pending: 'Pendente',
    error: 'Erro',
    failed: 'Falhou',
    offline: 'Offline',
    inactive: 'Inativo',
    blocked: 'Bloqueado',
    banned: 'Banido',
  };
  
  return texts[status.toLowerCase()] || status;
}

/**
 * Retorna ícone emoji baseado no tipo
 */
export function getIconEmoji(type: string): string {
  const icons: Record<string, string> = {
    // Ações
    reset: '♻️',
    stats: '⚡',
    donation: '💰',
    login: '✅',
    logout: '🚪',
    purchase: '🛒',
    
    // Status
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    
    // Sistemas
    security: '🛡️',
    cron: '⏱️',
    player: '🎮',
    admin: '👑',
    
    // Eventos
    boss: '🐉',
    event: '🎪',
    guild: '⚔️',
    castle: '🏰',
  };
  
  return icons[type.toLowerCase()] || '📌';
}

/**
 * Retorna classe CSS completa para status badge
 */
export function getStatusBadgeClass(status: string): string {
  const baseClass = 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold';
  const statusColor = getStatusColor(status);
  const statusBg = getStatusBgColor(status);
  
  return `${baseClass} ${statusBg} ${statusColor}`;
}

/**
 * Retorna prioridade numérica do status (para ordenação)
 */
export function getStatusPriority(status: string): number {
  const priorities: Record<string, number> = {
    error: 1,
    failed: 1,
    blocked: 1,
    banned: 1,
    warning: 2,
    pending: 2,
    paused: 3,
    inactive: 4,
    offline: 4,
    active: 5,
    online: 5,
    success: 5,
  };
  
  return priorities[status.toLowerCase()] || 0;
}

/**
 * Retorna cor de progresso baseada em porcentagem
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-400';
  if (percentage >= 50) return 'text-yellow-400';
  if (percentage >= 25) return 'text-orange-400';
  return 'text-red-400';
}

/**
 * Retorna cor baseada no tipo de ação
 */
export function getActionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    create: 'text-green-400',
    update: 'text-blue-400',
    delete: 'text-red-400',
    read: 'text-gray-400',
    ban: 'text-red-400',
    unban: 'text-green-400',
    login: 'text-green-400',
    logout: 'text-gray-400',
  };
  
  return colors[type.toLowerCase()] || 'text-gray-400';
}
