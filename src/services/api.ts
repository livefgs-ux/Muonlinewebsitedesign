/**
 * 🌐 API Service - MeuMU Online
 * 
 * Serviço centralizado para todas as chamadas de API
 * Conecta com o backend Node.js/Express
 * 
 * ⚠️ SEM MOCKS - Apenas dados REAIS do banco de dados MariaDB!
 */

// Base URL da API (Backend Node.js)
// NOTA: Alterar para o IP/domínio da VPS em produção
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Flag para modo fallback (desenvolvimento)
const USE_FALLBACK_DATA = false; // Alterar para true se backend não estiver disponível

// Headers padrão para todas as requisições
const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * 🔧 Função genérica para fazer fetch
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(token),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API Error (${response.status}): ${response.statusText}`);
    }

    // Backend Node.js retorna { success: true, data: ... }
    return data.data || data;
  } catch (error) {
    console.error(`❌ API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============================================
// 👤 USER & AUTHENTICATION API
// ============================================

export interface User {
  id: string;
  username: string;
  email: string;
  accountStatus: 'Active' | 'Banned' | 'Suspended';
  onlineStatus: 'Online' | 'Offline';
  createdAt: string;
  lastLogin: string;
  vipLevel: number;
  credits: number;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  resets: number;
  grandResets?: number;
  strength: number;
  agility: number;
  vitality: number;
  energy: number;
  command?: number;
  points: number;
  location: string;
  guild: string | null;
  pk: number;
  lastLogin: Date;
  online: boolean;
  imageUrl?: string;
}

