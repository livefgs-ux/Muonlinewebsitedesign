import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, CheckCircle, XCircle, Save, Info, Shield, AlertTriangle, Lock } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface MyPasswordConfig {
  active: number;
  change_password_email_verification: number;
  change_password_request_timeout: string;
}

export function MyPasswordSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<MyPasswordConfig>({
    active: 1,
    change_password_email_verification: 1,
    change_password_request_timeout: '24',
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
    for (let i = 1; i <= 3; i++) {
      settings[`setting_${i}`] = formData.get(`setting_${i}`);
    }

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving Change Password Settings...');
      console.log('📄 XML Path: module_configs/usercp.mypassword.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        change_password_email_verification: Number(settings.setting_2),
        change_password_request_timeout: settings.setting_3,
      });

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        change_password_email_verification: Number(settings.setting_2),
        change_password_request_timeout: settings.setting_3 as string,
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
        <h2 className="text-3xl text-white mb-2">Change Password Settings</h2>
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
                      Enable/disable the change password module.
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
                      If enabled, the account's password will not be changed until the user clicks the verification link sent via email.
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
                        defaultChecked={config.change_password_email_verification === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="0"
                        defaultChecked={config.change_password_email_verification === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Change Password Time Limit */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Change Password Time Limit</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If email verification is enabled, set the time that the verification link will stay valid.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="setting_3"
                      defaultValue={config.change_password_request_timeout}
                      placeholder="24"
                      className="w-32 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                    />
                    <span className="text-gray-400">hour(s)</span>
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
            <Key className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Change Password Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the Change Password module in the User Control Panel (UserCP).
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Status:</strong> Enable or disable the Change Password module</li>
              <li><strong>Email Verification:</strong> Require users to verify password changes via email link</li>
              <li><strong>Time Limit:</strong> How long the verification link remains valid (in hours)</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/usercp.mypassword.xml</code></li>
              <li>This module allows players to securely update their account password</li>
              <li>Email verification prevents unauthorized password changes</li>
              <li>Verification link is sent to the account's registered email</li>
              <li>Part of the UserCP (User Control Panel) system</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Password Change Verification Flow Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Password Change Verification Flow</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              When email verification is enabled, the following secure process is used:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/50">
                    <span className="text-indigo-300 text-sm font-bold">1</span>
                  </div>
                  <p className="text-indigo-300 font-semibold">Player Requests Password Change</p>
                </div>
                <p className="text-indigo-300/70 text-sm ml-11">
                  Player enters their current password and new password in the UserCP
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
                  System sends verification link to the account's registered email address
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
                  Player must click the link within the time limit to confirm the password change
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                    <span className="text-green-300 text-sm font-bold">4</span>
                  </div>
                  <p className="text-green-300 font-semibold">Password Changed Successfully</p>
                </div>
                <p className="text-green-300/70 text-sm ml-11">
                  After verification, the account password is updated to the new password
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
                    <span className="text-red-300 text-sm font-bold">⏰</span>
                  </div>
                  <p className="text-red-300 font-semibold">Link Expires After Time Limit</p>
                </div>
                <p className="text-red-300/70 text-sm ml-11">
                  If the player doesn't verify within the time limit, the link expires and password remains unchanged
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
              Email verification for password changes provides critical security protection:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">✅ Prevents Account Takeover</p>
                <p className="text-green-300/70 text-xs">
                  If someone gains access to an account, they cannot permanently change the password without email access
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">🔐 Two-Factor Verification</p>
                <p className="text-green-300/70 text-xs">
                  Requires both account access AND email access to change password
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">📧 Immediate Alert Notification</p>
                <p className="text-green-300/70 text-xs">
                  Account owner is instantly notified of any password change attempts
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">⏰ Time-Limited Protection</p>
                <p className="text-green-300/70 text-xs">
                  Verification links expire, preventing indefinite vulnerability windows
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">🛡️ Recovery Window</p>
                <p className="text-green-300/70 text-xs">
                  Owner has time to contact support and secure their account before password changes
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">🚫 Blocks Automated Attacks</p>
                <p className="text-green-300/70 text-xs">
                  Prevents bots and scripts from mass-changing passwords
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
            <h3 className="text-white font-semibold mb-2">⚠️ Important Security Considerations</h3>
            <ul className="text-yellow-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Email Verification HIGHLY Recommended:</strong> Always enable in production environments</li>
              <li><strong>SMTP Configuration Required:</strong> Email Settings must be properly configured for verification emails</li>
              <li><strong>Time Limit Recommendations:</strong> 24-48 hours is recommended for verification link validity</li>
              <li><strong>Current Password Required:</strong> Always require current password before accepting new password</li>
              <li><strong>Password Strength:</strong> Implement strong password requirements (min length, complexity)</li>
              <li><strong>Rate Limiting:</strong> Limit password change attempts to prevent abuse (e.g., 3 per day)</li>
              <li><strong>Security Logging:</strong> Log all password change requests and completions for auditing</li>
              <li><strong>Notification Emails:</strong> Send confirmation email after successful password change</li>
              <li><strong>Session Termination:</strong> Consider logging out all sessions after password change</li>
              <li><strong>Password History:</strong> Prevent reuse of recent passwords (last 3-5 passwords)</li>
              <li><strong>Without Verification:</strong> If disabled, password changes immediately (DANGEROUS for production)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Recommended Settings Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Lock className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">🎯 Recommended Settings</h3>
            <div className="space-y-2 text-purple-300/70 text-sm">
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold mb-1">✅ Production Server (Recommended):</p>
                <ul className="space-y-1 list-disc list-inside ml-2">
                  <li><strong>Status:</strong> Enabled</li>
                  <li><strong>Email Verification:</strong> Enabled</li>
                  <li><strong>Time Limit:</strong> 24-48 hours</li>
                  <li>Require current password validation</li>
                  <li>Minimum password length: 8 characters</li>
                  <li>Require: uppercase, lowercase, number, special char</li>
                  <li>Rate limit: 3 password changes per 24 hours</li>
                  <li>Send confirmation email after change</li>
                  <li>Log out all sessions after password change</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold mb-1">🧪 Testing/Development Server:</p>
                <ul className="space-y-1 list-disc list-inside ml-2">
                  <li><strong>Status:</strong> Enabled</li>
                  <li><strong>Email Verification:</strong> Disabled (for easier testing)</li>
                  <li><strong>Time Limit:</strong> 1 hour (if testing verification)</li>
                  <li>Relaxed password requirements for testing</li>
                  <li>No rate limiting</li>
                  <li>Session persistence for convenience</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold mb-1">🔒 High Security Server:</p>
                <ul className="space-y-1 list-disc list-inside ml-2">
                  <li><strong>Status:</strong> Enabled</li>
                  <li><strong>Email Verification:</strong> Enabled</li>
                  <li><strong>Time Limit:</strong> 12-24 hours</li>
                  <li>Minimum password length: 12 characters</li>
                  <li>Strict complexity requirements</li>
                  <li>Rate limit: 2 password changes per 48 hours</li>
                  <li>Mandatory 2FA for password changes</li>
                  <li>Password change cooldown: 7 days between changes</li>
                  <li>Prevent password reuse (last 10 passwords)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Password Requirements Card */}
      <Card className="backdrop-blur-lg bg-cyan-500/5 border-cyan-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/50 flex-shrink-0">
            <Key className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">🔑 Strong Password Best Practices</h3>
            <p className="text-cyan-300/70 text-sm mb-2">
              Implement these password requirements for maximum security:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-black/30 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-1">📏 Length Requirements</p>
                <ul className="text-cyan-300/70 text-xs space-y-1">
                  <li>• Minimum: 8 characters (standard)</li>
                  <li>• Recommended: 12+ characters</li>
                  <li>• High Security: 16+ characters</li>
                  <li>• Maximum: 128 characters</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-1">🔤 Complexity Requirements</p>
                <ul className="text-cyan-300/70 text-xs space-y-1">
                  <li>• At least one uppercase letter (A-Z)</li>
                  <li>• At least one lowercase letter (a-z)</li>
                  <li>• At least one number (0-9)</li>
                  <li>• At least one special character (!@#$%)</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-1">🚫 Prohibited Patterns</p>
                <ul className="text-cyan-300/70 text-xs space-y-1">
                  <li>• No common passwords (password123, etc.)</li>
                  <li>• No sequential characters (abc, 123)</li>
                  <li>• No keyboard patterns (qwerty, asdf)</li>
                  <li>• No username in password</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-1">🔄 Password Policies</p>
                <ul className="text-cyan-300/70 text-xs space-y-1">
                  <li>• Prevent password reuse (last 5-10)</li>
                  <li>• Regular password expiration (90 days)</li>
                  <li>• Password change cooldown (7 days)</li>
                  <li>• Account lockout after failed attempts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
