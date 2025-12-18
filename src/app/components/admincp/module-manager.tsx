import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Globe,
  User,
  ChevronRight,
  Package,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface WebEngineModule {
  name: string;
  id: string;
  enabled?: boolean;
  category: 'global' | 'usercp';
}

interface ModuleConfig {
  enabled: boolean;
  settings: { [key: string]: any };
}

const webengineModules: WebEngineModule[] = [
  // Global Modules
  { name: 'News', id: 'news', enabled: true, category: 'global' },
  { name: 'Login', id: 'login', enabled: true, category: 'global' },
  { name: 'Register', id: 'register', enabled: true, category: 'global' },
  { name: 'Downloads', id: 'downloads', enabled: true, category: 'global' },
  { name: 'Donation', id: 'donation', enabled: true, category: 'global' },
  { name: 'PayPal', id: 'paypal', enabled: true, category: 'global' },
  { name: 'Rankings', id: 'rankings', enabled: true, category: 'global' },
  { name: 'Castle Siege', id: 'castlesiege', enabled: true, category: 'global' },
  { name: 'Email System', id: 'email', enabled: true, category: 'global' },
  { name: 'Profiles', id: 'profiles', enabled: true, category: 'global' },
  { name: 'Contact Us', id: 'contact', enabled: true, category: 'global' },
  { name: 'Forgot Password', id: 'forgotpassword', enabled: true, category: 'global' },
  
  // UserCP Modules
  { name: 'Add Stats', id: 'addstats', enabled: true, category: 'usercp' },
  { name: 'Clear PK', id: 'clearpk', enabled: true, category: 'usercp' },
  { name: 'Clear Skill-Tree', id: 'clearskilltree', enabled: true, category: 'usercp' },
  { name: 'My Account', id: 'myaccount', enabled: true, category: 'usercp' },
  { name: 'Change Password', id: 'mypassword', enabled: true, category: 'usercp' },
  { name: 'Change Email', id: 'myemail', enabled: true, category: 'usercp' },
  { name: 'Character Reset', id: 'reset', enabled: true, category: 'usercp' },
  { name: 'Reset Stats', id: 'resetstats', enabled: true, category: 'usercp' },
  { name: 'Unstick Character', id: 'unstick', enabled: true, category: 'usercp' },
  { name: 'Vote and Reward', id: 'vote', enabled: true, category: 'usercp' },
  { name: 'Buy Zen', id: 'buyzen', enabled: true, category: 'usercp' },
];

