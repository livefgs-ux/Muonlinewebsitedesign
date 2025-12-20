import { motion } from 'motion/react';
import { 
  Users, Swords, TrendingUp, Award, Activity, Shield,
  Ban, CreditCard, FileText, Calendar, Database, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';

/**
 * 📊 Dashboard Section - Visão Geral do Servidor
 * 
 * ✨ Features:
 * - Estatísticas em tempo real
 * - Cards de métricas principais
 * - Status do servidor
 * - Atividade recente
 * - Gráficos e indicadores
 */

// Mock data para demonstração
const MOCK_STATS = {
  accounts: {
    total: 1257,
    online: 83,
    banned: 12,
    newToday: 8
  },
  characters: {
    total: 3542,
    activeToday: 156,
    topLevel: 400,
    resets: 28456
  },
  economy: {
    totalZen: "1.2B",
    totalCredits: 45678,
    transactions: 892,
    topDonator: "DarkLord99"
  },
  events: {
    active: 3,
    scheduled: 7,
    completed: 145,
    participants: 423
  },
  server: {
    uptime: "99.8%",
    tps: 19.9,
    memory: "68%",
    cpu: "42%",
    players: "83/500"
  }
};

const RECENT_ACTIVITIES = [
  {
    id: 1,
    user: "DarkLord99",
    action: "fez reset de personagem",
    time: "2 min atrás",
    type: "reset",
    color: "text-blue-400"
  },
  {
    id: 2,
    user: "MageSupreme",
    action: "comprou 500 créditos",
    time: "5 min atrás",
    type: "purchase",
    color: "text-green-400"
  },
  {
    id: 3,
    user: "WarriorKing",
    action: "atingiu nível 400",
    time: "8 min atrás",
    type: "level",
    color: "text-amber-400"
  },
  {
    id: 4,
    user: "AdminTest",
    action: "baniu usuário hack123",
    time: "15 min atrás",
    type: "ban",
    color: "text-red-400"
  },
  {
    id: 5,
    user: "NewPlayer01",
    action: "criou nova conta",
    time: "20 min atrás",
    type: "register",
    color: "text-purple-400"
  },
  {
    id: 6,
    user: "GuildMaster",
    action: "organizou Castle Siege",
    time: "35 min atrás",
    type: "event",
    color: "text-pink-400"
  }
];

export function DashboardSection() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Contas Totais"
          value={MOCK_STATS.accounts.total.toLocaleString()}
          subtitle={`${MOCK_STATS.accounts.online} online agora`}
          icon={Users}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
          trend={`+${MOCK_STATS.accounts.newToday} hoje`}
          trendPositive={true}
        />
        
        <StatCard
          title="Personagens"
          value={MOCK_STATS.characters.total.toLocaleString()}
          subtitle={`${MOCK_STATS.characters.activeToday} ativos hoje`}
          icon={Swords}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
          trend={`Nível ${MOCK_STATS.characters.topLevel} máx`}
          trendPositive={true}
        />
        
        <StatCard
          title="Economia Total"
          value={MOCK_STATS.economy.totalZen}
          subtitle={`${MOCK_STATS.economy.transactions} transações`}
          icon={TrendingUp}
          color="text-green-400"
          bgColor="bg-green-500/10"
          trend={`${MOCK_STATS.economy.totalCredits.toLocaleString()} créditos`}
          trendPositive={true}
        />
        
        <StatCard
          title="Eventos Ativos"
          value={MOCK_STATS.events.active}
          subtitle={`${MOCK_STATS.events.participants} participantes`}
          icon={Award}
          color="text-amber-400"
          bgColor="bg-amber-500/10"
          trend={`${MOCK_STATS.events.scheduled} agendados`}
          trendPositive={true}
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
              value={MOCK_STATS.server.uptime} 
              percentage={99.8}
              color="bg-green-500" 
            />
            <MetricBar 
              label="CPU" 
              value={MOCK_STATS.server.cpu} 
              percentage={42}
              color="bg-blue-500" 
            />
            <MetricBar 
              label="Memória" 
              value={MOCK_STATS.server.memory} 
              percentage={68}
              color="bg-purple-500" 
            />
            <MetricBar 
              label="Jogadores" 
              value={MOCK_STATS.server.players} 
              percentage={16.6}
              color="bg-amber-500" 
            />
            
            <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">TPS (Ticks por segundo)</p>
                <p className="text-2xl font-bold text-green-400">{MOCK_STATS.server.tps}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Performance</p>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Excelente
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
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[340px] pr-4">
              <div className="space-y-3">
                {RECENT_ACTIVITIES.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-transparent hover:border-amber-500/20"
                  >
                    <ActivityIcon type={activity.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className={`font-bold ${activity.color}`}>{activity.user}</span>
                        {' '}{activity.action}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat
          icon={Ban}
          label="Bans Ativos"
          value={MOCK_STATS.accounts.banned}
          color="text-red-400"
          bgColor="bg-red-500/10"
        />
        <QuickStat
          icon={CreditCard}
          label="Créditos Vendidos"
          value={MOCK_STATS.economy.totalCredits.toLocaleString()}
          color="text-green-400"
          bgColor="bg-green-500/10"
        />
        <QuickStat
          icon={Calendar}
          label="Eventos Completos"
          value={MOCK_STATS.events.completed}
          color="text-pink-400"
          bgColor="bg-pink-500/10"
        />
        <QuickStat
          icon={Database}
          label="Total de Resets"
          value={MOCK_STATS.characters.resets.toLocaleString()}
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
              className={`text-xs ${trendPositive ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}
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
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full shadow-lg`}
          style={{
            boxShadow: `0 0 10px ${color.replace('bg-', 'rgba(')}`
          }}
        />
      </div>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, { Icon: any; color: string; bgColor: string }> = {
    reset: { Icon: Shield, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    purchase: { Icon: CreditCard, color: 'text-green-400', bgColor: 'bg-green-500/20' },
    level: { Icon: Award, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
    ban: { Icon: Ban, color: 'text-red-400', bgColor: 'bg-red-500/20' },
    register: { Icon: Users, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    event: { Icon: Calendar, color: 'text-pink-400', bgColor: 'bg-pink-500/20' }
  };

  const { Icon, color, bgColor } = icons[type] || icons.register;

  return (
    <div className={`p-2 rounded-lg ${bgColor} shadow-lg`}>
      <Icon className={`w-4 h-4 ${color}`} />
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
