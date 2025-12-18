import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, CheckCircle, XCircle, Save, Info, AlertTriangle, Shield, DollarSign } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface PayPalConfig {
  active: number;
  paypal_enable_sandbox: number;
  paypal_email: string;
  paypal_title: string;
  paypal_currency: string;
  paypal_return_url: string;
  paypal_notify_url: string;
  paypal_conversion_rate: string;
  credit_config: string;
}

export function PayPalSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<PayPalConfig>({
    active: 1,
    paypal_enable_sandbox: 0,
    paypal_email: 'donations@muserver.com',
    paypal_title: 'Donation for MU Credits',
    paypal_currency: 'USD',
    paypal_return_url: 'http://yourwebsite.com/donate',
    paypal_notify_url: 'http://yourwebsite.com/api/paypal.php',
    paypal_conversion_rate: '100',
    credit_config: '1',
  });

  // Mock credit configurations - would come from database in production
  const creditConfigs = [
    { id: '1', name: 'WCoin (C)' },
    { id: '2', name: 'WCoin (P)' },
    { id: '3', name: 'GoblinPoint' },
    { id: '4', name: 'Credits Column' },
  ];

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

    // Get all settings (setting_2 to setting_10)
    for (let i = 2; i <= 10; i++) {
      settings[`setting_${i}`] = formData.get(`setting_${i}`);
    }

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving PayPal Settings...');
      console.log('📄 XML Path: module_configs/donation.paypal.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_2),
        paypal_enable_sandbox: Number(settings.setting_3),
        paypal_email: settings.setting_4,
        paypal_title: settings.setting_5,
        paypal_currency: settings.setting_6,
        paypal_return_url: settings.setting_7,
        paypal_notify_url: settings.setting_8,
        paypal_conversion_rate: settings.setting_9,
        credit_config: settings.setting_10,
      });

      // Update state
      setConfig({
        active: Number(settings.setting_2),
        paypal_enable_sandbox: Number(settings.setting_3),
        paypal_email: settings.setting_4 as string,
        paypal_title: settings.setting_5 as string,
        paypal_currency: settings.setting_6 as string,
        paypal_return_url: settings.setting_7 as string,
        paypal_notify_url: settings.setting_8 as string,
        paypal_conversion_rate: settings.setting_9 as string,
        credit_config: settings.setting_10 as string,
      });

      setMessage({
        type: 'success',
        text: '[PayPal] Settings successfully saved.',
      });

      console.log('✅ Settings saved successfully');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      setMessage({
        type: 'error',
        text: error.message === 'Missing data (complete all fields).' 
          ? error.message 
          : '[PayPal] There has been an error while saving changes.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">PayPal Settings</h1>
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
                      Enable/disable the paypal donation gateway.
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
                        defaultChecked={config.active === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="0"
                        defaultChecked={config.active === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* PayPal Sandbox Mode */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">PayPal Sandbox Mode</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enable/disable PayPal's IPN testing mode.
                      <br /><br />
                      More info:<br />
                      <a 
                        href="https://developer.paypal.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 underline"
                      >
                        https://developer.paypal.com/
                      </a>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_3"
                        value="1"
                        defaultChecked={config.paypal_enable_sandbox === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_3"
                        value="0"
                        defaultChecked={config.paypal_enable_sandbox === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* PayPal Email */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">PayPal Email</div>
                    <div className="text-gray-400 text-sm font-normal">
                      PayPal email where you will receive the donations.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_4"
                    defaultValue={config.paypal_email}
                    placeholder="donations@yourserver.com"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* PayPal Donations Title */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">PayPal Donations Title</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Title of the PayPal donation. Example: "Donation for MU Credits".
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_5"
                    defaultValue={config.paypal_title}
                    placeholder="Donation for MU Credits"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Currency Code */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Currency Code</div>
                    <div className="text-gray-400 text-sm font-normal">
                      List of available PayPal currencies:{' '}
                      <a 
                        href="https://cms.paypal.com/uk/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_currency_codes" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 underline"
                      >
                        click here
                      </a>.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_6"
                    defaultValue={config.paypal_currency}
                    placeholder="USD"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Return/Cancel URL */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Return/Cancel URL</div>
                    <div className="text-gray-400 text-sm font-normal">
                      URL where the client will be redirected to if the donation is cancelled or completed.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_7"
                    defaultValue={config.paypal_return_url}
                    placeholder="http://yourwebsite.com/donate"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* IPN Notify URL */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">IPN Notify URL</div>
                    <div className="text-gray-400 text-sm font-normal">
                      URL of WebEngine's PayPal API.
                      <br /><br />
                      By default it has to be in: <strong className="text-white">http://YOURWEBSITE.COM/api/paypal.php</strong>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_8"
                    defaultValue={config.paypal_notify_url}
                    placeholder="http://yourwebsite.com/api/paypal.php"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Credits Conversion Rate */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Credits Conversion Rate</div>
                    <div className="text-gray-400 text-sm font-normal">
                      How many game credits is equivalent to 1 of real money currency.
                      <br /><br />
                      Example:<br />
                      1 USD = 100 Credits, in this example you would type in the box 100.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_9"
                    defaultValue={config.paypal_conversion_rate}
                    placeholder="100"
                    className="w-32 px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Credit Configuration */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Credit Configuration</div>
                    <div className="text-gray-400 text-sm font-normal">
                      
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <select
                    name="setting_10"
                    defaultValue={config.credit_config}
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  >
                    {creditConfigs.map((creditConfig) => (
                      <option key={creditConfig.id} value={creditConfig.id}>
                        {creditConfig.name}
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
            <CreditCard className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">PayPal Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure PayPal as a donation gateway to accept payments and automatically credit player accounts.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Status:</strong> Enable or disable the PayPal donation gateway</li>
              <li><strong>Sandbox Mode:</strong> Use PayPal's test environment for development/testing</li>
              <li><strong>PayPal Email:</strong> The email address that will receive donation payments</li>
              <li><strong>Donations Title:</strong> Description shown on PayPal checkout page</li>
              <li><strong>Currency Code:</strong> 3-letter currency code (USD, EUR, GBP, etc.)</li>
              <li><strong>Return/Cancel URL:</strong> Where users are redirected after payment</li>
              <li><strong>IPN Notify URL:</strong> Webhook endpoint for PayPal to send payment notifications</li>
              <li><strong>Conversion Rate:</strong> How many in-game credits per 1 unit of real currency</li>
              <li><strong>Credit Configuration:</strong> Which credit system column to use (WCoin C/P, GoblinPoint, etc.)</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/donation.paypal.xml</code></li>
            </ul>
          </div>
        </div>
      </Card>

      {/* PayPal IPN Setup Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">PayPal IPN (Instant Payment Notification) Setup</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              IPN is PayPal's system for automatically notifying your server when a payment is completed:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/50">
                    <span className="text-indigo-300 text-sm font-bold">1</span>
                  </div>
                  <p className="text-indigo-300 font-semibold">Player Makes Donation</p>
                </div>
                <p className="text-indigo-300/70 text-sm ml-11">
                  Player clicks donate button and completes payment on PayPal
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/50">
                    <span className="text-indigo-300 text-sm font-bold">2</span>
                  </div>
                  <p className="text-indigo-300 font-semibold">PayPal Sends IPN</p>
                </div>
                <p className="text-indigo-300/70 text-sm ml-11">
                  PayPal automatically sends payment data to your IPN Notify URL
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/50">
                    <span className="text-indigo-300 text-sm font-bold">3</span>
                  </div>
                  <p className="text-indigo-300 font-semibold">Server Verifies Payment</p>
                </div>
                <p className="text-indigo-300/70 text-sm ml-11">
                  WebEngine validates the IPN data with PayPal to prevent fraud
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                    <span className="text-green-300 text-sm font-bold">4</span>
                  </div>
                  <p className="text-green-300 font-semibold">Credits Added to Account</p>
                </div>
                <p className="text-green-300/70 text-sm ml-11">
                  After verification, credits are automatically added to the player's account
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sandbox Mode Card */}
      <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50 flex-shrink-0">
            <Shield className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">🧪 PayPal Sandbox Testing Mode</h3>
            <p className="text-yellow-300/70 text-sm mb-3">
              Sandbox mode allows you to test donations without real money transactions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">✅ When to Enable Sandbox</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>During development and testing</li>
                  <li>Before launching your server</li>
                  <li>Testing new configurations</li>
                  <li>Training staff on donation process</li>
                  <li>Debugging IPN issues</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">❌ When to Disable Sandbox</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>When going live/production</li>
                  <li>Accepting real donations</li>
                  <li>After testing is complete</li>
                  <li>Ready to receive real payments</li>
                  <li><strong>ALWAYS disable in production!</strong></li>
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-300 font-semibold text-sm mb-2">🔧 How to Use Sandbox Mode</p>
              <ol className="text-yellow-300/70 text-xs space-y-1 list-decimal list-inside">
                <li>Create a PayPal Developer account at <a href="https://developer.paypal.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline">developer.paypal.com</a></li>
                <li>Create test buyer and seller accounts in the sandbox dashboard</li>
                <li>Enable Sandbox Mode in this settings page</li>
                <li>Use sandbox test accounts to make test donations</li>
                <li>Verify credits are added correctly</li>
                <li>Disable Sandbox Mode before going live!</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>

      {/* Currency Codes Card */}
      <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50 flex-shrink-0">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">💰 Common Currency Codes</h3>
            <p className="text-green-300/70 text-sm mb-3">
              Use these 3-letter ISO currency codes. Full list available at{' '}
              <a 
                href="https://cms.paypal.com/uk/cgi-bin/?cmd=_render-content&content_ID=developer/e_howto_api_nvp_currency_codes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-400 underline"
              >
                PayPal Currency Codes
              </a>:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-black/30 p-2 rounded border border-green-500/20 text-center">
                <p className="text-green-300 font-bold text-sm">USD</p>
                <p className="text-green-300/70 text-xs">US Dollar</p>
              </div>
              <div className="bg-black/30 p-2 rounded border border-green-500/20 text-center">
                <p className="text-green-300 font-bold text-sm">EUR</p>
                <p className="text-green-300/70 text-xs">Euro</p>
              </div>
              <div className="bg-black/30 p-2 rounded border border-green-500/20 text-center">
                <p className="text-green-300 font-bold text-sm">GBP</p>
                <p className="text-green-300/70 text-xs">British Pound</p>
              </div>
              <div className="bg-black/30 p-2 rounded border border-green-500/20 text-center">
                <p className="text-green-300 font-bold text-sm">BRL</p>
                <p className="text-green-300/70 text-xs">Brazilian Real</p>
              </div>
              <div className="bg-black/30 p-2 rounded border border-green-500/20 text-center">
                <p className="text-green-300 font-bold text-sm">CAD</p>
                <p className="text-green-300/70 text-xs">Canadian Dollar</p>
              </div>
              <div className="bg-black/30 p-2 rounded border border-green-500/20 text-center">
                <p className="text-green-300 font-bold text-sm">AUD</p>
                <p className="text-green-300/70 text-xs">Australian Dollar</p>
              </div>
              <div className="bg-black/30 p-2 rounded border border-green-500/20 text-center">
                <p className="text-green-300 font-bold text-sm">MXN</p>
                <p className="text-green-300/70 text-xs">Mexican Peso</p>
              </div>
              <div className="bg-black/30 p-2 rounded border border-green-500/20 text-center">
                <p className="text-green-300 font-bold text-sm">JPY</p>
                <p className="text-green-300/70 text-xs">Japanese Yen</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Important Notes Card */}
      <Card className="backdrop-blur-lg bg-red-500/5 border-red-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/50 flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">⚠️ Important Configuration Notes</h3>
            <ul className="text-red-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>IPN URL Must Be Publicly Accessible:</strong> PayPal cannot reach localhost or private IPs</li>
              <li><strong>HTTPS Recommended:</strong> Use SSL/TLS for security (https:// instead of http://)</li>
              <li><strong>Verify PayPal Email:</strong> Must match the email in your PayPal Business account</li>
              <li><strong>Test with Sandbox First:</strong> ALWAYS test with sandbox before accepting real payments</li>
              <li><strong>IPN URL Format:</strong> Must be exactly <code className="bg-black/50 px-2 py-1 rounded text-xs">http://YOURWEBSITE.COM/api/paypal.php</code></li>
              <li><strong>Disable Sandbox in Production:</strong> Never leave sandbox mode enabled on live server!</li>
              <li><strong>Check PayPal Logs:</strong> Monitor PayPal IPN history for failed notifications</li>
              <li><strong>Server PHP Requirements:</strong> Server must support cURL for IPN verification</li>
              <li><strong>Conversion Rate Examples:</strong> $1 = 100 credits (enter 100), $1 = 50 credits (enter 50)</li>
              <li><strong>Return URL:</strong> Should be a friendly thank you page on your website</li>
              <li><strong>Credit Configuration:</strong> Choose correct column based on your server setup</li>
              <li><strong>Backup Configuration:</strong> Save these settings before making changes</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Example Configuration Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Info className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">📋 Example Configuration</h3>
            <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
              <p className="text-purple-300 font-semibold mb-2">Production Server Example:</p>
              <div className="space-y-1 text-purple-300/70 text-sm font-mono">
                <p>• <strong>Status:</strong> Enabled</p>
                <p>• <strong>Sandbox Mode:</strong> Disabled</p>
                <p>• <strong>PayPal Email:</strong> donations@muserver.com</p>
                <p>• <strong>Donations Title:</strong> Donation for MU Online Credits</p>
                <p>• <strong>Currency Code:</strong> USD</p>
                <p>• <strong>Return URL:</strong> https://muserver.com/donate/thanks</p>
                <p>• <strong>IPN Notify URL:</strong> https://muserver.com/api/paypal.php</p>
                <p>• <strong>Conversion Rate:</strong> 100 (1 USD = 100 Credits)</p>
                <p>• <strong>Credit Config:</strong> WCoin (C)</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
