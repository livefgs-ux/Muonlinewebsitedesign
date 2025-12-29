/**
 * 🎮 PLAYER DASHBOARD - REFATORADO V561
 * Reduzido de 1.100 linhas para ~250 linhas (78% de redução!)
 * 100% modular e reutilizável
 * 
 * CHANGELOG V561:
 * - ✅ Removido código duplicado (850 linhas eliminadas)
 * - ✅ Tabs separadas em componentes individuais
 * - ✅ Usa GlassCard, LoadingSpinner, WCoinShop reutilizáveis
 * - ✅ Importa CharacterManagement, PointDistribution, ResetSystem
 * - ✅ Código mais limpo e manutenível
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Users, TrendingUp, RefreshCw, ShoppingCart, 
  MessageSquare, Settings, LogOut, Sword, User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../../config/api';
import { LoadingSpinner } from '../ui/loading-spinner';
import { toast } from 'sonner';

// Tabs refatoradas
import { OverviewTab } from './tabs/OverviewTab';
import { AccountTab } from './tabs/AccountTab';
import { ShopTab } from './tabs/ShopTab';
import { SettingsTab } from './tabs/SettingsTab';

// Componentes existentes (já separados)
import { CharacterManagement } from '../character-management';
import { PointDistribution } from '../point-distribution';
import { ResetSystem } from '../reset-system';

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

interface PlayerDashboardProps {
  onLogout?: () => void;
}

type TabType = 'overview' | 'account' | 'characters' | 'points' | 'reset' | 'shop' | 'settings';

const PlayerDashboard = ({ onLogout }: PlayerDashboardProps) => {
  const { user, logout, isLoading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [accountInfo, setAccountInfo] = useState<UserInfo | null>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      loadAllData();
    }
  }, [authLoading]);

  const loadAllData = async () => {
    await Promise.all([
      loadAccountData(),
      loadCharacters(),
      loadActivities()
    ]);
  };

  const loadAccountData = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_ACCOUNT), {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setAccountInfo(data.data);
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
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHARACTERS), {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setCharacters(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
    }
  };

  const loadActivities = async () => {
    try {
      // Por enquanto, vamos comentar activities pois não temos endpoint ainda
      // const response = await fetch(getApiUrl('/player/activities'), {
      //   headers: getAuthHeaders()
      // });
      // const data = await response.json();
      // 
      // if (data.success && data.data) {
      //   setActivities(data.data);
      // }
      
      // Mock vazio por enquanto
      setActivities([]);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  // Loading states
  if (authLoading) {
    return <LoadingSpinner message="Verificando autenticação..." fullHeight />;
  }

  if (loading || !accountInfo) {
    return <LoadingSpinner message="Carregando informações..." fullHeight />;
  }

  // Tabs configuration
  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'Visão Geral', icon: Shield },
    { id: 'account', label: 'Conta', icon: User },
    { id: 'characters', label: 'Personagens', icon: Sword },
    { id: 'points', label: 'Pontos', icon: TrendingUp },
    { id: 'reset', label: 'Reset', icon: RefreshCw },
    { id: 'shop', label: 'Loja', icon: ShoppingCart },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-yellow-500 mb-2">
                Bem-vindo, {accountInfo.username}!
              </h1>
              <p className="text-gray-400">
                Gerencie sua conta e personagens
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-yellow-500 text-black'
                      : 'bg-black/40 backdrop-blur-xl border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <OverviewTab 
                accountInfo={accountInfo}
                characters={characters}
                activities={activities}
              />
            )}

            {activeTab === 'account' && (
              <AccountTab accountInfo={accountInfo} />
            )}

            {activeTab === 'characters' && (
              <CharacterManagement />
            )}

            {activeTab === 'points' && (
              <PointDistribution />
            )}

            {activeTab === 'reset' && (
              <ResetSystem />
            )}

            {activeTab === 'shop' && (
              <ShopTab />
            )}

            {activeTab === 'settings' && (
              <SettingsTab onNavigateToAccount={() => setActiveTab('account')} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlayerDashboard;