import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, CheckCircle, XCircle, Save, Info, Shield, Mail, Key, Clock, Lock } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface RegistrationConfig {
  active: number;
  register_enable_recaptcha: number;
  register_recaptcha_site_key: string;
  register_recaptcha_secret_key: string;
  verify_email: number;
  send_welcome_email: number;
  verification_timelimit: number;
  automatic_login: number;
}

export function RegistrationSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<RegistrationConfig>({
    active: 1,
    register_enable_recaptcha: 0,
    register_recaptcha_site_key: '',
    register_recaptcha_secret_key: '',
    verify_email: 0,
    send_welcome_email: 1,
    verification_timelimit: 24,
    automatic_login: 1,
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
    settings.setting_1 = formData.get('setting_1');
    settings.setting_2 = formData.get('setting_2');
    settings.setting_3 = formData.get('setting_3');
    settings.setting_4 = formData.get('setting_4');
    settings.setting_5 = formData.get('setting_5');
    settings.setting_6 = formData.get('setting_6');
    settings.setting_7 = formData.get('setting_7');
    settings.setting_8 = formData.get('setting_8');

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving Registration Settings...');
      console.log('📄 XML Path: module_configs/register.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        register_enable_recaptcha: Number(settings.setting_2),
        register_recaptcha_site_key: settings.setting_3,
        register_recaptcha_secret_key: settings.setting_4,
        verify_email: Number(settings.setting_5),
        send_welcome_email: Number(settings.setting_6),
        verification_timelimit: Number(settings.setting_7),
        automatic_login: Number(settings.setting_8),
      });
      console.log('🗄️ Database: MySQL');

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        register_enable_recaptcha: Number(settings.setting_2),
        register_recaptcha_site_key: settings.setting_3,
        register_recaptcha_secret_key: settings.setting_4,
        verify_email: Number(settings.setting_5),
        send_welcome_email: Number(settings.setting_6),
        verification_timelimit: Number(settings.setting_7),
        automatic_login: Number(settings.setting_8),
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
        <h2 className="text-3xl text-white mb-2">Registration Settings</h2>
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
                      Enable/disable the registration module.
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

              {/* Recaptcha v2 */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Recaptcha v2</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enable/disable Recaptcha validation.
                      <br /><br />
                      <a
                        href="https://www.google.com/recaptcha/admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        https://www.google.com/recaptcha/admin
                      </a>
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
                        defaultChecked={config.register_enable_recaptcha === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="0"
                        defaultChecked={config.register_enable_recaptcha === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Recaptcha Site Key */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Recaptcha Site Key</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_3"
                    defaultValue={config.register_recaptcha_site_key}
                    placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono text-sm"
                  />
                </td>
              </tr>

              {/* Recaptcha Secret Key */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Recaptcha Secret Key</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_4"
                    defaultValue={config.register_recaptcha_secret_key}
                    placeholder="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono text-sm"
                  />
                </td>
              </tr>

              {/* Email Verification */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Email Verification</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, the user will receive an email with a verification link. The account will not be created if the email is not verified.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_5"
                        value="1"
                        defaultChecked={config.verify_email === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_5"
                        value="0"
                        defaultChecked={config.verify_email === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Send Welcome Email */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Send Welcome Email</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Sends a welcome email after registering a new account.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_6"
                        value="1"
                        defaultChecked={config.send_welcome_email === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_6"
                        value="0"
                        defaultChecked={config.send_welcome_email === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Verification Time Limit */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Verification Time Limit</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If <strong>Email Verification</strong> is Enabled. Set the amount of time the user has to verify the account. After the verification time limit passed, the user will have to repeat the registration process.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="setting_7"
                      defaultValue={config.verification_timelimit}
                      min="1"
                      className="w-24 bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                    <span className="text-gray-400">Hour(s)</span>
                  </div>
                </td>
              </tr>

              {/* Automatic Log-In */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Automatic Log-In</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Automatic account log-in after registering. This feature only works when email verification is disabled.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_8"
                        value="1"
                        defaultChecked={config.automatic_login === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_8"
                        value="0"
                        defaultChecked={config.automatic_login === 0}
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
            <UserPlus className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Registration Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the account registration system for new players. All account data is stored in your <strong>MySQL</strong> database.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/register.xml</code></li>
              <li>New accounts are created in <strong>MySQL MEMB_INFO table</strong></li>
              <li>Email verification requires SMTP settings to be configured properly</li>
              <li>Recaptcha v2 helps prevent bot registrations and spam accounts</li>
              <li>Automatic login only works when email verification is disabled</li>
              <li>Verification time limit prevents expired verification links from working</li>
              <li>Welcome emails improve user onboarding experience</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Recaptcha Info Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Google reCAPTCHA v2 Setup Guide</h3>
            <p className="text-purple-300/70 text-sm mb-3">
              Protect your registration system from bots and automated spam accounts using Google's reCAPTCHA v2.
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">📝 Step 1: Register Your Site</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Visit: <a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">https://www.google.com/recaptcha/admin</a></li>
                  <li>Sign in with your Google account</li>
                  <li>Click on "+" to register a new site</li>
                  <li>Choose reCAPTCHA type: <strong>reCAPTCHA v2</strong> → "I'm not a robot" Checkbox</li>
                  <li>Add your website domains (e.g., yourserver.com, www.yourserver.com)</li>
                  <li>Accept reCAPTCHA Terms of Service</li>
                  <li>Click "Submit" to complete registration</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">🔑 Step 2: Get Your Keys</p>
                <p className="text-purple-300/70 text-xs mb-2">
                  After registering, Google will provide you with two keys:
                </p>
                <div className="space-y-2">
                  <div className="bg-black/50 p-3 rounded border border-purple-500/20">
                    <p className="text-purple-300 text-xs font-semibold mb-1">Site Key (Public Key)</p>
                    <p className="text-purple-300/70 text-xs mb-2">
                      Used in the HTML code of your registration page. This key is visible to users in the page source.
                    </p>
                    <code className="text-purple-300/70 text-xs bg-black/50 px-2 py-1 rounded block">
                      Example: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
                    </code>
                  </div>
                  <div className="bg-black/50 p-3 rounded border border-purple-500/20">
                    <p className="text-purple-300 text-xs font-semibold mb-1">Secret Key (Private Key)</p>
                    <p className="text-purple-300/70 text-xs mb-2">
                      Used for server-side verification. <strong>Keep this key secret!</strong> Never expose it in client-side code or public repositories.
                    </p>
                    <code className="text-purple-300/70 text-xs bg-black/50 px-2 py-1 rounded block">
                      Example: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">⚙️ Step 3: Configure WebEngine</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Enable "Recaptcha v2" setting above</li>
                  <li>Paste your <strong>Site Key</strong> in the "Recaptcha Site Key" field</li>
                  <li>Paste your <strong>Secret Key</strong> in the "Recaptcha Secret Key" field</li>
                  <li>Click "Save Changes" to apply the configuration</li>
                  <li>Test registration to verify reCAPTCHA appears correctly</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">🧪 Testing Keys (Development Only)</p>
                <p className="text-purple-300/70 text-xs mb-2">
                  Google provides test keys that <strong>always pass validation</strong>. Use these only for development/testing:
                </p>
                <div className="bg-black/50 p-2 rounded text-xs font-mono space-y-1">
                  <p className="text-purple-300/70"><strong>Site Key:</strong> 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI</p>
                  <p className="text-purple-300/70"><strong>Secret Key:</strong> 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe</p>
                </div>
                <p className="text-red-400 text-xs mt-2">
                  ⚠️ <strong>Never use test keys in production!</strong> They provide no actual protection against bots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Email Verification Info Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Mail className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Email Verification System</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              Enable email verification to ensure users provide valid email addresses and prevent fake account creation.
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">🔒 How Email Verification Works</p>
                <ol className="text-indigo-300/70 text-xs space-y-2 list-decimal list-inside">
                  <li><strong>User Fills Registration Form:</strong> User submits username, password, email, etc.</li>
                  <li><strong>Temporary Account Created:</strong> Account is created in MySQL but marked as "unverified"</li>
                  <li><strong>Verification Email Sent:</strong> System sends email with unique verification link</li>
                  <li><strong>User Clicks Link:</strong> User opens email and clicks verification link</li>
                  <li><strong>Account Activated:</strong> System verifies token and activates account in MySQL</li>
                  <li><strong>User Can Log In:</strong> Account is now fully active and ready to use</li>
                </ol>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">⏰ Verification Time Limit</p>
                <p className="text-indigo-300/70 text-xs mb-2">
                  The time limit prevents expired verification links from being used. If a user doesn't verify within the time limit:
                </p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>The verification link becomes invalid and returns an error</li>
                  <li>The temporary account data is automatically deleted from MySQL</li>
                  <li>User must register again to create a new account</li>
                  <li><strong>Recommended:</strong> 24-72 hours (1-3 days)</li>
                  <li><strong>Too short:</strong> Users may not have time to verify</li>
                  <li><strong>Too long:</strong> Temporary accounts clutter the database</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">✅ Benefits of Email Verification</p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Prevents Fake Accounts:</strong> Requires valid email address</li>
                  <li><strong>Reduces Bot Registrations:</strong> Bots can't easily verify emails</li>
                  <li><strong>Enables Password Recovery:</strong> Verified emails can be used for "Forgot Password"</li>
                  <li><strong>Improves Communication:</strong> You can send newsletters, updates, and notifications</li>
                  <li><strong>Reduces Spam:</strong> Users less likely to use disposable email addresses</li>
                  <li><strong>Better Account Security:</strong> Adds an extra layer of verification</li>
                </ul>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">⚠️ Prerequisites</p>
                <p className="text-indigo-300/70 text-xs mb-2">
                  Email verification requires proper SMTP configuration:
                </p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Go to <strong>Site Editor → Email Settings</strong></li>
                  <li>Configure SMTP server details (host, port, username, password)</li>
                  <li>Test email sending to verify configuration works</li>
                  <li>Ensure your server's IP is not blacklisted for spam</li>
                  <li>Consider using email services like SendGrid, Mailgun, or AWS SES</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Welcome Email & Auto-Login Card */}
      <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50 flex-shrink-0">
            <Key className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Welcome Email & Automatic Login</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">📧 Send Welcome Email</p>
                <p className="text-green-300/70 text-xs mb-3">
                  A welcome email is sent to new users after successful registration, providing a warm introduction to your server.
                </p>
                <p className="text-green-300 text-xs font-semibold mb-2">Welcome Email Contains:</p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Greeting message and server welcome</li>
                  <li>Username reminder</li>
                  <li>Link to download game client</li>
                  <li>Server connection information (IP, port)</li>
                  <li>Discord/community links</li>
                  <li>Starter guide or helpful tips</li>
                  <li>Support contact information</li>
                </ul>
                <div className="mt-3 bg-black/50 p-2 rounded">
                  <p className="text-green-300/70 text-xs">
                    <strong>Note:</strong> Welcome email is sent regardless of email verification status. It's sent immediately after account creation.
                  </p>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">🔓 Automatic Log-In</p>
                <p className="text-green-300/70 text-xs mb-3">
                  When enabled, users are automatically logged in immediately after registration, streamlining the onboarding process.
                </p>
                <p className="text-green-300 text-xs font-semibold mb-2">How It Works:</p>
                <ol className="text-green-300/70 text-xs space-y-1 list-decimal list-inside mb-3">
                  <li>User completes registration form</li>
                  <li>Account is created in MySQL MEMB_INFO table</li>
                  <li>Session is automatically created</li>
                  <li>User is redirected to UserCP/Dashboard</li>
                  <li>No need to go to login page</li>
                </ol>
                <div className="bg-red-500/10 border border-red-500/30 rounded p-2 mb-2">
                  <p className="text-red-300 text-xs font-semibold mb-1">⚠️ Important Limitation:</p>
                  <p className="text-red-300/70 text-xs">
                    Automatic login <strong>only works when Email Verification is disabled</strong>. If email verification is enabled, users must verify their email before logging in.
                  </p>
                </div>
                <div className="bg-black/50 p-2 rounded">
                  <p className="text-green-300/70 text-xs">
                    <strong>Recommended Configuration:</strong><br />
                    • Casual servers: Enable auto-login (faster onboarding)<br />
                    • Competitive servers: Disable auto-login (require verification)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Best Practices Card */}
      <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50 flex-shrink-0">
            <Lock className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">🔐 Registration Security Best Practices</h3>
            <p className="text-yellow-300/70 text-sm mb-3">
              Follow these security recommendations to protect your server from malicious registrations and attacks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">✅ Always Enable</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>reCAPTCHA v2:</strong> Blocks automated bot registrations</li>
                  <li><strong>Email Verification:</strong> Ensures valid email addresses</li>
                  <li><strong>Password Strength:</strong> Enforce minimum length and complexity</li>
                  <li><strong>Rate Limiting:</strong> Limit registration attempts per IP</li>
                  <li><strong>Username Validation:</strong> Block offensive or admin-like names</li>
                  <li><strong>HTTPS:</strong> Encrypt registration data in transit</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">⚠️ Monitor for Abuse</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Multiple Accounts per IP:</strong> Check MySQL for suspicious patterns</li>
                  <li><strong>Disposable Emails:</strong> Block temporary email services</li>
                  <li><strong>Rapid Registrations:</strong> Flag accounts created in quick succession</li>
                  <li><strong>Failed reCAPTCHA:</strong> Log and block IPs with high failure rates</li>
                  <li><strong>Expired Verifications:</strong> Clean up unverified accounts regularly</li>
                  <li><strong>SQL Injection:</strong> Use prepared statements for all MySQL queries</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">🗄️ MySQL Security</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Prepared Statements:</strong> Prevent SQL injection attacks</li>
                  <li><strong>Password Hashing:</strong> Use bcrypt or Argon2 (never store plaintext)</li>
                  <li><strong>Unique Constraints:</strong> Username and email must be unique</li>
                  <li><strong>Index Optimization:</strong> Add indexes on username and email fields</li>
                  <li><strong>Regular Backups:</strong> Backup MEMB_INFO table regularly</li>
                  <li><strong>Connection Security:</strong> Use SSL/TLS for MySQL connections</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">🎯 Configuration Tips</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Verification Time:</strong> 24-48 hours is ideal balance</li>
                  <li><strong>Auto-Login:</strong> Only enable if email verification is off</li>
                  <li><strong>Welcome Email:</strong> Improves retention and engagement</li>
                  <li><strong>reCAPTCHA Theme:</strong> Match your site's design (dark/light)</li>
                  <li><strong>Test Environment:</strong> Use Google's test keys for development</li>
                  <li><strong>Error Messages:</strong> Don't reveal if username/email exists</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-300 font-semibold text-sm mb-2">📊 MySQL Table Structure Example</p>
              <div className="text-yellow-300/70 text-xs font-mono bg-black/50 p-2 rounded">
                <p>CREATE TABLE MEMB_INFO (</p>
                <p className="ml-4">memb___id VARCHAR(10) PRIMARY KEY,</p>
                <p className="ml-4">memb__pwd VARCHAR(255) NOT NULL, -- Hashed password</p>
                <p className="ml-4">memb_name VARCHAR(10) NOT NULL,</p>
                <p className="ml-4">mail_addr VARCHAR(50) UNIQUE,</p>
                <p className="ml-4">bloc_code TINYINT DEFAULT 0, -- 0=Active, 1=Banned</p>
                <p className="ml-4">ctl1_code TINYINT DEFAULT 0, -- Email verified flag</p>
                <p className="ml-4">mail_chek VARCHAR(1) DEFAULT 0,</p>
                <p className="ml-4">reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,</p>
                <p className="ml-4">INDEX idx_email (mail_addr)</p>
                <p>);</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Configuration Workflow Card */}
      <Card className="backdrop-blur-lg bg-cyan-500/5 border-cyan-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/50 flex-shrink-0">
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">⚙️ Recommended Configuration Workflows</h3>
            <p className="text-cyan-300/70 text-sm mb-3">
              Choose the registration configuration that best fits your server's needs:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">🎮 Configuration 1: Fast Registration (Casual Servers)</p>
                <p className="text-cyan-300/70 text-xs mb-2">
                  <strong>Best for:</strong> New servers, casual gameplay, quick player onboarding
                </p>
                <div className="bg-black/50 p-3 rounded space-y-1 text-xs">
                  <p className="text-green-400">✅ Status: <strong>Enabled</strong></p>
                  <p className="text-green-400">✅ Recaptcha v2: <strong>Enabled</strong></p>
                  <p className="text-red-400">❌ Email Verification: <strong>Disabled</strong></p>
                  <p className="text-green-400">✅ Send Welcome Email: <strong>Enabled</strong></p>
                  <p className="text-green-400">✅ Automatic Log-In: <strong>Enabled</strong></p>
                </div>
                <p className="text-cyan-300/70 text-xs mt-2">
                  <strong>User Experience:</strong> Register → reCAPTCHA → Auto-login → Start playing immediately
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">🛡️ Configuration 2: Secure Registration (Competitive Servers)</p>
                <p className="text-cyan-300/70 text-xs mb-2">
                  <strong>Best for:</strong> Competitive servers, anti-bot protection, serious communities
                </p>
                <div className="bg-black/50 p-3 rounded space-y-1 text-xs">
                  <p className="text-green-400">✅ Status: <strong>Enabled</strong></p>
                  <p className="text-green-400">✅ Recaptcha v2: <strong>Enabled</strong></p>
                  <p className="text-green-400">✅ Email Verification: <strong>Enabled</strong></p>
                  <p className="text-green-400">✅ Send Welcome Email: <strong>Enabled</strong></p>
                  <p className="text-yellow-400">⏰ Verification Time Limit: <strong>48 Hours</strong></p>
                  <p className="text-red-400">❌ Automatic Log-In: <strong>Disabled</strong></p>
                </div>
                <p className="text-cyan-300/70 text-xs mt-2">
                  <strong>User Experience:</strong> Register → reCAPTCHA → Verify email within 48h → Login → Start playing
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">🔒 Configuration 3: Maximum Security (High-Stakes Servers)</p>
                <p className="text-cyan-300/70 text-xs mb-2">
                  <strong>Best for:</strong> Pay-to-play servers, high-value items, exclusive communities
                </p>
                <div className="bg-black/50 p-3 rounded space-y-1 text-xs">
                  <p className="text-green-400">✅ Status: <strong>Enabled</strong></p>
                  <p className="text-green-400">✅ Recaptcha v2: <strong>Enabled</strong></p>
                  <p className="text-green-400">✅ Email Verification: <strong>Enabled</strong></p>
                  <p className="text-green-400">✅ Send Welcome Email: <strong>Enabled</strong></p>
                  <p className="text-yellow-400">⏰ Verification Time Limit: <strong>24 Hours</strong></p>
                  <p className="text-red-400">❌ Automatic Log-In: <strong>Disabled</strong></p>
                  <p className="text-cyan-300/70">+ Additional: Rate limiting, IP monitoring, disposable email blocking</p>
                </div>
                <p className="text-cyan-300/70 text-xs mt-2">
                  <strong>User Experience:</strong> Register → reCAPTCHA → Verify email within 24h → Manual login → Additional checks → Approved access
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-red-500/20">
                <p className="text-red-300 font-semibold text-sm mb-2">🚫 Configuration 4: Closed Registration (Invitation Only)</p>
                <p className="text-red-300/70 text-xs mb-2">
                  <strong>Best for:</strong> Beta testing, private servers, maintenance periods
                </p>
                <div className="bg-black/50 p-3 rounded space-y-1 text-xs">
                  <p className="text-red-400">❌ Status: <strong>Disabled</strong></p>
                  <p className="text-gray-400">⚪ All other settings: <strong>Inactive</strong></p>
                </div>
                <p className="text-red-300/70 text-xs mt-2">
                  <strong>User Experience:</strong> Registration page shows "Registrations are currently closed" message
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
