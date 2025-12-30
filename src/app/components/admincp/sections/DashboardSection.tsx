import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Swords, TrendingUp, Award, Activity, Shield,
  Ban, CreditCard, FileText, Calendar, Database, Zap, AlertCircle, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';

/**
 * 📊 Dashboard Section - Visão Geral do Servidor
 * 
 * ✅ V573+ - DADOS REAIS DO BACKEND
 * - Estatísticas em tempo real do banco de dados
 * - Status do servidor
 * - Atividade recente
 * - Refresh automático
 */

interface DashboardStats {
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
    online: number;
  };
  economy: {
    totalZen: string;
    totalZenRaw: number;
    totalCredits: number;
    transactions: number;
    goblinPoints: number;
  };
  events: {
    active: number;
    scheduled: number;
    completed: number;
    participants: number;
  };
  server: {
    uptime: string;
    tps: number;
    memory: string;
    cpu: string;
    players: string;
    playersOnline: number;
    playersMax: number;
  };
}

const RECENT_ACTIVITIES = [
  {
    id: 1,
    user: "Sistema",
    action: "atualizando estatísticas",
    time: "agora",
    type: "register",
    color: "text-blue-400"
  }
];

export function DashboardSection() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Função para buscar estatísticas
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ V574 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/admin/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ao buscar estatísticas: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erro ao buscar estatísticas');
      }

      console.log('✅ Estatísticas do dashboard recebidas:', data.data);
      setStats(data.data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('❌ Erro ao buscar estatísticas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Buscar estatísticas ao montar o componente
  useEffect(() => {
    fetchStats();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-white font-semibold">Carregando estatísticas...</p>
          <p className="text-slate-400 text-sm mt-2">Buscando dados do servidor</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !stats) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Card className="bg-red-500/10 border-red-500/30 max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-400 mb-2">Erro ao Carregar Dashboard</h3>
            <p className="text-slate-300 mb-4">{error}</p>
            <Button 
              onClick={fetchStats}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se não tem stats ainda, não renderiza nada
  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header com Last Update */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Dashboard</h2>
          <p className="text-sm text-slate-400">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>
        <Button
          onClick={fetchStats}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Contas Totais"
          value={stats.accounts.total.toLocaleString()}
          subtitle={`${stats.accounts.online} online agora`}
          icon={Users}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
          trend={stats.accounts.newToday > 0 ? `+${stats.accounts.newToday} hoje` : 'Nenhuma hoje'}
          trendPositive={stats.accounts.newToday > 0}
        />
        
        <StatCard
          title="Personagens"
          value={stats.characters.total.toLocaleString()}
          subtitle={`${stats.characters.online} online agora`}
          icon={Swords}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
          trend={`Nível ${stats.characters.topLevel} máx`}
          trendPositive={true}
        />
        
        <StatCard
          title="Economia Total"
          value={stats.economy.totalZen}
          subtitle={`${stats.economy.totalCredits.toLocaleString()} créditos`}
          icon={TrendingUp}
          color="text-green-400"
          bgColor="bg-green-500/10"
          trend={`${(stats.economy.totalZenRaw / 1000000).toFixed(1)}M Zen`}
          trendPositive={true}
        />
        
        <StatCard
          title="Eventos Ativos"
          value={stats.events.active}
          subtitle={`${stats.events.scheduled} agendados`}
          icon={Award}
          color="text-amber-400"
          bgColor="bg-amber-500/10"
          trend={stats.events.active > 0 ? 'Em andamento' : 'Nenhum ativo'}
          trendPositive={stats.events.active > 0}
        />
      </div>

      {/* Server Status & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Status */}
        <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Activity className="w-5 h-5" />
              Status do Servidor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MetricBar 
              label="Uptime" 
              value={stats.server.uptime} 
              percentage={parseFloat(stats.server.uptime)}
              color="bg-green-500" 
            />
            <MetricBar 
              label="CPU" 
              value={stats.server.cpu} 
              percentage={parseFloat(stats.server.cpu)}
              color="bg-blue-500" 
            />
            <MetricBar 
              label="Memória" 
              value={stats.server.memory} 
              percentage={parseFloat(stats.server.memory)}
              color="bg-purple-500" 
            />
            <MetricBar 
              label="Jogadores" 
              value={stats.server.players} 
              percentage={(stats.server.playersOnline / stats.server.playersMax) * 100}
              color="bg-amber-500" 
            />
            
            <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">TPS (Ticks por segundo)</p>
                <p className="text-2xl font-bold text-green-400">{stats.server.tps.toFixed(1)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Performance</p>
                <Badge className={`${
                  stats.server.tps >= 19.5 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : stats.server.tps >= 18.0
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  <Zap className="w-3 h-3 mr-1" />
                  {stats.server.tps >= 19.5 ? 'Excelente' : stats.server.tps >= 18.0 ? 'Bom' : 'Baixo'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <FileText className="w-5 h-5" />
              Estatísticas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <QuickStatInline
                icon={Users}
                label="Jogadores Ativos Hoje"
                value={stats.characters.activeToday}
                color="text-blue-400"
              />
              <QuickStatInline
                icon={Ban}
                label="Contas Banidas"
                value={stats.accounts.banned}
                color="text-red-400"
              />
              <QuickStatInline
                icon={Database}
                label="Total de Resets"
                value={stats.characters.resets.toLocaleString()}
                color="text-cyan-400"
              />
              <QuickStatInline
                icon={CreditCard}
                label="Goblin Points Acumulados"
                value={stats.economy.goblinPoints.toLocaleString()}
                color="text-green-400"
              />
              <QuickStatInline
                icon={Swords}
                label="Personagens Criados"
                value={stats.characters.total.toLocaleString()}
                color="text-purple-400"
              />
              <QuickStatInline
                icon={Award}
                label="Eventos Agendados"
                value={stats.events.scheduled}
                color="text-pink-400"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat
          icon={Ban}
          label="Bans Ativos"
          value={stats.accounts.banned}
          color="text-red-400"
          bgColor="bg-red-500/10"
        />
        <QuickStat
          icon={CreditCard}
          label="Créditos Vendidos"
          value={stats.economy.totalCredits.toLocaleString()}
          color="text-green-400"
          bgColor="bg-green-500/10"
        />
        <QuickStat
          icon={Calendar}
          label="Eventos Ativos"
          value={stats.events.active}
          color="text-pink-400"
          bgColor="bg-pink-500/10"
        />
        <QuickStat
          icon={Database}
          label="Total de Resets"
          value={stats.characters.resets.toLocaleString()}
          color="text-cyan-400"
          bgColor="bg-cyan-500/10"
        />
      </div>
    </div>
  );
}

// ========================================
// Componentes Auxiliares
// ========================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
  trend: string;
  trendPositive: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, color, bgColor, trend, trendPositive }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 shadow-xl hover:shadow-amber-500/10">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${bgColor} shadow-lg`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${trendPositive ? 'border-green-500/30 text-green-400' : 'border-slate-500/30 text-slate-400'}`}
            >
              {trend}
            </Badge>
          </div>
          <h3 className="text-3xl font-black text-white mb-1">{value}</h3>
          <p className="text-sm text-slate-400 mb-1 font-medium">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface MetricBarProps {
  label: string;
  value: string;
  percentage: number;
  color: string;
}

function MetricBar({ label, value, percentage, color }: MetricBarProps) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-slate-400 font-medium">{label}</span>
        <span className="text-sm text-white font-bold">{value}</span>
      </div>
      <div className="h-2.5 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-xl">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full shadow-lg`}
        />
      </div>
    </div>
  );
}

interface QuickStatProps {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

function QuickStat({ icon: Icon, label, value, color, bgColor }: QuickStatProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl ${bgColor} backdrop-blur-xl border border-transparent hover:border-amber-500/20 transition-all`}
    >
      <Icon className={`w-5 h-5 ${color} mb-2`} />
      <p className="text-2xl font-black text-white mb-1">{value}</p>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
    </motion.div>
  );
}

interface QuickStatInlineProps {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}

function QuickStatInline({ icon: Icon, label, value, color }: QuickStatInlineProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-slate-900/50`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <span className="text-sm text-slate-300 font-medium">{label}</span>
      </div>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
  );
}