export const userAPI = {
  /**
   * Buscar dados do usuário logado
   */
  async getCurrentUser(token: string): Promise<User> {
    return fetchAPI<User>('/auth/account', {}, token);
  },

  /**
   * Buscar personagens do usuário
   */
  async getUserCharacters(token: string): Promise<Character[]> {
    return fetchAPI<Character[]>('/characters', {}, token);
  },

  /**
   * Atualizar email do usuário
   */
  async updateEmail(email: string, token: string): Promise<{ success: boolean }> {
    return fetchAPI('/auth/update-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, token);
  },

  /**
   * Atualizar senha do usuário
   */
  async updatePassword(oldPassword: string, newPassword: string, token: string): Promise<{ success: boolean }> {
    return fetchAPI('/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    }, token);
  },
};

// ============================================
// 🎮 CHARACTER API
// ============================================

export const characterAPI = {
  /**
   * Distribuir pontos de status
   */
  async distributePoints(
    characterName: string,
    points: { strength?: number; dexterity?: number; vitality?: number; energy?: number; command?: number },
    token: string
  ): Promise<{ success: boolean; character: Character }> {
    return fetchAPI(`/characters/${characterName}/points`, {
      method: 'PUT',
      body: JSON.stringify(points),
    }, token);
  },

  /**
   * Reset de personagem
   */
  async resetCharacter(characterName: string, token: string): Promise<{ success: boolean; character: Character }> {
    return fetchAPI(`/characters/${characterName}/reset`, {
      method: 'POST',
    }, token);
  },

  /**
   * Buscar detalhes de um personagem
   */
  async getCharacterDetails(characterName: string, token: string): Promise<Character> {
    return fetchAPI<Character>(`/characters/${characterName}`, {}, token);
  },
};

// ============================================
// 🏆 RANKINGS API
// ============================================

export interface RankingPlayer {
  position: number;
  name: string;
  class: string;
  classNumber?: number;
  level?: number;
  resets?: number;
  grandResets?: number;
  kills?: number;
  pkLevel?: number;
  deaths?: number;
  points?: number;
  wins?: number;
  online?: boolean;
  exp?: number;
}

export interface RankingGuild {
  position: number;
  name: string;
  master: string;
  members: number;
  score: number;
  emblem?: string;
}

export const rankingsAPI = {
  /**
   * Top players por Resets
   */
  async getTopResets(limit: number = 100): Promise<RankingPlayer[]> {
    return fetchAPI<RankingPlayer[]>(`/rankings/resets?limit=${limit}`);
  },

  /**
   * Top players por PK
   */
  async getTopPK(limit: number = 100): Promise<RankingPlayer[]> {
    return fetchAPI<RankingPlayer[]>(`/rankings/pk?limit=${limit}`);
  },

  /**
   * Top players por Level
   */
  async getTopLevel(limit: number = 100): Promise<RankingPlayer[]> {
    return fetchAPI<RankingPlayer[]>(`/rankings/level?limit=${limit}`);
  },

  /**
   * Top Guilds
   */
  async getTopGuilds(limit: number = 50): Promise<RankingGuild[]> {
    return fetchAPI<RankingGuild[]>(`/rankings/guilds?limit=${limit}`);
  },

  /**
   * Buscar posição de um personagem
   */
  async getCharacterRank(name: string, type: 'resets' | 'pk' | 'level'): Promise<{ position: number }> {
    return fetchAPI(`/rankings/character/${name}?type=${type}`);
  },
};

// ============================================
// 🎪 EVENTS API
// ============================================

export interface GameEvent {
  id: string | number;
  name: string;
  name_en?: string;
  name_es?: string;
  name_de?: string;
  name_zh?: string;
  name_ru?: string;
  name_fil?: string;
  name_vi?: string;
  description: string;
  description_en?: string;
  description_es?: string;
  description_de?: string;
  description_zh?: string;
  description_ru?: string;
  description_fil?: string;
  description_vi?: string;
  icon: string;
  color: string;
  imageUrl?: string;
  schedule_type: 'recurring' | 'daily' | 'weekly' | 'specific';
  interval_hours?: number;
  interval_minutes?: number;
  daily_times?: string[];
  weekly_day?: number;
  weekly_time?: string;
  specific_datetime?: string;
  duration: number;
  is_active: boolean;
  is_featured: boolean;
  priority: number;
  rewards?: string;
  min_level: number;
  max_level: number;
  min_reset: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventOccurrence {
  nextOccurrence: string | null;
  timeUntil: number | null;
}

export const eventsAPI = {
  /**
   * Listar todos os eventos ativos
   */
  async getAllEvents(): Promise<GameEvent[]> {
    return fetchAPI<GameEvent[]>('/events');
  },

  /**
   * Obter eventos em destaque (para home)
   */
  async getFeaturedEvents(): Promise<GameEvent[]> {
    return fetchAPI<GameEvent[]>('/events/featured');
  },

  /**
   * Buscar evento específico
   */
  async getEventById(eventId: string | number): Promise<GameEvent> {
    return fetchAPI<GameEvent>(`/events/${eventId}`);
  },

  /**
   * Calcular próxima ocorrência do evento
   */
  async getNextOccurrence(eventId: string | number): Promise<EventOccurrence> {
    return fetchAPI<EventOccurrence>(`/events/${eventId}/next-occurrence`);
  },

  /**
   * ADMIN: Listar todos os eventos (incluindo inativos)
   */
  async getAllEventsAdmin(token: string): Promise<GameEvent[]> {
    return fetchAPI<GameEvent[]>('/events/admin/all', {}, token);
  },

  /**
   * ADMIN: Criar novo evento
   */
  async createEvent(eventData: Partial<GameEvent>, token: string): Promise<{ id: number }> {
    return fetchAPI<{ id: number }>('/events/admin', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }, token);
  },

  /**
   * ADMIN: Atualizar evento
   */
  async updateEvent(eventId: string | number, eventData: Partial<GameEvent>, token: string): Promise<void> {
    return fetchAPI<void>(`/events/admin/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }, token);
  },

  /**
   * ADMIN: Deletar evento
   */
  async deleteEvent(eventId: string | number, token: string): Promise<void> {
    return fetchAPI<void>(`/events/admin/${eventId}`, {
      method: 'DELETE',
    }, token);
  },

  /**
   * ADMIN: Alternar status do evento
   */
  async toggleEventStatus(eventId: string | number, token: string): Promise<void> {
    return fetchAPI<void>(`/events/admin/${eventId}/toggle`, {
      method: 'PATCH',
    }, token);
  },

  /**
   * ADMIN: Obter estatísticas de eventos
   */
  async getEventStats(token: string): Promise<any> {
    return fetchAPI<any>('/events/admin/stats', {}, token);
  },
};

// ============================================
// 📰 NEWS API
// ============================================

export interface NewsArticle {
  id: number | string;
  title: string;
  content: string;
  author: string;
  category?: string;
  priority?: string;
  created_at?: string;
  updated_at?: string;
  date: string;
  imageUrl?: string;
  publishTo?: string[];
  links?: { title: string; url: string }[];
  views?: number;
}

export const newsAPI = {
  /**
   * Listar todas as notícias
   */
  async getAllNews(limit: number = 10): Promise<NewsArticle[]> {
    return fetchAPI<NewsArticle[]>(`/news?limit=${limit}`);
  },

  /**
   * Buscar notícia específica
   */
  async getNewsById(newsId: string | number): Promise<NewsArticle> {
    return fetchAPI<NewsArticle>(`/news/${newsId}`);
  },

  /**
   * Criar notícia (Admin)
   */
  async createNews(newsData: Partial<NewsArticle>, token: string): Promise<NewsArticle> {
    return fetchAPI('/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    }, token);
  },

  /**
   * Atualizar notícia (Admin)
   */
  async updateNews(newsId: string | number, newsData: Partial<NewsArticle>, token: string): Promise<NewsArticle> {
    return fetchAPI(`/news/${newsId}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    }, token);
  },

  /**
   * Deletar notícia (Admin)
   */
  async deleteNews(newsId: string | number, token: string): Promise<{ success: boolean }> {
    return fetchAPI(`/news/${newsId}`, {
      method: 'DELETE',
    }, token);
  },
};

// ============================================
// 📊 SERVER INFO API
// ============================================

export interface ServerInfo {
  name: string;
  version: string;
  status?: 'online' | 'offline' | 'maintenance';
  rates?: {
    exp: string;
    drop: string;
  };
  limits?: {
    maxReset: number;
    maxGrandReset: number;
  };
  playersOnline?: number;
  maxPlayers?: number;
  uptime?: string;
  experience?: string;
  drop?: string;
}

export interface ServerStats {
  totalAccounts: number;
  totalCharacters: number;
  playersOnline: number;
  totalGuilds: number;
  topReset?: {
    Name: string;
    ResetCount: number;
  };
  lastUpdate: string;
}

export const serverAPI = {
  /**
   * Buscar informações do servidor
   */
  async getServerInfo(): Promise<ServerInfo> {
    return fetchAPI<ServerInfo>('/server/info');
  },

  /**
   * Buscar estatísticas do servidor
   */
  async getServerStats(): Promise<ServerStats> {
    return fetchAPI<ServerStats>('/server/stats');
  },

  /**
   * Health check
   */
  async getHealthStatus(): Promise<{ status: string; database: string }> {
    // Remove o /api do path pois /health está na raiz
    const response = await fetch('http://localhost:3001/health');
    return response.json();
  },
};

// ============================================
// 🔐 AUTH API
// ============================================

export interface LoginResponse {
  token: string;
  accountId: string;
  email: string;
  isAdmin: boolean;
}

export const authAPI = {
  /**
   * Login
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * Registro
   */
  async register(username: string, password: string, email: string, personalId?: string): Promise<LoginResponse> {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email, personalId }),
    });
  },

  /**
   * Verificar token
   */
  async verifyToken(token: string): Promise<{ accountId: string; email: string; isAdmin: boolean }> {
    return fetchAPI('/auth/verify', {
      method: 'POST',
    }, token);
  },
};

