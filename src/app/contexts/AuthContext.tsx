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
  const [user, setUser] = useState<User | null>(() => {
    // 🛡️ V578 FIX: Carregar dados do usuário do cache ao inicializar
    // Isso evita que o botão AdminCP desapareça durante reload/erros
    const cachedUserData = sessionStorage.getItem('user_data');
    const token = sessionStorage.getItem('auth_token');
    
    if (cachedUserData && token) {
      try {
        const parsedData = JSON.parse(cachedUserData);
        console.log('🔄 Dados do usuário restaurados do cache (inicialização)');
        return parsedData;
      } catch (e) {
        console.error('Erro ao restaurar dados do usuário:', e);
      }
    }
    
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há token salvo ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // ✅ BUSCAR DE /api/auth/account (tem isAdmin!)
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_ACCOUNT), {
        headers: getAuthHeaders(token)
      });

      if (response.ok) {
        const data = await response.json();
        // Backend retorna { success: true, data: { username, email, isAdmin, ... } }
        const accountData = data.data;
        
        if (accountData) {
          const userData = {
            username: accountData.username,
            email: accountData.email,
            isAdmin: accountData.isAdmin || false,
            accountId: accountData.username
          };
          
          setUser(userData);
          
          // 🛡️ V578 FIX: Persistir dados do usuário no sessionStorage
          // Isso garante que o estado de admin NÃO seja perdido em erros temporários
          sessionStorage.setItem('user_data', JSON.stringify(userData));
          
          console.log('✅ Usuário autenticado:', accountData.username, 'Admin:', accountData.isAdmin);
        }
      } else if (response.status === 401 || response.status === 403) {
        // ✅ Token inválido ou expirado - remover
        console.log('🔴 Token inválido ou expirado - fazendo logout');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_data'); // 🛡️ V578: Limpar dados persistidos
        setUser(null);
      } else {
        // ⚠️ Outro erro (400, 500, 503, etc) - MANTER TOKEN E USER
        // 🛡️ V578 FIX: Tentar recuperar dados do sessionStorage se disponível
        console.log(`⚠️ Erro ${response.status} ao verificar token - tentando recuperar dados locais`);
        
        const cachedUserData = sessionStorage.getItem('user_data');
        if (cachedUserData && !user) {
          try {
            const parsedData = JSON.parse(cachedUserData);
            setUser(parsedData);
            console.log('✅ Dados do usuário recuperados do cache local');
          } catch (e) {
            console.error('Erro ao parsear dados do usuário:', e);
          }
        }
      }
    } catch (error) {
      // 🛡️ Erro de rede ou servidor offline - MANTER TOKEN E USER
      // 🛡️ V578 FIX: Recuperar dados do sessionStorage
      console.log('⚠️ Backend offline - tentando recuperar dados locais');
      
      const cachedUserData = sessionStorage.getItem('user_data');
      if (cachedUserData && !user) {
        try {
          const parsedData = JSON.parse(cachedUserData);
          setUser(parsedData);
          console.log('✅ Dados do usuário recuperados do cache local (offline)');
        } catch (e) {
          console.error('Erro ao parsear dados do usuário:', e);
        }
      }
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
        // ✅ V.530 FIX: Backend retorna { success: true, data: { token, user } }
        // Não { token, user } diretamente!
        const token = data.data?.token || data.token; // Compatibilidade
        const user = data.data?.user || data.user;     // Compatibilidade
        
        if (!token) {
          console.error('❌ Token não recebido do backend:', data);
          return { success: false, message: 'Erro: token não recebido do servidor' };
        }
        
        sessionStorage.setItem('auth_token', token);
        
        // 🛡️ V578 FIX: Persistir dados do usuário no cache
        sessionStorage.setItem('user_data', JSON.stringify(user));
        
        setUser(user);
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
      const token = sessionStorage.getItem('auth_token');
      if (token) {
        await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_LOGOUT), {
          method: 'POST',
          headers: getAuthHeaders(token)
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_data'); // 🛡️ V578: Limpar dados persistidos
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
  return sessionStorage.getItem('auth_token');
}