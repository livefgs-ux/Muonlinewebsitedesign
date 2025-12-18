import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plug,
  AlertTriangle,
  User,
  Package,
  Calendar,
  Power,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface Plugin {
  id: number;
  name: string;
  author: string;
  version: string;
  compatibility: string;
  install_date: number;
  status: number;
}

// Mock plugins - In production, this comes from database
const mockPlugins: Plugin[] = [
  {
    id: 1,
    name: 'Account Lock',
    author: 'IGCNetwork',
    version: '1.0.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1642435200,
    status: 1,
  },
  {
    id: 2,
    name: 'Change Class',
    author: 'MU Team',
    version: '1.0.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1643040000,
    status: 1,
  },
  {
    id: 3,
    name: 'Event Ranking',
    author: 'IGCNetwork',
    version: '1.2.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1643644800,
    status: 1,
  },
  {
    id: 4,
    name: 'Online Players',
    author: 'IGCNetwork',
    version: '1.2.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1644249600,
    status: 1,
  },
  {
    id: 5,
    name: 'Exchange Resets',
    author: 'MU Team',
    version: '1.0.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1644854400,
    status: 0,
  },
  {
    id: 6,
    name: 'Mu Roulette',
    author: 'IGCNetwork',
    version: '1.1.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1645459200,
    status: 0,
  },
  {
    id: 7,
    name: 'Multi Account',
    author: 'IGCNetwork',
    version: '1.0.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1646064000,
    status: 1,
  },
  {
    id: 8,
    name: 'PvP Rankings',
    author: 'IGCNetwork',
    version: '1.1.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1646668800,
    status: 1,
  },
  {
    id: 9,
    name: 'Paygol Donations',
    author: 'IGCNetwork',
    version: '1.2.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1647273600,
    status: 0,
  },
  {
    id: 10,
    name: 'VIP Membership',
    author: 'IGCNetwork',
    version: '1.3.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1647878400,
    status: 0,
  },
  {
    id: 11,
    name: 'Weekly Lottery',
    author: 'IGCNetwork',
    version: '2.0.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1648483200,
    status: 0,
  },
  {
    id: 12,
    name: 'Ticket Support System',
    author: 'IGCNetwork',
    version: '1.1.0',
    compatibility: '1.2.0|1.2.1|1.2.2|1.2.3|1.2.4|1.2.5|1.2.6',
    install_date: 1649088000,
    status: 1,
  },
];

