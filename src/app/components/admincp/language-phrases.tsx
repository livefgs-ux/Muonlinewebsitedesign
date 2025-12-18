import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Languages,
  Search,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  Globe,
  FileText,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface LanguagePhrase {
  phrase: string;
  content: string;
}

export function LanguagePhrases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'phrase' | 'content'>('phrase');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Mock language phrases - In production, this comes from language files
  const languagePhrases: LanguagePhrase[] = [
    { phrase: 'lang_home', content: 'Home' },
    { phrase: 'lang_news', content: 'News' },
    { phrase: 'lang_downloads', content: 'Downloads' },
    { phrase: 'lang_rankings', content: 'Rankings' },
    { phrase: 'lang_usercp', content: 'User Panel' },
    { phrase: 'lang_register', content: 'Register' },
    { phrase: 'lang_login', content: 'Login' },
    { phrase: 'lang_logout', content: 'Logout' },
    { phrase: 'lang_welcome', content: 'Welcome to MeuMU Online' },
    { phrase: 'lang_server_status', content: 'Server Status' },
    { phrase: 'lang_online', content: 'Online' },
    { phrase: 'lang_offline', content: 'Offline' },
    { phrase: 'lang_players_online', content: 'Players Online' },
    { phrase: 'lang_account', content: 'Account' },
    { phrase: 'lang_password', content: 'Password' },
    { phrase: 'lang_email', content: 'Email Address' },
    { phrase: 'lang_username', content: 'Username' },
    { phrase: 'lang_character', content: 'Character' },
    { phrase: 'lang_level', content: 'Level' },
    { phrase: 'lang_class', content: 'Class' },
    { phrase: 'lang_guild', content: 'Guild' },
    { phrase: 'lang_resets', content: 'Resets' },
    { phrase: 'lang_grand_resets', content: 'Grand Resets' },
    { phrase: 'lang_pk_level', content: 'PK Level' },
    { phrase: 'lang_strength', content: 'Strength' },
    { phrase: 'lang_agility', content: 'Agility' },
    { phrase: 'lang_vitality', content: 'Vitality' },
    { phrase: 'lang_energy', content: 'Energy' },
    { phrase: 'lang_leadership', content: 'Leadership' },
    { phrase: 'lang_points', content: 'Points' },
    { phrase: 'lang_add_stats', content: 'Add Stats' },
    { phrase: 'lang_reset_character', content: 'Reset Character' },
    { phrase: 'lang_clear_pk', content: 'Clear PK' },
    { phrase: 'lang_unstick', content: 'Unstick Character' },
    { phrase: 'lang_change_password', content: 'Change Password' },
    { phrase: 'lang_change_email', content: 'Change Email' },
    { phrase: 'lang_my_account', content: 'My Account' },
    { phrase: 'lang_credits', content: 'Credits' },
    { phrase: 'lang_donate', content: 'Donate' },
    { phrase: 'lang_vote_reward', content: 'Vote and Reward' },
    { phrase: 'lang_castle_siege', content: 'Castle Siege' },
    { phrase: 'lang_castle_owner', content: 'Castle Owner' },
    { phrase: 'lang_next_siege', content: 'Next Siege' },
    { phrase: 'lang_dark_knight', content: 'Dark Knight' },
    { phrase: 'lang_dark_wizard', content: 'Dark Wizard' },
    { phrase: 'lang_fairy_elf', content: 'Fairy Elf' },
    { phrase: 'lang_magic_gladiator', content: 'Magic Gladiator' },
    { phrase: 'lang_summoner', content: 'Summoner' },
    { phrase: 'lang_dark_lord', content: 'Dark Lord' },
    { phrase: 'lang_rage_fighter', content: 'Rage Fighter' },
    { phrase: 'lang_error', content: 'Error' },
    { phrase: 'lang_success', content: 'Success' },
    { phrase: 'lang_warning', content: 'Warning' },
    { phrase: 'lang_info', content: 'Information' },
    { phrase: 'lang_submit', content: 'Submit' },
    { phrase: 'lang_cancel', content: 'Cancel' },
    { phrase: 'lang_save', content: 'Save' },
    { phrase: 'lang_delete', content: 'Delete' },
    { phrase: 'lang_edit', content: 'Edit' },
    { phrase: 'lang_view', content: 'View' },
    { phrase: 'lang_search', content: 'Search' },
    { phrase: 'lang_filter', content: 'Filter' },
    { phrase: 'lang_loading', content: 'Loading...' },
    { phrase: 'lang_no_results', content: 'No results found' },
    { phrase: 'lang_contact_us', content: 'Contact Us' },
    { phrase: 'lang_privacy_policy', content: 'Privacy Policy' },
    { phrase: 'lang_terms_of_service', content: 'Terms of Service' },
  ];

  const availableLanguages = [
    'English',
    'Português',
    'Español',
    'Français',
    'Deutsch',
    'Русский',
    'Polski',
    'Türkçe',
  ];

  // Filter and sort phrases
  const filteredAndSortedPhrases = useMemo(() => {
    let filtered = languagePhrases.filter(
      (phrase) =>
        phrase.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phrase.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      const aValue = sortBy === 'phrase' ? a.phrase : a.content;
      const bValue = sortBy === 'phrase' ? b.phrase : b.content;
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [languagePhrases, searchTerm, sortBy, sortOrder]);

  const handleSort = (column: 'phrase' | 'content') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleCopy = (phrase: string, content: string) => {
    const text = `${phrase}: ${content}`;
    navigator.clipboard.writeText(text);
    setCopySuccess(phrase);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleExportJSON = () => {
    const data = Object.fromEntries(
      filteredAndSortedPhrases.map(p => [p.phrase, p.content])
    );
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `language_${currentLanguage.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = [
      ['Phrase Name', 'Content'],
      ...filteredAndSortedPhrases.map(p => [p.phrase, p.content])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `language_${currentLanguage.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-white mb-2">Language Phrases</h1>
          <p className="text-gray-400">
            Current language: <span className="text-blue-400 font-medium">{currentLanguage}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Phrases</p>
              <p className="text-3xl text-blue-500 font-bold">{languagePhrases.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
              <Languages className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Showing</p>
              <p className="text-3xl text-green-500 font-bold">{filteredAndSortedPhrases.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/50">
              <FileText className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Language File</p>
              <p className="text-lg text-purple-400 font-mono">lang/{currentLanguage.toLowerCase()}.php</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
              <Globe className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 p-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search phrases by name or content..."
              className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none transition-colors"
            />
          </div>
        </Card>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleExportJSON}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button
            onClick={handleExportCSV}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Phrases Table */}
      {filteredAndSortedPhrases.length > 0 ? (
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50 bg-black/30">
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">
                    <button
                      onClick={() => handleSort('phrase')}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      Phrase Name
                      <ArrowUpDown className="w-4 h-4" />
                      {sortBy === 'phrase' && (
                        <span className="text-xs text-sky-400">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-gray-400 font-medium">
                    <button
                      onClick={() => handleSort('content')}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      Content
                      <ArrowUpDown className="w-4 h-4" />
                      {sortBy === 'content' && (
                        <span className="text-xs text-sky-400">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-gray-400 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedPhrases.map((phrase, index) => (
                  <motion.tr
                    key={phrase.phrase}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className="border-b border-gray-700/30 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <code className="text-sky-400 bg-black/50 px-3 py-1 rounded border border-sky-500/30 text-sm font-mono">
                        {phrase.phrase}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{phrase.content}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleCopy(phrase.phrase, phrase.content)}
                        className={`p-2 rounded-lg transition-all ${
                          copySuccess === phrase.phrase
                            ? 'bg-green-500/20 border border-green-500/50'
                            : 'bg-gray-700/50 border border-gray-600/50 hover:bg-sky-500/20 hover:border-sky-500/50'
                        }`}
                        title="Copy to clipboard"
                      >
                        {copySuccess === phrase.phrase ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl text-yellow-300 font-semibold mb-2">No Phrases Found</h3>
            <p className="text-gray-400">
              {searchTerm
                ? 'No phrases match your search criteria. Try a different search term.'
                : 'The language file is empty or not loaded properly.'}
            </p>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <Languages className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Language Phrases Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              This page displays all language phrases from the currently selected language file.
              These phrases are used throughout the website for multi-language support.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Language File:</strong> Located in <code className="bg-black/50 px-2 py-1 rounded text-xs">lang/{currentLanguage.toLowerCase()}.php</code></li>
              <li><strong>Phrase Name:</strong> The unique identifier used in the code (e.g., lang_home)</li>
              <li><strong>Content:</strong> The translated text displayed to users</li>
              <li><strong>Search:</strong> Filter phrases by name or content</li>
              <li><strong>Sort:</strong> Click column headers to sort alphabetically</li>
              <li><strong>Export:</strong> Download phrases as JSON or CSV for editing</li>
              <li><strong>Copy:</strong> Click the copy icon to copy phrase name and content</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
