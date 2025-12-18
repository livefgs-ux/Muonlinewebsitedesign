import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, XCircle, User, Calendar, Clock, Info, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface BanRecord {
  id: number;
  account_id: string;
  banned_by: string;
  ban_type: 'temporal' | 'permanent';
  ban_date: number;
  ban_days: number;
  ban_reason: string;
}

// Mock ban records for demonstration
const mockBanRecords: BanRecord[] = [
  {
    id: 1,
    account_id: 'hacker123',
    banned_by: 'admin',
    ban_type: 'permanent',
    ban_date: 1704067200,
    ban_days: 0,
    ban_reason: 'Using third-party programs',
  },
  {
    id: 2,
    account_id: 'cheater99',
    banned_by: 'gamemaster',
    ban_type: 'temporal',
    ban_date: 1704153600,
    ban_days: 7,
    ban_reason: 'Bug abuse',
  },
  {
    id: 3,
    account_id: 'testban',
    banned_by: 'admin',
    ban_type: 'temporal',
    ban_date: 1704240000,
    ban_days: 3,
    ban_reason: 'Test ban',
  },
  {
    id: 4,
    account_id: 'badplayer',
    banned_by: 'admin2',
    ban_type: 'permanent',
    ban_date: 1704326400,
    ban_days: 0,
    ban_reason: 'Repeated offenses',
  },
  {
    id: 5,
    account_id: 'testaccount',
    banned_by: 'gamemaster',
    ban_type: 'temporal',
    ban_date: 1704412800,
    ban_days: 1,
    ban_reason: 'Inappropriate behavior',
  },
];

export function BanSearch() {
  const [searchRequest, setSearchRequest] = useState('');
  const [searchResults, setSearchResults] = useState<BanRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReason, setShowReason] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSearchResults([]);
    setHasSearched(false);

    try {
      console.log('🔍 Searching bans for:', searchRequest);
      console.log('📊 SQL Query:', `SELECT TOP 25 * FROM WEBENGINE_BAN_LOG WHERE account_id LIKE '%${searchRequest}%'`);

      // Simulate database query with LIKE '%search%' (TOP 25)
      const searchLower = searchRequest.toLowerCase();
      const filtered = mockBanRecords
        .filter((ban) => ban.account_id.toLowerCase().includes(searchLower))
        .slice(0, 25); // TOP 25

      console.log('✅ Found', filtered.length, 'results');

      if (filtered.length === 0) {
        throw new Error('No results found.');
      }

      setSearchResults(filtered);
      setHasSearched(true);
    } catch (ex: any) {
      setError(ex.message);
    }
  };

  const handleLiftBan = (id: number, account: string) => {
    if (!confirm(`Are you sure you want to lift the ban for "${account}"?`)) {
      return;
    }

    console.log('🔓 Lifting ban ID:', id);
    setSearchResults((prev) => prev.filter((ban) => ban.id !== id));
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">Search Ban</h1>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex items-end gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={searchRequest}
            onChange={(e) => setSearchRequest(e.target.value)}
            placeholder="Account username"
            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none transition-colors"
          />
        </div>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3"
        >
          Search
        </Button>
      </form>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/50 rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/50 flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      {hasSearched && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1"
        >
          {/* Results Table (col-md-12) */}
          <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50 bg-black/30">
                    <th
                      colSpan={6}
                      className="px-6 py-4 text-left text-white font-medium"
                    >
                      Search Results for{' '}
                      <span className="text-red-500 italic">{searchRequest}</span>
                    </th>
                  </tr>
                </thead>
                <thead>
                  <tr className="border-b border-gray-700/50 bg-black/20">
                    <th className="px-6 py-3 text-left text-gray-400 font-medium">
                      Account
                    </th>
                    <th className="px-6 py-3 text-left text-gray-400 font-medium">
                      Banned By
                    </th>
                    <th className="px-6 py-3 text-left text-gray-400 font-medium">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-gray-400 font-medium">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-gray-400 font-medium">
                      Days
                    </th>
                    <th className="px-6 py-3 text-right text-gray-400 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((ban, index) => (
                    <motion.tr
                      key={ban.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-700/30 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <a
                          href="#"
                          className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          {ban.account_id}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href="#"
                          className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          {ban.banned_by}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {ban.ban_type === 'temporal' ? (
                          <span className="inline-flex items-center px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm border border-gray-500/50">
                            Temporal
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/50">
                            Permanent
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-300">{formatDate(ban.ban_date)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-300">{ban.ban_days}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setShowReason(showReason === ban.id ? null : ban.id)}
                            className="inline-flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded transition-colors"
                            title={ban.ban_reason}
                          >
                            <Info className="w-3 h-3" />
                            Reason
                          </button>
                          <button
                            onClick={() => handleLiftBan(ban.id, ban.account_id)}
                            className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                          >
                            Lift Ban
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reason Tooltips */}
            <AnimatePresence>
              {showReason !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-700/50 bg-yellow-500/5"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-white font-medium mb-1">Ban Reason</h4>
                        <p className="text-yellow-300/80 text-sm">
                          {searchResults.find((b) => b.id === showReason)?.ban_reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Search Ban Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Search for ban records by account username. The search supports partial matches and returns up to 25 results.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Account:</strong> The banned account username (clickable to view account info)</li>
              <li><strong>Banned By:</strong> The admin/GM who issued the ban</li>
              <li><strong>Type:</strong> Temporal (temporary) or Permanent ban</li>
              <li><strong>Date:</strong> When the ban was issued (YYYY-MM-DD HH:MM format)</li>
              <li><strong>Days:</strong> Duration in days (0 for permanent bans)</li>
              <li><strong>Reason:</strong> Click to view the ban reason (tooltip)</li>
              <li><strong>Lift Ban:</strong> Remove the ban from the account</li>
              <li>Results are limited to TOP 25 most recent bans</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
