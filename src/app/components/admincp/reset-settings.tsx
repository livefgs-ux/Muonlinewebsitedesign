import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, CheckCircle, XCircle, Save, Info, Zap, DollarSign, Award, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface ResetConfig {
  active: number;
  maximum_resets: number;
  keep_stats: number;
  clear_inventory: number;
  revert_class_evolution: number;
  required_level: number;
  zen_cost: number;
  credit_cost: number;
  credit_config: number;
  points_reward: number;
  multiply_points_by_resets: number;
  credit_reward: number;
  credit_reward_config: number;
}

// Mock Credit System configurations
const mockCreditConfigs = [
  { id: 1, name: 'WCoins (C)' },
  { id: 2, name: 'WCoins (P)' },
  { id: 3, name: 'GoblinPoints' },
  { id: 4, name: 'Ruud' },
];

export function ResetSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<ResetConfig>({
    active: 1,
    maximum_resets: 0, // 0 = unlimited
    keep_stats: 0,
    clear_inventory: 0,
    revert_class_evolution: 0,
    required_level: 400,
    zen_cost: 10000000,
    credit_cost: 0,
    credit_config: 1,
    points_reward: 500,
    multiply_points_by_resets: 0,
    credit_reward: 0,
    credit_reward_config: 1,
  });

  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const checkValue = (value: any): boolean => {
    return value !== '' && value !== null && value !== undefined;
  };

  const validateUnsignedNumber = (value: any): boolean => {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    const formData = new FormData(e.currentTarget);
    const settings: any = {};

    // Get all settings
    for (let i = 1; i <= 13; i++) {
      const key = `setting_${i}`;
      settings[key] = formData.get(key);
    }

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      // Validate active (setting_1)
      if (![0, 1].includes(Number(settings.setting_1))) {
        throw new Error('Invalid setting (active)');
      }

      // Validate maximum_resets (setting_6)
      if (!validateUnsignedNumber(settings.setting_6)) {
        throw new Error('Invalid setting (maximum_resets)');
      }

      // Validate keep_stats (setting_7)
      if (![0, 1].includes(Number(settings.setting_7))) {
        throw new Error('Invalid setting (keep_stats)');
      }

      // Validate clear_inventory (setting_10)
      if (![0, 1].includes(Number(settings.setting_10))) {
        throw new Error('Invalid setting (clear_inventory)');
      }

      // Validate revert_class_evolution (setting_11)
      if (![0, 1].includes(Number(settings.setting_11))) {
        throw new Error('Invalid setting (revert_class_evolution)');
      }

      // Validate required_level (setting_5)
      if (!validateUnsignedNumber(settings.setting_5)) {
        throw new Error('Invalid setting (required_level)');
      }

      // Validate zen_cost (setting_2)
      if (!validateUnsignedNumber(settings.setting_2)) {
        throw new Error('Invalid setting (zen_cost)');
      }

      // Validate credit_cost (setting_4)
      if (!validateUnsignedNumber(settings.setting_4)) {
        throw new Error('Invalid setting (credit_cost)');
      }

      // Validate credit_config (setting_3)
      if (!validateUnsignedNumber(settings.setting_3)) {
        throw new Error('Invalid setting (credit_config)');
      }

      // Validate points_reward (setting_8)
      if (!validateUnsignedNumber(settings.setting_8)) {
        throw new Error('Invalid setting (points_reward)');
      }

      // Validate multiply_points_by_resets (setting_9)
      if (![0, 1].includes(Number(settings.setting_9))) {
        throw new Error('Invalid setting (multiply_points_by_resets)');
      }

      // Validate credit_reward (setting_12)
      if (!validateUnsignedNumber(settings.setting_12)) {
        throw new Error('Invalid setting (credit_reward)');
      }

      // Validate credit_reward_config (setting_13)
      if (!validateUnsignedNumber(settings.setting_13)) {
        throw new Error('Invalid setting (credit_reward_config)');
      }

      console.log('💾 Saving Reset Settings...');
      console.log('📄 XML Path: module_configs/usercp.reset.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        maximum_resets: Number(settings.setting_6),
        keep_stats: Number(settings.setting_7),
        clear_inventory: Number(settings.setting_10),
        revert_class_evolution: Number(settings.setting_11),
        required_level: Number(settings.setting_5),
        zen_cost: Number(settings.setting_2),
        credit_cost: Number(settings.setting_4),
        credit_config: Number(settings.setting_3),
        points_reward: Number(settings.setting_8),
        multiply_points_by_resets: Number(settings.setting_9),
        credit_reward: Number(settings.setting_12),
        credit_reward_config: Number(settings.setting_13),
      });
      console.log('🗄️ Database: MySQL');

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        maximum_resets: Number(settings.setting_6),
        keep_stats: Number(settings.setting_7),
        clear_inventory: Number(settings.setting_10),
        revert_class_evolution: Number(settings.setting_11),
        required_level: Number(settings.setting_5),
        zen_cost: Number(settings.setting_2),
        credit_cost: Number(settings.setting_4),
        credit_config: Number(settings.setting_3),
        points_reward: Number(settings.setting_8),
        multiply_points_by_resets: Number(settings.setting_9),
        credit_reward: Number(settings.setting_12),
        credit_reward_config: Number(settings.setting_13),
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
        <h2 className="text-3xl text-white mb-2">Reset Settings</h2>
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
        {/* General Settings */}
        <h3 className="text-2xl text-white mb-4">General</h3>
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden mb-6">
          <table className="w-full">
            <tbody>
              {/* Status */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20" style={{ width: '40%' }}>
                  <div>
                    <div className="text-white font-medium mb-1">Status</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enable/disable the reset module.
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

              {/* Maximum Resets */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Maximum Resets</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Maximum allowed number of resets each character may have.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    name="setting_6"
                    defaultValue={config.maximum_resets}
                    min="0"
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                  <p className="text-gray-400 text-xs mt-1">Set to 0 for unlimited resets</p>
                </td>
              </tr>

              {/* Keep Stats */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Keep Stats</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, the character's stats will not be reverted back to its base stats.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_7"
                        value="1"
                        defaultChecked={config.keep_stats === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Yes (keep stats)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_7"
                        value="0"
                        defaultChecked={config.keep_stats === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">No (reset stats)</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Clear Inventory */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Clear Inventory</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Clears the character's inventory.
                      <br /><br />
                      <span className="text-red-400 font-semibold">
                        * Enabling this setting will also clear the character's equipment
                      </span>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_10"
                        value="1"
                        defaultChecked={config.clear_inventory === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_10"
                        value="0"
                        defaultChecked={config.clear_inventory === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Revert Class Evolution */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Revert Class Evolution</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Example: If the character is a Soul Master, after performing the reset the character's class will become Dark Wizard.
                      <br /><br />
                      <span className="text-red-400 font-semibold">
                        * Enabling this setting will also clear the character's quests
                      </span>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_11"
                        value="1"
                        defaultChecked={config.revert_class_evolution === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_11"
                        value="0"
                        defaultChecked={config.revert_class_evolution === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* Requirements */}
        <h3 className="text-2xl text-white mb-4">Requirements</h3>
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden mb-6">
          <table className="w-full">
            <tbody>
              {/* Required Level */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20" style={{ width: '40%' }}>
                  <div>
                    <div className="text-white font-medium mb-1">Required Level</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Minimum level required to perform a reset.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    name="setting_5"
                    defaultValue={config.required_level}
                    min="0"
                    max="400"
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </td>
              </tr>

              {/* Zen Cost */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Zen Cost</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of zen required to reset the character. Set to 0 to disable zen requirement.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    name="setting_2"
                    defaultValue={config.zen_cost}
                    min="0"
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </td>
              </tr>

              {/* Credit Cost */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Credit Cost</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of credits required to reset the character. Set to 0 to disable credit requirement.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    name="setting_4"
                    defaultValue={config.credit_cost}
                    min="0"
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </td>
              </tr>

              {/* Credit Cost Configuration */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Credit Cost Configuration</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <select
                    name="setting_3"
                    defaultValue={config.credit_config}
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  >
                    {mockCreditConfigs.map((credit) => (
                      <option key={credit.id} value={credit.id}>
                        {credit.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* Reward */}
        <h3 className="text-2xl text-white mb-4">Reward</h3>
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden mb-6">
          <table className="w-full">
            <tbody>
              {/* Level Up Points Reward */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20" style={{ width: '40%' }}>
                  <div>
                    <div className="text-white font-medium mb-1">Level Up Points Reward</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of level up points to be given to the character after the reset. Set to 0 to disable.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    name="setting_8"
                    defaultValue={config.points_reward}
                    min="0"
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </td>
              </tr>

              {/* Multiply Level Up Points by Resets */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Multiply Level Up Points by Resets</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, the amount of level up points reward will be multiplied by the amount of resets.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_9"
                        value="1"
                        defaultChecked={config.multiply_points_by_resets === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_9"
                        value="0"
                        defaultChecked={config.multiply_points_by_resets === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Credit Reward */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Credit Reward</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of credits to be rewarded on each reset to the character. Set to 0 to disable credit reward.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    name="setting_12"
                    defaultValue={config.credit_reward}
                    min="0"
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </td>
              </tr>

              {/* Credit Reward Configuration */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Credit Reward Configuration</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <select
                    name="setting_13"
                    defaultValue={config.credit_reward_config}
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  >
                    {mockCreditConfigs.map((credit) => (
                      <option key={credit.id} value={credit.id}>
                        {credit.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* Submit Button */}
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="px-6 py-4 bg-black/20">
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
            <RefreshCw className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Reset System Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the character reset system that allows players to reset their character level for rewards and progression. All reset data is stored in your <strong>MySQL</strong> database.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/usercp.reset.xml</code></li>
              <li>Reset count is tracked in <strong>MySQL Character table</strong></li>
              <li>Players can reset their character to level 1 for bonuses</li>
              <li>Supports unlimited or limited number of resets per character</li>
              <li>Customizable requirements (level, zen, credits)</li>
              <li>Configurable rewards (stat points, credits)</li>
              <li>Option to keep or reset character stats</li>
              <li>Optional inventory clearing and class reversion</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Reset Mechanics Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">How Reset System Works</h3>
            <p className="text-purple-300/70 text-sm mb-3">
              The reset system allows players to restart their character progression in exchange for permanent bonuses:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">📊 Reset Process Flow</p>
                <ol className="text-purple-300/70 text-xs space-y-2 list-decimal list-inside">
                  <li><strong>Player Reaches Required Level:</strong> Character must meet minimum level requirement (e.g., 400)</li>
                  <li><strong>Check Requirements:</strong> System verifies zen cost, credit cost, and maximum reset limit</li>
                  <li><strong>Reset Character:</strong> Character level resets to 1, reset count increases by 1 in MySQL</li>
                  <li><strong>Apply Settings:</strong> Stats reset (or kept), inventory cleared (optional), class reverted (optional)</li>
                  <li><strong>Grant Rewards:</strong> Character receives stat points and/or credits as reward</li>
                  <li><strong>Update MySQL:</strong> All changes saved to Character table and credit tables</li>
                </ol>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">🔄 What Happens During Reset</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-green-300 text-xs font-semibold mb-1">✅ Always Reset:</p>
                    <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                      <li>Character level → 1</li>
                      <li>Experience → 0</li>
                      <li>Reset counter +1 (MySQL)</li>
                      <li>Position → spawn point</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-yellow-300 text-xs font-semibold mb-1">⚙️ Optional (Configurable):</p>
                    <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                      <li>Stats → base values (if keep_stats=0)</li>
                      <li>Inventory → cleared (if clear_inventory=1)</li>
                      <li>Equipment → cleared (if clear_inventory=1)</li>
                      <li>Class → reverted (if revert_class_evolution=1)</li>
                      <li>Quests → cleared (if revert_class_evolution=1)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">💡 Reset Count Example</p>
                <p className="text-purple-300/70 text-xs mb-2">
                  Player "WarriorPro" performs 3 resets with points_reward=500 and multiply_points_by_resets=1:
                </p>
                <div className="space-y-1 text-xs font-mono bg-black/50 p-3 rounded">
                  <p className="text-purple-300/70"><strong className="text-green-400">Reset #1:</strong> Receives 500 × 1 = <span className="text-yellow-400">500 points</span></p>
                  <p className="text-purple-300/70"><strong className="text-green-400">Reset #2:</strong> Receives 500 × 2 = <span className="text-yellow-400">1,000 points</span></p>
                  <p className="text-purple-300/70"><strong className="text-green-400">Reset #3:</strong> Receives 500 × 3 = <span className="text-yellow-400">1,500 points</span></p>
                  <p className="text-purple-300/70 mt-2"><strong className="text-blue-400">Total Bonus:</strong> <span className="text-green-400">3,000 stat points</span> across 3 resets!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Configuration Options Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Configuration Options Explained</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">🎯 Maximum Resets</p>
                <p className="text-indigo-300/70 text-xs mb-2">
                  Limits how many times a character can reset:
                </p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>0:</strong> Unlimited resets (most common)</li>
                  <li><strong>10:</strong> Max 10 resets per character</li>
                  <li><strong>50:</strong> Max 50 resets per character</li>
                  <li>After reaching limit, reset button disabled</li>
                  <li>Use limits for balanced progression</li>
                </ul>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">📈 Keep Stats</p>
                <p className="text-indigo-300/70 text-xs mb-2">
                  Controls whether stat points are reset:
                </p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Yes:</strong> Stats remain unchanged after reset</li>
                  <li><strong>No:</strong> Stats revert to base values (STR/AGI/VIT/ENE)</li>
                  <li>Keeping stats makes reset easier but less challenging</li>
                  <li>Resetting stats forces players to rebuild character</li>
                  <li>Most servers use "No" for balance</li>
                </ul>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-red-500/20">
                <p className="text-red-300 font-semibold text-sm mb-1">⚠️ Clear Inventory</p>
                <p className="text-red-300/70 text-xs mb-2">
                  <strong>WARNING:</strong> Also clears equipped items!
                </p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Yes:</strong> All items deleted (inventory + equipment)</li>
                  <li><strong>No:</strong> Items remain (most common)</li>
                  <li>Clearing inventory is very punishing</li>
                  <li>Only use if you want hardcore reset system</li>
                  <li>Players will lose valuable items!</li>
                </ul>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-red-500/20">
                <p className="text-red-300 font-semibold text-sm mb-1">⚠️ Revert Class Evolution</p>
                <p className="text-red-300/70 text-xs mb-2">
                  <strong>WARNING:</strong> Also clears character quests!
                </p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Yes:</strong> Class reverts + quests cleared</li>
                  <li><strong>No:</strong> Class unchanged (most common)</li>
                  <li>Example: Soul Master → Dark Wizard</li>
                  <li>Blade Knight → Dark Knight</li>
                  <li>Muse Elf → Fairy Elf</li>
                  <li>Very punishing, rarely used</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Requirements & Rewards Card */}
      <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50 flex-shrink-0">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Requirements & Rewards System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">📋 Requirements (Cost to Reset)</p>
                <div className="space-y-2">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 text-xs font-semibold mb-1">🎚️ Required Level</p>
                    <p className="text-green-300/70 text-xs">
                      Minimum level needed to reset (usually 400). Prevents low-level resets.
                    </p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-yellow-300 text-xs font-semibold mb-1">💰 Zen Cost</p>
                    <p className="text-green-300/70 text-xs">
                      In-game currency cost. Example: 10,000,000 zen. Set to 0 to disable.
                    </p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-blue-300 text-xs font-semibold mb-1">💎 Credit Cost</p>
                    <p className="text-green-300/70 text-xs">
                      Premium currency cost (WCoins, GoblinPoints, Ruud). Set to 0 to disable.
                    </p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 text-xs font-semibold mb-1">⚙️ Credit Configuration</p>
                    <p className="text-green-300/70 text-xs">
                      Choose which credit type to use: WCoins (C), WCoins (P), GoblinPoints, or Ruud.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">🎁 Rewards (Gained from Reset)</p>
                <div className="space-y-2">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 text-xs font-semibold mb-1">⚡ Level Up Points Reward</p>
                    <p className="text-green-300/70 text-xs mb-2">
                      Stat points given after reset. Example: 500 points.
                    </p>
                    <p className="text-yellow-300/70 text-xs">
                      <strong>Multiply by Resets:</strong><br />
                      • Disabled: Always receive fixed amount (500 points)<br />
                      • Enabled: Points × reset count (500 × 3 = 1,500 points on 3rd reset)
                    </p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-blue-300 text-xs font-semibold mb-1">💎 Credit Reward</p>
                    <p className="text-green-300/70 text-xs">
                      Premium credits given after reset. Example: 10 WCoins. Set to 0 to disable.
                    </p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 text-xs font-semibold mb-1">⚙️ Credit Reward Configuration</p>
                    <p className="text-green-300/70 text-xs">
                      Choose which credit type to reward: WCoins (C), WCoins (P), GoblinPoints, or Ruud.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Best Practices Card */}
      <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50 flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Reset System Best Practices (MySQL)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">✅ Recommended Settings</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Maximum Resets:</strong> 0 (unlimited) for casual servers</li>
                  <li><strong>Keep Stats:</strong> No (reset stats) for balance</li>
                  <li><strong>Clear Inventory:</strong> No (keep items) - less punishing</li>
                  <li><strong>Revert Class:</strong> No (keep class) - most popular</li>
                  <li><strong>Required Level:</strong> 400 (standard max level)</li>
                  <li><strong>Zen Cost:</strong> 5-20 million zen (prevents spam resets)</li>
                  <li><strong>Points Reward:</strong> 500-1000 points</li>
                  <li><strong>Multiply Points:</strong> Yes (progressive rewards)</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">🗄️ MySQL Considerations</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Reset count stored in <strong>Character table</strong></li>
                  <li>Add index on reset column for faster queries</li>
                  <li>Log resets to separate table for statistics</li>
                  <li>Use transactions to ensure data integrity</li>
                  <li>Validate character state before reset (online check)</li>
                  <li>Update rankings cache after reset</li>
                  <li>Consider backup before allowing resets</li>
                  <li>Monitor reset frequency to detect abuse</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">🎮 Server Type Recommendations</p>
                <div className="space-y-2">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 text-xs font-semibold">Casual Server:</p>
                    <p className="text-yellow-300/70 text-xs">Unlimited resets, keep stats, high point rewards, low zen cost</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-blue-300 text-xs font-semibold">Balanced Server:</p>
                    <p className="text-yellow-300/70 text-xs">Unlimited resets, reset stats, moderate rewards, medium zen cost</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-red-300 text-xs font-semibold">Hardcore Server:</p>
                    <p className="text-yellow-300/70 text-xs">Limited resets (50), reset stats, low rewards, high cost, clear inventory</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">⚠️ Common Mistakes to Avoid</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Too Low Level Requirement:</strong> Causes spam resets</li>
                  <li><strong>No Cost:</strong> Makes resets meaningless</li>
                  <li><strong>Too High Rewards:</strong> Breaks game balance</li>
                  <li><strong>Clear Inventory + Class Revert:</strong> Too punishing, players quit</li>
                  <li><strong>No Maximum Resets:</strong> Can cause database bloat</li>
                  <li><strong>Forgetting to Update Rankings:</strong> Outdated leaderboards</li>
                  <li><strong>Not Logging Resets:</strong> Can't track abuse or statistics</li>
                  <li><strong>Allowing Online Resets:</strong> Can cause data corruption</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* MySQL Integration Card */}
      <Card className="backdrop-blur-lg bg-cyan-500/5 border-cyan-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/50 flex-shrink-0">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">MySQL Database Integration</h3>
            <p className="text-cyan-300/70 text-sm mb-3">
              The reset system interacts with multiple MySQL tables to track character progress and rewards:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">📊 MySQL Tables Involved</p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-cyan-300 mb-2"><strong>Character Table:</strong> Stores reset count and character data</p>
                    <code className="text-cyan-300/70 block">
                      UPDATE Character SET<br />
                      &nbsp;&nbsp;cLevel = 1,<br />
                      &nbsp;&nbsp;Experience = 0,<br />
                      &nbsp;&nbsp;ResetCount = ResetCount + 1,<br />
                      &nbsp;&nbsp;LevelUpPoint = LevelUpPoint + 500,<br />
                      &nbsp;&nbsp;Money = Money - 10000000<br />
                      WHERE Name = 'WarriorPro';
                    </code>
                  </div>
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-cyan-300 mb-2"><strong>Credit Tables:</strong> WCoinC, WCoinP, GoblinPoint tables</p>
                    <code className="text-cyan-300/70 block">
                      UPDATE WCoinC SET<br />
                      &nbsp;&nbsp;WCoinC = WCoinC - 10<br />
                      WHERE AccountID = 'player123';
                    </code>
                  </div>
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-cyan-300 mb-2"><strong>Reset Log Table:</strong> (Custom) Track reset history</p>
                    <code className="text-cyan-300/70 block">
                      INSERT INTO ResetLog<br />
                      (CharName, ResetNum, DateTime, ZenCost, CreditCost)<br />
                      VALUES ('WarriorPro', 5, NOW(), 10000000, 10);
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">🔒 Reset Validation Checks (MySQL Queries)</p>
                <div className="space-y-2 text-xs">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">1. Check Character Level:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT cLevel FROM Character WHERE Name = 'WarriorPro' AND cLevel &gt;= 400;
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">2. Check Reset Limit:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT ResetCount FROM Character WHERE Name = 'WarriorPro';
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">3. Check Zen Balance:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT Money FROM Character WHERE Name = 'WarriorPro' AND Money &gt;= 10000000;
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">4. Check Credits:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT WCoinC FROM WCoinC WHERE AccountID = 'player123' AND WCoinC &gt;= 10;
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">5. Check Online Status:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT ConnectStat FROM MEMB_STAT WHERE memb___id = 'player123' AND ConnectStat = 0;
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-red-500/20">
                <p className="text-red-300 font-semibold text-sm mb-2">⚠️ Important MySQL Considerations</p>
                <ul className="text-cyan-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Use Transactions:</strong> Ensure all MySQL updates succeed or rollback entirely</li>
                  <li><strong>Lock Character Row:</strong> Prevent concurrent reset attempts</li>
                  <li><strong>Validate Online Status:</strong> Only allow resets when character is offline</li>
                  <li><strong>Backup Before Reset:</strong> Save character state in case of issues</li>
                  <li><strong>Clear Cache:</strong> Update rankings and statistics cache after reset</li>
                  <li><strong>Log Everything:</strong> Track who, when, and what was reset for audit trail</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