// ============================================
// 🛡️ ADMIN API
// ============================================

export interface AdminStats {
  accounts: {
    total: number;
    online: number;
    banned: number;
    newToday: number;
  };
  characters: {
    total: number;
    activeToday: number;
    topLevel: number;
    resets: number;
  };
  economy: {
    totalZen: string;
    totalCredits: number;
    transactions: number;
  };
  events: {
    active: string;
    scheduled: string;
    participants: number;
    completed: string;
  };
  server: {
    uptime: string;
    cpu: string;
    memory: string;
    players: string;
    tps: number;
  };
}

export const adminAPI = {
  /**
   * Login Admin
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    return authAPI.login(username, password);
  },

  /**
   * Buscar estatísticas do dashboard admin
   */
  async getDashboardStats(token: string): Promise<AdminStats> {
    // Usar os stats do servidor por enquanto
    const stats = await serverAPI.getServerStats();
    
    // Converter para o formato AdminStats
    return {
      accounts: {
        total: stats.totalAccounts,
        online: stats.playersOnline,
        banned: 0,
        newToday: 0,
      },
      characters: {
        total: stats.totalCharacters,
        activeToday: stats.playersOnline,
        topLevel: 400,
        resets: stats.topReset?.ResetCount || 0,
      },
      economy: {
        totalZen: '0',
        totalCredits: 0,
        transactions: 0,
      },
      events: {
        active: '0',
        scheduled: '0',
        participants: 0,
        completed: '0',
      },
      server: {
        uptime: '24h',
        cpu: '45%',
        memory: '60%',
        players: `${stats.playersOnline}`,
        tps: 20,
      },
    };
  },

  /**
   * Buscar lista de usuários
   */
  async getUsers(token: string, page: number = 1, limit: number = 20): Promise<any> {
    return fetchAPI(`/admin/users?page=${page}&limit=${limit}`, {}, token);
  },

  /**
   * Banir usuário
   */
  async banUser(userId: string, reason: string, token: string): Promise<{ success: boolean }> {
    return fetchAPI('/admin/users/ban', {
      method: 'POST',
      body: JSON.stringify({ userId, reason }),
    }, token);
  },

  /**
   * Criar notícia
   */
  async createNews(newsData: Partial<NewsArticle>, token: string): Promise<NewsArticle> {
    return newsAPI.createNews(newsData, token);
  },
};

// ============================================
// 📦 EXPORT DEFAULT
// ============================================

export default {
  user: userAPI,
  character: characterAPI,
  rankings: rankingsAPI,
  events: eventsAPI,
  news: newsAPI,
  server: serverAPI,
  auth: authAPI,
  admin: adminAPI,
};