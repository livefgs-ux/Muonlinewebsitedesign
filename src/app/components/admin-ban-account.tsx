import { motion } from 'motion/react';
import { AlertTriangle, Ban, Calendar, FileText, Shield, User } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

export function AdminBanAccount() {
  const [banAccount, setBanAccount] = useState('');
  const [banDays, setBanDays] = useState('0');
  const [banReason, setBanReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBanAccount = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!banAccount.trim()) {
      alert('Please enter the account username.');
      return;
    }

    const days = parseInt(banDays);
    if (isNaN(days) || days < 0) {
      alert('Invalid ban days. Must be 0 or greater.');
      return;
    }

    if (banReason.length > 100) {
      alert('Ban reason too long (max 100 characters).');
      return;
    }

    setIsSubmitting(true);

    // Simulate: Check if account exists, is online, is already banned
    // Simulate: INSERT INTO WEBENGINE_BAN_LOG
    // Simulate: if temporal (days > 0) INSERT INTO WEBENGINE_BANS
    // Simulate: UPDATE MEMB_INFO SET bloc_code = 1
    // Simulate: Add ban system cron if doesn't exist

    setTimeout(() => {
      const banType = days >= 1 ? 'temporal' : 'permanent';
      
      console.log('🔨 Ban Account Submitted:');
      console.log('Account:', banAccount);
      console.log('Days:', days, `(${banType})`);
      console.log('Reason:', banReason || '(none)');
      console.log('Banned by:', 'Administrator (current session)');
      console.log('Ban date:', new Date().toISOString());

      // Simulate database operations:
      // 1. Check if ban system cron exists, if not add it
      console.log('✅ Ban System Cron verified/added');
      
      // 2. Log ban to WEBENGINE_BAN_LOG
      console.log('✅ Ban logged to ban_log table');
      
      // 3. If temporal ban, add to WEBENGINE_BANS
      if (banType === 'temporal') {
        console.log(`✅ Temporal ban added (expires in ${days} days)`);
      }
      
      // 4. Update MEMB_INFO bloc_code = 1
      console.log('✅ Account blocked in database');

      setShowSuccess(true);
      setIsSubmitting(false);

      // Reset form
      setBanAccount('');
      setBanDays('0');
      setBanReason('');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl border border-red-500/30">
          <Ban className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl text-white">Ban Account</h1>
          <p className="text-red-300/70 mt-1">
            Permanently or temporarily ban accounts from the server
          </p>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-green-300 font-medium">Account Banned Successfully</div>
              <div className="text-green-400/70 text-sm mt-1">
                The account has been blocked and all ban logs have been recorded.
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Ban Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-red-500/5 to-red-600/5 border-red-500/20 backdrop-blur-xl">
          <div className="p-6">
            <form onSubmit={handleBanAccount} className="space-y-6">
              {/* Account Input */}
              <div>
                <label htmlFor="ban_account" className="flex items-center gap-2 text-red-200 mb-2">
                  <User className="w-4 h-4" />
                  Account Username
                </label>
                <input
                  type="text"
                  id="ban_account"
                  value={banAccount}
                  onChange={(e) => setBanAccount(e.target.value)}
                  className="w-full bg-obsidian/50 border border-red-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="Enter account username"
                  disabled={isSubmitting}
                />
                <p className="text-red-300/50 text-sm mt-2">
                  The username of the account to ban
                </p>
              </div>

              {/* Days Input */}
              <div>
                <label htmlFor="ban_days" className="flex items-center gap-2 text-red-200 mb-2">
                  <Calendar className="w-4 h-4" />
                  Ban Duration (Days)
                </label>
                <input
                  type="number"
                  id="ban_days"
                  value={banDays}
                  onChange={(e) => setBanDays(e.target.value)}
                  min="0"
                  className="w-full bg-obsidian/50 border border-red-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="0"
                  disabled={isSubmitting}
                />
                <p className="text-red-300/50 text-sm mt-2">
                  Enter 0 for <span className="text-red-400 font-medium">permanent ban</span>, or number of days for temporal ban
                </p>
              </div>

              {/* Reason Input */}
              <div>
                <label htmlFor="ban_reason" className="flex items-center gap-2 text-red-200 mb-2">
                  <FileText className="w-4 h-4" />
                  Ban Reason <span className="text-red-400/50 text-sm">(optional)</span>
                </label>
                <input
                  type="text"
                  id="ban_reason"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  maxLength={100}
                  className="w-full bg-obsidian/50 border border-red-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="Enter reason for ban (max 100 characters)"
                  disabled={isSubmitting}
                />
                <p className="text-red-300/50 text-sm mt-2">
                  Optional description for the ban reason ({banReason.length}/100)
                </p>
              </div>

              {/* Warning Box */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <div className="text-red-300 font-medium">Important Notes:</div>
                    <ul className="text-red-300/70 text-sm space-y-1 list-disc list-inside">
                      <li>The account must exist in the database</li>
                      <li>The account cannot be currently online</li>
                      <li>The account cannot be already banned</li>
                      <li>Temporal bans will be automatically lifted after the specified days</li>
                      <li>All bans are logged to the ban history table</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Banning Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Ban className="w-5 h-5" />
                    <span>Ban Account</span>
                  </div>
                )}
              </Button>
            </form>
          </div>
        </Card>
      </motion.div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20 backdrop-blur-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-red-400" />
                <h3 className="text-xl text-red-200">Temporal Bans</h3>
              </div>
              <div className="text-red-300/70 space-y-2 text-sm">
                <p>
                  Temporal bans are automatically lifted after the specified number of days.
                </p>
                <p>
                  A cron job runs every hour to check for expired bans and unblock accounts.
                </p>
                <p className="text-red-400">
                  Example: Setting 7 days will unban the account after 7 days automatically.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-red-500/5 to-pink-500/5 border-red-500/20 backdrop-blur-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-red-400" />
                <h3 className="text-xl text-red-200">Permanent Bans</h3>
              </div>
              <div className="text-red-300/70 space-y-2 text-sm">
                <p>
                  Permanent bans (0 days) will never expire automatically.
                </p>
                <p>
                  You must manually unban the account through the Unban Account section.
                </p>
                <p className="text-red-400">
                  Use permanent bans for serious violations or repeat offenders.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Database Simulation Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl text-purple-200">System Operations</h3>
            </div>
            <div className="text-purple-300/70 space-y-2 text-sm">
              <p className="font-medium text-purple-300">When you ban an account, the system will:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Verify the ban system cron job exists (adds if missing)</li>
                <li>Check if the account exists in the database</li>
                <li>Verify the account is not currently online</li>
                <li>Confirm the account is not already banned</li>
                <li>Log the ban to <code className="text-purple-400 bg-purple-500/10 px-1 rounded">WEBENGINE_BAN_LOG</code></li>
                <li>If temporal: Add entry to <code className="text-purple-400 bg-purple-500/10 px-1 rounded">WEBENGINE_BANS</code></li>
                <li>Update <code className="text-purple-400 bg-purple-500/10 px-1 rounded">MEMB_INFO.bloc_code = 1</code></li>
              </ol>
              <p className="text-purple-400 mt-4">
                📌 In production, this connects to your MU Online database and executes real SQL queries.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
