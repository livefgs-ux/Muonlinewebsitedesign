import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, CheckCircle, XCircle, Save, Info, Zap, DollarSign, Award, TrendingUp, Shield } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface ResetStatsConfig {
  active: number;
  zen_cost: number;
  credit_cost: number;
  credit_config: number;
}

// Mock Credit System configurations
const mockCreditConfigs = [
  { id: 1, name: 'WCoins (C)' },
  { id: 2, name: 'WCoins (P)' },
  { id: 3, name: 'GoblinPoints' },
  { id: 4, name: 'Ruud' },
];

export function ResetStatsSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<ResetStatsConfig>({
    active: 1,
    zen_cost: 1000000, // 1M zen
    credit_cost: 0, // disabled
    credit_config: 1, // WCoins (C)
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
    settings.setting_1 = formData.get('setting_1');
    settings.setting_2 = formData.get('setting_2');
    settings.setting_3 = formData.get('setting_3');
    settings.setting_4 = formData.get('setting_4');

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

      // Validate zen_cost (setting_2)
      if (!validateUnsignedNumber(settings.setting_2)) {
        throw new Error('Invalid setting (zen_cost)');
      }

      // Validate credit_config (setting_3)
      if (!validateUnsignedNumber(settings.setting_3)) {
        throw new Error('Invalid setting (credit_config)');
      }

      // Validate credit_cost (setting_4)
      if (!validateUnsignedNumber(settings.setting_4)) {
        throw new Error('Invalid setting (credit_cost)');
      }

      console.log('💾 Saving Reset Stats Settings...');
      console.log('📄 XML Path: module_configs/usercp.resetstats.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        zen_cost: Number(settings.setting_2),
        credit_config: Number(settings.setting_3),
        credit_cost: Number(settings.setting_4),
      });
      console.log('🗄️ Database: MySQL');

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        zen_cost: Number(settings.setting_2),
        credit_cost: Number(settings.setting_4),
        credit_config: Number(settings.setting_3),
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
        <h2 className="text-3xl text-white mb-2">Reset Stats Settings</h2>
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
                      Enable/disable the reset stats module.
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
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Zen Cost</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of zen required to reset the character stats. Set to 0 to disable zen requirement.
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
                      Amount of credits required to reset the character stats. Set to 0 to disable credit requirement.
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

              {/* Credit Configuration */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Credit Configuration</div>
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
            <RotateCcw className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Reset Stats Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the stat point reset system that allows players to redistribute their character's stat points (STR, AGI, VIT, ENE, CMD). All data is stored in your <strong>MySQL</strong> database.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/usercp.resetstats.xml</code></li>
              <li>Character stats are stored in <strong>MySQL Character table</strong></li>
              <li>Players can reset their stat distribution without changing level</li>
              <li>Useful for testing different builds or fixing stat mistakes</li>
              <li>Requires zen and/or credits as cost</li>
              <li>Does NOT reset character level or experience</li>
              <li>Does NOT clear inventory or equipment</li>
              <li>Character receives all level up points back to redistribute</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Reset Stats vs Reset Character Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Info className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Reset Stats vs Reset Character</h3>
            <p className="text-purple-300/70 text-sm mb-3">
              Understanding the difference between these two reset systems:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">🔄 Reset Stats (This Module)</p>
                <p className="text-purple-300/70 text-xs mb-3">
                  Resets only the character's stat point distribution, allowing players to redistribute their points.
                </p>
                <p className="text-green-300 text-xs font-semibold mb-1">✅ What Happens:</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li>Stats reset to base values (STR, AGI, VIT, ENE, CMD)</li>
                  <li>LevelUpPoint = Total points available for redistribution</li>
                  <li>Character level stays the same</li>
                  <li>Experience stays the same</li>
                  <li>Inventory/equipment unchanged</li>
                  <li>Class unchanged</li>
                  <li>Reset counter unchanged</li>
                </ul>
                <p className="text-blue-300 text-xs font-semibold mb-1">📊 Use Cases:</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Player made a mistake in stat distribution</li>
                  <li>Want to try different character build</li>
                  <li>Switching from PvM to PvP build</li>
                  <li>Testing optimal stat allocation</li>
                  <li>Adapting to server balance changes</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                <p className="text-blue-300 font-semibold text-sm mb-2">🔄 Reset Character (Different Module)</p>
                <p className="text-blue-300/70 text-xs mb-3">
                  Completely resets the character back to level 1 in exchange for permanent bonuses.
                </p>
                <p className="text-green-300 text-xs font-semibold mb-1">✅ What Happens:</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li>Character level → 1</li>
                  <li>Experience → 0</li>
                  <li>Reset counter +1</li>
                  <li>Stats reset to base (if configured)</li>
                  <li>Receive bonus stat points as reward</li>
                  <li>Inventory/equipment (depends on config)</li>
                  <li>Class (depends on config)</li>
                </ul>
                <p className="text-blue-300 text-xs font-semibold mb-1">📊 Use Cases:</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Reached max level, want to get stronger</li>
                  <li>Accumulate bonus stat points</li>
                  <li>Progressive character power increase</li>
                  <li>Server progression system</li>
                  <li>Compete in reset rankings</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-300 font-semibold text-sm mb-2">💡 Key Difference</p>
              <p className="text-purple-300/70 text-xs">
                <strong>Reset Stats</strong> is for <strong>redistributing existing points</strong> without any progression loss.
                <strong>Reset Character</strong> is for <strong>restarting from level 1</strong> to gain permanent power bonuses.
                Most servers enable both systems to give players flexibility.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* How Reset Stats Works Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">How Reset Stats Works</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              Step-by-step process when a player resets their character stats:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">📊 Reset Stats Process Flow</p>
                <ol className="text-indigo-300/70 text-xs space-y-2 list-decimal list-inside">
                  <li><strong>Player Requests Reset:</strong> Clicks "Reset Stats" button in UserCP</li>
                  <li><strong>Check Requirements:</strong> System verifies zen cost and/or credit cost in MySQL</li>
                  <li><strong>Deduct Cost:</strong> Remove zen from Character table and/or credits from credit tables</li>
                  <li><strong>Calculate Total Points:</strong> Count all points currently distributed (STR + AGI + VIT + ENE + CMD - base stats)</li>
                  <li><strong>Reset Stats to Base:</strong> Set Strength, Dexterity, Vitality, Energy, Leadership to base class values</li>
                  <li><strong>Grant LevelUpPoint:</strong> Give back all points to redistribute (LevelUpPoint = total distributed points)</li>
                  <li><strong>Update MySQL:</strong> Save all changes to Character table</li>
                  <li><strong>Confirmation:</strong> Show success message to player</li>
                </ol>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">💡 Calculation Example</p>
                <p className="text-indigo-300/70 text-xs mb-2">
                  Player "DarkKnight" (Level 400, Dark Knight class) wants to reset stats:
                </p>
                <div className="space-y-2 text-xs font-mono bg-black/50 p-3 rounded">
                  <p className="text-indigo-300/70"><strong className="text-yellow-400">Current Stats:</strong></p>
                  <p className="text-indigo-300/70">• Strength: 1500 (Base: 28)</p>
                  <p className="text-indigo-300/70">• Dexterity: 800 (Base: 20)</p>
                  <p className="text-indigo-300/70">• Vitality: 600 (Base: 25)</p>
                  <p className="text-indigo-300/70">• Energy: 200 (Base: 10)</p>
                  <p className="text-indigo-300/70">• Leadership: 50 (Base: 10)</p>
                  <p className="text-indigo-300/70 mt-2"><strong className="text-green-400">Calculation:</strong></p>
                  <p className="text-indigo-300/70">• Distributed Points = (1500-28) + (800-20) + (600-25) + (200-10) + (50-10)</p>
                  <p className="text-indigo-300/70">• Distributed Points = 1472 + 780 + 575 + 190 + 40</p>
                  <p className="text-indigo-300/70">• <strong className="text-green-400">Total = 3,057 points</strong></p>
                  <p className="text-indigo-300/70 mt-2"><strong className="text-blue-400">After Reset:</strong></p>
                  <p className="text-indigo-300/70">• Strength: 28 (base)</p>
                  <p className="text-indigo-300/70">• Dexterity: 20 (base)</p>
                  <p className="text-indigo-300/70">• Vitality: 25 (base)</p>
                  <p className="text-indigo-300/70">• Energy: 10 (base)</p>
                  <p className="text-indigo-300/70">• Leadership: 10 (base)</p>
                  <p className="text-indigo-300/70">• <strong className="text-green-400">LevelUpPoint: 3,057</strong> (ready to redistribute!)</p>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">✅ What Players Get</p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>All previously distributed stat points returned to LevelUpPoint</li>
                  <li>Ability to create a completely different character build</li>
                  <li>Fix mistakes in stat distribution</li>
                  <li>Experiment with optimal builds without leveling a new character</li>
                  <li>Adapt to server meta changes or balance updates</li>
                  <li>No loss of level, experience, items, or other progress</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Cost Configuration Card */}
      <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50 flex-shrink-0">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Cost Configuration Guide</h3>
            <p className="text-green-300/70 text-sm mb-3">
              Configure the cost for resetting stats. You can require zen, credits, or both:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">💰 Zen Cost</p>
                <p className="text-green-300/70 text-xs mb-3">
                  In-game currency cost for resetting stats:
                </p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li><strong>0:</strong> Free reset (no zen required)</li>
                  <li><strong>1,000,000:</strong> 1 million zen (low cost)</li>
                  <li><strong>5,000,000:</strong> 5 million zen (moderate cost)</li>
                  <li><strong>10,000,000:</strong> 10 million zen (high cost)</li>
                  <li><strong>50,000,000+:</strong> Very expensive (prevents frequent resets)</li>
                </ul>
                <div className="bg-black/50 p-2 rounded">
                  <p className="text-yellow-300 text-xs font-semibold mb-1">💡 Recommendation:</p>
                  <p className="text-green-300/70 text-xs">
                    Set moderate cost (1-5M zen) to prevent spam resets but allow flexibility. 
                    Lower than Reset Character cost since this doesn't grant any bonuses.
                  </p>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                <p className="text-blue-300 font-semibold text-sm mb-2">💎 Credit Cost</p>
                <p className="text-green-300/70 text-xs mb-3">
                  Premium currency cost for resetting stats:
                </p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li><strong>0:</strong> Free reset (no credits required)</li>
                  <li><strong>5-10:</strong> Small credit cost (affordable)</li>
                  <li><strong>20-50:</strong> Moderate credit cost</li>
                  <li><strong>100+:</strong> High credit cost (premium service)</li>
                </ul>
                <div className="bg-black/50 p-2 rounded mb-2">
                  <p className="text-purple-300 text-xs font-semibold mb-1">⚙️ Credit Configuration:</p>
                  <p className="text-green-300/70 text-xs">
                    Choose which credit type to use:<br />
                    • <strong>WCoins (C):</strong> Cash shop currency<br />
                    • <strong>WCoins (P):</strong> Promotional currency<br />
                    • <strong>GoblinPoints:</strong> In-game earned points<br />
                    • <strong>Ruud:</strong> Special currency
                  </p>
                </div>
                <div className="bg-black/50 p-2 rounded">
                  <p className="text-yellow-300 text-xs font-semibold mb-1">💡 Recommendation:</p>
                  <p className="text-green-300/70 text-xs">
                    Most servers use zen-only cost. Credits are optional for premium convenience.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-black/30 p-4 rounded-lg border border-green-500/20">
              <p className="text-green-300 font-semibold text-sm mb-2">⚖️ Cost Balance Examples</p>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-black/50 p-3 rounded border border-green-500/20">
                  <p className="text-green-300 font-semibold mb-2">Free Reset</p>
                  <p className="text-green-300/70 mb-1">• Zen: 0</p>
                  <p className="text-green-300/70">• Credits: 0</p>
                  <p className="text-yellow-300/70 mt-2 text-xs">
                    ⚠️ Players may reset too frequently, making stat choices meaningless.
                  </p>
                </div>
                <div className="bg-black/50 p-3 rounded border border-blue-500/20">
                  <p className="text-blue-300 font-semibold mb-2">Balanced Cost</p>
                  <p className="text-green-300/70 mb-1">• Zen: 1-5M</p>
                  <p className="text-green-300/70">• Credits: 0</p>
                  <p className="text-green-300/70 mt-2 text-xs">
                    ✅ Most common. Affordable but prevents spam resets.
                  </p>
                </div>
                <div className="bg-black/50 p-3 rounded border border-purple-500/20">
                  <p className="text-purple-300 font-semibold mb-2">Premium Option</p>
                  <p className="text-green-300/70 mb-1">• Zen: 10M</p>
                  <p className="text-green-300/70">• Credits: 5-10</p>
                  <p className="text-purple-300/70 mt-2 text-xs">
                    💎 High zen cost, but players can pay credits for convenience.
                  </p>
                </div>
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
              The reset stats system interacts with MySQL to reset character stat distribution:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">📊 MySQL Tables Involved</p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-cyan-300 mb-2"><strong>Character Table:</strong> Stores character stats and points</p>
                    <code className="text-cyan-300/70 block">
                      UPDATE Character SET<br />
                      &nbsp;&nbsp;Strength = 28, -- Base STR for class<br />
                      &nbsp;&nbsp;Dexterity = 20, -- Base AGI for class<br />
                      &nbsp;&nbsp;Vitality = 25, -- Base VIT for class<br />
                      &nbsp;&nbsp;Energy = 10, -- Base ENE for class<br />
                      &nbsp;&nbsp;Leadership = 10, -- Base CMD for class<br />
                      &nbsp;&nbsp;LevelUpPoint = 3057, -- Total distributed points<br />
                      &nbsp;&nbsp;Money = Money - 1000000 -- Deduct zen cost<br />
                      WHERE Name = 'DarkKnight';
                    </code>
                  </div>
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-cyan-300 mb-2"><strong>Credit Tables:</strong> WCoinC, WCoinP, GoblinPoint (if using credits)</p>
                    <code className="text-cyan-300/70 block">
                      UPDATE WCoinC SET<br />
                      &nbsp;&nbsp;WCoinC = WCoinC - 5<br />
                      WHERE AccountID = 'player123';
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">🔒 Reset Stats Validation (MySQL Queries)</p>
                <div className="space-y-2 text-xs">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">1. Check Character Exists:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT Name FROM Character WHERE Name = 'DarkKnight';
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">2. Check Zen Balance:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT Money FROM Character WHERE Name = 'DarkKnight' AND Money &gt;= 1000000;
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">3. Check Credits (if required):</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT WCoinC FROM WCoinC WHERE AccountID = 'player123' AND WCoinC &gt;= 5;
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">4. Check Online Status:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT ConnectStat FROM MEMB_STAT WHERE memb___id = 'player123' AND ConnectStat = 0;
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">5. Get Class Base Stats:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      -- Base stats vary by class (DK, DW, ELF, MG, DL, SUM, RF, GL, RW, SLA, GC)
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-2">📋 Base Stats by Class</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-yellow-300 mb-1"><strong>Dark Knight:</strong></p>
                    <p className="text-cyan-300/70 font-mono">STR:28 AGI:20 VIT:25 ENE:10 CMD:10</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-yellow-300 mb-1"><strong>Dark Wizard:</strong></p>
                    <p className="text-cyan-300/70 font-mono">STR:18 AGI:18 VIT:15 ENE:30 CMD:10</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-yellow-300 mb-1"><strong>Fairy Elf:</strong></p>
                    <p className="text-cyan-300/70 font-mono">STR:22 AGI:25 VIT:20 ENE:15 CMD:10</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-yellow-300 mb-1"><strong>Magic Gladiator:</strong></p>
                    <p className="text-cyan-300/70 font-mono">STR:26 AGI:26 VIT:26 ENE:16 CMD:10</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-yellow-300 mb-1"><strong>Dark Lord:</strong></p>
                    <p className="text-cyan-300/70 font-mono">STR:26 AGI:20 VIT:20 ENE:15 CMD:25</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-yellow-300 mb-1"><strong>Summoner:</strong></p>
                    <p className="text-cyan-300/70 font-mono">STR:21 AGI:21 VIT:18 ENE:23 CMD:10</p>
                  </div>
                </div>
                <p className="text-cyan-300/70 text-xs mt-2">
                  * Base stats must be restored according to character class when resetting
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-red-500/20">
                <p className="text-red-300 font-semibold text-sm mb-2">⚠️ Important MySQL Considerations</p>
                <ul className="text-cyan-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Use Transactions:</strong> Ensure all MySQL updates succeed or rollback entirely</li>
                  <li><strong>Lock Character Row:</strong> Prevent concurrent reset attempts</li>
                  <li><strong>Validate Online Status:</strong> Only allow resets when character is offline</li>
                  <li><strong>Validate Class:</strong> Use correct base stats for character's class</li>
                  <li><strong>Calculate Correctly:</strong> Ensure LevelUpPoint = sum of all distributed points</li>
                  <li><strong>Backup Before Reset:</strong> Save character state in case of issues</li>
                  <li><strong>Log Everything:</strong> Track who, when, and what was reset for audit trail</li>
                </ul>
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
            <h3 className="text-white font-semibold mb-2">Reset Stats Best Practices (MySQL)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">✅ Recommended Settings</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Zen Cost:</strong> 1-5M zen (affordable but prevents spam)</li>
                  <li><strong>Credit Cost:</strong> 0 (free) or 5-10 (convenience option)</li>
                  <li><strong>Credit Type:</strong> WCoins (C) or GoblinPoints</li>
                  <li>Lower cost than Reset Character (no bonuses granted)</li>
                  <li>Allow unlimited resets (no cap needed)</li>
                  <li>Make it easy for players to experiment with builds</li>
                  <li>Don't make it too expensive or players won't use it</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">🗄️ MySQL Considerations</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Store base stats per class in config or database</li>
                  <li>Add index on Character table Name column</li>
                  <li>Log stat resets to separate table for statistics</li>
                  <li>Use transactions to ensure data integrity</li>
                  <li>Validate character is offline before reset</li>
                  <li>Double-check LevelUpPoint calculation</li>
                  <li>Consider backup before allowing resets</li>
                  <li>Monitor reset frequency to detect abuse</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">🎮 Server Type Recommendations</p>
                <div className="space-y-2">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 text-xs font-semibold">Casual Server:</p>
                    <p className="text-yellow-300/70 text-xs">Free or very low cost (500K zen). Players can experiment freely.</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-blue-300 text-xs font-semibold">Balanced Server:</p>
                    <p className="text-yellow-300/70 text-xs">Moderate cost (1-5M zen). Allows flexibility but prevents spam.</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-red-300 text-xs font-semibold">Hardcore Server:</p>
                    <p className="text-yellow-300/70 text-xs">High cost (10M+ zen). Stat choices are more permanent and strategic.</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">⚠️ Common Mistakes to Avoid</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Wrong Base Stats:</strong> Using incorrect base stats for class</li>
                  <li><strong>Wrong Calculation:</strong> LevelUpPoint doesn't match distributed points</li>
                  <li><strong>Allowing Online Resets:</strong> Can cause data corruption</li>
                  <li><strong>No Cost:</strong> Players reset too frequently, makes choices meaningless</li>
                  <li><strong>Too Expensive:</strong> Players never use the feature</li>
                  <li><strong>Forgetting Command Stat:</strong> Dark Lord base CMD must be included</li>
                  <li><strong>Not Logging:</strong> Can't track abuse or statistics</li>
                  <li><strong>No Validation:</strong> Not checking zen/credit balance before reset</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-green-500/20">
              <p className="text-green-300 font-semibold text-sm mb-2">💡 Pro Tip: Combine with Reset Character</p>
              <p className="text-yellow-300/70 text-xs">
                Most successful servers enable BOTH Reset Stats and Reset Character systems. This gives players maximum flexibility:
                <br /><br />
                • <strong>Reset Stats:</strong> For tweaking build without losing progress<br />
                • <strong>Reset Character:</strong> For gaining permanent power bonuses<br />
                <br />
                Make sure Reset Stats is significantly cheaper than Reset Character since it doesn't grant any bonuses.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
