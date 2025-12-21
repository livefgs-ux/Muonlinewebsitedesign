// ⚙️ CONFIGURAÇÃO DA API DO BACKEND
// 
// INSTRUÇÕES:
// 1. Altere a URL abaixo para o endereço do seu servidor Node.js/Express
// 2. Certifique-se de que o backend está rodando neste endereço
// 3. Configure CORS no backend para aceitar requisições desta origem
//
// EXEMPLOS:
// - Desenvolvimento local: 'http://localhost:3000/api'
// - VPS/Servidor: 'http://192.168.1.100:3000/api' (use seu IP válido)
// - Domínio: 'https://api.meumu-online.com/api'
//
// ⚠️ IMPORTANTE: IPs devem ter valores de 0-255 em cada parte
//    Exemplo válido: 192.168.1.100
//    Exemplo inválido: 23.321.231.227 (321 > 255)

export const API_CONFIG = {
  // URL BASE DO BACKEND (SEM BARRA NO FINAL)
  BASE_URL: 'http://localhost:3001/api',
  
  // TIMEOUT DE REQUISIÇÕES (ms)
  TIMEOUT: 30000,
  
  // ENDPOINTS
  ENDPOINTS: {
    // Autenticação
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    AUTH_VERIFY: '/auth/verify',
    AUTH_LOGOUT: '/auth/logout',
    
    // Jogador
    PLAYER_CHARACTERS: '/player/characters',
    PLAYER_CHARACTER: '/player/character', // + /:name
    PLAYER_DISTRIBUTE_POINTS: '/player/character', // + /:name/add-stats
    PLAYER_RESET: '/player/character', // + /:name/reset
    PLAYER_ACCOUNT_INFO: '/player/account-info',
    
    // Rankings
    RANKING_PLAYERS: '/rankings/players',
    RANKING_GUILDS: '/rankings/guilds',
    RANKING_KILLERS: '/rankings/killers',
    RANKING_GENS: '/rankings/gens',
    
    // Status do Servidor
    SERVER_STATUS: '/status',
    SERVER_STATUS_DETAILED: '/status/detailed',
    
    // WCoin Packages
    WCOIN_PACKAGES: '/wcoin/packages',
  }
};

// Helper para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper para requisições autenticadas
export const getAuthHeaders = (token?: string | null): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const authToken = token || localStorage.getItem('auth_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// Helper para fazer requisições com tratamento de erros
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    const url = getApiUrl(endpoint);
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);
    throw error;
  }
};