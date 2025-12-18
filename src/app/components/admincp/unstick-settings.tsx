import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, CheckCircle, XCircle, Save, Info, Zap, DollarSign, Award, TrendingUp, Shield, AlertTriangle, Navigation } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface UnstickConfig {
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

export function UnstickSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<UnstickConfig>({
    active: 1,
    zen_cost: 500000, // 500k zen
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

      console.log('💾 Saving Unstick Character Settings...');
      console.log('📄 XML Path: module_configs/usercp.unstick.xml');
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
        <h2 className="text-3xl text-white mb-2">Unstick Character Settings</h2>
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
                      Enable/disable the character unstick module.
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
                      Amount of zen required to unstick the character. Set to 0 to disable zen requirement.
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
                      Amount of credits required to unstick the character. Set to 0 to disable credit requirement.
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
            <MapPin className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Unstick Character Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the character unstick system that allows players to teleport their stuck characters to a safe location. This is essential for resolving issues where characters become trapped in invalid map positions. All data is stored in your <strong>MySQL</strong> database.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/usercp.unstick.xml</code></li>
              <li>Character positions are stored in <strong>MySQL Character table</strong> (MapNumber, MapPosX, MapPosY)</li>
              <li>Players can unstick characters that are trapped in invalid locations</li>
              <li>Character is teleported to a safe spawn point (usually Lorencia)</li>
              <li>Requires zen and/or credits as cost</li>
              <li>Character must be OFFLINE to use unstick</li>
              <li>Does NOT affect character stats, level, inventory, or equipment</li>
              <li>Only changes character map coordinates to a safe position</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* What is Character Stuck Card */}
      <Card className="backdrop-blur-lg bg-orange-500/5 border-orange-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/50 flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">What is a "Stuck" Character?</h3>
            <p className="text-orange-300/70 text-sm mb-3">
              A "stuck" character is a character that cannot move or login properly because it's in an invalid map location. This can prevent players from accessing their character entirely.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-4 rounded-lg border border-orange-500/20">
                <p className="text-orange-300 font-semibold text-sm mb-2">🚫 Common Causes of Stuck Characters</p>
                <ul className="text-orange-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Server Crashes:</strong> Character logged out during map transition</li>
                  <li><strong>Teleport Bugs:</strong> Invalid destination coordinates</li>
                  <li><strong>Map Corruption:</strong> Map file missing or corrupted</li>
                  <li><strong>Custom Events:</strong> Event map removed but character still inside</li>
                  <li><strong>GM Errors:</strong> Moved to invalid coordinates by mistake</li>
                  <li><strong>Exploits:</strong> Player used bug to reach unreachable areas</li>
                  <li><strong>Database Edits:</strong> Manual coordinate changes without validation</li>
                  <li><strong>Plugin Conflicts:</strong> Custom plugin teleported to invalid position</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-red-500/20">
                <p className="text-red-300 font-semibold text-sm mb-2">⚠️ Symptoms of Stuck Character</p>
                <ul className="text-orange-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li>Cannot login to character (disconnect/crash)</li>
                  <li>Character appears online but can't move</li>
                  <li>Black screen or frozen screen after login</li>
                  <li>Immediate disconnect after character selection</li>
                  <li>Client shows "Invalid map" error</li>
                  <li>Character appears in unreachable location</li>
                  <li>Cannot use warp commands or scrolls</li>
                </ul>
                <div className="bg-black/50 p-2 rounded">
                  <p className="text-yellow-300 text-xs font-semibold mb-1">💡 Why This Matters:</p>
                  <p className="text-orange-300/70 text-xs">
                    Without the unstick feature, you would need to manually edit the MySQL database to fix each stuck character. This tool automates the process and lets players fix it themselves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* How Unstick Works Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">How Character Unstick Works</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              Step-by-step process when a player unsticks their character:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">📊 Unstick Process Flow</p>
                <ol className="text-indigo-300/70 text-xs space-y-2 list-decimal list-inside">
                  <li><strong>Player Requests Unstick:</strong> Clicks "Unstick Character" button in UserCP</li>
                  <li><strong>Check Character Status:</strong> System verifies character is OFFLINE in MySQL</li>
                  <li><strong>Check Requirements:</strong> System verifies zen cost and/or credit cost</li>
                  <li><strong>Deduct Cost:</strong> Remove zen from Character table and/or credits from credit tables</li>
                  <li><strong>Get Safe Position:</strong> Retrieve safe spawn coordinates (usually Lorencia 0, X:130, Y:116)</li>
                  <li><strong>Update Position:</strong> Set character MapNumber, MapPosX, MapPosY to safe location</li>
                  <li><strong>Update MySQL:</strong> Save all changes to Character table</li>
                  <li><strong>Confirmation:</strong> Show success message - character can now login normally</li>
                </ol>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">💡 MySQL Example</p>
                <p className="text-indigo-300/70 text-xs mb-2">
                  Player "StuckWarrior" is trapped in an invalid location:
                </p>
                <div className="space-y-2 text-xs font-mono bg-black/50 p-3 rounded">
                  <p className="text-indigo-300/70"><strong className="text-red-400">Before Unstick:</strong></p>
                  <p className="text-indigo-300/70">• MapNumber: 99 (invalid custom event map)</p>
                  <p className="text-indigo-300/70">• MapPosX: 250</p>
                  <p className="text-indigo-300/70">• MapPosY: 180</p>
                  <p className="text-indigo-300/70">• Money: 5,000,000 zen</p>
                  <p className="text-red-300/70 mt-2">❌ Character cannot login - map 99 doesn't exist!</p>
                  
                  <p className="text-indigo-300/70 mt-3"><strong className="text-blue-400">Unstick Action (MySQL):</strong></p>
                  <p className="text-indigo-300/70">UPDATE Character SET</p>
                  <p className="text-indigo-300/70">&nbsp;&nbsp;MapNumber = 0, -- Lorencia</p>
                  <p className="text-indigo-300/70">&nbsp;&nbsp;MapPosX = 130, -- Safe X coordinate</p>
                  <p className="text-indigo-300/70">&nbsp;&nbsp;MapPosY = 116, -- Safe Y coordinate</p>
                  <p className="text-indigo-300/70">&nbsp;&nbsp;Money = Money - 500000 -- Deduct 500k zen</p>
                  <p className="text-indigo-300/70">WHERE Name = 'StuckWarrior';</p>
                  
                  <p className="text-indigo-300/70 mt-3"><strong className="text-green-400">After Unstick:</strong></p>
                  <p className="text-indigo-300/70">• MapNumber: 0 (Lorencia)</p>
                  <p className="text-indigo-300/70">• MapPosX: 130</p>
                  <p className="text-indigo-300/70">• MapPosY: 116</p>
                  <p className="text-indigo-300/70">• Money: 4,500,000 zen</p>
                  <p className="text-green-300/70 mt-2">✅ Character can now login normally at Lorencia!</p>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">✅ What Happens After Unstick</p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Character position reset to safe spawn point (Lorencia)</li>
                  <li>Player can now login to their character normally</li>
                  <li>All stats, level, experience remain unchanged</li>
                  <li>All inventory items and equipment remain unchanged</li>
                  <li>Character can move freely and play normally</li>
                  <li>No other side effects - only position is changed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Safe Spawn Positions Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Navigation className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Safe Spawn Positions (MySQL)</h3>
            <p className="text-purple-300/70 text-sm mb-3">
              Common safe spawn coordinates used for unstick in MU Online servers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">🗺️ Default Safe Positions</p>
                <div className="space-y-2 text-xs">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 font-semibold mb-1">Lorencia (Most Common)</p>
                    <code className="text-purple-300/70 block font-mono">
                      MapNumber: 0<br />
                      MapPosX: 130<br />
                      MapPosY: 116
                    </code>
                    <p className="text-purple-300/70 mt-1">✅ Default spawn point, safest option</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 font-semibold mb-1">Noria</p>
                    <code className="text-purple-300/70 block font-mono">
                      MapNumber: 3<br />
                      MapPosX: 174<br />
                      MapPosY: 101
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 font-semibold mb-1">Elveland</p>
                    <code className="text-purple-300/70 block font-mono">
                      MapNumber: 2<br />
                      MapPosX: 51<br />
                      MapPosY: 229
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 font-semibold mb-1">Devias</p>
                    <code className="text-purple-300/70 block font-mono">
                      MapNumber: 1<br />
                      MapPosX: 197<br />
                      MapPosY: 35
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">⚙️ Configuration Options</p>
                <p className="text-purple-300/70 text-xs mb-3">
                  You can configure which position to use for unstick:
                </p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li><strong>Single Position:</strong> All characters go to same spot (Lorencia)</li>
                  <li><strong>Class-Based:</strong> Different positions based on character class</li>
                  <li><strong>Level-Based:</strong> Low levels → Lorencia, High levels → Elveland</li>
                  <li><strong>Random Safe Position:</strong> Choose randomly from list of safe spots</li>
                  <li><strong>Last Safe Position:</strong> Store last known valid position (advanced)</li>
                </ul>
                <div className="bg-black/50 p-2 rounded">
                  <p className="text-yellow-300 text-xs font-semibold mb-1">💡 Recommendation:</p>
                  <p className="text-purple-300/70 text-xs">
                    Most servers use Lorencia (0, 130, 116) as it's the default spawn and works for all character types. Simple and reliable.
                  </p>
                </div>
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
              Configure the cost for unsticking characters. You can require zen, credits, or both:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">💰 Zen Cost</p>
                <p className="text-green-300/70 text-xs mb-3">
                  In-game currency cost for unsticking:
                </p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li><strong>0:</strong> Free unstick (not recommended)</li>
                  <li><strong>100,000 - 500,000:</strong> Low cost (prevents abuse)</li>
                  <li><strong>500,000 - 1,000,000:</strong> Moderate cost (recommended)</li>
                  <li><strong>1,000,000 - 5,000,000:</strong> High cost (rare use)</li>
                </ul>
                <div className="bg-black/50 p-2 rounded">
                  <p className="text-yellow-300 text-xs font-semibold mb-1">💡 Recommendation:</p>
                  <p className="text-green-300/70 text-xs">
                    Set 500k zen to prevent abuse (players intentionally getting stuck) but keep it affordable for legitimate stuck situations. Lower than other services since stuck is usually not player's fault.
                  </p>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                <p className="text-blue-300 font-semibold text-sm mb-2">💎 Credit Cost</p>
                <p className="text-green-300/70 text-xs mb-3">
                  Premium currency cost for unsticking:
                </p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li><strong>0:</strong> Free unstick (most common)</li>
                  <li><strong>1-5:</strong> Very small credit cost</li>
                  <li><strong>5-10:</strong> Small credit cost (premium convenience)</li>
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
                    Most servers use zen-only cost. Credits usually set to 0 since getting stuck is often server-related, not player's fault.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-black/30 p-4 rounded-lg border border-green-500/20">
              <p className="text-green-300 font-semibold text-sm mb-2">⚖️ Cost Philosophy</p>
              <p className="text-green-300/70 text-xs mb-2">
                Unstick pricing should balance two goals:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-black/50 p-3 rounded border border-green-500/20">
                  <p className="text-green-300 font-semibold mb-2">✅ Help Legitimate Stuck Players</p>
                  <p className="text-green-300/70">
                    Players who are genuinely stuck due to server bugs or crashes should be able to afford the unstick cost easily. This is not their fault.
                  </p>
                </div>
                <div className="bg-black/50 p-3 rounded border border-yellow-500/20">
                  <p className="text-yellow-300 font-semibold mb-2">⚠️ Prevent Abuse</p>
                  <p className="text-green-300/70">
                    Some players might try to abuse unstick as a free teleport. A small cost prevents this while remaining affordable for real stuck situations.
                  </p>
                </div>
              </div>
              <p className="text-green-300/70 text-xs mt-3">
                <strong>Best Practice:</strong> Set a low-to-moderate zen cost (500k-1M) with no credit requirement. This prevents teleport abuse while being affordable for genuine stuck situations.
              </p>
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
              The unstick system interacts with MySQL to reset character position:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">📊 MySQL Tables Involved</p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-cyan-300 mb-2"><strong>Character Table:</strong> Stores character position and zen</p>
                    <code className="text-cyan-300/70 block">
                      UPDATE Character SET<br />
                      &nbsp;&nbsp;MapNumber = 0, -- Lorencia<br />
                      &nbsp;&nbsp;MapPosX = 130, -- Safe X coordinate<br />
                      &nbsp;&nbsp;MapPosY = 116, -- Safe Y coordinate<br />
                      &nbsp;&nbsp;Money = Money - 500000 -- Deduct zen cost<br />
                      WHERE Name = 'StuckWarrior';
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
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-cyan-300 mb-2"><strong>MEMB_STAT Table:</strong> Check if character is online</p>
                    <code className="text-cyan-300/70 block">
                      SELECT ConnectStat<br />
                      FROM MEMB_STAT<br />
                      WHERE memb___id = 'player123';
                    </code>
                    <p className="text-cyan-300/70 mt-1">
                      • ConnectStat = 0: Offline (can unstick)<br />
                      • ConnectStat = 1: Online (cannot unstick)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">🔒 Unstick Validation (MySQL Queries)</p>
                <div className="space-y-2 text-xs">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">1. Check Character Exists:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT Name FROM Character WHERE Name = 'StuckWarrior';
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">2. Check Character is Offline:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT ConnectStat FROM MEMB_STAT WHERE memb___id = 'player123' AND ConnectStat = 0;
                    </code>
                    <p className="text-red-300/70 mt-1 text-xs">
                      ⚠️ CRITICAL: Character MUST be offline. Unsticking online characters causes corruption!
                    </p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">3. Check Zen Balance:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT Money FROM Character WHERE Name = 'StuckWarrior' AND Money &gt;= 500000;
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">4. Check Credits (if required):</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT WCoinC FROM WCoinC WHERE AccountID = 'player123' AND WCoinC &gt;= 5;
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">5. Update Position (Transaction):</p>
                    <code className="text-cyan-300/70 block font-mono">
                      START TRANSACTION;<br />
                      UPDATE Character SET MapNumber=0, MapPosX=130, MapPosY=116, Money=Money-500000 WHERE Name='StuckWarrior';<br />
                      -- If credits: UPDATE WCoinC SET WCoinC=WCoinC-5 WHERE AccountID='player123';<br />
                      COMMIT;
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-red-500/20">
                <p className="text-red-300 font-semibold text-sm mb-2">⚠️ Important MySQL Considerations</p>
                <ul className="text-cyan-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>MUST Check Offline:</strong> NEVER unstick online characters - causes data corruption</li>
                  <li><strong>Use Transactions:</strong> Ensure position update and cost deduction both succeed</li>
                  <li><strong>Validate Coordinates:</strong> Ensure safe position exists in server's map files</li>
                  <li><strong>Lock Character Row:</strong> Prevent concurrent unstick attempts</li>
                  <li><strong>Log Unstick Actions:</strong> Track who, when, and from where (for abuse detection)</li>
                  <li><strong>Backup Before Changes:</strong> Save character state in case of issues</li>
                  <li><strong>Test Safe Position:</strong> Verify safe coordinates work before deploying</li>
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
            <h3 className="text-white font-semibold mb-2">Unstick Best Practices (MySQL)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">✅ Recommended Settings</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Zen Cost:</strong> 500k-1M zen (prevents abuse, stays affordable)</li>
                  <li><strong>Credit Cost:</strong> 0 (free - stuck not player's fault)</li>
                  <li><strong>Safe Position:</strong> Lorencia (0, 130, 116) - most reliable</li>
                  <li>Allow unlimited unsticks (no cooldown needed)</li>
                  <li>ALWAYS verify character is offline first</li>
                  <li>Use MySQL transactions for data integrity</li>
                  <li>Log all unstick actions for audit trail</li>
                  <li>Show clear success/error messages to players</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">🗄️ MySQL Considerations</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Add index on Character.Name for faster lookups</li>
                  <li>Store unstick logs in separate table</li>
                  <li>Use stored procedure for atomic unstick operation</li>
                  <li>Validate safe coordinates exist in server config</li>
                  <li>Monitor unstick frequency per account (detect abuse)</li>
                  <li>Consider cooldown for same character (e.g., 1 per hour)</li>
                  <li>Backup character position before unstick</li>
                  <li>Test safe spawn position thoroughly before deployment</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">🎮 Server Type Recommendations</p>
                <div className="space-y-2">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 text-xs font-semibold">Casual Server:</p>
                    <p className="text-yellow-300/70 text-xs">Free or very low cost (100k zen). Stuck situations are frustrating, make it easy.</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-blue-300 text-xs font-semibold">Balanced Server:</p>
                    <p className="text-yellow-300/70 text-xs">Moderate cost (500k-1M zen). Prevents teleport abuse but affordable for real stuck.</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 text-xs font-semibold">Hardcore Server:</p>
                    <p className="text-yellow-300/70 text-xs">Higher cost (1-5M zen) but allow GM tickets for genuine server bugs (free unstick by staff).</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">⚠️ Common Mistakes to Avoid</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Allowing Online Unstick:</strong> Causes data corruption and duplication</li>
                  <li><strong>No Cost:</strong> Players abuse it as free teleport system</li>
                  <li><strong>Invalid Safe Position:</strong> Character still stuck after unstick</li>
                  <li><strong>No Transaction:</strong> Zen deducted but position not updated</li>
                  <li><strong>Not Logging:</strong> Can't detect abuse or track issues</li>
                  <li><strong>Wrong Map Number:</strong> Using removed/custom maps as safe position</li>
                  <li><strong>No Validation:</strong> Not checking zen balance before unstick</li>
                  <li><strong>Too Expensive:</strong> Players can't afford it when genuinely stuck</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-green-500/20">
              <p className="text-green-300 font-semibold text-sm mb-2">💡 Pro Tip: Prevention is Better Than Cure</p>
              <p className="text-yellow-300/70 text-xs mb-2">
                While unstick is essential, focus on preventing stuck situations:
              </p>
              <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                <li><strong>Validate Teleports:</strong> Check destination coordinates before teleporting</li>
                <li><strong>Test Custom Maps:</strong> Ensure all custom maps have valid spawn points</li>
                <li><strong>Event Cleanup:</strong> Move characters out before removing event maps</li>
                <li><strong>Graceful Shutdowns:</strong> Proper server shutdown procedures</li>
                <li><strong>Regular Backups:</strong> Backup character positions frequently</li>
                <li><strong>Monitor Logs:</strong> Track unusual position changes or crashes</li>
              </ul>
              <p className="text-yellow-300/70 text-xs mt-2">
                <strong>Remember:</strong> Unstick is a safety net, not a replacement for stable server code. Keep unstick costs low since stuck situations are usually server-related, not player mistakes.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
