import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle, XCircle, Save, Send } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface ContactConfig {
  active: number;
  subject: string;
  sendto: string;
}

export function ContactSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<ContactConfig>({
    active: 1,
    subject: 'MeuMU Online - Contact Form',
    sendto: 'admin@meumuonline.com',
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

      console.log('💾 Saving Contact Us Settings...');
      console.log('📄 XML Path: module_configs/contact.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        subject: settings.setting_2,
        sendto: settings.setting_3,
      });

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        subject: settings.setting_2 as string,
        sendto: settings.setting_3 as string,
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
        <h2 className="text-3xl text-white mb-2">Contact Us Settings</h2>
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
                      Enable/disable the contact module.
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

              {/* Email Subject */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Email Subject</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_2"
                    defaultValue={config.subject}
                    placeholder="e.g., MeuMU Online - Contact Form"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Send Emails To */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Send Emails To</div>
                    <div className="text-gray-400 text-sm font-normal"></div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_3"
                    defaultValue={config.sendto}
                    placeholder="admin@example.com"
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
            <h3 className="text-white font-semibold mb-2">Contact Us Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the Contact Us form that allows visitors to send messages to the server administration.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Status:</strong> Enable or disable the contact form module</li>
              <li><strong>Email Subject:</strong> Subject line for emails received from the contact form</li>
              <li><strong>Send Emails To:</strong> Email address where contact form submissions will be sent</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/contact.xml</code></li>
              <li>The contact form allows players to reach server admins for support, questions, or reports</li>
              <li>Make sure the email address is monitored regularly to respond to player inquiries</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
