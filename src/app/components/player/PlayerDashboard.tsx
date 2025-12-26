/**
 * 🎮 PLAYER DASHBOARD - 100% REAL (SEM MOCKS)
 * Integrado com backend Node.js + MariaDB
 * Versão 492 - Dados reais do banco de dados
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Users, TrendingUp, RefreshCw, ShoppingCart, 
  MessageSquare, Settings, LogOut, Sword, 
  MapPin, Clock, Mail, Lock, Eye, EyeOff, AlertCircle, 
  Send, ChevronRight, Zap, Heart, Coins, User
} from 'lucide-react';
import { getStatusColor, getIconEmoji } from '../../../utils/status-helpers';
import type { Character, Activity as ActivityType, Stats } from '../../../types/common';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../../config/api';

interface UserInfo {
  username: string;
  email: string;
  accountId: string;
  createdAt: string;
  vipLevel: number;
  isBlocked: boolean;
  isAdmin: boolean;
  cashCredits: number;
}

interface ExtendedCharacter extends Character {
  location: string;
  coords: string;
  lastLogin: Date;
  stats: {
    str: number;
    agi: number;
    vit: number;
    ene: number;
    points: number;
  };
}

interface PlayerDashboardProps {
  onLogout?: () => void;
}

interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  createdAt: string;
}

type TabType = 'account' | 'characters' | 'stats' | 'reset' | 'shop' | 'tickets' | 'settings';

const PlayerDashboard = ({ onLogout }: PlayerDashboardProps) => {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [selectedChar, setSelectedChar] = useState<ExtendedCharacter | null>(null);
  const [showStatsBox, setShowStatsBox] = useState(false);
  const [statsMessage, setStatsMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Data states (REAL)
  const [accountInfo, setAccountInfo] = useState<UserInfo | null>(null);
  const [characters, setCharacters] = useState<ExtendedCharacter[]>([]);
  const [userStats, setUserStats] = useState<Stats>({ wcoin: 0, goblinPoints: 0, zen: 0 });
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats inputs
  const [pointsToAdd, setPointsToAdd] = useState({ str: 0, agi: 0, vit: 0, ene: 0 });
  
  // Account settings
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Transfer states
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);

  // Ticket states
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  // Shop states
  const [wcoinPackages, setWcoinPackages] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // =========================================================================
  // 🔄 CARREGAR DADOS REAIS DO BACKEND
  // =========================================================================

  useEffect(() => {
    loadAccountData();
    loadCharacters();
    loadWCoinPackages();
    loadTickets();
    loadActivities();
  }, []);

  const loadAccountData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        if (onLogout) onLogout();
        return;
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_ACCOUNT), {
        headers: getAuthHeaders(token)
      });

      if (response.ok) {
        const data = await response.json();
        setAccountInfo({
          username: data.data.accountId || user?.username || 'Player',
          email: data.data.email || user?.email || '',
          accountId: data.data.accountId || '',
          createdAt: data.data.createdAt || 'N/A',
          vipLevel: data.data.vipLevel || 0,
          isBlocked: data.data.isBlocked || false,
          isAdmin: data.data.isAdmin || false,
          cashCredits: data.data.cashCredits || 0
        });
        setEmail(data.data.email || '');
      } else {
        throw new Error('Falha ao carregar dados da conta');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da conta:', error);
      toast.error('Erro ao carregar informações da conta');
    } finally {
      setLoading(false);
    }
  };

  const loadCharacters = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHARACTERS), {
        headers: getAuthHeaders(token)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const formattedChars: ExtendedCharacter[] = data.data.map((char: any) => ({
            id: char.id || 0,
            name: char.name || 'Unknown',
            class: char.class || 'Unknown',
            level: char.level || 1,
            resets: char.resets || 0,
            masterResets: char.masterResets || 0,
            guild: char.guild || '-',
            online: char.online || false,
            location: char.location || 'Unknown',
            coords: char.coords || '0, 0',
            lastLogin: char.lastLogin ? new Date(char.lastLogin) : new Date(),
            stats: {
              str: char.strength || 0,
              agi: char.agility || 0,
              vit: char.vitality || 0,
              ene: char.energy || 0,
              points: char.levelUpPoint || 0
            }
          }));
          setCharacters(formattedChars);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
    }
  };

  const loadWCoinPackages = async () => {
    try {
      setLoadingPackages(true);
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WCOIN_PACKAGES));
      const data = await response.json();
      
      if (data.success && data.data) {
        setWcoinPackages(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar pacotes de WCoin:', error);
      setWcoinPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  const loadTickets = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      // TODO: Implementar endpoint /api/tickets no backend
      // Por enquanto, deixar vazio (SEM MOCK)
      setTickets([]);
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
    }
  };

  const loadActivities = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      // TODO: Implementar endpoint /api/activities no backend
      // Por enquanto, deixar vazio (SEM MOCK)
      setActivities([]);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  // =========================================================================
  // 🎮 FUNÇÕES DE AÇÕES DO JOGADOR
  // =========================================================================

  const handleSelectCharacter = (char: ExtendedCharacter) => {
    setSelectedChar(char);
    setPointsToAdd({ str: 0, agi: 0, vit: 0, ene: 0 });
  };

  const canPerformAction = () => {
    if (!selectedChar) {
      toast.error('Por favor, selecione um personagem primeiro!');
      return false;
    }
    if (selectedChar.online) {
      toast.error('O personagem está online! Desconecte do jogo para usar esta função.');
      return false;
    }
    return true;
  };

  const handleAddPoints = (stat: string) => {
    if (!selectedChar) return;
    
    const total = Object.values(pointsToAdd).reduce((a, b) => a + b, 0);
    if (total < selectedChar.stats.points) {
      setPointsToAdd({ ...pointsToAdd, [stat]: pointsToAdd[stat as keyof typeof pointsToAdd] + 1 });
    }
  };

  const handleApplyPoints = async () => {
    if (!canPerformAction()) return;
    
    const total = Object.values(pointsToAdd).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
      toast.error('Adicione pelo menos 1 ponto!');
      return;
    }

    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHARACTERS_ADD_STATS), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(token || ''),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterName: selectedChar?.name,
          points: pointsToAdd
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`${total} pontos distribuídos com sucesso!`);
        setPointsToAdd({ str: 0, agi: 0, vit: 0, ene: 0 });
        await loadCharacters(); // Recarregar personagens
      } else {
        toast.error(data.message || 'Erro ao adicionar pontos');
      }
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      toast.error('Erro ao processar requisição');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    if (!canPerformAction()) return;
    
    if (selectedChar && selectedChar.level >= 400) {
      const confirmed = window.confirm(
        `Deseja realmente fazer reset do personagem ${selectedChar.name}?\n\n` +
        `O personagem voltará ao level 1 e ganhará +1 reset.`
      );

      if (confirmed) {
        setIsProcessing(true);

        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHARACTERS_RESET), {
            method: 'POST',
            headers: {
              ...getAuthHeaders(token || ''),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              characterName: selectedChar.name
            })
          });

          const data = await response.json();

          if (data.success) {
            toast.success('Reset realizado com sucesso!');
            await loadCharacters();
          } else {
            toast.error(data.message || 'Erro ao realizar reset');
          }
        } catch (error) {
          console.error('Erro ao realizar reset:', error);
          toast.error('Erro ao processar requisição');
        } finally {
          setIsProcessing(false);
        }
      }
    } else {
      toast.error('Personagem precisa estar no level 400 para fazer reset!');
    }
  };

  const handleMasterReset = async () => {
    if (!canPerformAction()) return;
    
    if (selectedChar && selectedChar.level >= 400 && selectedChar.resets >= 400) {
      const confirmed = window.confirm(
        `Deseja realmente fazer MASTER RESET do personagem ${selectedChar.name}?\n\n` +
        `Requisitos: Level 400 + 400 Resets\n` +
        `O personagem voltará ao level 1, resets zerados e ganhará +1 Master Reset.`
      );

      if (confirmed) {
        setIsProcessing(true);

        try {
          const token = localStorage.getItem('auth_token');
          const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHARACTERS_MASTER_RESET), {
            method: 'POST',
            headers: {
              ...getAuthHeaders(token || ''),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              characterName: selectedChar.name
            })
          });

          const data = await response.json();

          if (data.success) {
            toast.success('Master Reset realizado com sucesso!');
            await loadCharacters();
          } else {
            toast.error(data.message || 'Erro ao realizar master reset');
          }
        } catch (error) {
          console.error('Erro ao realizar master reset:', error);
          toast.error('Erro ao processar requisição');
        } finally {
          setIsProcessing(false);
        }
      }
    } else {
      toast.error('Requisitos: Level 400 + 400 Resets!');
    }
  };

  const handleLogout = async () => {
    await logout();
    if (onLogout) onLogout();
    toast.success('Logout realizado com sucesso!');
  };

  const handleSaveEmail = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Email inválido!');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(getApiUrl('/api/auth/update-email'), {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(token || ''),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Email atualizado com sucesso!');
        setIsEditingEmail(false);
        await loadAccountData();
      } else {
        toast.error(data.message || 'Erro ao atualizar email');
      }
    } catch (error) {
      console.error('Erro ao atualizar email:', error);
      toast.error('Erro ao processar requisição');
    }
  };

  const handleSavePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    // Validação de senha forte
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;
    if (!strongPasswordRegex.test(newPassword)) {
      toast.error('Senha muito fraca! Use maiúsculas, minúsculas, números e símbolos.');
      return;
    }

    // Verificar sequências
    const checkSequences = (str: string) => {
      for (let i = 0; i < str.length - 2; i++) {
        const charCode = str.charCodeAt(i);
        if ((str.charCodeAt(i+1) === charCode + 1 && str.charCodeAt(i+2) === charCode + 2) ||
            (str.charCodeAt(i+1) === charCode - 1 && str.charCodeAt(i+2) === charCode - 2)) {
          return true;
        }
        if (str[i] === str[i+1] && str[i] === str[i+2]) return true;
      }
      return false;
    };

    if (checkSequences(newPassword.toLowerCase())) {
      toast.error('A senha não pode conter sequências óbvias (abc, 123) ou caracteres repetidos (aaa, 111).');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(getApiUrl('/api/auth/update-password'), {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(token || ''),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          currentPassword: password,
          newPassword 
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Senha atualizada com sucesso!');
        setIsEditingPassword(false);
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Erro ao atualizar senha');
      }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      toast.error('Erro ao processar requisição');
    }
  };

  // =========================================================================
  // 🎨 FORMATAÇÃO E UTILIDADES
  // =========================================================================

  const formatNumber = (num: number) => num.toLocaleString('pt-BR');
  
  const formatLocalizedCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const sortedCharacters = [...characters].sort((a, b) => 
    b.lastLogin.getTime() - a.lastLogin.getTime()
  );

  const displayedCharacters = sortedCharacters.slice(0, 3);

  // =========================================================================
  // 🎬 LOADING STATE
  // =========================================================================

  if (loading || !accountInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando informações...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 🎨 RENDER DO DASHBOARD
  // =========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl text-white mb-2">Bem-vindo, {accountInfo.username}</h2>
              <p className="text-gray-400">Gerencie seus personagens e conta</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">WCoin</p>
                  <p className="text-2xl text-yellow-500 font-bold">{formatNumber(accountInfo.cashCredits)}</p>
                </div>
                <Coins className="w-8 h-8 text-yellow-500" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">VIP Level</p>
                  <p className="text-2xl text-purple-500 font-bold">{accountInfo.vipLevel}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Personagens</p>
                  <p className="text-2xl text-blue-500 font-bold">{characters.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'account', label: 'Minha Conta', icon: User },
              { id: 'characters', label: 'Personagens', icon: Sword },
              { id: 'stats', label: 'Distribuir Pontos', icon: Zap },
              { id: 'reset', label: 'Reset', icon: RefreshCw },
              { id: 'shop', label: 'Loja', icon: ShoppingCart },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-500'
                    : 'bg-black/40 border border-gray-700 text-gray-400 hover:border-yellow-500/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'account' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Info Card */}
                <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6">
                  <h3 className="text-xl text-yellow-500 mb-6 flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Informações da Conta
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Status da Conta:</label>
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 rounded-lg ${
                          !accountInfo.isBlocked
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                          {!accountInfo.isBlocked ? 'Ativa' : 'Bloqueada'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Nome de Usuário:</label>
                      <div className="bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-3">
                        <p className="text-white">{accountInfo.username}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Email:</label>
                      {!isEditingEmail ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-3">
                            <p className="text-white">{email}</p>
                          </div>
                          <button
                            onClick={() => setIsEditingEmail(true)}
                            className="px-4 py-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all"
                          >
                            Editar
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-yellow-500/50 rounded-lg px-4 py-3 text-white"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEmail}
                              className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingEmail(false);
                                setEmail(accountInfo.email);
                              }}
                              className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Data de Criação:</label>
                      <div className="bg-black/50 border border-yellow-500/30 rounded-lg px-4 py-3">
                        <p className="text-white">{accountInfo.createdAt}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Change Card */}
                <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6">
                  <h3 className="text-xl text-yellow-500 mb-6 flex items-center gap-2">
                    <Lock className="w-6 h-6" />
                    Alterar Senha
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Senha Atual:</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-black/50 border border-yellow-500/50 rounded-lg px-4 py-3 text-white pr-12"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Nova Senha:</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-black/50 border border-yellow-500/50 rounded-lg px-4 py-3 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Confirmar Nova Senha:</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a nova senha"
                        className="w-full bg-black/50 border border-yellow-500/50 rounded-lg px-4 py-3 text-white"
                      />
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <p className="text-yellow-500 text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Requisitos de Senha:
                      </p>
                      <ul className="text-gray-400 text-xs space-y-1">
                        <li>• Mínimo 6 caracteres</li>
                        <li>• 1 letra maiúscula (A-Z)</li>
                        <li>• 1 letra minúscula (a-z)</li>
                        <li>• 1 número (0-9)</li>
                        <li>• 1 caractere especial (!@#$%^&*)</li>
                        <li>• Sem sequências (abc, 123)</li>
                        <li>• Sem repetições (aaa, 111)</li>
                      </ul>
                    </div>

                    <button
                      onClick={handleSavePassword}
                      className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all"
                    >
                      Salvar Nova Senha
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'characters' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Sword className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhum personagem encontrado</p>
                    <p className="text-gray-500 text-sm mt-2">Crie um personagem no jogo para começar!</p>
                  </div>
                ) : (
                  characters.map((char) => (
                    <motion.div
                      key={char.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectCharacter(char)}
                      className={`bg-black/40 backdrop-blur-xl border rounded-xl p-6 cursor-pointer transition-all ${
                        selectedChar?.id === char.id
                          ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                          : 'border-gray-700 hover:border-yellow-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl text-yellow-500 font-bold">{char.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          char.online
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                          {char.online ? 'Online' : 'Offline'}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm mb-4">{char.class}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Level:</span>
                          <span className="text-white font-bold">{char.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Resets:</span>
                          <span className="text-blue-400 font-bold">{char.resets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Master Resets:</span>
                          <span className="text-purple-400 font-bold">{char.masterResets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Guild:</span>
                          <span className="text-white">{char.guild}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pontos:</span>
                          <span className="text-green-400 font-bold">{char.stats.points}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="max-w-2xl mx-auto">
                {!selectedChar ? (
                  <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-12 text-center">
                    <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">Selecione um Personagem</p>
                    <p className="text-gray-400">Vá para a aba "Personagens" e selecione um personagem para distribuir pontos</p>
                  </div>
                ) : (
                  <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-8">
                    <h3 className="text-2xl text-yellow-500 mb-6 flex items-center gap-2">
                      <Zap className="w-8 h-8" />
                      Distribuir Pontos - {selectedChar.name}
                    </h3>

                    <div className="mb-6">
                      <p className="text-gray-400 mb-2">Pontos Disponíveis:</p>
                      <p className="text-4xl text-green-400 font-bold">
                        {selectedChar.stats.points - Object.values(pointsToAdd).reduce((a, b) => a + b, 0)}
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      {[
                        { key: 'str', label: 'Força (STR)', current: selectedChar.stats.str },
                        { key: 'agi', label: 'Agilidade (AGI)', current: selectedChar.stats.agi },
                        { key: 'vit', label: 'Vitalidade (VIT)', current: selectedChar.stats.vit },
                        { key: 'ene', label: 'Energia (ENE)', current: selectedChar.stats.ene }
                      ].map((stat) => (
                        <div key={stat.key} className="flex items-center justify-between bg-black/50 border border-yellow-500/30 rounded-lg p-4">
                          <div className="flex-1">
                            <p className="text-white mb-1">{stat.label}</p>
                            <p className="text-gray-400 text-sm">Atual: {stat.current}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-green-400 font-bold">+{pointsToAdd[stat.key as keyof typeof pointsToAdd]}</span>
                            <button
                              onClick={() => handleAddPoints(stat.key)}
                              disabled={Object.values(pointsToAdd).reduce((a, b) => a + b, 0) >= selectedChar.stats.points}
                              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-bold rounded-lg transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleApplyPoints}
                      disabled={isProcessing || Object.values(pointsToAdd).reduce((a, b) => a + b, 0) === 0}
                      className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-bold text-lg rounded-lg transition-all"
                    >
                      {isProcessing ? 'Processando...' : 'Aplicar Pontos'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reset' && (
              <div className="max-w-2xl mx-auto">
                {!selectedChar ? (
                  <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-12 text-center">
                    <RefreshCw className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <p className="text-white text-lg mb-2">Selecione um Personagem</p>
                    <p className="text-gray-400">Vá para a aba "Personagens" e selecione um personagem para fazer reset</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Reset Normal */}
                    <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-8">
                      <h3 className="text-2xl text-yellow-500 mb-6 flex items-center gap-2">
                        <RefreshCw className="w-8 h-8" />
                        Reset Normal
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Personagem:</span>
                          <span className="text-white font-bold">{selectedChar.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Level Atual:</span>
                          <span className="text-white font-bold">{selectedChar.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Resets Atuais:</span>
                          <span className="text-blue-400 font-bold">{selectedChar.resets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Level Necessário:</span>
                          <span className={selectedChar.level >= 400 ? 'text-green-400' : 'text-red-400'}>400</span>
                        </div>
                      </div>

                      <button
                        onClick={handleReset}
                        disabled={isProcessing || selectedChar.level < 400}
                        className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-bold text-lg rounded-lg transition-all"
                      >
                        {isProcessing ? 'Processando...' : selectedChar.level >= 400 ? 'Fazer Reset' : 'Level Insuficiente'}
                      </button>
                    </div>

                    {/* Master Reset */}
                    <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl p-8">
                      <h3 className="text-2xl text-purple-500 mb-6 flex items-center gap-2">
                        <Shield className="w-8 h-8" />
                        Master Reset
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Level Necessário:</span>
                          <span className={selectedChar.level >= 400 ? 'text-green-400' : 'text-red-400'}>400</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Resets Necessários:</span>
                          <span className={selectedChar.resets >= 400 ? 'text-green-400' : 'text-red-400'}>400</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Master Resets Atuais:</span>
                          <span className="text-purple-400 font-bold">{selectedChar.masterResets}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleMasterReset}
                        disabled={isProcessing || selectedChar.level < 400 || selectedChar.resets < 400}
                        className="w-full px-6 py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-bold text-lg rounded-lg transition-all"
                      >
                        {isProcessing ? 'Processando...' : selectedChar.level >= 400 && selectedChar.resets >= 400 ? 'Fazer Master Reset' : 'Requisitos Não Atendidos'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shop' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingPackages ? (
                  <div className="col-span-full text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-white">Carregando pacotes...</p>
                  </div>
                ) : wcoinPackages.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhum pacote disponível no momento</p>
                  </div>
                ) : (
                  wcoinPackages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6"
                    >
                      <div className="text-center mb-4">
                        <p className="text-4xl text-yellow-500 font-bold mb-2">{pkg.wcoin}</p>
                        <p className="text-gray-400">WCoin</p>
                      </div>

                      <div className="text-center mb-6">
                        <p className="text-2xl text-white font-bold">{formatLocalizedCurrency(pkg.price)}</p>
                      </div>

                      {pkg.bonus > 0 && (
                        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-2 mb-4 text-center">
                          <p className="text-green-400 text-sm">+{pkg.bonus} Bônus</p>
                        </div>
                      )}

                      <button className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all">
                        Comprar Agora
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-8">
                  <h3 className="text-2xl text-yellow-500 mb-6 flex items-center gap-2">
                    <Settings className="w-8 h-8" />
                    Configurações da Conta
                  </h3>

                  <div className="space-y-6">
                    <div className="border-b border-gray-700 pb-6">
                      <h4 className="text-white text-lg mb-4">Segurança</h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Altere sua senha regularmente para manter sua conta segura.
                      </p>
                      <button
                        onClick={() => setActiveTab('account')}
                        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all"
                      >
                        Alterar Senha
                      </button>
                    </div>

                    <div className="border-b border-gray-700 pb-6">
                      <h4 className="text-white text-lg mb-4">Notificações</h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Receba notificações por email sobre atualizações e eventos.
                      </p>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5" defaultChecked />
                        <span className="text-white">Receber emails promocionais</span>
                      </label>
                    </div>

                    <div>
                      <h4 className="text-white text-lg mb-4">Zona de Perigo</h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Esta ação é irreversível. Todos os seus personagens e dados serão excluídos permanentemente.
                      </p>
                      <button
                        disabled
                        className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 font-bold rounded-lg cursor-not-allowed"
                      >
                        Excluir Conta (Desabilitado)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlayerDashboard;
