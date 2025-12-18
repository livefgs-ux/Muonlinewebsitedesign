import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import {
  Plug,
  Settings,
  Power,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Database,
  Clock,
  Globe,
  Upload,
  Download,
} from 'lucide-react';

interface PluginCompatibility {
  site: boolean;
  mysql: boolean;
  cron: boolean;
  issues: string[];
}

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
  compatibility: PluginCompatibility;
  config: PluginConfig;
  requiresCron: boolean;
  requiresDatabase: boolean;
  icon: string;
}

const defaultPlugins: Plugin[] = [
  {
    id: 'account-lock',
    name: 'Account Lock',
    version: '1.0.0',
    description: 'Sistema de bloqueio de contas com verificação de segurança',
    author: 'IGCNetwork',
    enabled: true,
    compatibility: { site: true, mysql: true, cron: false, issues: [] },
    config: {
      enableEmailNotification: true,
      maxLoginAttempts: 5,
      lockDuration: 30,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '🔒',
  },
  {
    id: 'change-class',
    name: 'Change Class',
    version: '1.0.0',
    description: 'Permite aos jogadores trocar de classe via web',
    author: 'MU Team',
    enabled: true,
    compatibility: { site: true, mysql: true, cron: false, issues: [] },
    config: {
      enableClassChange: true,
      creditCost: 100,
      requireLevel: 400,
      cooldownHours: 24,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '⚔️',
  },
  {
    id: 'event-ranking',
    name: 'Event Ranking',
    version: '1.2.0',
    description: 'Sistema de ranking para eventos especiais',
    author: 'IGCNetwork',
    enabled: true,
    compatibility: { site: true, mysql: true, cron: true, issues: [] },
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
  },
  {
    id: 'online-players',
    name: 'Online Players',
    version: '1.2.0',
    description: 'Exibe jogadores online com detalhes personalizáveis',
    author: 'IGCNetwork',
    enabled: true,
    compatibility: { site: true, mysql: true, cron: false, issues: [] },
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
  },
  {
    id: 'exchange-resets',
    name: 'Exchange Resets',
    version: '1.0.0',
    description: 'Sistema de troca de resets por pontos ou créditos',
    author: 'MU Team',
    enabled: false,
    compatibility: { site: true, mysql: true, cron: false, issues: [] },
    config: {
      enableExchange: true,
      resetsPerCredit: 10,
      minimumResets: 50,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '🔄',
  },
  {
    id: 'mu-roulette',
    name: 'Mu Roulette',
    version: '1.1.0',
    description: 'Sistema de roleta para ganhar prêmios',
    author: 'IGCNetwork',
    enabled: false,
    compatibility: { site: true, mysql: true, cron: false, issues: [] },
    config: {
      enableRoulette: true,
      spinCost: 50,
      jackpotChance: 1,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '🎰',
  },
  {
    id: 'multi-account',
    name: 'Multi Account',
    version: '1.0.0',
    description: 'Gerenciamento de múltiplas contas por IP',
    author: 'IGCNetwork',
    enabled: true,
    compatibility: { site: true, mysql: true, cron: false, issues: [] },
    config: {
      maxAccountsPerIP: 3,
      enableIPTracking: true,
      alertOnExceed: true,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '👤',
  },
  {
    id: 'pvp-rankings',
    name: 'PvP Rankings',
    version: '1.1.0',
    description: 'Ranking de jogadores PvP com sistema de pontos',
    author: 'IGCNetwork',
    enabled: true,
    compatibility: { site: true, mysql: true, cron: true, issues: [] },
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
  },
  {
    id: 'paypal-donations',
    name: 'Paygol Donations',
    version: '1.2.0',
    description: 'Sistema de doações via Paygol',
    author: 'IGCNetwork',
    enabled: false,
    compatibility: { site: true, mysql: true, cron: false, issues: [] },
    config: {
      enableDonations: true,
      apiKey: '',
      secretKey: '',
      autoDelivery: true,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '💳',
  },
  {
    id: 'vip-membership',
    name: 'VIP Membership',
    version: '1.3.0',
    description: 'Sistema de assinatura VIP com benefícios exclusivos',
    author: 'IGCNetwork',
    enabled: false,
    compatibility: { site: true, mysql: true, cron: true, issues: [] },
    config: {
      enableVIP: true,
      monthlyPrice: 15,
      expBonus: 50,
      dropBonus: 30,
      autoRenewal: true,
    },
    requiresCron: true,
    requiresDatabase: true,
    icon: '⭐',
  },
  {
    id: 'weekly-lottery',
    name: 'Weekly Lottery',
    version: '2.0.0',
    description: 'Loteria semanal com prêmios automáticos',
    author: 'IGCNetwork',
    enabled: false,
    compatibility: { site: true, mysql: true, cron: true, issues: [] },
    config: {
      enableLottery: true,
      ticketPrice: 100,
      drawDay: 'Sunday',
      jackpotPercent: 70,
    },
    requiresCron: true,
    requiresDatabase: true,
    icon: '🎫',
  },
  {
    id: 'ticket-support',
    name: 'Ticket Support System',
    version: '1.1.0',
    description: 'Sistema de tickets de suporte ao jogador',
    author: 'IGCNetwork',
    enabled: true,
    compatibility: { site: true, mysql: true, cron: false, issues: [] },
    config: {
      enableTickets: true,
      maxOpenTickets: 3,
      autoCloseAfterDays: 7,
      emailNotifications: true,
    },
    requiresCron: false,
    requiresDatabase: true,
    icon: '🎫',
  },
];

export function AdminPlugins() {
  const [plugins, setPlugins] = useState<Plugin[]>(defaultPlugins);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [showInstaller, setShowInstaller] = useState(false);

  const togglePlugin = (id: string) => {
    setPlugins((prev) =>
      prev.map((plugin) =>
        plugin.id === id ? { ...plugin, enabled: !plugin.enabled } : plugin
      )
    );
  };

  const deletePlugin = (id: string) => {
    if (confirm('🗑️ Tem certeza que deseja remover este plugin? Esta ação não pode ser desfeita.')) {
      setPlugins((prev) => prev.filter((plugin) => plugin.id !== id));
      if (selectedPlugin?.id === id) {
        setSelectedPlugin(null);
      }
    }
  };

  const updatePluginConfig = (pluginId: string, key: string, value: any) => {
    setPlugins((prev) =>
      prev.map((plugin) =>
        plugin.id === pluginId
          ? { ...plugin, config: { ...plugin.config, [key]: value } }
          : plugin
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-white mb-2">Gerenciamento de Plugins</h1>
          <p className="text-gray-400">
            Instale, configure e gerencie plugins do servidor
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowInstaller(!showInstaller)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Instalar Plugin
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-black/70 border-yellow-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Plug className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total de Plugins</p>
              <p className="text-2xl text-white">{plugins.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-black/70 border-green-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ativos</p>
              <p className="text-2xl text-white">
                {plugins.filter((p) => p.enabled).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-black/70 border-blue-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Requerem MySQL</p>
              <p className="text-2xl text-white">
                {plugins.filter((p) => p.requiresDatabase).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-black/70 border-purple-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Requerem Cron</p>
              <p className="text-2xl text-white">
                {plugins.filter((p) => p.requiresCron).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Plugin Installer */}
      {showInstaller && <PluginInstaller onClose={() => setShowInstaller(false)} />}

      <div className="grid grid-cols-12 gap-6">
        {/* Plugins List */}
        <div className="col-span-5">
          <Card className="bg-black/70 border-yellow-500/30 p-6">
            <h3 className="text-xl text-white mb-4 flex items-center gap-2">
              <Plug className="w-5 h-5 text-yellow-500" />
              Plugins Instalados
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {plugins.map((plugin) => (
                <button
                  key={plugin.id}
                  onClick={() => setSelectedPlugin(plugin)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedPlugin?.id === plugin.id
                      ? 'bg-yellow-500/20 border border-yellow-500/50'
                      : 'bg-black/50 border border-yellow-500/20 hover:border-yellow-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{plugin.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white">{plugin.name}</h4>
                          <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs">
                            v{plugin.version}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {plugin.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {plugin.requiresDatabase && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs flex items-center gap-1">
                              <Database className="w-3 h-3" />
                              MySQL
                            </span>
                          )}
                          {plugin.requiresCron && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Cron
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          plugin.enabled ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      />
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Plugin Details/Settings */}
        <div className="col-span-7">
          {selectedPlugin ? (
            <PluginSettings
              plugin={selectedPlugin}
              onToggle={() => togglePlugin(selectedPlugin.id)}
              onDelete={() => deletePlugin(selectedPlugin.id)}
              onConfigUpdate={(key, value) =>
                updatePluginConfig(selectedPlugin.id, key, value)
              }
            />
          ) : (
            <Card className="bg-black/70 border-yellow-500/30 p-12 text-center">
              <Plug className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">
                Nenhum plugin selecionado
              </p>
              <p className="text-gray-500 text-sm">
                Selecione um plugin da lista para ver suas configurações
              </p>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function PluginSettings({
  plugin,
  onToggle,
  onDelete,
  onConfigUpdate,
}: {
  plugin: Plugin;
  onToggle: () => void;
  onDelete: () => void;
  onConfigUpdate: (key: string, value: any) => void;
}) {
  const [hasChanges, setHasChanges] = useState(false);

  const handleConfigChange = (key: string, value: any) => {
    onConfigUpdate(key, value);
    setHasChanges(true);
  };

  const handleSave = () => {
    alert('✅ Configurações salvas com sucesso!');
    setHasChanges(false);
  };

  return (
    <Card className="bg-black/70 border-yellow-500/30 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-yellow-500/20">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{plugin.icon}</span>
            <div>
              <h3 className="text-2xl text-white mb-1">{plugin.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{plugin.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>v{plugin.version}</span>
                <span>•</span>
                <span>por {plugin.author}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onToggle}
              variant="outline"
              size="sm"
              className={
                plugin.enabled
                  ? 'border-green-500/50 text-green-500 hover:bg-green-500/10'
                  : 'border-gray-500/50 text-gray-500 hover:bg-gray-500/10'
              }
            >
              <Power className="w-4 h-4 mr-1" />
              {plugin.enabled ? 'Ativo' : 'Inativo'}
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="border-red-500/50 text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Compatibility Check */}
        <div>
          <h4 className="text-white mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-yellow-500" />
            Verificação de Compatibilidade
          </h4>
          <div className="space-y-2">
            <CompatibilityItem
              label="Site"
              compatible={plugin.compatibility.site}
              icon={<Globe className="w-4 h-4" />}
            />
            <CompatibilityItem
              label="MySQL/MariaDB"
              compatible={plugin.compatibility.mysql}
              icon={<Database className="w-4 h-4" />}
            />
            <CompatibilityItem
              label="Cron Jobs"
              compatible={plugin.compatibility.cron || !plugin.requiresCron}
              icon={<Clock className="w-4 h-4" />}
              optional={!plugin.requiresCron}
            />
          </div>
          {plugin.compatibility.issues.length > 0 && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium mb-2">
                    Problemas de Compatibilidade:
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                    {plugin.compatibility.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div>
          <h4 className="text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-yellow-500" />
            Configurações do Plugin
          </h4>
          <div className="space-y-4">
            {Object.entries(plugin.config).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-yellow-500/20">
                <label className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {typeof value === 'boolean' ? (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={key}
                        checked={value === true}
                        onChange={() => handleConfigChange(key, true)}
                        className="w-4 h-4 text-yellow-500"
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={key}
                        checked={value === false}
                        onChange={() => handleConfigChange(key, false)}
                        className="w-4 h-4 text-yellow-500"
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                ) : typeof value === 'number' ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleConfigChange(key, parseInt(e.target.value))
                    }
                    className="w-32 bg-black/50 border border-yellow-500/30 rounded px-3 py-2 text-white text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                    className="w-64 bg-black/50 border border-yellow-500/30 rounded px-3 py-2 text-white text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* UserCP Links */}
        {plugin.enabled && (
          <div className="pt-6 border-t border-yellow-500/20">
            <h4 className="text-white mb-3">UserCP Links</h4>
            <p className="text-gray-400 text-sm mb-3">
              Clique no botão abaixo para adicionar automaticamente os links deste plugin ao menu do UserCP.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Add UserCP Links
            </Button>
          </div>
        )}

        {/* Save Button */}
        <div className="flex gap-3 pt-6 border-t border-yellow-500/20">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black"
          >
            Save Changes
          </Button>
        </div>

        {hasChanges && (
          <p className="text-yellow-500 text-sm text-center">
            ⚠️ Você tem alterações não salvas
          </p>
        )}
      </div>
    </Card>
  );
}

function CompatibilityItem({
  label,
  compatible,
  icon,
  optional = false,
}: {
  label: string;
  compatible: boolean;
  icon: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${
        compatible
          ? 'bg-green-500/10 border-green-500/30'
          : optional
          ? 'bg-gray-500/10 border-gray-500/30'
          : 'bg-red-500/10 border-red-500/30'
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={
            compatible
              ? 'text-green-400'
              : optional
              ? 'text-gray-400'
              : 'text-red-400'
          }
        >
          {icon}
        </div>
        <span
          className={
            compatible
              ? 'text-green-300'
              : optional
              ? 'text-gray-300'
              : 'text-red-300'
          }
        >
          {label}
          {optional && ' (Opcional)'}
        </span>
      </div>
      {compatible ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : optional ? (
        <span className="text-gray-500 text-sm">Não requerido</span>
      ) : (
        <XCircle className="w-5 h-5 text-red-500" />
      )}
    </div>
  );
}

function PluginInstaller({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    compatible: boolean;
    issues: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const checkCompatibility = () => {
    setChecking(true);
    // Simular verificação de compatibilidade
    setTimeout(() => {
      // Exemplo de verificação aleatória para demo
      const issues: string[] = [];
      const random = Math.random();

      if (random < 0.3) {
        issues.push('Plugin requer tabela "PluginData" que não existe no banco de dados');
        issues.push('Função "cron_schedule" não está disponível no servidor');
      }

      setResult({
        compatible: issues.length === 0,
        issues,
      });
      setChecking(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-black/70 border-blue-500/30 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Instalar Novo Plugin
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Selecione o arquivo do plugin (.zip)
            </label>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
            />
          </div>

          {file && !result && (
            <Button
              onClick={checkCompatibility}
              disabled={checking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {checking ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Verificando Compatibilidade...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verificar Compatibilidade
                </>
              )}
            </Button>
          )}

          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.compatible
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex items-start gap-2 mb-3">
                {result.compatible ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-green-400 font-medium mb-1">
                        ✅ Plugin Compatível!
                      </p>
                      <p className="text-green-300 text-sm">
                        O plugin passou em todas as verificações e pode ser instalado com segurança.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium mb-2">
                        ❌ Plugin Incompatível
                      </p>
                      <p className="text-red-300 text-sm mb-3">
                        O plugin apresenta os seguintes problemas:
                      </p>
                      <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                        {result.issues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {result.compatible && (
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-3">
                  <Download className="w-4 h-4 mr-2" />
                  Instalar Plugin
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
