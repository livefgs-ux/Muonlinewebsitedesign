import { useState, useEffect, memo, useMemo } from "react";
import {
  Server,
  Users,
  TrendingUp,
  Zap,
  Circle,
  Skull,
} from "lucide-react";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { serverAPI } from "../../services/api";

interface ServerInfoWidgetProps {
  currentSection?: string;
}

interface ServerData {
  status: string;
  players_online: number;
  total_accounts: number;
  total_characters: number;
  total_guilds: number;
  castle_owner: string;
  total_bosses: number;
  alive_bosses: number;
  server_name: string;
  season: string;
  exp_rate: string;
  drop_rate: string;
  updated_at: string;
}

export const ServerInfoWidget = memo(function ServerInfoWidget({ currentSection = 'home' }: ServerInfoWidgetProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  // Fetch server data from Node.js Backend
  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        // Usar o novo backend Node.js em localhost:3001
        const [info, stats] = await Promise.all([
          serverAPI.getServerInfo(),
          serverAPI.getServerStats()
        ]);
        
        // Converter para o formato esperado pelo componente
        const data: ServerData = {
          status: 'online',
          players_online: stats.playersOnline || 0,
          total_accounts: stats.totalAccounts || 0,
          total_characters: stats.totalCharacters || 0,
          total_guilds: stats.totalGuilds || 0,
          castle_owner: undefined, // ❌ REMOVIDO - Sem dados reais no banco
          total_bosses: undefined, // ❌ REMOVIDO - Sem dados reais no banco
          alive_bosses: undefined, // ❌ REMOVIDO - Sem dados reais no banco
          server_name: info.name || 'MeuMU Online',
          season: info.version || 'Season 19-2-3 - Épico',
          exp_rate: info.rates?.exp || '9999x',
          drop_rate: info.rates?.drop || '60%',
          updated_at: stats.lastUpdate || new Date().toISOString()
        };
        
        setServerData(data);
        setIsOnline(true);
        setIsLoading(false);
        
      } catch (error) {
        console.error('❌ Erro ao buscar dados do servidor:', error);
        
        // ✅ ERRO: Não usar fallback, mostrar estado de erro
        setServerData(null);
        setIsOnline(false);
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchServerInfo();

    // Fetch every 60 seconds
    const interval = setInterval(fetchServerInfo, 60000);

    return () => clearInterval(interval);
  }, []);

  const serverInfo = useMemo(() => [
    { 
      label: t('common.season')?.split(' ')[0] || 'Season', // "Season" - safe navigation
      value: serverData?.season?.split(' - ')[0] || "Season 19-2-3", 
      icon: Server 
    },
    { 
      label: t('serverStatus.experience'), 
      value: serverData?.exp_rate || "9999x", 
      icon: TrendingUp 
    },
    { 
      label: t('serverStatus.drop'), 
      value: serverData?.drop_rate || "60%", 
      icon: Zap 
    },
    {
      label: t('serverStatus.players'),
      value: isLoading ? t('common.loading') : (serverData?.players_online.toLocaleString() || "0"),
      icon: Users,
    },
    // ❌ REMOVIDO: Alive Bosses (sem dados reais no banco)
  ], [t, serverData, isLoading]);

  // Hide widget in AdminCP and Dashboard - MOVED AFTER all hooks
  const hiddenSections = ['admincp', 'dashboard'];
  if (hiddenSections.includes(currentSection)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed right-6 top-24 z-30 hidden xl:block pointer-events-auto"
      style={{ maxWidth: '280px' }}
    >
      <Card className="backdrop-blur-lg bg-black/70 border-yellow-500/30 p-6 w-64 shadow-2xl shadow-black/50">
        {/* Server Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white">{t('serverStatus.title')}</h3>
            <div className="flex items-center gap-2">
              <Circle
                className={`w-3 h-3 ${isOnline ? "fill-green-500 text-green-500" : "fill-red-500 text-red-500"}`}
              />
              <span
                className={`text-sm ${isOnline ? "text-green-500" : "text-red-500"}`}
              >
                {isOnline ? t('serverStatus.online') : t('serverStatus.offline')}
              </span>
            </div>
          </div>

          {isOnline && (
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                initial={{ width: "0%" }}
                animate={{ width: "95%" }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          )}
        </div>

        {/* Server Info */}
        <div className="space-y-3">
          {serverInfo.map((info, index) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-yellow-500/20"
            >
              <div className="flex items-center gap-2">
                <info.icon className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-400 text-sm">
                  {info.label}
                </span>
              </div>
              <span className="text-white">{info.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <div className="mt-6 pt-6 border-t border-yellow-500/20">
          <h4 className="text-white text-sm mb-3">
            Comunidade
          </h4>
          <div className="flex flex-col gap-2">
            {[
              {
                name: "Discord",
                color:
                  "bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/50 text-indigo-500",
              },
              {
                name: "WhatsApp",
                color:
                  "bg-green-500/40 hover:bg-green-500/50 border-green-500/50 text-green-500",
              },
              {
                name: "Fórum",
                color:
                  "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/50 text-yellow-500",
              },
            ].map((social) => (
              <button
                key={social.name}
                className={`px-4 py-2 rounded text-sm border transition-all ${social.color}`}
              >
                {social.name}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
});