import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle, XCircle, Save, Info, Shield, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface MyEmailConfig {
  active: number;
  require_verification: number;
}

export function MyEmailSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<MyEmailConfig>({
    active: 1,
    require_verification: 1,
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
    for (let i = 1; i <= 2; i++) {
      settings[`setting_${i}`] = formData.get(`setting_${i}`);
    }

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving Change Email Settings...');
      console.log('📄 XML Path: module_configs/usercp.myemail.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        require_verification: Number(settings.setting_2),
      });

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        require_verification: Number(settings.setting_2),
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
        <h2 className="text-3xl text-white mb-2">Change Email Settings</h2>
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
                      Enable/disable the change email module.
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

              {/* Email Verification */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Email Verification</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, the account's email will not be changed until the user clicks the verification link sent to their current email.
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
                        defaultChecked={config.require_verification === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="0"
                        defaultChecked={config.require_verification === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
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
            <Mail className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Change Email Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the Change Email module in the User Control Panel (UserCP).
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Status:</strong> Enable or disable the Change Email module</li>
              <li><strong>Email Verification:</strong> Require users to verify email changes via link</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/usercp.myemail.xml</code></li>
              <li>This module allows players to update their account email address</li>
              <li>Email verification prevents unauthorized email changes</li>
              <li>Verification link is sent to the current email address</li>
              <li>Part of the UserCP (User Control Panel) system</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Email Verification Flow Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Email Verification Flow</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              When email verification is enabled, the following process is used:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/50">
                    <span className="text-indigo-300 text-sm font-bold">1</span>
                  </div>
                  <p className="text-indigo-300 font-semibold">Player Requests Email Change</p>
                </div>
                <p className="text-indigo-300/70 text-sm ml-11">
                  Player enters their new email address in the UserCP
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/50">
                    <span className="text-indigo-300 text-sm font-bold">2</span>
                  </div>
                  <p className="text-indigo-300 font-semibold">Verification Email Sent</p>
                </div>
                <p className="text-indigo-300/70 text-sm ml-11">
                  System sends verification link to the <strong>current</strong> email address
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/50">
                    <span className="text-indigo-300 text-sm font-bold">3</span>
                  </div>
                  <p className="text-indigo-300 font-semibold">Player Clicks Verification Link</p>
                </div>
                <p className="text-indigo-300/70 text-sm ml-11">
                  Player must click the link in their current email to confirm the change
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                    <span className="text-green-300 text-sm font-bold">4</span>
                  </div>
                  <p className="text-green-300 font-semibold">Email Changed Successfully</p>
                </div>
                <p className="text-green-300/70 text-sm ml-11">
                  After verification, the account email is updated to the new address
                </p>
              </div>
            </div>
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
            <h3 className="text-white font-semibold mb-2">🔒 Security Benefits</h3>
            <p className="text-green-300/70 text-sm mb-2">
              Email verification provides important security benefits:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">✅ Prevents Unauthorized Changes</p>
                <p className="text-green-300/70 text-xs">
                  If someone gains access to an account, they cannot change the email without access to the current email
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">🔐 Account Recovery Protection</p>
                <p className="text-green-300/70 text-xs">
                  Prevents attackers from locking out the real owner by changing the email
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">📧 Notification Alert</p>
                <p className="text-green-300/70 text-xs">
                  Account owner is immediately notified of any email change attempts
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">⏰ Time Window for Response</p>
                <p className="text-green-300/70 text-xs">
                  Owner has time to secure their account before the email is actually changed
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Important Notes Card */}
      <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50 flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">⚠️ Important Configuration Notes</h3>
            <ul className="text-yellow-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Email Verification Highly Recommended:</strong> Always enable email verification in production environments</li>
              <li><strong>SMTP Configuration Required:</strong> Email Settings must be properly configured for verification emails to work</li>
              <li><strong>Verification Link Expiration:</strong> Consider implementing a time limit on verification links (e.g., 24 hours)</li>
              <li><strong>Rate Limiting:</strong> Implement rate limiting to prevent abuse of the email change feature</li>
              <li><strong>Logging:</strong> Keep logs of all email change requests and verifications for security auditing</li>
              <li><strong>User Notification:</strong> Always send notification to both old and new email addresses</li>
              <li><strong>Cooldown Period:</strong> Consider adding a cooldown period between email changes (e.g., 7 days)</li>
              <li><strong>Verification Without Email:</strong> If disabled, emails change immediately (NOT recommended for production)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Recommended Settings Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">🎯 Recommended Settings</h3>
            <div className="space-y-2 text-purple-300/70 text-sm">
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold mb-1">✅ Production Server (Recommended):</p>
                <ul className="space-y-1 list-disc list-inside ml-2">
                  <li><strong>Status:</strong> Enabled</li>
                  <li><strong>Email Verification:</strong> Enabled</li>
                  <li>Verification link expiration: 24 hours</li>
                  <li>Email change cooldown: 7 days</li>
                  <li>Rate limit: 3 requests per hour</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold mb-1">🧪 Testing/Development Server:</p>
                <ul className="space-y-1 list-disc list-inside ml-2">
                  <li><strong>Status:</strong> Enabled</li>
                  <li><strong>Email Verification:</strong> Disabled (for easier testing)</li>
                  <li>No cooldown period</li>
                  <li>No rate limiting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