export function ModuleManager() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [moduleStates, setModuleStates] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(webengineModules.map(m => [m.id, m.enabled || true]))
  );

  const globalModules = webengineModules.filter(m => m.category === 'global');
  const usercpModules = webengineModules.filter(m => m.category === 'usercp');

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
  };

  const handleToggleModule = (moduleId: string) => {
    setModuleStates(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const selectedModuleData = webengineModules.find(m => m.id === selectedModule);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">Module Manager</h1>
        <p className="text-gray-400">Configure and manage website modules</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Modules</p>
              <p className="text-3xl text-blue-500 font-bold">{webengineModules.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
              <Package className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Enabled</p>
              <p className="text-3xl text-green-500 font-bold">
                {Object.values(moduleStates).filter(Boolean).length}
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
                {Object.values(moduleStates).filter(v => !v).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-500/20 flex items-center justify-center border border-gray-500/50">
              <AlertCircle className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Module Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Modules */}
        <Card className="backdrop-blur-lg bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/30">
          <div className="p-6 border-b border-gray-700/50 bg-blue-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl text-white font-semibold">Global Modules</h3>
                <p className="text-gray-400 text-sm">Public website modules</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {globalModules.map((module) => (
                <li key={module.id}>
                  <button
                    onClick={() => handleModuleClick(module.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
                      selectedModule === module.id
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'bg-black/30 border border-gray-700/50 hover:border-blue-500/30 hover:bg-blue-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${moduleStates[module.id] ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <span className="text-white font-medium">{module.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* UserCP Modules */}
        <Card className="backdrop-blur-lg bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/30">
          <div className="p-6 border-b border-gray-700/50 bg-purple-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl text-white font-semibold">User CP Modules</h3>
                <p className="text-gray-400 text-sm">User control panel modules</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {usercpModules.map((module) => (
                <li key={module.id}>
                  <button
                    onClick={() => handleModuleClick(module.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
                      selectedModule === module.id
                        ? 'bg-purple-500/20 border border-purple-500/50'
                        : 'bg-black/30 border border-gray-700/50 hover:border-purple-500/30 hover:bg-purple-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${moduleStates[module.id] ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <span className="text-white font-medium">{module.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Module Configuration Panel */}
      {selectedModule && selectedModuleData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`backdrop-blur-lg border overflow-hidden ${
            selectedModuleData.category === 'global'
              ? 'bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/30'
              : 'bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/30'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b border-gray-700/50 ${
              selectedModuleData.category === 'global' ? 'bg-blue-500/5' : 'bg-purple-500/5'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                    selectedModuleData.category === 'global'
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-purple-500/20 border-purple-500/50'
                  }`}>
                    <Settings className={`w-6 h-6 ${
                      selectedModuleData.category === 'global' ? 'text-blue-400' : 'text-purple-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-2xl text-white font-semibold">{selectedModuleData.name}</h3>
                    <p className="text-gray-400 text-sm">Module Configuration</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleModule(selectedModule)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    moduleStates[selectedModule]
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30'
                      : 'bg-gray-500/20 border border-gray-500/50 text-gray-400 hover:bg-gray-500/30'
                  }`}
                >
                  {moduleStates[selectedModule] ? (
                    <>
                      <ToggleRight className="w-5 h-5" />
                      <span className="font-medium">Enabled</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5" />
                      <span className="font-medium">Disabled</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Configuration Content */}
            <div className="p-6">
              <ModuleConfigContent moduleId={selectedModule} moduleName={selectedModuleData.name} />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Info Card */}
      {!selectedModule && (
        <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50">
              <Info className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Select a Module</h3>
              <p className="text-gray-400 text-sm">
                Click on any module from the lists above to view and configure its settings.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Module Configuration Content Component
function ModuleConfigContent({ moduleId, moduleName }: { moduleId: string; moduleName: string }) {
  const [config, setConfig] = useState({
    enabled: true,
    requiresLogin: false,
    showInMenu: true,
    description: `Configuration settings for ${moduleName} module`,
  });

  const handleSave = () => {
    console.log('💾 Saving module configuration:');
    console.log('Module ID:', moduleId);
    console.log('Config:', config);
    // In production: Save to config file or database
  };

  return (
    <div className="space-y-6">
      {/* Module Info */}
      <div className="bg-black/30 rounded-lg p-4 border border-gray-700/50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Module ID</label>
            <div className="text-white font-mono bg-black/50 px-3 py-2 rounded border border-gray-700/50">
              {moduleId}
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">Module Name</label>
            <div className="text-white font-medium bg-black/50 px-3 py-2 rounded border border-gray-700/50">
              {moduleName}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="space-y-4">
        <h4 className="text-white font-semibold text-lg mb-4">Module Settings</h4>

        {/* Enabled Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-gray-700/50">
          <div>
            <label className="text-white font-medium">Module Enabled</label>
            <p className="text-gray-400 text-sm mt-1">Enable or disable this module globally</p>
          </div>
          <label className="relative inline-block w-14 h-8 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        {/* Requires Login */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-gray-700/50">
          <div>
            <label className="text-white font-medium">Requires Login</label>
            <p className="text-gray-400 text-sm mt-1">Users must be logged in to access this module</p>
          </div>
          <label className="relative inline-block w-14 h-8 cursor-pointer">
            <input
              type="checkbox"
              checked={config.requiresLogin}
              onChange={(e) => setConfig({ ...config, requiresLogin: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>

        {/* Show in Menu */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-gray-700/50">
          <div>
            <label className="text-white font-medium">Show in Navigation Menu</label>
            <p className="text-gray-400 text-sm mt-1">Display this module in the main navigation menu</p>
          </div>
          <label className="relative inline-block w-14 h-8 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showInMenu}
              onChange={(e) => setConfig({ ...config, showInMenu: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500"></div>
          </label>
        </div>

        {/* Description */}
        <div className="p-4 rounded-lg bg-black/30 border border-gray-700/50">
          <label className="text-white font-medium block mb-2">Description</label>
          <textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            rows={3}
            className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 resize-none"
            placeholder="Module description..."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-700/50">
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 text-sm">
              <strong>Configuration File:</strong> <code className="bg-black/50 px-2 py-1 rounded text-xs">admincp/modules/mconfig/{moduleId}.php</code>
            </p>
            <p className="text-blue-300/70 text-sm mt-2">
              Module configurations are stored in individual PHP files. Changes made here will update the respective configuration file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
