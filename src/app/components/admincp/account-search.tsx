import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, AlertCircle, XCircle, User, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface AccountSearchProps {
  onViewAccount?: (accountId: string) => void;
}

interface AccountResult {
  memb___id: string;
  memb__usr: string;
}

export function AccountSearch({ onViewAccount }: AccountSearchProps) {
  const [searchRequest, setSearchRequest] = useState('');
  const [searchResults, setSearchResults] = useState<AccountResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock accounts for demonstration
  const mockAccounts: AccountResult[] = [
    { memb___id: 'admin', memb__usr: 'admin' },
    { memb___id: 'player1', memb__usr: 'player1' },
    { memb___id: 'testaccount', memb__usr: 'testaccount' },
    { memb___id: 'gamemaster', memb__usr: 'gamemaster' },
    { memb___id: 'admin2', memb__usr: 'admin2' },
    { memb___id: 'player123', memb__usr: 'player123' },
    { memb___id: 'testuser', memb__usr: 'testuser' },
    { memb___id: 'muonline', memb__usr: 'muonline' },
    { memb___id: 'administrator', memb__usr: 'administrator' },
    { memb___id: 'playertest', memb__usr: 'playertest' },
  ];

  const validateAlphaNumeric = (str: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(str);
  };

  const validateLength = (str: string, max: number, min: number): boolean => {
    return str.length >= min && str.length <= max;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSearchResults([]);
    setHasSearched(false);

    try {
      // Validation
      if (!validateAlphaNumeric(searchRequest)) {
        throw new Error('The username entered must contain alpha-numeric characters only.');
      }

      if (!validateLength(searchRequest, 10, 3)) {
        throw new Error('The username can be 3 to 10 characters long.');
      }

      console.log('🔍 Searching for:', searchRequest);
      console.log('📊 SQL Query:', `SELECT memb___id, memb__usr FROM MEMB_INFO WHERE memb__usr LIKE '%${searchRequest}%'`);

      // Simulate database query with LIKE '%search%'
      const searchLower = searchRequest.toLowerCase();
      const filtered = mockAccounts.filter((account) =>
        account.memb__usr.toLowerCase().includes(searchLower)
      );

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">Search Account</h1>
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Results Table (col-md-6) */}
          <div>
            <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50 bg-black/30">
                      <th
                        colSpan={2}
                        className="px-6 py-4 text-left text-white font-medium"
                      >
                        Search Results for{' '}
                        <span className="text-red-500 italic">{searchRequest}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((account, index) => (
                      <motion.tr
                        key={account.memb___id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-700/30 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-sky-400" />
                            <span className="text-white">{account.memb__usr}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            onClick={() =>
                              onViewAccount && onViewAccount(account.memb___id)
                            }
                            className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1"
                          >
                            Account Information
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Empty column (col-md-6) */}
          <div></div>
        </motion.div>
      )}

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Search Account Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              Search for accounts by username. The search supports partial matches.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Username:</strong> Must contain only alpha-numeric characters (a-z, A-Z, 0-9)</li>
              <li><strong>Length:</strong> Must be between 3 and 10 characters</li>
              <li><strong>Search:</strong> Supports partial matching (e.g., "admin" will find "admin", "admin2", "administrator")</li>
              <li><strong>Results:</strong> Click "Account Information" to view full account details</li>
              <li>The search is performed using SQL LIKE operator with wildcards</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
