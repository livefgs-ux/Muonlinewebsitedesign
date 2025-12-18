import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle, XCircle, Save, Server, Lock } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface EmailConfig {
  active: number;
  send_from: string;
  send_name: string;
  smtp_active: number;
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass: string;
}

export function EmailSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<EmailConfig>({
    active: 1,
    send_from: 'noreply@meumuonline.com',
    send_name: 'MeuMU Online',
    smtp_active: 1,
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_user: 'your-email@gmail.com',
    smtp_pass: 'your-app-password',
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
    for (let i = 1; i <= 8; i++) {
      settings[`setting_${i}`] = formData.get(`setting_${i}`);
    }

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving Email Settings...');
      console.log('📄 XML Path: configs/email.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        send_from: settings.setting_2,
        send_name: settings.setting_3,
        smtp_active: Number(settings.setting_4),
        smtp_host: settings.setting_5,
        smtp_port: settings.setting_6,
        smtp_user: settings.setting_7,
        smtp_pass: settings.setting_8,
      });

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        send_from: settings.setting_2 as string,
        send_name: settings.setting_3 as string,
        smtp_active: Number(settings.setting_4),
        smtp_host: settings.setting_5 as string,
        smtp_port: settings.setting_6 as string,
        smtp_user: settings.setting_7 as string,
        smtp_pass: settings.setting_8 as string,
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
        <h1 className="text-4xl text-white mb-2">Email Settings</h1>
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
              {/* Email System */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20" style={{ width: '40%' }}>
                  <div>
                    <div className="text-white font-medium mb-1">Email System</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enable/disable the email system.
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

              {/* Send Email From */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Send Email From</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_2"
                    defaultValue={config.send_from}
                    placeholder="noreply@example.com"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Send Email From Name */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Send Email From Name</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_3"
                    defaultValue={config.send_name}
                    placeholder="Server Name"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* SMTP Status */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">SMTP Status</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enable/disable the SMTP system.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_4"
                        value="1"
                        defaultChecked={config.smtp_active === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_4"
                        value="0"
                        defaultChecked={config.smtp_active === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* SMTP Host */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">SMTP Host</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_5"
                    defaultValue={config.smtp_host}
                    placeholder="smtp.gmail.com"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* SMTP Port */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">SMTP Port</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_6"
                    defaultValue={config.smtp_port}
                    placeholder="587"
                    className="w-32 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* SMTP User */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">SMTP User</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_7"
                    defaultValue={config.smtp_user}
                    placeholder="your-email@gmail.com"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* SMTP Password */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">SMTP Password</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_8"
                    defaultValue={config.smtp_pass}
                    placeholder="your-app-password"
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
            <Mail className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Email Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the email system for sending automated emails to players.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Email System:</strong> Enable or disable all email functionality</li>
              <li><strong>Send From:</strong> The email address that appears as sender</li>
              <li><strong>Send From Name:</strong> The display name for the sender</li>
              <li><strong>SMTP:</strong> Use SMTP server for reliable email delivery</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">configs/email.xml</code></li>
              <li>Used for account verification, password resets, and notifications</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* SMTP Info Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Server className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">SMTP Configuration Guide</h3>
            <p className="text-indigo-300/70 text-sm mb-2">
              Configure SMTP for reliable email delivery through external email providers.
            </p>
            <div className="space-y-3 mt-3">
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">Gmail SMTP</p>
                <ul className="text-indigo-300/70 text-xs space-y-1">
                  <li>• Host: <code className="bg-black/50 px-1 py-0.5 rounded">smtp.gmail.com</code></li>
                  <li>• Port: <code className="bg-black/50 px-1 py-0.5 rounded">587</code> (TLS) or <code className="bg-black/50 px-1 py-0.5 rounded">465</code> (SSL)</li>
                  <li>• User: Your Gmail address</li>
                  <li>• Password: Use App Password (not regular password)</li>
                  <li>• Enable 2-Factor Authentication and generate App Password</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">Other Providers</p>
                <ul className="text-indigo-300/70 text-xs space-y-1">
                  <li>• <strong>Outlook:</strong> smtp-mail.outlook.com:587</li>
                  <li>• <strong>Yahoo:</strong> smtp.mail.yahoo.com:465</li>
                  <li>• <strong>SendGrid:</strong> smtp.sendgrid.net:587</li>
                  <li>• <strong>Mailgun:</strong> smtp.mailgun.org:587</li>
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
            <Lock className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">⚠️ Security Important</h3>
            <ul className="text-yellow-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Always use <strong>App Passwords</strong> instead of regular passwords for Gmail</li>
              <li>Never share your SMTP credentials with anyone</li>
              <li>Use TLS/SSL encryption (port 587 or 465) for secure connections</li>
              <li>Test email functionality after configuration changes</li>
              <li>Monitor email sending limits imposed by your provider</li>
              <li>Keep your SMTP password secure and change it periodically</li>
              <li>Some hosting providers may block outgoing SMTP ports - check with your host</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
