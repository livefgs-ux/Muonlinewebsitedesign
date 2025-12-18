import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vote, CheckCircle, XCircle, Save, Info, Zap, DollarSign, Award, TrendingUp, Shield, Trash2, Plus, ExternalLink, Clock, Gift } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface VoteConfig {
  active: number;
  vote_save_logs: number;
  credit_config: number;
}

interface VoteSite {
  votesite_id: number;
  votesite_title: string;
  votesite_link: string;
  votesite_reward: number;
  votesite_time: number;
}

// Mock Credit System configurations
const mockCreditConfigs = [
  { id: 1, name: 'WCoins (C)' },
  { id: 2, name: 'WCoins (P)' },
  { id: 3, name: 'GoblinPoints' },
  { id: 4, name: 'Ruud' },
];

// Mock existing vote sites
const mockInitialVoteSites: VoteSite[] = [
  {
    votesite_id: 1,
    votesite_title: 'MMOTop100',
    votesite_link: 'https://mmotop100.com/vote/12345',
    votesite_reward: 5,
    votesite_time: 12,
  },
  {
    votesite_id: 2,
    votesite_title: 'XtremeTop100',
    votesite_link: 'https://xtremetop100.com/vote/67890',
    votesite_reward: 3,
    votesite_time: 24,
  },
];

