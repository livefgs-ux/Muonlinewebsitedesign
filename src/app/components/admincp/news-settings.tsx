import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, CheckCircle, XCircle, Save, Info, Lightbulb, Settings } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface NewsConfig {
  active: number;
  news_expanded: string;
  news_list_limit: string;
  news_short: number;
  news_short_char_limit: string;
}

export function NewsSettings() {
  // Mock current configuration - would come from XML file in production
  const [config, setConfig] = useState<NewsConfig>({
    active: 1,
    news_expanded: '3',
    news_list_limit: '10',
    news_short: 1,
    news_short_char_limit: '200',
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

    // Get all settings (note: setting_6 and setting_7, not sequential)
    settings.setting_1 = formData.get('setting_1');
    settings.setting_2 = formData.get('setting_2');
    settings.setting_3 = formData.get('setting_3');
    settings.setting_6 = formData.get('setting_6');
    settings.setting_7 = formData.get('setting_7');

    try {
      // Check all fields are filled
      for (const setting of Object.values(settings)) {
        if (!checkValue(setting)) {
          throw new Error('Missing data (complete all fields).');
        }
      }

      console.log('💾 Saving News Settings...');
      console.log('📄 XML Path: module_configs/news.xml');
      console.log('⚙️ Settings:', {
        active: Number(settings.setting_1),
        news_expanded: settings.setting_2,
        news_list_limit: settings.setting_3,
        news_short: Number(settings.setting_6),
        news_short_char_limit: settings.setting_7,
      });

      // Update state
      setConfig({
        active: Number(settings.setting_1),
        news_expanded: settings.setting_2 as string,
        news_list_limit: settings.setting_3 as string,
        news_short: Number(settings.setting_6),
        news_short_char_limit: settings.setting_7 as string,
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
        <h2 className="text-3xl text-white mb-2">News Settings</h2>
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
                      Enable/disable the news module.
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

              {/* Expanded News */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Expanded News</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of news you want to display expanded. If less than the display news limit configuration, then the rest of the news will not display expanded.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_2"
                    defaultValue={config.news_expanded}
                    placeholder="3"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Shown News Limit */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Shown News Limit</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of news to display in the news page.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_3"
                    defaultValue={config.news_list_limit}
                    placeholder="10"
                    className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </td>
              </tr>

              {/* Short News */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Short News</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Enable/disable the short news feature.
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
                        defaultChecked={config.news_short === 1}
                        className="w-4 h-4 text-green-500"
                      />
                      <span className="text-white">Enabled</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="setting_6"
                        value="0"
                        defaultChecked={config.news_short === 0}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-white">Disabled</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Short News Character Limit */}
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <th className="px-6 py-4 text-left align-top bg-black/20">
                  <div>
                    <div className="text-white font-medium mb-1">Short News Character Limit</div>
                    <div className="text-gray-400 text-sm font-normal">
                      Amount of characters to show in the short version of news.
                    </div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    name="setting_7"
                    defaultValue={config.news_short_char_limit}
                    placeholder="200"
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
            <Newspaper className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">News Settings Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Configure how news articles are displayed on your website.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Status:</strong> Enable or disable the entire news module</li>
              <li><strong>Expanded News:</strong> Number of news articles to display in full (expanded) view</li>
              <li><strong>Shown News Limit:</strong> Total number of news articles to display on the news page</li>
              <li><strong>Short News:</strong> Enable truncated preview of news content with "Read More" button</li>
              <li><strong>Short News Character Limit:</strong> Maximum characters to show in preview before truncation</li>
              <li>Settings are saved to: <code className="bg-black/50 px-2 py-1 rounded text-xs">module_configs/news.xml</code></li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Expanded vs Collapsed Examples Card */}
      <Card className="backdrop-blur-lg bg-indigo-500/5 border-indigo-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/50 flex-shrink-0">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">News Display Modes Explained</h3>
            <p className="text-indigo-300/70 text-sm mb-3">
              Understanding the difference between Expanded and Short news:
            </p>
            <div className="space-y-4">
              {/* Expanded News Example */}
              <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center border border-green-500/50">
                    <span className="text-green-300 text-xs font-bold">✓</span>
                  </div>
                  <p className="text-green-300 font-semibold">Expanded News (Full Content)</p>
                </div>
                <div className="ml-8 space-y-2 text-green-300/70 text-sm">
                  <p>
                    If <strong>Expanded News = 3</strong> and <strong>Shown News Limit = 10</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>The first 3 news articles will be shown in full (complete content)</li>
                    <li>These articles display the entire news text</li>
                    <li>No "Read More" button is needed</li>
                    <li>Best for important announcements or latest updates</li>
                  </ul>
                </div>
              </div>

              {/* Short News Example */}
              <div className="bg-black/30 p-4 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-yellow-500/20 rounded flex items-center justify-center border border-yellow-500/50">
                    <span className="text-yellow-300 text-xs font-bold">✂</span>
                  </div>
                  <p className="text-yellow-300 font-semibold">Short News (Truncated Preview)</p>
                </div>
                <div className="ml-8 space-y-2 text-yellow-300/70 text-sm">
                  <p>
                    If <strong>Short News = Enabled</strong> and <strong>Character Limit = 200</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>News articles #4-10 will show only the first 200 characters</li>
                    <li>Content is truncated with "..." at the end</li>
                    <li>"Read More" button is displayed to expand full content</li>
                    <li>Saves space and improves page loading speed</li>
                    <li>If disabled, all remaining news show full content (can make page very long)</li>
                  </ul>
                </div>
              </div>

              {/* Visual Example */}
              <div className="bg-black/30 p-4 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 font-semibold mb-2">📄 Visual Example</p>
                <div className="space-y-2 text-indigo-300/70 text-xs ml-2">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-green-400 font-semibold">News #1:</span>
                    <span className="text-green-300">📰 [EXPANDED - Full Content Visible]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-green-400 font-semibold">News #2:</span>
                    <span className="text-green-300">📰 [EXPANDED - Full Content Visible]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-green-400 font-semibold">News #3:</span>
                    <span className="text-green-300">📰 [EXPANDED - Full Content Visible]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-yellow-400 font-semibold">News #4:</span>
                    <span className="text-yellow-300">✂️ [SHORT - First 200 chars... Read More]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-yellow-400 font-semibold">News #5:</span>
                    <span className="text-yellow-300">✂️ [SHORT - First 200 chars... Read More]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-gray-400 font-semibold">News #6-10:</span>
                    <span className="text-gray-300">✂️ [SHORT - Truncated...]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommended Settings Card */}
      <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50 flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">💡 Recommended Configurations</h3>
            <p className="text-green-300/70 text-sm mb-3">
              Choose a configuration based on your website's needs:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">🎯 Standard Configuration</p>
                <ul className="text-green-300/70 text-xs space-y-1">
                  <li>• <strong>Expanded News:</strong> 3</li>
                  <li>• <strong>Shown News Limit:</strong> 10</li>
                  <li>• <strong>Short News:</strong> Enabled</li>
                  <li>• <strong>Character Limit:</strong> 200</li>
                  <li className="text-green-400 mt-2">✓ Best for most servers</li>
                  <li className="text-green-400">✓ Good balance between detail and performance</li>
                </ul>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">📱 Mobile-Friendly</p>
                <ul className="text-green-300/70 text-xs space-y-1">
                  <li>• <strong>Expanded News:</strong> 2</li>
                  <li>• <strong>Shown News Limit:</strong> 8</li>
                  <li>• <strong>Short News:</strong> Enabled</li>
                  <li>• <strong>Character Limit:</strong> 150</li>
                  <li className="text-green-400 mt-2">✓ Faster loading on mobile devices</li>
                  <li className="text-green-400">✓ Less scrolling required</li>
                </ul>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">📰 News-Heavy Website</p>
                <ul className="text-green-300/70 text-xs space-y-1">
                  <li>• <strong>Expanded News:</strong> 5</li>
                  <li>• <strong>Shown News Limit:</strong> 20</li>
                  <li>• <strong>Short News:</strong> Enabled</li>
                  <li>• <strong>Character Limit:</strong> 250</li>
                  <li className="text-green-400 mt-2">✓ For servers with frequent updates</li>
                  <li className="text-green-400">✓ Shows more content at once</li>
                </ul>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-green-500/20">
                <p className="text-green-300 font-semibold text-sm mb-1">⚡ Performance Focused</p>
                <ul className="text-green-300/70 text-xs space-y-1">
                  <li>• <strong>Expanded News:</strong> 1</li>
                  <li>• <strong>Shown News Limit:</strong> 5</li>
                  <li>• <strong>Short News:</strong> Enabled</li>
                  <li>• <strong>Character Limit:</strong> 100</li>
                  <li className="text-green-400 mt-2">✓ Minimal page load time</li>
                  <li className="text-green-400">✓ Best for slow connections</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Best Practices Card */}
      <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50 flex-shrink-0">
            <Settings className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">⚙️ Configuration Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-1">✅ Do's</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Keep Expanded News ≤ 5 for better performance</li>
                  <li>Set Short News Character Limit between 150-300</li>
                  <li>Use Short News feature to reduce page length</li>
                  <li>Shown News Limit should be 5-20 for optimal UX</li>
                  <li>Test on mobile devices after configuration</li>
                  <li>Enable Short News for servers with many updates</li>
                  <li>Expanded News should be &lt; Shown News Limit</li>
                </ul>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-purple-500/20">
                <p className="text-purple-300 font-semibold text-sm mb-1">❌ Don'ts</p>
                <ul className="text-purple-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>Don't set Expanded News &gt; Shown News Limit</li>
                  <li>Don't disable Short News with high news count</li>
                  <li>Don't set Character Limit too low (&lt;100 chars)</li>
                  <li>Don't display too many news at once (&gt;30)</li>
                  <li>Don't set Expanded News &gt; 10 (performance issue)</li>
                  <li>Avoid very short character limits (looks choppy)</li>
                  <li>Don't forget to test after changes</li>
                </ul>
              </div>
            </div>

            <div className="mt-3 bg-black/30 p-3 rounded-lg border border-purple-500/20">
              <p className="text-purple-300 font-semibold text-sm mb-2">📊 Impact on Performance</p>
              <div className="space-y-2 text-purple-300/70 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>High Expanded News (10+):</strong> Slower page load, more database queries, larger HTML</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>High Shown News Limit (30+):</strong> Longer scrolling, more memory usage, slower rendering</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong>Short News Disabled:</strong> Very long pages, poor mobile experience, high bandwidth usage</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span className="text-green-300/70"><strong>Recommended Balance:</strong> 2-3 expanded, 10-15 total, Short News enabled with 200 char limit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
