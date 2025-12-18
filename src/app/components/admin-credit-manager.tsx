import { motion } from 'motion/react';
import { DollarSign, Plus, Minus, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Clock, Server } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface CreditLog {
  log_id: number;
  log_config: string;
  log_identifier: string;
  log_credits: number;
  log_transaction: 'add' | 'subtract';
  log_date: number;
  log_module: string;
  log_ip: string;
  log_inadmincp: boolean;
}

interface CreditConfig {
  config_id: number;
  config_title: string;
  config_user_col_id: string;
}

export function AdminCreditManager() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Available credit configurations (from database)
  const creditConfigs: CreditConfig[] = [
    { config_id: 1, config_title: 'WCoin (Cash Credits)', config_user_col_id: 'username' },
    { config_id: 2, config_title: 'GoblinPoints', config_user_col_id: 'username' },
  ];

  // Form state
  const [selectedConfig, setSelectedConfig] = useState<number>(1);
  const [identifier, setIdentifier] = useState('');
  const [credits, setCredits] = useState<number>(0);
  const [transaction, setTransaction] = useState<'add' | 'subtract'>('add');

  // Mock logs data - in production, this would come from database
  const [logs, setLogs] = useState<CreditLog[]>([
    {
      log_id: 1,
      log_config: 'WCoin (Cash Credits)',
      log_identifier: 'PlayerX',
      log_credits: 500,
      log_transaction: 'add',
      log_date: Date.now() / 1000 - 7200, // 2 hours ago
      log_module: 'AdminCP Manual',
      log_ip: '192.168.1.100',
      log_inadmincp: true,
    },
    {
      log_id: 2,
      log_config: 'GoblinPoints',
      log_identifier: 'PlayerY',
      log_credits: 100,
      log_transaction: 'subtract',
      log_date: Date.now() / 1000 - 3600, // 1 hour ago
      log_module: 'AdminCP Manual',
      log_ip: '192.168.1.101',
      log_inadmincp: true,
    },
    {
      log_id: 3,
      log_config: 'WCoin (Cash Credits)',
      log_identifier: 'PlayerZ',
      log_credits: 1000,
      log_transaction: 'add',
      log_date: Date.now() / 1000 - 1800, // 30 mins ago
      log_module: 'PayPal Donation',
      log_ip: '192.168.1.102',
      log_inadmincp: false,
    },
    {
      log_id: 4,
      log_config: 'GoblinPoints',
      log_identifier: 'PlayerA',
      log_credits: 250,
      log_transaction: 'add',
      log_date: Date.now() / 1000 - 900, // 15 mins ago
      log_module: 'AdminCP Manual',
      log_ip: '192.168.1.103',
      log_inadmincp: true,
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!identifier.trim()) {
      setErrorMessage('Identifier is required.');
      return;
    }

    if (!credits || credits <= 0) {
      setErrorMessage('Credits must be greater than 0.');
      return;
    }

    setIsSubmitting(true);

    // Simulate: Process transaction
    setTimeout(() => {
      const selectedConfigData = creditConfigs.find(c => c.config_id === selectedConfig);
      
      console.log('💰 Credit Transaction:');
      console.log('Config:', selectedConfigData?.config_title);
      console.log('Identifier:', identifier);
      console.log('Credits:', credits);
      console.log('Transaction:', transaction);
      console.log('User Column ID:', selectedConfigData?.config_user_col_id);

      // Add new log entry
      const newLog: CreditLog = {
        log_id: Math.max(...logs.map(l => l.log_id), 0) + 1,
        log_config: selectedConfigData?.config_title || '',
        log_identifier: identifier,
        log_credits: credits,
        log_transaction: transaction,
        log_date: Date.now() / 1000,
        log_module: 'AdminCP Manual',
        log_ip: '192.168.1.1',
        log_inadmincp: true,
      };

      setLogs([newLog, ...logs]);

      // Reset form
      setIdentifier('');
      setCredits(0);
      setTransaction('add');

      setSuccessMessage('Transaction completed successfully!');
      setShowSuccess(true);
      setIsSubmitting(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 800);
  };

  const getIdentifierLabel = () => {
    const config = creditConfigs.find(c => c.config_id === selectedConfig);
    if (!config) return 'Identifier';

    switch (config.config_user_col_id) {
      case 'userid':
        return 'User ID';
      case 'username':
        return 'Username';
      case 'email':
        return 'Email';
      case 'character':
        return 'Character Name';
      default:
        return 'Identifier';
    }
  };

  const getIdentifierPlaceholder = () => {
    const config = creditConfigs.find(c => c.config_id === selectedConfig);
    if (!config) return 'Enter identifier';

    switch (config.config_user_col_id) {
      case 'userid':
        return 'Enter user ID';
      case 'username':
        return 'Enter username';
      case 'email':
        return 'Enter email';
      case 'character':
        return 'Enter character name';
      default:
        return 'Enter identifier';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl border border-green-500/30">
          <DollarSign className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl text-white">Credit Manager</h1>
          <p className="text-green-300/70 mt-1">
            Add or subtract credits manually
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
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="text-red-300 font-medium">{errorMessage}</div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border-blue-500/20 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl text-blue-200">Add/Subtract Credits</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Configuration Select */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Configuration:</label>
                    <select
                      value={selectedConfig}
                      onChange={(e) => setSelectedConfig(parseInt(e.target.value))}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      disabled={isSubmitting}
                    >
                      {creditConfigs.map((config) => (
                        <option key={config.config_id} value={config.config_id}>
                          {config.config_title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Identifier */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">{getIdentifierLabel()}:</label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder={getIdentifierPlaceholder()}
                      required
                      disabled={isSubmitting}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Depending on the selected configuration, this can be the userid, username, email or character name.
                    </p>
                  </div>

                  {/* Credits */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Credit(s):</label>
                    <input
                      type="number"
                      value={credits}
                      onChange={(e) => setCredits(parseInt(e.target.value) || 0)}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="0"
                      min="1"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Transaction Type */}
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Transaction Type:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="transaction"
                          checked={transaction === 'add'}
                          onChange={() => setTransaction('add')}
                          className="w-4 h-4 text-green-500 focus:ring-green-500"
                          disabled={isSubmitting}
                        />
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">Add Credits</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="transaction"
                          checked={transaction === 'subtract'}
                          onChange={() => setTransaction('subtract')}
                          className="w-4 h-4 text-red-500 focus:ring-red-500"
                          disabled={isSubmitting}
                        />
                        <div className="flex items-center gap-2">
                          <Minus className="w-4 h-4 text-red-400" />
                          <span className="text-gray-300">Subtract Credits</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full ${
                        transaction === 'add'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      } text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          {transaction === 'add' ? (
                            <Plus className="w-5 h-5" />
                          ) : (
                            <Minus className="w-5 h-5" />
                          )}
                          <span>Execute Transaction</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Logs Column */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-yellow-500/5 to-amber-600/5 border-yellow-500/20 backdrop-blur-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl text-yellow-200">Transaction Logs</h2>
                </div>

                {logs.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-yellow-400/30 mx-auto mb-4" />
                    <p className="text-yellow-300/50">There are no logs to display.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-yellow-500/20">
                          <th className="text-left text-yellow-300/70 text-sm py-3 px-2">Config</th>
                          <th className="text-left text-yellow-300/70 text-sm py-3 px-2">Identifier</th>
                          <th className="text-left text-yellow-300/70 text-sm py-3 px-2">Credits</th>
                          <th className="text-left text-yellow-300/70 text-sm py-3 px-2">Transaction</th>
                          <th className="text-left text-yellow-300/70 text-sm py-3 px-2">Date</th>
                          <th className="text-left text-yellow-300/70 text-sm py-3 px-2">Module</th>
                          <th className="text-left text-yellow-300/70 text-sm py-3 px-2">IP</th>
                          <th className="text-left text-yellow-300/70 text-sm py-3 px-2">AdminCP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr
                            key={log.log_id}
                            className="border-b border-yellow-500/10 hover:bg-yellow-500/5 transition-colors"
                          >
                            <td className="text-yellow-200 text-sm py-3 px-2">{log.log_config}</td>
                            <td className="text-yellow-200 text-sm py-3 px-2 font-mono">{log.log_identifier}</td>
                            <td className="text-yellow-200 text-sm py-3 px-2 font-mono">{log.log_credits.toLocaleString()}</td>
                            <td className="py-3 px-2">
                              {log.log_transaction === 'add' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                                  <TrendingUp className="w-3 h-3" />
                                  Add
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs">
                                  <TrendingDown className="w-3 h-3" />
                                  Subtract
                                </span>
                              )}
                            </td>
                            <td className="text-yellow-200 text-xs py-3 px-2">{formatDate(log.log_date)}</td>
                            <td className="text-yellow-200 text-xs py-3 px-2">{log.log_module}</td>
                            <td className="text-yellow-200 text-xs py-3 px-2 font-mono">{log.log_ip}</td>
                            <td className="py-3 px-2">
                              {log.log_inadmincp ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                                  Yes
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-500/20 border border-gray-500/30 text-gray-400 text-xs">
                                  No
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border-blue-500/20 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl text-blue-200">Important Information</h3>
            </div>
            <div className="text-blue-300/70 space-y-2 text-sm">
              <p className="font-medium text-blue-300">
                Credit Manager Guidelines:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Select the appropriate credit configuration before processing transactions</li>
                <li>The identifier field changes based on the selected configuration (userid, username, email, or character name)</li>
                <li>All transactions are logged with timestamp, IP address, and module information</li>
                <li>Use "Add" to give credits to players and "Subtract" to remove credits</li>
                <li>Transaction logs help track all credit movements for auditing purposes</li>
              </ul>
              <p className="text-blue-400 mt-4">
                💡 <strong>Tip:</strong> Always verify the identifier before executing transactions to avoid crediting the wrong account!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
