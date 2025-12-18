import { useState } from 'react';
import { motion } from 'motion/react';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  User,
  Search,
  Filter,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface PayPalTransaction {
  id: number;
  transaction_id: string;
  user_id: string;
  account_username: string; // Joined from MEMB_INFO
  payment_amount: number;
  paypal_email: string;
  transaction_date: number; // Unix timestamp
  transaction_status: 0 | 1; // 0 = reversed, 1 = ok
}

export function PayPalDonations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ok' | 'reversed'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Mock data - in production, this would come from database
  const mockTransactions: PayPalTransaction[] = [
    {
      id: 1,
      transaction_id: 'PAYID-M3XYZ123ABC',
      user_id: 'player1',
      account_username: 'PlayerOne',
      payment_amount: 50.00,
      paypal_email: 'player1@email.com',
      transaction_date: Date.now() - 86400000 * 2, // 2 days ago
      transaction_status: 1,
    },
    {
      id: 2,
      transaction_id: 'PAYID-M4ABC456DEF',
      user_id: 'player2',
      account_username: 'MegaPlayer',
      payment_amount: 100.00,
      paypal_email: 'player2@email.com',
      transaction_date: Date.now() - 3600000 * 5, // 5 hours ago
      transaction_status: 1,
    },
    {
      id: 3,
      transaction_id: 'PAYID-M5DEF789GHI',
      user_id: 'player3',
      account_username: 'ProGamer',
      payment_amount: 25.00,
      paypal_email: 'player3@email.com',
      transaction_date: Date.now() - 86400000 * 7, // 7 days ago
      transaction_status: 0, // reversed
    },
    {
      id: 4,
      transaction_id: 'PAYID-M6GHI012JKL',
      user_id: 'player4',
      account_username: 'EpicWarrior',
      payment_amount: 75.00,
      paypal_email: 'player4@email.com',
      transaction_date: Date.now() - 86400000 * 1, // 1 day ago
      transaction_status: 1,
    },
    {
      id: 5,
      transaction_id: 'PAYID-M7JKL345MNO',
      user_id: 'player5',
      account_username: 'DarkKnight',
      payment_amount: 150.00,
      paypal_email: 'player5@email.com',
      transaction_date: Date.now() - 3600000 * 12, // 12 hours ago
      transaction_status: 1,
    },
    {
      id: 6,
      transaction_id: 'PAYID-M8MNO678PQR',
      user_id: 'player6',
      account_username: 'MagicMage',
      payment_amount: 30.00,
      paypal_email: 'player6@email.com',
      transaction_date: Date.now() - 86400000 * 14, // 14 days ago
      transaction_status: 1,
    },
    {
      id: 7,
      transaction_id: 'PAYID-M9PQR901STU',
      user_id: 'player7',
      account_username: 'StealthElf',
      payment_amount: 20.00,
      paypal_email: 'player7@email.com',
      transaction_date: Date.now() - 86400000 * 30, // 30 days ago
      transaction_status: 0, // reversed
    },
  ];

  // Calculate statistics
  const totalTransactions = mockTransactions.length;
  const successfulTransactions = mockTransactions.filter(t => t.transaction_status === 1).length;
  const reversedTransactions = mockTransactions.filter(t => t.transaction_status === 0).length;
  const totalAmount = mockTransactions
    .filter(t => t.transaction_status === 1)
    .reduce((sum, t) => sum + t.payment_amount, 0);
  const reversedAmount = mockTransactions
    .filter(t => t.transaction_status === 0)
    .reduce((sum, t) => sum + t.payment_amount, 0);

  // Filter transactions
  const filteredTransactions = mockTransactions.filter(transaction => {
    // Search filter
    const matchesSearch = 
      transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.account_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paypal_email.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'ok' && transaction.transaction_status === 1) ||
      (statusFilter === 'reversed' && transaction.transaction_status === 0);

    // Date filter
    let matchesDate = true;
    const now = Date.now();
    const transactionDate = transaction.transaction_date;
    
    if (dateFilter === 'today') {
      matchesDate = (now - transactionDate) < 86400000;
    } else if (dateFilter === 'week') {
      matchesDate = (now - transactionDate) < 86400000 * 7;
    } else if (dateFilter === 'month') {
      matchesDate = (now - transactionDate) < 86400000 * 30;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleExport = () => {
    console.log('📥 Exporting PayPal donations data...');
    // In production: Generate CSV/Excel export
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">PayPal Donations</h1>
        <p className="text-gray-400">Transaction history and donation management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Amount</p>
              <p className="text-3xl text-green-500 font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/50">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Transactions</p>
              <p className="text-3xl text-blue-500 font-bold">{totalTransactions}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
              <CreditCard className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-emerald-500/5 border-emerald-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Successful</p>
              <p className="text-3xl text-emerald-500 font-bold">{successfulTransactions}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-red-500/5 border-red-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Reversed</p>
              <p className="text-3xl text-red-500 font-bold">{reversedTransactions}</p>
              <p className="text-xs text-red-400 mt-1">-${reversedAmount.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/50">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="backdrop-blur-lg bg-gray-900/50 border-gray-700/50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Transaction ID, Account, Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Status</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-black/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="ok">Successful Only</option>
                <option value="reversed">Reversed Only</option>
              </select>
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Period</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="w-full bg-black/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 appearance-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="backdrop-blur-lg bg-gray-900/50 border-green-500/30 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50 bg-green-500/5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl text-white font-semibold">Transaction History</h3>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
              {filteredTransactions.length} transactions
            </span>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/30 border-b border-gray-700/50">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Transaction ID</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Account</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">PayPal Email</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Date</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {filteredTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="text-blue-400 font-mono text-sm">{transaction.transaction_id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => console.log('View account:', transaction.user_id)}
                        className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="font-medium">{transaction.account_username}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-green-400 font-bold text-lg">
                        ${transaction.payment_amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300 text-sm">{transaction.paypal_email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300 text-sm font-mono">{formatDate(transaction.transaction_date)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {transaction.transaction_status === 1 ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                          <CheckCircle className="w-4 h-4" />
                          OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30">
                          <XCircle className="w-4 h-4" />
                          Reversed
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600/50">
              <DollarSign className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg mb-2">No transactions found</p>
            <p className="text-gray-500 text-sm">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'There are no PayPal transactions in the database'}
            </p>
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50">
            <AlertTriangle className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl text-white">About PayPal Donations</h3>
        </div>
        <div className="space-y-2 text-blue-300/70 text-sm">
          <p>
            <strong className="text-blue-300">Transaction Tracking:</strong> All PayPal donations are automatically logged 
            with transaction IDs, amounts, and user information for complete transparency.
          </p>
          <p>
            <strong className="text-blue-300">Status Types:</strong> Transactions marked as "OK" have been successfully 
            processed and credits awarded. "Reversed" transactions indicate chargebacks or refunds.
          </p>
          <p>
            <strong className="text-blue-300">Account Integration:</strong> Click on any account username to view 
            detailed account information and transaction history.
          </p>
        </div>
      </Card>
    </div>
  );
}
