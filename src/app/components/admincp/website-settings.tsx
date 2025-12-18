import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, CheckCircle, XCircle, Save, Info, Settings, Shield, Languages, Users, Link, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface WebsiteConfig {
  system_active: boolean;
  error_reporting: boolean;
  website_template: string;
  maintenance_page: string;
  server_name: string;
  website_title: string;
  website_meta_description: string;
  website_meta_keywords: string;
  website_forum_link: string;
  server_files: string;
  language_switch_active: boolean;
  language_default: string;
  language_debug: boolean;
  plugins_system_enable: boolean;
  ip_block_system_enable: boolean;
  player_profiles: boolean;
  guild_profiles: boolean;
  username_min_len: number;
  username_max_len: number;
  password_min_len: number;
  password_max_len: number;
  cron_api: boolean;
  cron_api_key: string;
  social_link_facebook: string;
  social_link_instagram: string;
  social_link_discord: string;
  server_info_season: string;
  server_info_exp: string;
  server_info_masterexp: string;
  server_info_drop: string;
  maximum_online: string;
}

// Mock available templates
const availableTemplplates = [
  'default',
  'darkmode',
  'responsive',
];

// Mock server files compatibility
const fileCompatibility: Record<string, { name: string }> = {
  'igcn_75': { name: 'IGCN v0.75 (Season 1~4)' },
  'igcn_93': { name: 'IGCN v0.93 (Season 5~7)' },
  'igcn_97d7': { name: 'IGCN v0.97d+7 (Season 8~13)' },
  'webzen_97d9': { name: 'Webzen v0.97d+9 (Season 14~18)' },
  'webzen_19x': { name: 'Webzen 1.19.x (Season 19+)' },
};

// Mock available languages
const availableLanguages = [
  'English',
  'Portuguese',
  'Spanish',
  'Russian',
  'Turkish',
  'Polish',
  'German',
  'French',
];

