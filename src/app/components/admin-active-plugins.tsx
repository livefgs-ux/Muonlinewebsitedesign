import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import {
  CheckCircle,
  Settings,
  Power,
  Database,
  Clock,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

interface PluginConfig {
  [key: string]: boolean | string | number;
}

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  config: PluginConfig;
  requiresCron: boolean;
  requiresDatabase: boolean;
  icon: string;
  lastUpdate: string;
}

// Plugins ativos (os mesmos do admin-plugins.tsx, mas filtrados por enabled: true)
const activePlugins: Plugin[] = [
  {
    id: 'account-lock',
    name: 'Account Lock',
    version: '1.0.0',
    description: 'Sistema de bloqueio de contas com verificação de segurança',
    author: 'IGCNetwork',
    enabled: true,
    config: {
      enableEmailNotification: true,
      maxLoginAttempts: 5,
      lockDuration: 30,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '🔒',
    lastUpdate: '2 days ago',
  },
  {
    id: 'change-class',
    name: 'Change Class',
    version: '1.0.0',
    description: 'Permite aos jogadores trocar de classe via web',
    author: 'MU Team',
    enabled: true,
    config: {
      enableClassChange: true,
      creditCost: 100,
      requireLevel: 400,
      cooldownHours: 24,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '⚔️',
    lastUpdate: '1 week ago',
  },
  {
    id: 'event-ranking',
    name: 'Event Ranking',
    version: '1.2.0',
    description: 'Sistema de ranking para eventos especiais',
    author: 'IGCNetwork',
    enabled: true,
    config: {
      showClass: true,
      showLevel: true,
      showGuild: true,
      updateInterval: 5,
      topPlayersCount: 100,
    },
    requiresCron: true,
    requiresDatabase: true,
    icon: '🏆',
    lastUpdate: '3 days ago',
  },
  {
    id: 'online-players',
    name: 'Online Players',
    version: '1.2.0',
    description: 'Exibe jogadores online com detalhes personalizáveis',
    author: 'IGCNetwork',
    enabled: true,
    config: {
      showClass: true,
      showLevel: true,
      showLastLocation: true,
      showMasterLevel: true,
      combineRegularMasterLevel: true,
      showGuild: true,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '👥',
    lastUpdate: '5 days ago',
  },
  {
    id: 'multi-account',
    name: 'Multi Account',
    version: '1.0.0',
    description: 'Gerenciamento de múltiplas contas por IP',
    author: 'IGCNetwork',
    enabled: true,
    config: {
      maxAccountsPerIP: 3,
      enableIPTracking: true,
      alertOnExceed: true,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '👤',
    lastUpdate: '1 week ago',
  },
  {
    id: 'pvp-rankings',
    name: 'PvP Rankings',
    version: '1.1.0',
    description: 'Ranking de jogadores PvP com sistema de pontos',
    author: 'IGCNetwork',
    enabled: true,
    config: {
      showClass: true,
      showKills: true,
      showDeaths: true,
      showKDRatio: true,
      updateInterval: 10,
    },
    requiresCron: true,
    requiresDatabase: true,
    icon: '⚔️',
    lastUpdate: '4 days ago',
  },
  {
    id: 'ticket-support',
    name: 'Ticket Support System',
    version: '1.1.0',
    description: 'Sistema de tickets de suporte ao jogador',
    author: 'IGCNetwork',
    enabled: true,
    config: {
      enableTickets: true,
      maxOpenTickets: 3,
      autoCloseAfterDays: 7,
      emailNotifications: true,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '🎫',
    lastUpdate: '6 days ago',
  },
];

export function AdminActivePlugins() {
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  const totalCronPlugins = activePlugins.filter((p) => p.requiresCron).length;
  const totalDatabasePlugins = activePlugins.filter((p) => p.requiresDatabase).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-white mb-2">Active Plugins</h1>
          <p className="text-gray-400">
            Visualize e gerencie todos os plugins ativos no servidor
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-black/70 border-green-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Plugins Ativos</p>
              <p className="text-2xl text-white">{activePlugins.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-black/70 border-blue-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Usam MySQL</p>
              <p className="text-2xl text-white">{totalDatabasePlugins}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-black/70 border-purple-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Usam Cron</p>
              <p className="text-2xl text-white">{totalCronPlugins}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-black/70 border-yellow-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Settings className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Configs</p>
              <p className="text-2xl text-white">
                {activePlugins.reduce((acc, p) => acc + Object.keys(p.config).length, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Plugins Grid */}
      <div className="grid grid-cols-1 gap-4">
        {activePlugins.map((plugin) => (
          <motion.div
            key={plugin.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-black/70 border-green-500/30 p-6 hover:border-green-500/50 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                    <span className="text-3xl">{plugin.icon}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl text-white">{plugin.name}</h3>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/50 flex items-center gap-1">
                        <Power className="w-3 h-3" />
                        ATIVO
                      </span>
                      <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs">
                        v{plugin.version}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-3">{plugin.description}</p>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500">
                        Por <span className="text-gray-400">{plugin.author}</span>
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">
                        Atualizado {plugin.lastUpdate}
                      </span>
                    </div>

                    {/* Requirements */}
                    <div className="flex items-center gap-2 mt-3">
                      {plugin.requiresDatabase && (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center gap-1 border border-blue-500/30">
                          <Database className="w-3 h-3" />
                          MySQL
                        </span>
                      )}
                      {plugin.requiresCron && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs flex items-center gap-1 border border-purple-500/30">
                          <Clock className="w-3 h-3" />
                          Cron Job
                        </span>
                      )}
                      <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                        {Object.keys(plugin.config).length} configurações
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setSelectedPlugin(plugin)}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-black"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Configurar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
                  >
                    Ver Detalhes
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Quick Config Preview */}
              {selectedPlugin?.id === plugin.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-green-500/20"
                >
                  <h4 className="text-white mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-yellow-500" />
                    Configurações Rápidas
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(plugin.config).slice(0, 4).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-green-500/20"
                      >
                        <span className="text-gray-300 text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {typeof value === 'boolean' ? (
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              value
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                : 'bg-red-500/20 text-red-400 border border-red-500/50'
                            }`}
                          >
                            {value ? 'Yes' : 'No'}
                          </span>
                        ) : (
                          <span className="text-white text-sm">{value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black"
                    onClick={() => {
                      alert('🔄 Redirecionando para a página de configuração completa...');
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Abrir Configurações Completas
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info Message */}
      <Card className="bg-blue-500/10 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-blue-400 font-medium mb-2">💡 Dica de Gerenciamento</h4>
            <p className="text-blue-300 text-sm">
              Esta página exibe apenas os plugins que estão atualmente ativos no servidor. 
              Para ativar/desativar plugins ou instalar novos, vá para{' '}
              <span className="text-white font-medium">Plugins Manager</span>.
            </p>
          </div>
        </div>
      </Card>

      {activePlugins.length === 0 && (
        <Card className="bg-black/70 border-yellow-500/30 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">Nenhum plugin ativo</p>
          <p className="text-gray-500 text-sm mb-6">
            Vá para Plugins Manager para ativar plugins
          </p>
          <Button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black">
            <Settings className="w-4 h-4 mr-2" />
            Ir para Plugins Manager
          </Button>
        </Card>
      )}
    </motion.div>
  );
}
