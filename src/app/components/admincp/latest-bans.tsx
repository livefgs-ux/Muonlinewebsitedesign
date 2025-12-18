import { useState } from 'react';
import { motion } from 'motion/react';
import { Ban, User, Calendar, Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface BanRecord {
  id: number;
  account_id: string;
  banned_by: string;
  ban_date: number; // Unix timestamp
  ban_days: number | null; // null for permanent
  ban_reason: string;
  ban_type: 'temporal' | 'permanent';
}

export function LatestBans() {
  const [activeTab, setActiveTab] = useState<'temporal' | 'permanent'>('temporal');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [liftingBanId, setLiftingBanId] = useState<number | null>(null);

  // Mock data - in production, this would come from database
  const mockTemporalBans: BanRecord[] = [
    {
      id: 1,
      account_id: 'CheatUser123',
      banned_by: 'Admin1',
      ban_date: Date.now() - 86400000 * 2, // 2 days ago
      ban_days: 7,
      ban_reason: 'Using third-party software (auto-hunt bot)',
      ban_type: 'temporal',
    },
    {
      id: 2,
      account_id: 'Hacker456',
      banned_by: 'GameMaster',
      ban_date: Date.now() - 3600000 * 5, // 5 hours ago
      ban_days: 3,
      ban_reason: 'Item duplication exploit',
      ban_type: 'temporal',
    },
    {
      id: 3,
      account_id: 'Spammer789',
      banned_by: 'Admin2',
      ban_date: Date.now() - 3600000 * 12, // 12 hours ago
      ban_days: 1,
      ban_reason: 'Spam in global chat',
      ban_type: 'temporal',
    },
    {
      id: 4,
      account_id: 'BugAbuser',
      banned_by: 'Admin1',
      ban_date: Date.now() - 86400000 * 5, // 5 days ago
      ban_days: 14,
      ban_reason: 'Exploiting game bugs for personal gain',
      ban_type: 'temporal',
    },
  ];

  const mockPermanentBans: BanRecord[] = [
    {
      id: 5,
      account_id: 'RealMoneySeller',
      banned_by: 'Admin1',
      ban_date: Date.now() - 86400000 * 10, // 10 days ago
      ban_days: null,
      ban_reason: 'Real money trading (RMT) - selling game items for real currency',
      ban_type: 'permanent',
    },
    {
      id: 6,
      account_id: 'MajorHacker',
      banned_by: 'GameMaster',
      ban_date: Date.now() - 86400000 * 15, // 15 days ago
      ban_days: null,
      ban_reason: 'Multiple serious violations: hacking, duping, and account theft',
      ban_type: 'permanent',
    },
    {
      id: 7,
      account_id: 'Scammer99',
      banned_by: 'Admin2',
      ban_date: Date.now() - 86400000 * 7, // 7 days ago
      ban_days: null,
      ban_reason: 'Scamming players for items and zen',
      ban_type: 'permanent',
    },
  ];

  const handleLiftBan = async (banId: number, accountId: string) => {
    setLiftingBanId(banId);
    setErrorMessage('');
    setShowSuccess(false);

    // Simulate: Lift ban process
    setTimeout(() => {
      console.log('🔓 Lifting ban:');
      console.log('Ban ID:', banId);
      console.log('Account ID:', accountId);
      console.log('Updating MEMB_INFO: SET bloc_code = 0');
      console.log('Deleting from ban log table');
      console.log('Deleting from bans table');

      setSuccessMessage(`Account ban lifted successfully for ${accountId}`);
      setShowSuccess(true);
      setLiftingBanId(null);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');
  };

  const currentBans = activeTab === 'temporal' ? mockTemporalBans : mockPermanentBans;
  const totalTemporalBans = mockTemporalBans.length;
  const totalPermanentBans = mockPermanentBans.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">Last 50 Bans</h1>
        <p className="text-gray-400">Recent ban records - Temporal and Permanent bans</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="text-green-300 font-medium">{successMessage}</div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div className="text-red-300 font-medium">{errorMessage}</div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-lg bg-rose-500/5 border-rose-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Bans</p>
              <p className="text-3xl text-rose-500 font-bold">{totalTemporalBans + totalPermanentBans}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-rose-500/20 flex items-center justify-center border border-rose-500/50">
              <Ban className="w-6 h-6 text-rose-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Temporal Bans</p>
              <p className="text-3xl text-yellow-500 font-bold">{totalTemporalBans}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
              <Calendar className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-red-500/5 border-red-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Permanent Bans</p>
              <p className="text-3xl text-red-500 font-bold">{totalPermanentBans}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/50">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-purple-500/5 border-purple-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Bans</p>
              <p className="text-3xl text-purple-500 font-bold">{totalTemporalBans + totalPermanentBans}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Bans List with Tabs */}
      <Card className="backdrop-blur-lg bg-gray-900/50 border-rose-500/30 overflow-hidden">
        {/* Tabs Header */}
        <div className="flex border-b border-gray-700/50">
          <button
            onClick={() => setActiveTab('temporal')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
              activeTab === 'temporal'
                ? 'bg-yellow-500/10 text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Temporal</span>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                {totalTemporalBans}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('permanent')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
              activeTab === 'permanent'
                ? 'bg-red-500/10 text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Permanent</span>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                {totalPermanentBans}
              </span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {currentBans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Account</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Banned By</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                    {activeTab === 'temporal' && (
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Days</th>
                    )}
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Reason</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBans.map((ban) => (
                    <motion.tr
                      key={ban.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-700/30 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-white font-medium">{ban.account_id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-yellow-500">{ban.banned_by}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300 text-sm font-mono">{formatDate(ban.ban_date)}</span>
                      </td>
                      {activeTab === 'temporal' && (
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full border border-yellow-500/30">
                            {ban.ban_days} {ban.ban_days === 1 ? 'day' : 'days'}
                          </span>
                        </td>
                      )}
                      <td className="py-4 px-4">
                        <span className="text-gray-300 text-sm">{ban.ban_reason}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleLiftBan(ban.id, ban.account_id)}
                          disabled={liftingBanId === ban.id}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {liftingBanId === ban.id ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Lifting...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <X className="w-4 h-4" />
                              <span>Lift Ban</span>
                            </div>
                          )}
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/50">
                <Ban className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-gray-400 text-lg mb-2">No {activeTab} bans found</p>
              <p className="text-gray-500 text-sm">
                There are no {activeTab} bans logged in the system.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50">
            <AlertTriangle className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl text-white">About Ban System</h3>
        </div>
        <div className="space-y-2 text-blue-300/70 text-sm">
          <p>
            <strong className="text-blue-300">Temporal Bans:</strong> Temporary suspensions with a specific duration (in days). 
            The account will be automatically unbanned after the ban period expires.
          </p>
          <p>
            <strong className="text-blue-300">Permanent Bans:</strong> Indefinite suspensions that require manual intervention to lift. 
            These are typically applied for serious violations of server rules.
          </p>
          <p>
            <strong className="text-blue-300">Lift Ban:</strong> Clicking "Lift Ban" will immediately unban the account, 
            remove all ban records from the database, and allow the player to log in again.
          </p>
        </div>
      </Card>
    </div>
  );
}