export function WebsiteSettings() {
  // Mock current configuration - would come from webengine.json in production
  const [config, setConfig] = useState<WebsiteConfig>({
    system_active: true,
    error_reporting: false,
    website_template: 'default',
    maintenance_page: 'https://example.com/maintenance',
    server_name: 'MeuMU Online',
    website_title: 'MeuMU Online - Season 19 Epic Server',
    website_meta_description: 'Best MU Online private server with high rates, custom events, and active community.',
    website_meta_keywords: 'mu online, private server, mmorpg, season 19, epic server',
    website_forum_link: 'https://example.com/forum',
    server_files: 'webzen_19x',
    language_switch_active: true,
    language_default: 'English',
    language_debug: false,
    plugins_system_enable: true,
    ip_block_system_enable: true,
    player_profiles: true,
    guild_profiles: true,
    username_min_len: 4,
    username_max_len: 10,
    password_min_len: 4,
    password_max_len: 20,
    cron_api: true,
    cron_api_key: '123456789abcdef',
    social_link_facebook: 'https://facebook.com/yourserver',
    social_link_instagram: 'https://instagram.com/yourserver',
    social_link_discord: 'https://discord.gg/yourserver',
    server_info_season: 'Season 19-2-3 Épico',
    server_info_exp: '1000x',
    server_info_masterexp: '500x',
    server_info_drop: '50%',
    maximum_online: '1000',
  });

  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateUnsignedNumber = (value: any): boolean => {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    const formData = new FormData(e.currentTarget);

    try {
      // Validate system_active
      const systemActive = formData.get('system_active');
      if (!['0', '1'].includes(String(systemActive))) {
        throw new Error('Invalid Website Status setting.');
      }

      // Validate error_reporting
      const errorReporting = formData.get('error_reporting');
      if (!['0', '1'].includes(String(errorReporting))) {
        throw new Error('Invalid Error Reporting setting.');
      }

      // Validate website_template
      const websiteTemplate = String(formData.get('website_template'));
      if (!availableTemplplates.includes(websiteTemplate)) {
        throw new Error('The selected template doesn\'t exist.');
      }

      // Validate maintenance_page
      const maintenancePage = String(formData.get('maintenance_page'));
      if (!validateUrl(maintenancePage)) {
        throw new Error('The maintenance page setting is not a valid URL.');
      }

      // Validate forum link
      const forumLink = String(formData.get('website_forum_link'));
      if (!validateUrl(forumLink)) {
        throw new Error('The forum link setting is not a valid URL.');
      }

      // Validate server_files
      const serverFiles = String(formData.get('server_files'));
      if (!Object.keys(fileCompatibility).includes(serverFiles)) {
        throw new Error('Invalid Server Files setting.');
      }

      // Validate language_switch_active
      const languageSwitchActive = formData.get('language_switch_active');
      if (!['0', '1'].includes(String(languageSwitchActive))) {
        throw new Error('Invalid Language Switch setting.');
      }

      // Validate language_default
      const languageDefault = String(formData.get('language_default'));
      if (!availableLanguages.includes(languageDefault)) {
        throw new Error('The default language doesn\'t exist.');
      }

      // Validate language_debug
      const languageDebug = formData.get('language_debug');
      if (!['0', '1'].includes(String(languageDebug))) {
        throw new Error('Invalid Language Debug setting.');
      }

      // Validate plugins_system_enable
      const pluginsSystemEnable = formData.get('plugins_system_enable');
      if (!['0', '1'].includes(String(pluginsSystemEnable))) {
        throw new Error('Invalid Plugin System setting.');
      }

      // Validate ip_block_system_enable
      const ipBlockSystemEnable = formData.get('ip_block_system_enable');
      if (!['0', '1'].includes(String(ipBlockSystemEnable))) {
        throw new Error('Invalid IP Block System setting.');
      }

      // Validate player_profiles
      const playerProfiles = formData.get('player_profiles');
      if (!['0', '1'].includes(String(playerProfiles))) {
        throw new Error('Invalid setting (player_profiles)');
      }

      // Validate guild_profiles
      const guildProfiles = formData.get('guild_profiles');
      if (!['0', '1'].includes(String(guildProfiles))) {
        throw new Error('Invalid setting (guild_profiles)');
      }

      // Validate username_min_len
      const usernameMinLen = formData.get('username_min_len');
      if (!validateUnsignedNumber(usernameMinLen)) {
        throw new Error('Invalid setting (username_min_len)');
      }

      // Validate username_max_len
      const usernameMaxLen = formData.get('username_max_len');
      if (!validateUnsignedNumber(usernameMaxLen)) {
        throw new Error('Invalid setting (username_max_len)');
      }

      // Validate password_min_len
      const passwordMinLen = formData.get('password_min_len');
      if (!validateUnsignedNumber(passwordMinLen)) {
        throw new Error('Invalid setting (password_min_len)');
      }

      // Validate password_max_len
      const passwordMaxLen = formData.get('password_max_len');
      if (!validateUnsignedNumber(passwordMaxLen)) {
        throw new Error('Invalid setting (password_max_len)');
      }

      // Validate cron_api
      const cronApi = formData.get('cron_api');
      if (!['0', '1'].includes(String(cronApi))) {
        throw new Error('Invalid setting (cron_api)');
      }

      // Validate social links (optional, but if provided must be valid)
      const facebookLink = String(formData.get('social_link_facebook'));
      if (facebookLink && !validateUrl(facebookLink)) {
        throw new Error('The facebook link setting is not a valid URL.');
      }

      const instagramLink = String(formData.get('social_link_instagram'));
      if (instagramLink && !validateUrl(instagramLink)) {
        throw new Error('The instagram link setting is not a valid URL.');
      }

      const discordLink = String(formData.get('social_link_discord'));
      if (discordLink && !validateUrl(discordLink)) {
        throw new Error('The discord link setting is not a valid URL.');
      }

      // Validate maximum_online (optional)
      const maximumOnline = String(formData.get('maximum_online'));
      if (maximumOnline && !validateUnsignedNumber(maximumOnline)) {
        throw new Error('Invalid setting (maximum_online)');
      }

      console.log('💾 Saving Website Settings...');
      console.log('📄 File Path: configs/webengine.json');
      console.log('⚙️ All Settings:', Object.fromEntries(formData));

      // Update state
      setConfig({
        system_active: systemActive === '1',
        error_reporting: errorReporting === '1',
        website_template: websiteTemplate,
        maintenance_page: maintenancePage,
        server_name: String(formData.get('server_name')),
        website_title: String(formData.get('website_title')),
        website_meta_description: String(formData.get('website_meta_description')),
        website_meta_keywords: String(formData.get('website_meta_keywords')),
        website_forum_link: forumLink,
        server_files: serverFiles,
        language_switch_active: languageSwitchActive === '1',
        language_default: languageDefault,
        language_debug: languageDebug === '1',
        plugins_system_enable: pluginsSystemEnable === '1',
        ip_block_system_enable: ipBlockSystemEnable === '1',
        player_profiles: playerProfiles === '1',
        guild_profiles: guildProfiles === '1',
        username_min_len: Number(usernameMinLen),
        username_max_len: Number(usernameMaxLen),
        password_min_len: Number(passwordMinLen),
        password_max_len: Number(passwordMaxLen),
        cron_api: cronApi === '1',
        cron_api_key: String(formData.get('cron_api_key')),
        social_link_facebook: facebookLink,
        social_link_instagram: instagramLink,
        social_link_discord: discordLink,
        server_info_season: String(formData.get('server_info_season')),
        server_info_exp: String(formData.get('server_info_exp')),
        server_info_masterexp: String(formData.get('server_info_masterexp')),
        server_info_drop: String(formData.get('server_info_drop')),
        maximum_online: maximumOnline,
      });

      setMessage({
        type: 'success',
        text: 'Settings successfully saved!',
      });

      console.log('✅ Settings saved successfully to webengine.json');
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
        <h1 className="text-4xl text-white mb-2">Website Settings</h1>
        <p className="text-gray-400">Configure your website's core settings and behavior</p>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {/* === SYSTEM SETTINGS === */}
                
                {/* Website Status */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20" style={{ width: '45%' }}>
                    <div>
                      <div className="text-white font-medium mb-1">Website Status</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Enables/disables your website. If disabled, visitors will be redirected to the maintenance page.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="system_active"
                          value="1"
                          defaultChecked={config.system_active}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-white">Enabled</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="system_active"
                          value="0"
                          defaultChecked={!config.system_active}
                          className="w-4 h-4 text-red-500"
                        />
                        <span className="text-white">Disabled</span>
                      </label>
                    </div>
                  </td>
                </tr>

                {/* Debug Mode */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Debug Mode</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Debugging mode, enable this setting only if you want the website to display any errors.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="error_reporting"
                          value="1"
                          defaultChecked={config.error_reporting}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-white">Enabled</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="error_reporting"
                          value="0"
                          defaultChecked={!config.error_reporting}
                          className="w-4 h-4 text-red-500"
                        />
                        <span className="text-white">Disabled</span>
                      </label>
                    </div>
                  </td>
                </tr>

                {/* Default Template */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Default Template</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Your website's default template.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="website_template"
                      defaultValue={config.website_template}
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Maintenance Page URL */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Maintenance Page Url</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Full URL address to your website's maintenance page. Visitors are redirected to your maintenance page when the website is disabled.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="url"
                      name="maintenance_page"
                      defaultValue={config.maintenance_page}
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* === BASIC INFORMATION === */}
                
                {/* Server Name */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Server Name</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Your Mu Online server name.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="server_name"
                      defaultValue={config.server_name}
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Website Title */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Website Title</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Your website's title.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="website_title"
                      defaultValue={config.website_title}
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Meta Description */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Meta Description</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Define a description of your server.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="website_meta_description"
                      defaultValue={config.website_meta_description}
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Meta Keywords */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Meta Keywords</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Define keywords for search engines.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="website_meta_keywords"
                      defaultValue={config.website_meta_keywords}
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Forum Link */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Forum Link</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Full URL to your forum.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="url"
                      name="website_forum_link"
                      defaultValue={config.website_forum_link}
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Server Files */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Server Files</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Define your server files for maximum WebEngine compatibility.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <select
                      name="server_files"
                      defaultValue={config.server_files}
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    >
                      {Object.entries(fileCompatibility).map(([value, info]) => (
                        <option key={value} value={value}>
                          {info.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                {/* === LANGUAGE SETTINGS === */}
                
                {/* Language Switching */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Language Switching</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Enables/disables the language switching system.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="language_switch_active"
                          value="1"
                          defaultChecked={config.language_switch_active}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-white">Enabled</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="language_switch_active"
                          value="0"
                          defaultChecked={!config.language_switch_active}
                          className="w-4 h-4 text-red-500"
                        />
                        <span className="text-white">Disabled</span>
                      </label>
                    </div>
                  </td>
                </tr>

                {/* Default Language */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Default Language</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Default language that WebEngine will use.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="language_default"
                      defaultValue={config.language_default}
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Language Debug */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Language Debug</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Enables/disabled language debugging. If enabled, language phrases will be shown in a hover-tip when pointing text with the mouse. Keep disabled in a live website.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="language_debug"
                          value="1"
                          defaultChecked={config.language_debug}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-white">Enabled</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="language_debug"
                          value="0"
                          defaultChecked={!config.language_debug}
                          className="w-4 h-4 text-red-500"
                        />
                        <span className="text-white">Disabled</span>
                      </label>
                    </div>
                  </td>
                </tr>

                {/* === SYSTEM FEATURES === */}
                
                {/* Plugin System Status */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Plugin System Status</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Enables/disables the plugin system.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="plugins_system_enable"
                          value="1"
                          defaultChecked={config.plugins_system_enable}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-white">Enabled</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="plugins_system_enable"
                          value="0"
                          defaultChecked={!config.plugins_system_enable}
                          className="w-4 h-4 text-red-500"
                        />
                        <span className="text-white">Disabled</span>
                      </label>
                    </div>
                  </td>
                </tr>

                {/* IP Block System Status */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">IP Block System Status</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Enables/disables the IP blocking system.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ip_block_system_enable"
                          value="1"
                          defaultChecked={config.ip_block_system_enable}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-white">Enabled</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ip_block_system_enable"
                          value="0"
                          defaultChecked={!config.ip_block_system_enable}
                          className="w-4 h-4 text-red-500"
                        />
                        <span className="text-white">Disabled</span>
                      </label>
                    </div>
                  </td>
                </tr>

                {/* === PROFILE SETTINGS === */}
                
                {/* Player Profile Links */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Player Profile Links</div>
                      <div className="text-gray-400 text-sm font-normal">
                        If enabled, player names will have a link to their public profile.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="player_profiles"
                          value="1"
                          defaultChecked={config.player_profiles}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-white">Enabled</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="player_profiles"
                          value="0"
                          defaultChecked={!config.player_profiles}
                          className="w-4 h-4 text-red-500"
                        />
                        <span className="text-white">Disabled</span>
                      </label>
                    </div>
                  </td>
                </tr>

                {/* Guild Profile Links */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Guild Profile Links</div>
                      <div className="text-gray-400 text-sm font-normal">
                        If enabled, guild names will have a link to their public profile.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="guild_profiles"
                          value="1"
                          defaultChecked={config.guild_profiles}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-white">Enabled</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="guild_profiles"
                          value="0"
                          defaultChecked={!config.guild_profiles}
                          className="w-4 h-4 text-red-500"
                        />
                        <span className="text-white">Disabled</span>
                      </label>
                    </div>
                  </td>
                </tr>

                {/* === VALIDATION SETTINGS === */}
                
                {/* Username Minimum Length */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Username Minimum Length</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      name="username_min_len"
                      defaultValue={config.username_min_len}
                      min="1"
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Username Maximum Length */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Username Maximum Length</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      name="username_max_len"
                      defaultValue={config.username_max_len}
                      min="1"
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Password Minimum Length */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Password Minimum Length</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      name="password_min_len"
                      defaultValue={config.password_min_len}
                      min="1"
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Password Maximum Length */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Password Maximum Length</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      name="password_max_len"
                      defaultValue={config.password_max_len}
                      min="1"
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* === CRON SETTINGS === */}
                
                {/* Cron API */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Cron API</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Enable/disable the cron api.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="cron_api"
                          value="1"
                          defaultChecked={config.cron_api}
                          className="w-4 h-4 text-green-500"
                        />
                        <span className="text-white">Enabled</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="cron_api"
                          value="0"
                          defaultChecked={!config.cron_api}
                          className="w-4 h-4 text-red-500"
                        />
                        <span className="text-white">Disabled</span>
                      </label>
                    </div>
                  </td>
                </tr>

                {/* Cron API Key */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Cron API Key</div>
                      <div className="text-gray-400 text-sm font-normal">
                        <br />Usage:<br />
                        {window.location.origin}/api/cron.php?key=<span className="text-red-400">123456</span>
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="cron_api_key"
                      defaultValue={config.cron_api_key}
                      required
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* === SOCIAL LINKS === */}
                
                {/* Facebook Link */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Facebook Link</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Link to your facebook page.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="url"
                      name="social_link_facebook"
                      defaultValue={config.social_link_facebook}
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Instagram Link */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Instagram Link</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Link to your instagram page.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="url"
                      name="social_link_instagram"
                      defaultValue={config.social_link_instagram}
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Discord Link */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Discord Link</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Link to your discord invitation.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="url"
                      name="social_link_discord"
                      defaultValue={config.social_link_discord}
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* === SERVER INFO === */}
                
                {/* Server Info: Season */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Server Info: Season</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Leave empty to hide this information.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="server_info_season"
                      defaultValue={config.server_info_season}
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Server Info: Experience */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Server Info: Experience</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Leave empty to hide this information.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="server_info_exp"
                      defaultValue={config.server_info_exp}
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Server Info: Master Experience */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Server Info: Master Experience</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Leave empty to hide this information.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="server_info_masterexp"
                      defaultValue={config.server_info_masterexp}
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Server Info: Drop */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Server Info: Drop</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Leave empty to hide this information.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      name="server_info_drop"
                      defaultValue={config.server_info_drop}
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                </tr>

                {/* Maximum Online Players */}
                <tr className="border-b border-gray-700/30">
                  <th className="px-6 py-4 text-left align-top bg-black/20">
                    <div>
                      <div className="text-white font-medium mb-1">Maximum Online Players</div>
                      <div className="text-gray-400 text-sm font-normal">
                        Maximum amount of players that your server may allow. Leave empty to hide this information.
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      name="maximum_online"
                      defaultValue={config.maximum_online}
                      min="0"
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
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
                      Save Settings
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </form>

      {/* Info Card - System Settings */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Website Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure all core settings for your WebEngine CMS website. These settings control the fundamental behavior, appearance, and functionality of your MU Online server website. All settings are stored in <strong>configs/webengine.json</strong>.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">configs/webengine.json</code></li>
              <li><strong>System Settings:</strong> Control website status, debug mode, template, and maintenance page</li>
              <li><strong>Basic Information:</strong> Server name, website title, meta description/keywords for SEO</li>
              <li><strong>Server Files:</strong> Define file compatibility for maximum WebEngine features support</li>
              <li><strong>Language Settings:</strong> Multi-language support with language switching and debugging</li>
              <li><strong>System Features:</strong> Enable/disable plugin system and IP blocking</li>
              <li><strong>Profile Settings:</strong> Control public player and guild profile pages</li>
              <li><strong>Validation Settings:</strong> Username and password length requirements</li>
              <li><strong>Cron Settings:</strong> API for automated scheduled tasks</li>
              <li><strong>Social Links:</strong> Connect your social media pages</li>
              <li><strong>Server Info:</strong> Display server rates and configuration to visitors</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Info Card - Server Files */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Settings className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Server Files Compatibility</h3>
            <p className="text-purple-300/70 text-sm mb-3">
              The Server Files setting is crucial for maximum WebEngine CMS compatibility. Different MU Online server files have different database structures, character class IDs, and item codes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">📁 Available Server Files</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>IGCN v0.75:</strong> Season 1~4 (oldest)</li>
                  <li><strong>IGCN v0.93:</strong> Season 5~7</li>
                  <li><strong>IGCN v0.97d+7:</strong> Season 8~13</li>
                  <li><strong>Webzen v0.97d+9:</strong> Season 14~18</li>
                  <li><strong>Webzen 1.19.x:</strong> Season 19+ (newest)</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">⚙️ What This Affects</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Character class identification</li>
                  <li>Item parsing and display</li>
                  <li>Database structure compatibility</li>
                  <li>Rankings calculation methods</li>
                  <li>Pet and mount support</li>
                  <li>Master level calculations</li>
                  <li>Guild and alliance features</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-300 font-semibold text-sm mb-1">⚠️ Important:</p>
              <p className="text-purple-300/70 text-xs">
                Make sure to select the correct server files version that matches your MU Online server. Using the wrong version may cause rankings, character displays, and other features to malfunction.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Info Card - SEO & Social */}
      <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50 flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">SEO & Social Media Best Practices</h3>
            <p className="text-green-300/70 text-sm mb-3">
              Optimize your website for search engines and social media to attract more players:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">🔍 Meta Description & Keywords</p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Meta Description:</strong> 150-160 characters describing your server</li>
                  <li><strong>Meta Keywords:</strong> Relevant keywords separated by commas</li>
                  <li>Include: "mu online", "private server", your server name, season number</li>
                  <li>Mention unique features: "custom events", "high rates", "active community"</li>
                  <li>Be specific: "Season 19 Epic Server" vs just "MU Server"</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">🔗 Social Media Integration</p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Facebook:</strong> Link to your official page for news and updates</li>
                  <li><strong>Instagram:</strong> Share screenshots and server highlights</li>
                  <li><strong>Discord:</strong> Direct invite link for community chat</li>
                  <li>Keep social links updated and active</li>
                  <li>Cross-promote: mention website on social media</li>
                  <li>Engage with players on all platforms</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-green-500/20">
              <p className="text-green-300 font-semibold text-sm mb-2">💡 Example Meta Tags</p>
              <div className="bg-black/50 p-2 rounded text-xs font-mono">
                <p className="text-green-300/70 mb-1"><strong>Good Description:</strong></p>
                <p className="text-green-300/70 mb-2">"Join MeuMU Online - Season 19 Epic MU Online private server with 1000x EXP, 500x Master EXP, 50% drop rate. Custom events, active community, and professional support. Register now!"</p>
                <p className="text-green-300/70 mb-1"><strong>Good Keywords:</strong></p>
                <p className="text-green-300/70">"mu online, private server, season 19, epic server, high rates, mmorpg, custom events, free to play, meumuonline"</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Info Card - Cron API */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Cron API - Automated Tasks</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              The Cron API allows you to automate scheduled tasks on your WebEngine website:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">⚙️ How Cron API Works</p>
                <p className="text-indigo-300/70 text-xs mb-2">
                  Set up a scheduled task (cron job) on your server to call the API URL at regular intervals:
                </p>
                <div className="bg-black/50 p-2 rounded text-xs font-mono mb-2">
                  <p className="text-indigo-300/70">
                    {window.location.origin}/api/cron.php?key=<span className="text-yellow-400">your_api_key_here</span>
                  </p>
                </div>
                <p className="text-indigo-300/70 text-xs">
                  The API key protects the endpoint from unauthorized access. Keep your API key secret and change it regularly.
                </p>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">📋 Common Automated Tasks</p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Update rankings (top players, guilds, etc.)</li>
                  <li>Calculate Castle Siege schedules</li>
                  <li>Send automated newsletters/announcements</li>
                  <li>Clear expired bans automatically</li>
                  <li>Backup database at regular intervals</li>
                  <li>Reset vote cooldowns</li>
                  <li>Archive old logs and data</li>
                  <li>Check server status and send alerts</li>
                </ul>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">⏰ Setting Up Cron Job (Linux)</p>
                <div className="bg-black/50 p-2 rounded text-xs font-mono">
                  <p className="text-green-300/70 mb-1"># Edit crontab:</p>
                  <p className="text-green-300/70 mb-2">crontab -e</p>
                  <p className="text-green-300/70 mb-1"># Run every 5 minutes:</p>
                  <p className="text-green-300/70 mb-2">*/5 * * * * curl "{window.location.origin}/api/cron.php?key=your_key"</p>
                  <p className="text-green-300/70 mb-1"># Run every hour:</p>
                  <p className="text-green-300/70">0 * * * * curl "{window.location.origin}/api/cron.php?key=your_key"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
