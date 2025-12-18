import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCircle, CheckCircle, XCircle, Save, Info, Users, Shield } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface ProfilesConfig {
  active: number;
}

export function ProfilesSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<ProfilesConfig>({
    active: 1,
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

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving Profiles Settings...');
      console.log('📄 XML Path: module_configs/profiles.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
      });

      // Update state
      setConfig({
        active: Number(settings.setting_1),
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
        <h2 className="text-3xl text-white mb-2">Profiles Settings</h2>
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
                      Enable/disable the profile modules.
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
            <UserCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Profiles Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the player profile system that allows users and visitors to view detailed information about players and their characters.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Status:</strong> Enable or disable the entire profile module</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/profiles.xml</code></li>
              <li>Profiles allow public viewing of player statistics and achievements</li>
              <li>Each player has a unique profile URL that can be shared</li>
              <li>Profiles display character information, stats, equipment, and more</li>
              <li>Helps build community by showcasing top players and achievements</li>
              <li>Profiles are accessible to both logged-in users and visitors</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Profile Features Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Profile Features</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              When profiles are enabled, players and visitors can view:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">📊 Character Statistics</p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Character name, class, and level</li>
                  <li>Strength, Agility, Vitality, Energy stats</li>
                  <li>PK (Player Kill) count and status</li>
                  <li>Resets and Grand Resets count</li>
                  <li>Current map/location</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">🎒 Equipment & Inventory</p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Equipped items and weapons</li>
                  <li>Item options and ancient sets</li>
                  <li>Wings and special items</li>
                  <li>Socket items and jewels</li>
                  <li>Overall character power rating</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">🏆 Achievements & Rankings</p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Ranking position (level, resets, etc.)</li>
                  <li>Guild affiliation and rank</li>
                  <li>Achievement badges and titles</li>
                  <li>PvP statistics and record</li>
                  <li>Event participation history</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-1">👤 Account Information</p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>List of all account characters</li>
                  <li>Total playtime across characters</li>
                  <li>Account creation date</li>
                  <li>Last online/login time</li>
                  <li>Account status (active, banned, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Use Cases Card */}
      <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50 flex-shrink-0">
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">💡 Profile Module Use Cases</h3>
            <p className="text-green-300/70 text-sm mb-3">
              The profile module enhances community engagement in several ways:
            </p>
            <div className="space-y-2">
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">🔍 Player Search & Discovery</p>
                <p className="text-green-300/70 text-xs">
                  Players can search for other players by name, view their stats, and learn about their achievements. 
                  Helps new players find and connect with experienced players.
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">🏅 Showcase Achievements</p>
                <p className="text-green-300/70 text-xs">
                  Top players can share their profile URLs on forums, social media, and Discord to showcase their 
                  progress, equipment, and achievements to the community.
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">⚔️ PvP & Competition</p>
                <p className="text-green-300/70 text-xs">
                  Before engaging in PvP, players can view opponent profiles to check their stats, equipment, 
                  and PK record. Adds strategic depth to player vs player interactions.
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">🛡️ Guild Recruitment</p>
                <p className="text-green-300/70 text-xs">
                  Guild leaders can review potential member profiles to assess their character strength, 
                  activity level, and playstyle before sending guild invitations.
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">📈 Server Promotion</p>
                <p className="text-green-300/70 text-xs">
                  Public profiles make your server more transparent and attractive to new players. 
                  They can see real player stats and active community before registering.
                </p>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">💬 Community Building</p>
                <p className="text-green-300/70 text-xs">
                  Profiles foster healthy competition and social interaction. Players can compare their 
                  progress with others and set goals based on top player achievements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Best Practices Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">⚙️ Profile Module Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-1">✅ Recommendations</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Enable profiles for community engagement</li>
                  <li>Cache profile data for better performance</li>
                  <li>Update profile views in real-time when possible</li>
                  <li>Include shareable profile URLs (SEO-friendly)</li>
                  <li>Add "View Profile" links in rankings</li>
                  <li>Allow profile customization (avatars, bio, etc.)</li>
                  <li>Show online/offline status indicators</li>
                  <li>Display guild emblem on character profiles</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-1">⚠️ Privacy Considerations</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Consider hiding sensitive account data</li>
                  <li>Don't display email addresses publicly</li>
                  <li>Allow players to set profile privacy settings</li>
                  <li>Hide IP addresses and connection details</li>
                  <li>Don't show real-money donation amounts</li>
                  <li>Respect player privacy preferences</li>
                  <li>Hide banned account details from public view</li>
                  <li>Implement rate limiting to prevent scraping</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-purple-500/20">
              <p className="text-purple-300 font-semibold text-sm mb-2">🎯 Profile URL Examples</p>
              <div className="space-y-1 text-purple-300/70 text-xs font-mono">
                <p>• <span className="text-purple-400">Direct Character:</span> https://yourserver.com/profile/CharacterName</p>
                <p>• <span className="text-purple-400">Account Profile:</span> https://yourserver.com/profile/account/Username</p>
                <p>• <span className="text-purple-400">With Character ID:</span> https://yourserver.com/profile/char/12345</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