export function AdminPlugins() {
  const [plugins, setPlugins] = useState<Plugin[]>(mockPlugins);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'warning' | null;
    text: string;
  }>({ type: null, text: '' });

  // Plugin system status - would come from config in production
  const pluginSystemEnabled = true;
  const allowUninstall = true;

  const handleEnable = (id: number) => {
    console.log('🟢 Enabling plugin ID:', id);
    setPlugins((prev) =>
      prev.map((plugin) =>
        plugin.id === id ? { ...plugin, status: 1 } : plugin
      )
    );
    setMessage({ type: 'success', text: 'Plugin enabled successfully!' });
    setTimeout(() => setMessage({ type: null, text: '' }), 3000);
  };

  const handleDisable = (id: number) => {
    console.log('🔴 Disabling plugin ID:', id);
    setPlugins((prev) =>
      prev.map((plugin) =>
        plugin.id === id ? { ...plugin, status: 0 } : plugin
      )
    );
    setMessage({ type: 'success', text: 'Plugin disabled successfully!' });
    setTimeout(() => setMessage({ type: null, text: '' }), 3000);
  };

  const handleUninstall = (id: number, name: string) => {
    if (!allowUninstall) {
      setMessage({ type: 'error', text: 'Plugin uninstall is not allowed.' });
      return;
    }

    if (!confirm(`Are you sure you want to uninstall "${name}"? This action cannot be undone.`)) {
      return;
    }

    console.log('🗑️ Uninstalling plugin ID:', id);
    setPlugins((prev) => prev.filter((plugin) => plugin.id !== id));
    setMessage({ type: 'success', text: 'Plugin successfully uninstalled.' });
    console.log('🔄 Rebuilding plugins cache...');
    setTimeout(() => setMessage({ type: null, text: '' }), 3000);
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatCompatibility = (compatibility: string): string => {
    return compatibility.split('|').join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">Plugin Manager</h1>
        <p className="text-gray-400">Manage installed plugins</p>
      </div>

      {/* Plugin System Warning */}
      {!pluginSystemEnabled && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/50 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/50 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-orange-300 font-semibold mb-2">WARNING</h3>
              <p className="text-orange-300/80 text-sm">
                The plugin system is not currently enabled. To enable it please change your{' '}
                <a
                  href="?module=website_settings"
                  className="text-orange-200 underline hover:text-orange-100 transition-colors"
                >
                  website settings
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <AnimatePresence>
        {message.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl p-6 border ${
              message.type === 'success'
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50'
                : message.type === 'error'
                ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50'
                : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                  message.type === 'success'
                    ? 'bg-green-500/20 border-green-500/50'
                    : message.type === 'error'
                    ? 'bg-red-500/20 border-red-500/50'
                    : 'bg-yellow-500/20 border-yellow-500/50'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : message.type === 'error' ? (
                  <XCircle className="w-6 h-6 text-red-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    message.type === 'success'
                      ? 'text-green-300'
                      : message.type === 'error'
                      ? 'text-red-300'
                      : 'text-yellow-300'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Plugins</p>
              <p className="text-3xl text-blue-500 font-bold">{plugins.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
              <Plug className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Enabled</p>
              <p className="text-3xl text-green-500 font-bold">
                {plugins.filter((p) => p.status === 1).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/50">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-gray-500/5 border-gray-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Disabled</p>
              <p className="text-3xl text-gray-500 font-bold">
                {plugins.filter((p) => p.status === 0).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-500/20 flex items-center justify-center border border-gray-500/50">
              <XCircle className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Plugins Table */}
      {plugins.length > 0 ? (
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50 bg-black/30">
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Name</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Author</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Version</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Compatibility</th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">Install Date</th>
                  <th className="px-6 py-4 text-center text-gray-400 font-medium">Status</th>
                  <th className="px-6 py-4 text-center text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plugins.map((plugin, index) => (
                  <motion.tr
                    key={plugin.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-700/30 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Plug className="w-4 h-4 text-sky-400" />
                        <span className="text-white font-medium">{plugin.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300">{plugin.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300">{plugin.version}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {formatCompatibility(plugin.compatibility)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300">{formatDate(plugin.install_date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {plugin.status === 1 ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/50">
                          enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm border border-gray-500/50">
                          disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {plugin.status === 1 ? (
                          <Button
                            onClick={() => handleDisable(plugin.id)}
                            className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1"
                          >
                            disable
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEnable(plugin.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                          >
                            enable
                          </Button>
                        )}
                        {allowUninstall && (
                          <Button
                            onClick={() => handleUninstall(plugin.id, plugin.name)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
                          >
                            uninstall
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-12">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl text-yellow-300 font-semibold mb-2">No Plugins Installed</h3>
            <p className="text-gray-400">
              You have not installed any plugin yet. Visit the{' '}
              <a href="?module=import_plugin" className="text-yellow-400 underline hover:text-yellow-300">
                Import Plugin
              </a>{' '}
              page to install new plugins.
            </p>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <Plug className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Plugin Manager Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Manage all installed plugins from this page. You can enable, disable, or uninstall plugins.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Enable:</strong> Activate the plugin to make it available on your website</li>
              <li><strong>Disable:</strong> Deactivate the plugin without uninstalling it</li>
              <li><strong>Uninstall:</strong> Completely remove the plugin from your system</li>
              <li><strong>Compatibility:</strong> Shows which WebEngine versions the plugin supports</li>
              <li><strong>Install Date:</strong> When the plugin was first installed</li>
              <li>After uninstalling, the plugins cache is automatically rebuilt</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
