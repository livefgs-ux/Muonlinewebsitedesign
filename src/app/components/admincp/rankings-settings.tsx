import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle, XCircle, Save, Info, Award, Users, Shield, TrendingUp, Star } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface RankingsConfig {
  active: number;
  rankings_results: number;
  rankings_show_date: number;
  rankings_show_default: string;
  rankings_show_place_number: number;
  rankings_enable_level: number;
  rankings_enable_resets: number;
  rankings_enable_pk: number;
  rankings_enable_gr: number;
  rankings_enable_online: number;
  rankings_enable_guilds: number;
  rankings_enable_master: number;
  rankings_enable_gens: number;
  rankings_enable_votes: number;
  rankings_excluded_characters: string;
  combine_level_masterlevel: number;
  show_country_flags: number;
  show_location: number;
  show_online_status: number;
  guild_score_formula: number;
  guild_score_multiplier: number;
  rankings_excluded_guilds: string;
  rankings_class_filter: number;
}

export function RankingsSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<RankingsConfig>({
    active: 1,
    rankings_results: 50,
    rankings_show_date: 1,
    rankings_show_default: 'level',
    rankings_show_place_number: 1,
    rankings_enable_level: 1,
    rankings_enable_resets: 1,
    rankings_enable_pk: 1,
    rankings_enable_gr: 1,
    rankings_enable_online: 1,
    rankings_enable_guilds: 1,
    rankings_enable_master: 1,
    rankings_enable_gens: 1,
    rankings_enable_votes: 1,
    rankings_excluded_characters: '',
    combine_level_masterlevel: 0,
    show_country_flags: 1,
    show_location: 1,
    show_online_status: 1,
    guild_score_formula: 1,
    guild_score_multiplier: 1,
    rankings_excluded_guilds: '',
    rankings_class_filter: 1,
  });

  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

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
    settings.setting_9 = formData.get('setting_9');
    settings.setting_10 = formData.get('setting_10');
    settings.setting_11 = formData.get('setting_11');
    settings.setting_12 = formData.get('setting_12');
    settings.setting_14 = formData.get('setting_14');
    settings.setting_15 = formData.get('setting_15');
    settings.setting_16 = formData.get('setting_16');
    settings.setting_17 = formData.get('setting_17');
    settings.setting_18 = formData.get('setting_18');
    settings.setting_19 = formData.get('setting_19');
    settings.setting_20 = formData.get('setting_20');
    settings.setting_21 = formData.get('setting_21');
    settings.setting_22 = formData.get('setting_22');
    settings.setting_23 = formData.get('setting_23');
    settings.setting_24 = formData.get('setting_24');

    try {
      console.log('💾 Saving Rankings Settings...');
      console.log('📄 XML Path: module_configs/rankings.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        rankings_results: Number(settings.setting_2),
        rankings_show_date: Number(settings.setting_3),
        rankings_show_default: settings.setting_4,
        rankings_show_place_number: Number(settings.setting_5),
        rankings_enable_level: Number(settings.setting_6),
        rankings_enable_resets: Number(settings.setting_7),
        rankings_enable_pk: Number(settings.setting_8),
        rankings_enable_gr: Number(settings.setting_9),
        rankings_enable_online: Number(settings.setting_10),
        rankings_enable_guilds: Number(settings.setting_11),
        rankings_enable_master: Number(settings.setting_12),
        rankings_enable_gens: Number(settings.setting_14),
        rankings_enable_votes: Number(settings.setting_15),
        rankings_excluded_characters: settings.setting_16,
        combine_level_masterlevel: Number(settings.setting_17),
        show_country_flags: Number(settings.setting_18),
        show_location: Number(settings.setting_19),
        show_online_status: Number(settings.setting_20),
        guild_score_formula: Number(settings.setting_21),
        guild_score_multiplier: Number(settings.setting_22),
        rankings_excluded_guilds: settings.setting_23,
        rankings_class_filter: Number(settings.setting_24),
      });
      console.log('🗄️ Database: MySQL');

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        rankings_results: Number(settings.setting_2),
        rankings_show_date: Number(settings.setting_3),
        rankings_show_default: settings.setting_4,
        rankings_show_place_number: Number(settings.setting_5),
        rankings_enable_level: Number(settings.setting_6),
        rankings_enable_resets: Number(settings.setting_7),
        rankings_enable_pk: Number(settings.setting_8),
        rankings_enable_gr: Number(settings.setting_9),
        rankings_enable_online: Number(settings.setting_10),
        rankings_enable_guilds: Number(settings.setting_11),
        rankings_enable_master: Number(settings.setting_12),
        rankings_enable_gens: Number(settings.setting_14),
        rankings_enable_votes: Number(settings.setting_15),
        rankings_excluded_characters: settings.setting_16,
        combine_level_masterlevel: Number(settings.setting_17),
        show_country_flags: Number(settings.setting_18),
        show_location: Number(settings.setting_19),
        show_online_status: Number(settings.setting_20),
        guild_score_formula: Number(settings.setting_21),
        guild_score_multiplier: Number(settings.setting_22),
        rankings_excluded_guilds: settings.setting_23,
        rankings_class_filter: Number(settings.setting_24),
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
        text: 'There has been an error while saving changes.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Rankings Settings</h2>
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
        {/* Main Rankings Settings */}
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden mb-6">
          <table className="w-full">
            <tbody>
              {/* Status */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20" style={{ width: '40%' }}>
                  <div>
                    <div className="text-white font-medium mb-1">Status</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enable/disable the ranking system.
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

              {/* Rankings Results */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Rankings Results</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of ranking results WebEngine should cache.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    name="setting_2"
                    defaultValue={config.rankings_results}
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </td>
              </tr>

              {/* Display Last Update Date */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Display Last Update Date</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Show at the bottom of the rankings the date each ranking was last updated.
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
                        defaultChecked={config.rankings_show_date === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_3"
                        value="0"
                        defaultChecked={config.rankings_show_date === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Default Rankings */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Default Rankings</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Which rankings will be shown by default when accessing to the rankings page.
                      <br /><br />
                      <strong>Options:</strong>
                      <ul className="list-disc list-inside mt-1">
                        <li>level</li>
                        <li>resets</li>
                        <li>killers</li>
                        <li>grandresets</li>
                        <li>online</li>
                        <li>guilds</li>
                        <li>master</li>
                        <li>gens</li>
                      </ul>
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_4"
                    defaultValue={config.rankings_show_default}
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </td>
              </tr>

              {/* Display Position Number */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Display Position Number</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_5"
                        value="1"
                        defaultChecked={config.rankings_show_place_number === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_5"
                        value="0"
                        defaultChecked={config.rankings_show_place_number === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Level Rankings */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Level Rankings</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_6"
                        value="1"
                        defaultChecked={config.rankings_enable_level === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_6"
                        value="0"
                        defaultChecked={config.rankings_enable_level === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Reset Rankings */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Reset Rankings</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_7"
                        value="1"
                        defaultChecked={config.rankings_enable_resets === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_7"
                        value="0"
                        defaultChecked={config.rankings_enable_resets === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Killer Rankings */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Killer Rankings</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_8"
                        value="1"
                        defaultChecked={config.rankings_enable_pk === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_8"
                        value="0"
                        defaultChecked={config.rankings_enable_pk === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Grand Reset Rankings */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Grand Reset Rankings</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_9"
                        value="1"
                        defaultChecked={config.rankings_enable_gr === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_9"
                        value="0"
                        defaultChecked={config.rankings_enable_gr === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Online Rankings */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Online Rankings</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_10"
                        value="1"
                        defaultChecked={config.rankings_enable_online === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_10"
                        value="0"
                        defaultChecked={config.rankings_enable_online === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Master Level Rankings */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Master Level Rankings</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_12"
                        value="1"
                        defaultChecked={config.rankings_enable_master === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_12"
                        value="0"
                        defaultChecked={config.rankings_enable_master === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Gens Rankings */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Gens Rankings</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_14"
                        value="1"
                        defaultChecked={config.rankings_enable_gens === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_14"
                        value="0"
                        defaultChecked={config.rankings_enable_gens === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Vote Rankings */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Vote Rankings</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_15"
                        value="1"
                        defaultChecked={config.rankings_enable_votes === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_15"
                        value="0"
                        defaultChecked={config.rankings_enable_votes === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Exclude Characters */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Exclude Characters</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Add the names of characters (separated by commas) that you want to exclude from showing up in the rankings.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_16"
                    defaultValue={config.rankings_excluded_characters}
                    placeholder="CharacterName1, CharacterName2, ..."
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </td>
              </tr>

              {/* Combine Level + Master Level */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Combine Level + Master Level</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, the player's level and master level will be combined as one in the rankings.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_17"
                        value="1"
                        defaultChecked={config.combine_level_masterlevel === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_17"
                        value="0"
                        defaultChecked={config.combine_level_masterlevel === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Country Flags */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Country Flags</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, the character's country flag will be displayed in the rankings.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_18"
                        value="1"
                        defaultChecked={config.show_country_flags === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_18"
                        value="0"
                        defaultChecked={config.show_country_flags === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Character Last Location */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Character Last Location</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, the character's last known location will be displayed in the rankings.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_19"
                        value="1"
                        defaultChecked={config.show_location === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_19"
                        value="0"
                        defaultChecked={config.show_location === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Character Online Status */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Character Online Status</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, the character's online status will be displayed in the rankings.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_20"
                        value="1"
                        defaultChecked={config.show_online_status === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_20"
                        value="0"
                        defaultChecked={config.show_online_status === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Character Class Filter */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Character Class Filter</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, the character's class filter menu will be displayed in the rankings.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_24"
                        value="1"
                        defaultChecked={config.rankings_class_filter === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_24"
                        value="0"
                        defaultChecked={config.rankings_class_filter === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* Guild Ranking Settings */}
        <h3 className="text-2xl text-white mb-4">Guild Ranking Settings</h3>
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden mb-6">
          <table className="w-full">
            <tbody>
              {/* Guild Rankings */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20" style={{ width: '40%' }}>
                  <div>
                    <div className="text-white font-medium mb-1">Guild Rankings</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_11"
                        value="1"
                        defaultChecked={config.rankings_enable_guilds === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_11"
                        value="0"
                        defaultChecked={config.rankings_enable_guilds === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Guild Score Formula */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Guild Score Formula</div>
                    <div className="text-gray-400 text-sm font-normal">
                      <br />
                      <strong>Original Guild Score:</strong><br />
                      Uses the game's original guild score.<br /><br />
                      <strong>WebEngine CMS Custom 1:</strong><br />
                      Calculates the sum of all guild member's stats and multiplies by the multiplier value.<br /><br />
                      <strong>WebEngine CMS Custom 2:</strong><br />
                      Calculates the sum of all guild member's stats (except Command) and multiplies by the multiplier value.<br /><br />
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <select
                    name="setting_21"
                    defaultValue={config.guild_score_formula}
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  >
                    <option value="1">Original Guild Score</option>
                    <option value="2">WebEngine CMS Custom 1: (STR+AGI+VIT+ENE+CMD) * MULTIPLIER</option>
                    <option value="3">WebEngine CMS Custom 2: (STR+AGI+VIT+ENE) * MULTIPLIER</option>
                  </select>
                </td>
              </tr>

              {/* Multiplier */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Multiplier</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If the score setting is set to one of WebEngine's custom score formulas, use the multiplier to customize how big or small you want the scores to be.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    name="setting_22"
                    defaultValue={config.guild_score_multiplier}
                    step="0.1"
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </td>
              </tr>

              {/* Exclude Guilds */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Exclude Guilds</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Add the names of the guilds (separated by commas) that you want to exclude from showing up in the guilds rankings.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_23"
                    defaultValue={config.rankings_excluded_guilds}
                    placeholder="GuildName1, GuildName2, ..."
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* Submit Button */}
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="px-6 py-4 bg-black/20">
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
            <Trophy className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Rankings Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the comprehensive ranking system that displays top players and guilds from your <strong>MySQL</strong> database.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/rankings.xml</code></li>
              <li>Rankings are automatically cached for better performance</li>
              <li>All data is queried from <strong>MySQL Character and Guild tables</strong></li>
              <li>Supports multiple ranking types (Level, Resets, PK, Grand Resets, Online, Guilds, Master Level, Gens, Votes)</li>
              <li>Class filter allows players to view rankings by character class</li>
              <li>Exclude specific characters or guilds from appearing in rankings</li>
              <li>Display additional information: country flags, location, online status</li>
              <li>Guild rankings support custom score formulas with configurable multipliers</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Ranking Types Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Available Ranking Types</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              Enable or disable individual ranking categories based on your server's features:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">🏆 Level Rankings</p>
                <p className="text-indigo-300/70 text-xs">
                  Top players by character level. Query: <code className="bg-black/50 px-1 py-0.5 rounded text-xs">SELECT * FROM Character ORDER BY cLevel DESC</code>
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">🔄 Reset Rankings</p>
                <p className="text-indigo-300/70 text-xs">
                  Top players by reset count. Tracks how many times players have reset their character.
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">⚔️ Killer Rankings (PK)</p>
                <p className="text-indigo-300/70 text-xs">
                  Top players by Player Kill count. Query: <code className="bg-black/50 px-1 py-0.5 rounded text-xs">SELECT * FROM Character ORDER BY PkCount DESC</code>
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">💎 Grand Reset Rankings</p>
                <p className="text-indigo-300/70 text-xs">
                  Top players by grand reset count. For servers with grand reset system.
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">🟢 Online Rankings</p>
                <p className="text-indigo-300/70 text-xs">
                  Currently online players sorted by level or other criteria. Real-time data from MySQL.
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">🛡️ Guild Rankings</p>
                <p className="text-indigo-300/70 text-xs">
                  Top guilds by score. Query: <code className="bg-black/50 px-1 py-0.5 rounded text-xs">SELECT * FROM Guild ORDER BY G_Score DESC</code>
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">✨ Master Level Rankings</p>
                <p className="text-indigo-300/70 text-xs">
                  Top players by master level. For 3rd class advancement characters.
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">⚡ Gens Rankings</p>
                <p className="text-indigo-300/70 text-xs">
                  Top players by Gens contribution. For servers with Gens system (Duprian/Vanert).
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">🗳️ Vote Rankings</p>
                <p className="text-indigo-300/70 text-xs">
                  Top voters who support the server on voting sites. Encourages community engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Guild Score Formulas Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Guild Score Formula Explained</h3>
            <p className="text-purple-300/70 text-sm mb-3">
              Choose how guild scores are calculated in the rankings:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">1️⃣ Original Guild Score (Default)</p>
                <p className="text-purple-300/70 text-xs mb-2">
                  Uses the game's built-in guild score system. This value is stored in the <strong>MySQL Guild table</strong> and updated by the game server.
                </p>
                <p className="text-purple-300/70 text-xs font-mono bg-black/50 p-2 rounded">
                  Query: SELECT G_Name, G_Score FROM Guild ORDER BY G_Score DESC LIMIT 50
                </p>
                <p className="text-purple-300/70 text-xs mt-2">
                  ✅ <strong>Pros:</strong> Official game mechanic, no custom calculations needed<br />
                  ⚠️ <strong>Cons:</strong> Score formula is controlled by game server settings
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">2️⃣ WebEngine CMS Custom 1: (STR+AGI+VIT+ENE+CMD) × Multiplier</p>
                <p className="text-purple-300/70 text-xs mb-2">
                  Calculates guild score by summing ALL stats (including Command) of all guild members from MySQL Character table, then multiplying by your custom multiplier.
                </p>
                <p className="text-purple-300/70 text-xs font-mono bg-black/50 p-2 rounded mb-2">
                  Formula: SUM(Strength + Dexterity + Vitality + Energy + Leadership) × Multiplier
                </p>
                <p className="text-purple-300/70 text-xs">
                  <strong>Example:</strong> If a guild has 10 members with average 2000 total stats each, and multiplier is 1.5:<br />
                  Score = (10 × 2000) × 1.5 = <strong>30,000 points</strong>
                </p>
                <p className="text-purple-300/70 text-xs mt-2">
                  ✅ <strong>Pros:</strong> Rewards guilds for having strong members<br />
                  ✅ <strong>Pros:</strong> Includes Leadership stat (important for some classes)<br />
                  ⚠️ <strong>Note:</strong> Requires querying all guild member stats from MySQL
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">3️⃣ WebEngine CMS Custom 2: (STR+AGI+VIT+ENE) × Multiplier</p>
                <p className="text-purple-300/70 text-xs mb-2">
                  Same as Custom 1 but <strong>excludes Command/Leadership stat</strong>. Focuses on core combat stats only.
                </p>
                <p className="text-purple-300/70 text-xs font-mono bg-black/50 p-2 rounded mb-2">
                  Formula: SUM(Strength + Dexterity + Vitality + Energy) × Multiplier
                </p>
                <p className="text-purple-300/70 text-xs">
                  <strong>Example:</strong> If a guild has 10 members with average 1800 combat stats each, and multiplier is 2.0:<br />
                  Score = (10 × 1800) × 2.0 = <strong>36,000 points</strong>
                </p>
                <p className="text-purple-300/70 text-xs mt-2">
                  ✅ <strong>Pros:</strong> Focuses on combat effectiveness only<br />
                  ✅ <strong>Pros:</strong> Doesn't give extra advantage to Dark Lord characters<br />
                  ⚠️ <strong>Note:</strong> May be more balanced for PvP-focused servers
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">⚙️ Multiplier Setting</p>
                <p className="text-purple-300/70 text-xs mb-2">
                  The multiplier adjusts the final score to match your preferences:
                </p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Multiplier &lt; 1:</strong> Smaller scores (e.g., 0.5 = half score, easier to read)</li>
                  <li><strong>Multiplier = 1:</strong> Direct sum of stats (no adjustment)</li>
                  <li><strong>Multiplier &gt; 1:</strong> Larger scores (e.g., 2.0 = double score, more impressive numbers)</li>
                  <li><strong>Decimal values:</strong> Fine-tune scoring (e.g., 1.25, 0.75, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance & Best Practices Card */}
      <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50 flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Performance & Best Practices (MySQL)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">✅ Caching Strategy</p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Rankings Results:</strong> Set to 50-100 for optimal performance</li>
                  <li>Rankings are cached and updated via cron jobs</li>
                  <li>Reduces MySQL query load on the database</li>
                  <li>Display "Last Updated" date for transparency</li>
                  <li>Cache updates every 5-15 minutes recommended</li>
                  <li>Larger values = more memory but better UX</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">🗄️ MySQL Optimization</p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Add indexes on frequently queried columns (cLevel, PkCount)</li>
                  <li>Use LIMIT clause to restrict result count</li>
                  <li>Consider MySQL query caching for rankings</li>
                  <li>Use prepared statements for security</li>
                  <li>Monitor slow query log for optimization</li>
                  <li>Regular OPTIMIZE TABLE on Character and Guild tables</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">🎯 Display Options</p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Position Numbers:</strong> Show #1, #2, #3 rankings</li>
                  <li><strong>Country Flags:</strong> Visual appeal, shows player diversity</li>
                  <li><strong>Location:</strong> Last map visited (e.g., "Lorencia", "Devias")</li>
                  <li><strong>Online Status:</strong> Green dot for currently online players</li>
                  <li><strong>Class Filter:</strong> Let players filter by DW, DK, ELF, etc.</li>
                  <li>Combine Level+ML for Season 6+ servers</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">⚠️ Exclusion Lists</p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Exclude GM/Admin characters from rankings</li>
                  <li>Exclude test characters or bots</li>
                  <li>Exclude inactive guilds (disbanded or empty)</li>
                  <li>Use comma-separated names (case-sensitive)</li>
                  <li>Example: "GameMaster, Admin, TestChar"</li>
                  <li>Regular cleanup keeps rankings legitimate</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-green-500/20">
              <p className="text-green-300 font-semibold text-sm mb-2">📊 MySQL Query Examples</p>
              <div className="space-y-2 text-green-300/70 text-xs font-mono">
                <div>
                  <p className="text-green-400 mb-1">Level Rankings:</p>
                  <p className="bg-black/50 p-2 rounded">
                    SELECT Name, cLevel, Class, PkCount FROM Character<br />
                    WHERE Name NOT IN ('GameMaster', 'Admin')<br />
                    ORDER BY cLevel DESC LIMIT 50;
                  </p>
                </div>
                <div>
                  <p className="text-green-400 mb-1">Guild Rankings:</p>
                  <p className="bg-black/50 p-2 rounded">
                    SELECT G_Name, G_Score, G_Master FROM Guild<br />
                    WHERE G_Name NOT IN ('TestGuild')<br />
                    ORDER BY G_Score DESC LIMIT 50;
                  </p>
                </div>
                <div>
                  <p className="text-green-400 mb-1">Online Players:</p>
                  <p className="bg-black/50 p-2 rounded">
                    SELECT c.Name, c.cLevel, c.Class FROM Character c<br />
                    INNER JOIN MEMB_STAT m ON c.AccountID = m.memb___id<br />
                    WHERE m.ConnectStat = 1<br />
                    ORDER BY c.cLevel DESC;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Default Rankings Info */}
      <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50 flex-shrink-0">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Default Rankings Configuration</h3>
            <p className="text-yellow-300/70 text-sm mb-3">
              The "Default Rankings" setting determines which ranking is displayed when players first visit the rankings page.
            </p>
            <div className="bg-black/30 p-4 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-300 font-semibold text-sm mb-2">Available Options:</p>
              <div className="grid grid-cols-2 gap-2 text-yellow-300/70 text-xs">
                <div><code className="bg-black/50 px-2 py-1 rounded">level</code> - Level Rankings</div>
                <div><code className="bg-black/50 px-2 py-1 rounded">resets</code> - Reset Rankings</div>
                <div><code className="bg-black/50 px-2 py-1 rounded">killers</code> - Killer Rankings (PK)</div>
                <div><code className="bg-black/50 px-2 py-1 rounded">grandresets</code> - Grand Reset Rankings</div>
                <div><code className="bg-black/50 px-2 py-1 rounded">online</code> - Online Rankings</div>
                <div><code className="bg-black/50 px-2 py-1 rounded">guilds</code> - Guild Rankings</div>
                <div><code className="bg-black/50 px-2 py-1 rounded">master</code> - Master Level Rankings</div>
                <div><code className="bg-black/50 px-2 py-1 rounded">gens</code> - Gens Rankings</div>
              </div>
              <p className="text-yellow-300/70 text-xs mt-3">
                <strong>Recommendation:</strong> Set to your most popular ranking type (usually "level" or "resets" for most servers).
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
