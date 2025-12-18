import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  username: string;
  name: string;
  email: string;
  isAdmin: boolean;
  adminLevel: number;
  accountLevel: number;
}

interface Character {
  name: string;
  level: number;
  class: number;
  resets: number;
  zen: number;
}

interface AuthContextType {
  user: User | null;
  characters: Character[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, password: string, email: string, name?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  verifyAdmin: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('muonline_user');
        const storedToken = localStorage.getItem('muonline_token');
        const storedCharacters = localStorage.getItem('muonline_characters');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          if (storedCharacters) {
            setCharacters(JSON.parse(storedCharacters));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('muonline_user');
        localStorage.removeItem('muonline_token');
        localStorage.removeItem('muonline_characters');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      // Salvar dados no state e localStorage
      setUser(data.data.user);
      setCharacters(data.data.characters);

      localStorage.setItem('muonline_user', JSON.stringify(data.data.user));
      localStorage.setItem('muonline_token', data.data.token);
      localStorage.setItem('muonline_characters', JSON.stringify(data.data.characters));

      return { success: true };

    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: 'Erro ao conectar com o servidor. Verifique se o backend está rodando.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, email: string, name?: string) => {
    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, name }),
      });

      const data = await response.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      return { success: true, message: data.message };

    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        message: 'Erro ao conectar com o servidor. Verifique se o backend está rodando.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCharacters([]);
    localStorage.removeItem('muonline_user');
    localStorage.removeItem('muonline_token');
    localStorage.removeItem('muonline_characters');
  };

  const verifyAdmin = async (username: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/verify?username=${username}`);
      const data = await response.json();

      if (data.success) {
        return data.data.isAdmin;
      }

      return false;
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        characters,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        isLoading,
        login,
        register,
        logout,
        verifyAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