export function VoteSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<VoteConfig>({
    active: 1,
    vote_save_logs: 1,
    credit_config: 1, // WCoins (C)
  });

  const [voteSites, setVoteSites] = useState<VoteSite[]>(mockInitialVoteSites);

  const [newVoteSite, setNewVoteSite] = useState({
    title: '',
    link: '',
    reward: '',
    time: '',
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

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving Vote and Reward Settings...');
      console.log('📄 XML Path: module_configs/usercp.vote.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        vote_save_logs: Number(settings.setting_2),
        credit_config: Number(settings.setting_3),
      });
      console.log('🗄️ Database: MySQL');

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        vote_save_logs: Number(settings.setting_2),
        credit_config: Number(settings.setting_3),
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

  const handleAddVoteSite = () => {
    setMessage({ type: null, text: '' });

    // Validate inputs
    if (!newVoteSite.title || !newVoteSite.link || !newVoteSite.reward || !newVoteSite.time) {
      setMessage({
        type: 'error',
        text: 'There has been an error while adding the topsite.',
      });
      return;
    }

    const reward = Number(newVoteSite.reward);
    const time = Number(newVoteSite.time);

    if (isNaN(reward) || reward <= 0 || isNaN(time) || time <= 0) {
      setMessage({
        type: 'error',
        text: 'There has been an error while adding the topsite.',
      });
      return;
    }

    // Add new vote site
    const newSite: VoteSite = {
      votesite_id: Math.max(...voteSites.map(s => s.votesite_id), 0) + 1,
      votesite_title: newVoteSite.title,
      votesite_link: newVoteSite.link,
      votesite_reward: reward,
      votesite_time: time,
    };

    setVoteSites([...voteSites, newSite]);

    console.log('✅ Votesite added:', newSite);
    console.log('🗄️ Database: MySQL - wvote_sites table');

    setMessage({
      type: 'success',
      text: 'Votesite successfully added.',
    });

    // Clear form
    setNewVoteSite({ title: '', link: '', reward: '', time: '' });
  };

  const handleDeleteVoteSite = (siteId: number) => {
    setMessage({ type: null, text: '' });

    setVoteSites(voteSites.filter(site => site.votesite_id !== siteId));

    console.log('🗑️ Votesite deleted:', siteId);
    console.log('🗄️ Database: MySQL - wvote_sites table');

    setMessage({
      type: 'success',
      text: 'Votesite successfully deleted.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-white mb-2">Vote and Reward Settings</h2>
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
                      Enable/disable the vote module.
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

              {/* Save Vote Logs */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Save Vote Logs</div>
                    <div className="text-gray-400 text-sm font-normal">
                      If enabled, every vote will be permanently logged in a database table.
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
                        defaultChecked={config.vote_save_logs === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_2"
                        value="0"
                        defaultChecked={config.vote_save_logs === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Credit Configuration */}
              <tr className="border-b border-gray-700/30">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Credit Configuration</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <select
                    name="setting_3"
                    defaultValue={config.credit_config}
                    className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  >
                    {mockCreditConfigs.map((credit) => (
                      <option key={credit.id} value={credit.id}>
                        {credit.name}
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

      {/* Divider */}
      <div className="border-t border-gray-700/50"></div>

      {/* Manage Vote Sites */}
      <div>
        <h3 className="text-2xl text-white mb-4">Manage Vote Sites</h3>
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/30 bg-black/20">
                  <th className="px-6 py-3 text-left text-white font-medium">Title</th>
                  <th className="px-6 py-3 text-left text-white font-medium">Link (full url including http)</th>
                  <th className="px-6 py-3 text-left text-white font-medium">Reward</th>
                  <th className="px-6 py-3 text-left text-white font-medium">Vote Every</th>
                  <th className="px-6 py-3 text-left text-white font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {/* Existing Vote Sites */}
                {voteSites.length > 0 ? (
                  voteSites.map((site) => (
                    <tr key={site.votesite_id} className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white">{site.votesite_title}</td>
                      <td className="px-6 py-4">
                        <a
                          href={site.votesite_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                        >
                          {site.votesite_link}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-white">{site.votesite_reward} credit(s)</td>
                      <td className="px-6 py-4 text-white">{site.votesite_time} hour(s)</td>
                      <td className="px-6 py-4">
                        <Button
                          onClick={() => handleDeleteVoteSite(site.votesite_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : null}

                {/* Add New Vote Site Form */}
                <tr className="bg-black/20">
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={newVoteSite.title}
                      onChange={(e) => setNewVoteSite({ ...newVoteSite, title: e.target.value })}
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newVoteSite.link}
                      onChange={(e) => setNewVoteSite({ ...newVoteSite, link: e.target.value })}
                      className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="5"
                        value={newVoteSite.reward}
                        onChange={(e) => setNewVoteSite({ ...newVoteSite, reward: e.target.value })}
                        className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                        min="1"
                      />
                      <span className="text-gray-400 text-sm whitespace-nowrap">credit(s)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="12"
                        value={newVoteSite.time}
                        onChange={(e) => setNewVoteSite({ ...newVoteSite, time: e.target.value })}
                        className="w-full bg-black/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                        min="1"
                      />
                      <span className="text-gray-400 text-sm whitespace-nowrap">hour(s)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={handleAddVoteSite}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 text-sm w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add!
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <Vote className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Vote and Reward System Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure the vote and reward system that allows players to vote for your server on gaming toplists and receive credits as rewards. This helps increase server visibility and rewards loyal players. All data is stored in your <strong>MySQL</strong> database.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/usercp.vote.xml</code></li>
              <li>Vote sites are stored in <strong>MySQL wvote_sites table</strong></li>
              <li>Vote logs are stored in <strong>MySQL wvote_log table</strong> (if enabled)</li>
              <li>Players can vote once per topsite based on the cooldown period</li>
              <li>Credits are automatically added to player account after voting</li>
              <li>Each topsite can have different reward amounts and cooldown times</li>
              <li>System prevents duplicate votes within the cooldown period</li>
              <li>Vote logs help track player engagement and detect abuse</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* How Voting System Works Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">How the Voting System Works</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              Step-by-step process when a player votes for your server:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">📊 Voting Process Flow</p>
                <ol className="text-indigo-300/70 text-xs space-y-2 list-decimal list-inside">
                  <li><strong>Player Clicks Vote Button:</strong> From UserCP vote page, player selects a topsite</li>
                  <li><strong>Check Cooldown:</strong> System checks last vote time in MySQL wvote_log table</li>
                  <li><strong>Redirect to Topsite:</strong> If cooldown passed, redirect to external voting site</li>
                  <li><strong>Player Votes:</strong> Player completes CAPTCHA/vote on external topsite</li>
                  <li><strong>Topsite Callback:</strong> External site sends callback to your server (API)</li>
                  <li><strong>Verify Vote:</strong> System verifies callback authenticity and IP</li>
                  <li><strong>Award Credits:</strong> Add configured reward amount to player's credit balance</li>
                  <li><strong>Log Vote:</strong> Save vote record to wvote_log table (if enabled)</li>
                  <li><strong>Confirmation:</strong> Show success message and updated credit balance</li>
                </ol>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold text-sm mb-2">💡 MySQL Example</p>
                <p className="text-indigo-300/70 text-xs mb-2">
                  Player "VoterPro" votes on MMOTop100 (12-hour cooldown, 5 credits reward):
                </p>
                <div className="space-y-2 text-xs font-mono bg-black/50 p-3 rounded">
                  <p className="text-indigo-300/70"><strong className="text-yellow-400">Check Last Vote:</strong></p>
                  <p className="text-indigo-300/70">
                    SELECT vote_date FROM wvote_log<br />
                    WHERE account_id = 'player123'<br />
                    AND votesite_id = 1<br />
                    ORDER BY vote_date DESC LIMIT 1;
                  </p>
                  
                  <p className="text-indigo-300/70 mt-3"><strong className="text-green-400">If cooldown passed (12 hours):</strong></p>
                  <p className="text-indigo-300/70">
                    -- Award credits<br />
                    UPDATE WCoinC SET WCoinC = WCoinC + 5<br />
                    WHERE AccountID = 'player123';
                  </p>
                  <p className="text-indigo-300/70 mt-2">
                    -- Log vote (if enabled)<br />
                    INSERT INTO wvote_log<br />
                    (account_id, votesite_id, vote_date, vote_ip)<br />
                    VALUES ('player123', 1, NOW(), '192.168.1.100');
                  </p>
                  
                  <p className="text-green-300/70 mt-3">✅ Player receives 5 WCoins (C)!</p>
                  <p className="text-blue-300/70">⏰ Can vote again in 12 hours</p>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">✅ What Players Get</p>
                <ul className="text-indigo-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Free credits for voting (helps server grow)</li>
                  <li>Can vote on multiple topsites (different cooldowns)</li>
                  <li>Regular income source without spending real money</li>
                  <li>Support server visibility and attract new players</li>
                  <li>Feel valued for contributing to server growth</li>
                  <li>Compete in vote rankings (top voters)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Topsite Integration Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <ExternalLink className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Popular Gaming Topsites</h3>
            <p className="text-purple-300/70 text-sm mb-3">
              Common gaming toplists where you can register your MU Online server:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">🏆 Popular MU Online Topsites</p>
                <div className="space-y-2 text-xs">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 font-semibold mb-1">XtremeTop100</p>
                    <p className="text-purple-300/70">https://www.xtremetop100.com/</p>
                    <p className="text-purple-300/70 mt-1">✅ Most popular, high traffic, supports callbacks</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 font-semibold mb-1">MMOTop100</p>
                    <p className="text-purple-300/70">https://www.mmotop100.com/</p>
                    <p className="text-purple-300/70 mt-1">✅ MMO-focused, good visibility, API support</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 font-semibold mb-1">TopG</p>
                    <p className="text-purple-300/70">https://topg.org/</p>
                    <p className="text-purple-300/70 mt-1">✅ Large network, multiple game categories</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 font-semibold mb-1">MMORPG-Top</p>
                    <p className="text-purple-300/70">Various regional MMORPG toplists</p>
                    <p className="text-purple-300/70 mt-1">✅ Good for targeting specific regions</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-2">⚙️ Topsite Configuration Tips</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li><strong>Title:</strong> Use recognizable topsite name (e.g., "XtremeTop100")</li>
                  <li><strong>Link:</strong> Direct voting URL with your server ID</li>
                  <li><strong>Reward:</strong> Balance between generous and sustainable (3-10 credits)</li>
                  <li><strong>Cooldown:</strong> Most topsites allow 12-24 hour votes</li>
                  <li>Register your server on each topsite first</li>
                  <li>Get your unique voting URL from topsite dashboard</li>
                  <li>Configure callback URL if topsite supports it</li>
                  <li>Test voting process before announcing to players</li>
                </ul>
                <div className="bg-black/50 p-2 rounded">
                  <p className="text-yellow-300 text-xs font-semibold mb-1">💡 Recommendation:</p>
                  <p className="text-purple-300/70 text-xs">
                    Start with 2-3 popular topsites. Add more as your player base grows. Higher rewards attract more voters but cost more credits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Reward Configuration Card */}
      <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50 flex-shrink-0">
            <Gift className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Reward Configuration Guide</h3>
            <p className="text-green-300/70 text-sm mb-3">
              Balance vote rewards to incentivize voting while maintaining server economy:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-2">💰 Reward Amount Guidelines</p>
                <p className="text-green-300/70 text-xs mb-3">
                  Credit rewards per vote:
                </p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li><strong>1-2 credits:</strong> Very low (not motivating enough)</li>
                  <li><strong>3-5 credits:</strong> Moderate (standard for most servers)</li>
                  <li><strong>5-10 credits:</strong> Good (encourages regular voting)</li>
                  <li><strong>10-20 credits:</strong> High (generous but expensive)</li>
                  <li><strong>20+ credits:</strong> Very high (unsustainable long-term)</li>
                </ul>
                <div className="bg-black/50 p-2 rounded">
                  <p className="text-yellow-300 text-xs font-semibold mb-1">💡 Recommendation:</p>
                  <p className="text-green-300/70 text-xs">
                    Most successful servers use 5 credits per vote with 12-hour cooldown. This gives players ~10 credits/day from voting, which is meaningful but not game-breaking.
                  </p>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-blue-500/20">
                <p className="text-blue-300 font-semibold text-sm mb-2">⏰ Cooldown Time Guidelines</p>
                <p className="text-green-300/70 text-xs mb-3">
                  Time between votes on same topsite:
                </p>
                <ul className="text-green-300/70 text-xs space-y-1 list-disc list-inside mb-3">
                  <li><strong>1-6 hours:</strong> Very short (topsite may not allow)</li>
                  <li><strong>12 hours:</strong> Standard (2 votes per day)</li>
                  <li><strong>24 hours:</strong> Most common (1 vote per day)</li>
                  <li><strong>48+ hours:</strong> Long (reduces player engagement)</li>
                </ul>
                <div className="bg-black/50 p-2 rounded mb-2">
                  <p className="text-purple-300 text-xs font-semibold mb-1">⚙️ Cooldown Strategy:</p>
                  <p className="text-green-300/70 text-xs">
                    Match topsite's allowed voting frequency. Most topsites allow 12-24 hour votes. Check each topsite's rules before configuring.
                  </p>
                </div>
                <div className="bg-black/50 p-2 rounded">
                  <p className="text-yellow-300 text-xs font-semibold mb-1">💡 Tip:</p>
                  <p className="text-green-300/70 text-xs">
                    Use different cooldowns for different topsites (e.g., 12h for XtremeTop100, 24h for others) to spread out voting opportunities.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-black/30 p-4 rounded-lg border border-green-500/20">
              <p className="text-green-300 font-semibold text-sm mb-2">⚖️ Economy Balance Example</p>
              <div className="space-y-2 text-xs">
                <div className="bg-black/50 p-3 rounded">
                  <p className="text-green-300 font-semibold mb-2">Scenario: 5 Topsites, 5 credits each, 12-hour cooldown</p>
                  <p className="text-green-300/70 mb-1"><strong>Daily Maximum:</strong></p>
                  <p className="text-green-300/70 font-mono">• 5 topsites × 2 votes/day × 5 credits = 50 credits/day</p>
                  <p className="text-green-300/70 mb-1 mt-2"><strong>Monthly Maximum:</strong></p>
                  <p className="text-green-300/70 font-mono">• 50 credits/day × 30 days = 1,500 credits/month</p>
                  <p className="text-blue-300/70 mt-2">
                    ✅ This is generous but sustainable. Players get meaningful free credits without breaking economy.
                  </p>
                </div>
                <div className="bg-black/50 p-3 rounded">
                  <p className="text-yellow-300 font-semibold text-xs mb-1">⚠️ Consider:</p>
                  <p className="text-green-300/70 text-xs">
                    Compare vote rewards to your cash shop prices. If players can get everything free from voting, you won't make revenue. Balance free rewards with premium options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* MySQL Integration Card */}
      <Card className="backdrop-blur-lg bg-cyan-500/5 border-cyan-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/50 flex-shrink-0">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">MySQL Database Integration</h3>
            <p className="text-cyan-300/70 text-sm mb-3">
              The voting system interacts with MySQL to manage vote sites, logs, and rewards:
            </p>
            <div className="space-y-3">
              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">📊 MySQL Tables Involved</p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-cyan-300 mb-2"><strong>wvote_sites Table:</strong> Stores configured voting sites</p>
                    <code className="text-cyan-300/70 block">
                      CREATE TABLE wvote_sites (<br />
                      &nbsp;&nbsp;votesite_id INT PRIMARY KEY AUTO_INCREMENT,<br />
                      &nbsp;&nbsp;votesite_title VARCHAR(255),<br />
                      &nbsp;&nbsp;votesite_link VARCHAR(500),<br />
                      &nbsp;&nbsp;votesite_reward INT,<br />
                      &nbsp;&nbsp;votesite_time INT -- Hours between votes<br />
                      );
                    </code>
                  </div>
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-cyan-300 mb-2"><strong>wvote_log Table:</strong> Logs all votes (if enabled)</p>
                    <code className="text-cyan-300/70 block">
                      CREATE TABLE wvote_log (<br />
                      &nbsp;&nbsp;vote_id INT PRIMARY KEY AUTO_INCREMENT,<br />
                      &nbsp;&nbsp;account_id VARCHAR(50),<br />
                      &nbsp;&nbsp;votesite_id INT,<br />
                      &nbsp;&nbsp;vote_date DATETIME,<br />
                      &nbsp;&nbsp;vote_ip VARCHAR(45),<br />
                      &nbsp;&nbsp;FOREIGN KEY (votesite_id) REFERENCES wvote_sites(votesite_id)<br />
                      );
                    </code>
                  </div>
                  <div className="bg-black/50 p-3 rounded">
                    <p className="text-cyan-300 mb-2"><strong>Credit Tables:</strong> WCoinC, WCoinP, GoblinPoint (store rewards)</p>
                    <code className="text-cyan-300/70 block">
                      UPDATE WCoinC SET<br />
                      &nbsp;&nbsp;WCoinC = WCoinC + 5<br />
                      WHERE AccountID = 'player123';
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/20">
                <p className="text-cyan-300 font-semibold text-sm mb-2">🔒 Vote Validation (MySQL Queries)</p>
                <div className="space-y-2 text-xs">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">1. Get Vote Site Info:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT * FROM wvote_sites WHERE votesite_id = 1;
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">2. Check Last Vote Time:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT vote_date FROM wvote_log<br />
                      WHERE account_id = 'player123' AND votesite_id = 1<br />
                      ORDER BY vote_date DESC LIMIT 1;
                    </code>
                    <p className="text-cyan-300/70 mt-1">
                      -- Compare with current time and cooldown period
                    </p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">3. Award Credits (Transaction):</p>
                    <code className="text-cyan-300/70 block font-mono">
                      START TRANSACTION;<br />
                      UPDATE WCoinC SET WCoinC = WCoinC + 5 WHERE AccountID = 'player123';<br />
                      INSERT INTO wvote_log (account_id, votesite_id, vote_date, vote_ip)<br />
                      VALUES ('player123', 1, NOW(), '192.168.1.100');<br />
                      COMMIT;
                    </code>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 font-semibold mb-1">4. Top Voters Query:</p>
                    <code className="text-cyan-300/70 block font-mono">
                      SELECT account_id, COUNT(*) as vote_count<br />
                      FROM wvote_log<br />
                      WHERE vote_date &gt;= DATE_SUB(NOW(), INTERVAL 30 DAY)<br />
                      GROUP BY account_id<br />
                      ORDER BY vote_count DESC LIMIT 10;
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border border-red-500/20">
                <p className="text-red-300 font-semibold text-sm mb-2">⚠️ Important MySQL Considerations</p>
                <ul className="text-cyan-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Use Transactions:</strong> Ensure credit award and vote log both succeed</li>
                  <li><strong>Add Indexes:</strong> Index on (account_id, votesite_id, vote_date) for faster lookups</li>
                  <li><strong>Prevent Duplicates:</strong> Check cooldown before allowing vote</li>
                  <li><strong>Log IP Addresses:</strong> Helps detect multi-account vote abuse</li>
                  <li><strong>Archive Old Logs:</strong> Periodically move old vote logs to archive table</li>
                  <li><strong>Validate Callbacks:</strong> Verify external topsite callbacks are legitimate</li>
                  <li><strong>Rate Limiting:</strong> Prevent spam voting attempts from same IP</li>
                  <li><strong>Monitor Patterns:</strong> Track unusual voting patterns (abuse detection)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Best Practices Card */}
      <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50 flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Voting System Best Practices (MySQL)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">✅ Recommended Settings</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Active:</strong> Enabled (voting drives traffic)</li>
                  <li><strong>Save Logs:</strong> Enabled (track engagement and abuse)</li>
                  <li><strong>Credit Type:</strong> WCoins (C) or GoblinPoints</li>
                  <li><strong>Reward:</strong> 5 credits per vote (standard)</li>
                  <li><strong>Cooldown:</strong> 12-24 hours (match topsite rules)</li>
                  <li>Start with 2-3 popular topsites</li>
                  <li>Test voting flow before announcing</li>
                  <li>Monitor vote logs for abuse patterns</li>
                  <li>Update topsite links if they change</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">🗄️ MySQL Considerations</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Add composite index: (account_id, votesite_id, vote_date)</li>
                  <li>Partition wvote_log table by month (large tables)</li>
                  <li>Archive votes older than 6-12 months</li>
                  <li>Use transactions for credit award + log insert</li>
                  <li>Monitor table size and optimize regularly</li>
                  <li>Backup vote sites configuration</li>
                  <li>Consider caching top voters query (expensive)</li>
                  <li>Log failed vote attempts for debugging</li>
                </ul>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">🎮 Server Growth Strategy</p>
                <div className="space-y-2">
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-green-300 text-xs font-semibold">Phase 1: Launch (0-100 players)</p>
                    <p className="text-yellow-300/70 text-xs">2-3 topsites, 5-7 credits/vote, 12h cooldown. Focus on getting listed and building initial voter base.</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-blue-300 text-xs font-semibold">Phase 2: Growth (100-500 players)</p>
                    <p className="text-yellow-300/70 text-xs">4-5 topsites, 5 credits/vote, 12h cooldown. Maintain rewards, add more topsites for exposure.</p>
                  </div>
                  <div className="bg-black/50 p-2 rounded">
                    <p className="text-purple-300 text-xs font-semibold">Phase 3: Established (500+ players)</p>
                    <p className="text-yellow-300/70 text-xs">5-7 topsites, 3-5 credits/vote, 24h cooldown. Reduce rewards as server is established, maintain toplist presence.</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 font-semibold text-sm mb-1">⚠️ Common Mistakes to Avoid</p>
                <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                  <li><strong>Rewards Too High:</strong> Devalues cash shop, unsustainable</li>
                  <li><strong>Rewards Too Low:</strong> Players won't bother voting</li>
                  <li><strong>No Vote Logging:</strong> Can't track engagement or detect abuse</li>
                  <li><strong>Wrong Cooldown:</strong> Violates topsite rules, votes don't count</li>
                  <li><strong>Broken Links:</strong> Players can't vote, lose toplist rank</li>
                  <li><strong>No Callback Verification:</strong> Fake votes can exploit system</li>
                  <li><strong>Ignoring Top Voters:</strong> Missing engagement opportunity</li>
                  <li><strong>No Multi-Account Prevention:</strong> Same player votes with many accounts</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-green-500/20">
              <p className="text-green-300 font-semibold text-sm mb-2">💡 Pro Tips: Maximize Voting Impact</p>
              <ul className="text-yellow-300/70 text-xs space-y-1 list-disc list-inside">
                <li><strong>Top Voters Rewards:</strong> Give bonus rewards to top 10 voters each month (encourages competition)</li>
                <li><strong>Vote Events:</strong> Double vote rewards during slow periods (2x credits weekends)</li>
                <li><strong>Vote Rankings:</strong> Display top voters prominently on website (recognition motivates voting)</li>
                <li><strong>Reminder System:</strong> Notify players when vote cooldown expires (increases voting frequency)</li>
                <li><strong>Vote Streak Bonuses:</strong> Extra rewards for voting daily for 7/14/30 days (builds habit)</li>
                <li><strong>Referral Bonuses:</strong> Reward players who refer others to vote (organic growth)</li>
                <li><strong>Social Media Integration:</strong> Share toplist rankings on Discord/Facebook (community pride)</li>
              </ul>
              <p className="text-yellow-300/70 text-xs mt-2">
                <strong>Remember:</strong> Voting system is win-win. Players get free credits, you get visibility and traffic. Make voting easy, rewarding, and track results to optimize your strategy!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
