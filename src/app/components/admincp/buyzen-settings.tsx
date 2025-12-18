import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, CheckCircle, XCircle, Save, Coins } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface BuyZenConfig {
  active: number;
  max_zen: number;
  exchange_ratio: number;
  increment_rate: number;
  credit_config: number;
}

export function BuyZenSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<BuyZenConfig>({
    active: 1,
    max_zen: 2000000000,
    exchange_ratio: 1000000,
    increment_rate: 1000000,
    credit_config: 1,
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

  const checkValue = (value: any): boolean => {
    return value !== '' && value !== null && value !== undefined;
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
    settings.setting_5 = formData.get('setting_5');

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving Buy Zen Settings...');
      console.log('📄 XML Path: module_configs/usercp.buyzen.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        max_zen: Number(settings.setting_2),
        exchange_ratio: Number(settings.setting_3),
        increment_rate: Number(settings.setting_5),
        credit_config: Number(settings.setting_4),
      });

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        max_zen: Number(settings.setting_2),
        exchange_ratio: Number(settings.setting_3),
        increment_rate: Number(settings.setting_5),
        credit_config: Number(settings.setting_4),
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
        <h2 className="text-3xl text-white mb-2">Buy Zen Settings</h2>
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
                      Enable/disable the buy zen module.
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

              {/* Max Zen */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Max Zen</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Maximum zen a character can have
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_2"
                    defaultValue={config.max_zen}
                    className="w-48 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Exchange Rate */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Exchange Rate</div>
                    <div className="text-gray-400 text-sm font-normal">
                      How much zen does 1 CREDIT equals to.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_3"
                    defaultValue={config.exchange_ratio}
                    className="w-48 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Increment Rate */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Increment Rate</div>
                    <div className="text-gray-400 text-sm font-normal">
                      The larger the value, the less options there will be in the dropdown menu.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_5"
                    defaultValue={config.increment_rate}
                    className="w-48 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
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
                    name="setting_4"
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
            <Coins className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Buy Zen Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the Buy Zen module that allows players to purchase in-game zen using credits via the UserCP.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Status:</strong> Enable or disable the entire module</li>
              <li><strong>Max Zen:</strong> Maximum amount of zen a character can have (2,000,000,000 default)</li>
              <li><strong>Exchange Rate:</strong> How much zen equals 1 credit (e.g., 1,000,000 zen = 1 credit)</li>
              <li><strong>Increment Rate:</strong> Controls dropdown options - larger value = fewer options</li>
              <li><strong>Credit Configuration:</strong> Which credit type to use (WCoin, GoblinPoint, etc.)</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/usercp.buyzen.xml</code></li>
              <li>Example: If exchange rate is 1,000,000 and increment is 1,000,000, dropdown shows: 1M, 2M, 3M zen</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
