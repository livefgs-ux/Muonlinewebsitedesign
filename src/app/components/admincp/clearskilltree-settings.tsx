import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle, XCircle, Save, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface ClearSkillTreeConfig {
  active: number;
  zen_cost: number;
  credit_config: number;
  credit_cost: number;
  required_level: number;
  required_master_level: number;
}

export function ClearSkillTreeSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<ClearSkillTreeConfig>({
    active: 1,
    zen_cost: 10000000,
    credit_config: 1,
    credit_cost: 150,
    required_level: 400,
    required_master_level: 200,
  });

  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  // Mock credit configurations - would come from database/config in production
  const creditConfigurations = [
    { id: 1, name: 'WCoin (C)' },
    { id: 2, name: 'GoblinPoint (P)' },
    { id: 3, name: 'Ruud' },
    { id: 4, name: 'Premium Points' },
  ];

  const validateUnsignedNumber = (value: any): boolean => {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
  };

  const checkValue = (value: any): boolean => {
    return value !== '' && value !== null && value !== undefined;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    const formData = new FormData(e.currentTarget);
    const settings: any = {};

    // Get all settings
    for (let i = 1; i <= 6; i++) {
      settings[`setting_${i}`] = formData.get(`setting_${i}`);
    }

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      // Validate setting_1 (active)
      if (!settings.setting_1) throw new Error('Invalid setting (active)');
      const active = Number(settings.setting_1);
      if (![0, 1].includes(active)) throw new Error('Invalid setting (active)');

      // Validate setting_2 (zen_cost)
      if (!settings.setting_2) throw new Error('Invalid setting (zen_cost)');
      if (!validateUnsignedNumber(settings.setting_2)) {
        throw new Error('Invalid setting (zen_cost)');
      }

      // Validate setting_3 (credit_config)
      if (!settings.setting_3) throw new Error('Invalid setting (credit_config)');
      if (!validateUnsignedNumber(settings.setting_3)) {
        throw new Error('Invalid setting (credit_config)');
      }

      // Validate setting_4 (credit_cost)
      if (!settings.setting_4) throw new Error('Invalid setting (credit_cost)');
      if (!validateUnsignedNumber(settings.setting_4)) {
        throw new Error('Invalid setting (credit_cost)');
      }

      // Validate setting_5 (required_level)
      if (!settings.setting_5) throw new Error('Invalid setting (required_level)');
      if (!validateUnsignedNumber(settings.setting_5)) {
        throw new Error('Invalid setting (required_level)');
      }
      if (Number(settings.setting_5) > 400) {
        throw new Error('The required level setting can have a maximum value of 400.');
      }

      // Validate setting_6 (required_master_level)
      if (!settings.setting_6) throw new Error('Invalid setting (required_master_level)');
      if (!validateUnsignedNumber(settings.setting_6)) {
        throw new Error('Invalid setting (required_master_level)');
      }

      console.log('💾 Saving Clear Skill-Tree Settings...');
      console.log('📄 XML Path: module_configs/usercp.clearskilltree.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        zen_cost: Number(settings.setting_2),
        credit_config: Number(settings.setting_3),
        credit_cost: Number(settings.setting_4),
        required_level: Number(settings.setting_5),
        required_master_level: Number(settings.setting_6),
      });

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        zen_cost: Number(settings.setting_2),
        credit_config: Number(settings.setting_3),
        credit_cost: Number(settings.setting_4),
        required_level: Number(settings.setting_5),
        required_master_level: Number(settings.setting_6),
      });

      setMessage({
        type: 'success',
        text: 'Settings successfully saved.',
      });

      console.log('✅ Settings saved successfully');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setMessage({
        type: 'error',
        text: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Clear Skill-Tree Settings</h2>
      </div>

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
                : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                  message.type === 'success'
                    ? 'bg-green-500/20 border-green-500/50'
                    : 'bg-red-500/20 border-red-500/50'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    message.type === 'success' ? 'text-green-300' : 'text-red-300'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Form */}
      <form onSubmit={handleSubmit}>
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
          <table className="w-full">
            <tbody>
              {/* Status */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20" style={{ width: '40%' }}>
                  <div>
                    <div className="text-white font-medium mb-1">Status</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enable/disable the clear skill tree module.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_1"
                        value="1"
                        defaultChecked={config.active === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_1"
                        value="0"
                        defaultChecked={config.active === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Zen Cost */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Zen Cost</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of zen required to clear the master skill tree. Set to 0 to disable zen requirement.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_2"
                    defaultValue={config.zen_cost}
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Credit Cost */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Credit Cost</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of credits required to clear the master skill tree. Set to 0 to disable credit requirement.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_4"
                    defaultValue={config.credit_cost}
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Credit Configuration */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Credit Configuration</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <select
                    name="setting_3"
                    defaultValue={config.credit_config}
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  >
                    {creditConfigurations.map((credit) => (
                      <option key={credit.id} value={credit.id}>
                        {credit.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>

              {/* Required Level */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Required Level</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Minimum level required to clear the master skill tree. It is recommended to keep this setting at the maximum level of 400.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_5"
                    defaultValue={config.required_level}
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Required Master Level */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Required Master Level</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Minimum master level required to clear the master skill tree.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_6"
                    defaultValue={config.required_master_level}
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Submit Button */}
              <tr>
                <td colSpan={2} className="px-6 py-4 bg-black/20">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </form>

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Clear Skill-Tree Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the Clear Skill-Tree module that allows players to reset their master skill tree via the UserCP.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Status:</strong> Enable or disable the entire module</li>
              <li><strong>Zen Cost:</strong> Amount of in-game zen required to clear skill tree (0 = free)</li>
              <li><strong>Credit Cost:</strong> Amount of credits required to clear skill tree (0 = free)</li>
              <li><strong>Credit Configuration:</strong> Which credit type to use (WCoin, GoblinPoint, etc.)</li>
              <li><strong>Required Level:</strong> Minimum character level required (maximum: 400)</li>
              <li><strong>Required Master Level:</strong> Minimum master level required</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/usercp.clearskilltree.xml</code></li>
              <li>Master Skill Tree is a progression system for high-level characters</li>
              <li>This module allows players to reset their skill tree allocation for a fee</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
