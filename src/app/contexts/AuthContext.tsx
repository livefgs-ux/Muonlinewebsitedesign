import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../config/api';

export interface User {
  username: string;
  email: string;
  isAdmin: boolean;
  accountId: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há token salvo ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_VERIFY), {
        headers: getAuthHeaders(token)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401 || response.status === 403) {
        // ✅ Token inválido ou expirado - remover
        console.log('🔴 Token inválido ou expirado - fazendo logout');
        localStorage.removeItem('auth_token');
        setUser(null);
      } else {
        // ⚠️ Outro erro (500, 503, etc) - manter token mas não logar
        console.log(`⚠️ Erro ${response.status} ao verificar token - mantendo sessão local`);
        // Não remove token - usuário pode tentar novamente
        setUser(null);
      }
    } catch (error) {
      // 🛡️ Erro de rede ou servidor offline - MANTER TOKEN
      // Permite que usuário navegue no site enquanto backend está offline
      console.log('⚠️ Backend offline - mantendo token para reconexão automática');
      // NÃO remove token - quando backend voltar, usuário reconecta automaticamente
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        return { success: true, message: 'Login realizado com sucesso!' };
      } else {
        return { success: false, message: data.message || 'Erro ao fazer login' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro de conexão com o servidor' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'Conta criada com sucesso! Faça login.' };
      } else {
        return { success: false, message: data.message || 'Erro ao criar conta' };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro de conexão com o servidor' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_FORGOT_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'Email de recuperação enviado com sucesso!' };
      } else {
        return { success: false, message: data.message || 'Erro ao enviar email de recuperação' };
      }
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      return { success: false, message: 'Erro de conexão com o servidor' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_LOGOUT), {
          method: 'POST',
          headers: getAuthHeaders(token)
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    register,
    forgotPassword,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // 🛡️ Durante Hot Module Reload (HMR), o contexto pode estar temporariamente undefined
    // Retorna valores padrão ao invés de quebrar a aplicação
    if (import.meta.hot) {
      console.warn('⚠️ AuthContext não disponível durante HMR - usando valores padrão');
      return {
        user: null,
        isLoggedIn: false,
        isLoading: false,
        login: async () => ({ success: false, message: 'Recarregando...' }),
        register: async () => ({ success: false, message: 'Recarregando...' }),
        forgotPassword: async () => ({ success: false, message: 'Recarregando...' }),
        logout: async () => {},
        refreshUser: async () => {}
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook para obter o token
export function useAuthToken() {
  return localStorage.getItem('auth_token');
}