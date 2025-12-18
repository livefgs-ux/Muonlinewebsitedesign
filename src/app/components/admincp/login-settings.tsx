import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, CheckCircle, XCircle, Save, Shield, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface LoginConfig {
  active: number;
  enable_session_timeout: number;
  session_timeout: string;
  max_login_attempts: string;
  failed_login_timeout: string;
}

export function LoginSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<LoginConfig>({
    active: 1,
    enable_session_timeout: 1,
    session_timeout: '3600',
    max_login_attempts: '5',
    failed_login_timeout: '30',
  });

  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const checkValue = (value: any): boolean => {
    return value !== '' && value !== null && value !== undefined;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    const formData = new FormData(e.currentTarget);
    const settings: any = {};

    // Get all settings
    for (let i = 1; i <= 5; i++) {
      settings[`setting_${i}`] = formData.get(`setting_${i}`);
    }

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving Login Settings...');
      console.log('📄 XML Path: module_configs/login.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        enable_session_timeout: Number(settings.setting_2),
        session_timeout: settings.setting_3,
        max_login_attempts: settings.setting_4,
        failed_login_timeout: settings.setting_5,
      });

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        enable_session_timeout: Number(settings.setting_2),
        session_timeout: settings.setting_3 as string,
        max_login_attempts: settings.setting_4 as string,
        failed_login_timeout: settings.setting_5 as string,
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
        <h2 className="text-3xl text-white mb-2">Login Settings</h2>
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
                      Enable/disable the login module.
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

              {/* Session Timeout */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Session Timeout</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enable/disable sessions timeout.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="1"
                        defaultChecked={config.enable_session_timeout === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="0"
                        defaultChecked={config.enable_session_timeout === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Session Timeout Limit */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Session Timeout Limit</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If session timeout is enabled, define the time (in seconds) after which the inactive session should be logged out automatically.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="setting_3"
                      defaultValue={config.session_timeout}
                      placeholder="3600"
                      className="w-32 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                    />
                    <span className="text-gray-400">seconds</span>
                  </div>
                </td>
              </tr>

              {/* Maximum Failed Login Attempts */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Maximum Failed Login Attempts</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Define the maximum failed login attempts before the client's IP address should be temporarily blocked.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_4"
                    defaultValue={config.max_login_attempts}
                    placeholder="5"
                    className="w-32 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Failed Login Attempts IP Block Duration */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Failed Login Attempts IP Block Duration</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Time in minutes of failed login attempts IP block duration.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="setting_5"
                      defaultValue={config.failed_login_timeout}
                      placeholder="30"
                      className="w-32 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                    />
                    <span className="text-gray-400">minutes</span>
                  </div>
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
            <LogIn className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Login Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure security settings for the login system to protect against unauthorized access.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Status:</strong> Enable or disable the entire login module</li>
              <li><strong>Session Timeout:</strong> Automatically log out inactive users after a specified time</li>
              <li><strong>Session Timeout Limit:</strong> Time in seconds before automatic logout (default: 3600 = 1 hour)</li>
              <li><strong>Max Failed Login Attempts:</strong> Number of failed attempts before IP is blocked (default: 5)</li>
              <li><strong>IP Block Duration:</strong> How long the IP remains blocked in minutes (default: 30)</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/login.xml</code></li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Security Best Practices Card */}
      <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50 flex-shrink-0">
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">🔒 Recommended Security Settings</h3>
            <div className="space-y-2 text-green-300/70 text-sm">
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold mb-1">Session Timeout:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Low Security:</strong> 7200 seconds (2 hours)</li>
                  <li><strong>Medium Security:</strong> 3600 seconds (1 hour) - Recommended</li>
                  <li><strong>High Security:</strong> 1800 seconds (30 minutes)</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold mb-1">Failed Login Attempts:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Lenient:</strong> 10 attempts / 15 minute block</li>
                  <li><strong>Balanced:</strong> 5 attempts / 30 minute block - Recommended</li>
                  <li><strong>Strict:</strong> 3 attempts / 60 minute block</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Warning Card */}
      <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50 flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">⚠️ Important Security Notes</h3>
            <ul className="text-yellow-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Session timeout helps prevent unauthorized access from unattended sessions</li>
              <li>Failed login protection prevents brute force password attacks</li>
              <li>Balance security with user experience - too strict settings may frustrate legitimate users</li>
              <li>Monitor failed login attempts regularly to identify potential attacks</li>
              <li>Consider implementing CAPTCHA after 2-3 failed attempts for additional security</li>
              <li>Use strong password policies in combination with these settings</li>
              <li>Keep logs of all failed login attempts for security auditing</li>
              <li>Consider IP whitelisting for admin accounts for extra protection</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
