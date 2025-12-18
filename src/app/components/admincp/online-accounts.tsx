import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Server,
  Globe,
  Activity,
  ExternalLink,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface OnlineAccount {
  account: string;
  ipAddress: string;
  server: string;
  loginTime?: string;
  characters?: number;
}

interface ServerStats {
  server: string;
  count: number;
}

export function OnlineAccounts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock data - In production, this would come from MEMB_STAT table queries
  const serverList: ServerStats[] = [
    { server: 'Server 1', count: 45 },
    { server: 'Server 2', count: 67 },
    { server: 'Server 3', count: 34 },
    { server: 'Server 4', count: 10 },
  ];

  const onlineAccounts: OnlineAccount[] = [
    { account: 'Player001', ipAddress: '192.168.1.100', server: 'Server 1', loginTime: '2h ago', characters: 2 },
    { account: 'GuildMaster', ipAddress: '192.168.1.101', server: 'Server 1', loginTime: '1h ago', characters: 1 },
    { account: 'DarkKnight99', ipAddress: '192.168.1.102', server: 'Server 2', loginTime: '45m ago', characters: 3 },
    { account: 'MageSupreme', ipAddress: '192.168.1.103', server: 'Server 2', loginTime: '30m ago', characters: 1 },
    { account: 'AssassinPro', ipAddress: '192.168.1.104', server: 'Server 2', loginTime: '25m ago', characters: 2 },
    { account: 'SummonerX', ipAddress: '192.168.1.105', server: 'Server 3', loginTime: '20m ago', characters: 1 },
    { account: 'WarriorKing', ipAddress: '192.168.1.106', server: 'Server 3', loginTime: '15m ago', characters: 2 },
    { account: 'ElfQueen', ipAddress: '192.168.1.107', server: 'Server 4', loginTime: '10m ago', characters: 1 },
  ];

  const totalOnline = serverList.reduce((sum, server) => sum + server.count, 0);

  // Filter accounts by search term
  const filteredAccounts = onlineAccounts.filter(
    (account) =>
      account.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.ipAddress.includes(searchTerm) ||
      account.server.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    console.log('🔄 Refreshing online accounts...');
    console.log('Querying MEMB_STAT table...');
    console.log('SELECT ConnectStat, IP, ServerName FROM MEMB_STAT WHERE ConnectStat = 1');
    setLastUpdate(new Date());
  };

  const handleViewAccount = (accountId: string) => {
    console.log('👁️ Viewing account:', accountId);
    console.log('Navigate to accountinfo&u=' + accountId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-white mb-2">Online Accounts</h1>
          <p className="text-gray-400">Currently connected players across all servers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500">Last update</p>
            <p className="text-sm text-gray-400">{lastUpdate.toLocaleTimeString()}</p>
          </div>
          <Button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Auto Refresh Toggle */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-white font-medium">Auto Refresh</h3>
              <p className="text-gray-400 text-sm">Automatically update every 30 seconds</p>
            </div>
          </div>
          <label className="relative inline-block w-14 h-8 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </Card>

      {/* By Server Stats */}
      <div>
        <h3 className="text-2xl text-white mb-4 flex items-center gap-2">
          <Server className="w-6 h-6 text-sky-400" />
          By Server:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serverList.map((server, index) => (
            <motion.div
              key={server.server}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-lg bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-500/30 p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-blue-500/50">
                    <Server className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">{server.server}</h4>
                  <div className="bg-black/30 rounded-lg py-3 px-4 border border-blue-500/20">
                    <p className="text-3xl text-blue-400 font-bold">{server.count.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm mt-1">online</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Total Online */}
      <div>
        <h3 className="text-2xl text-white mb-4 flex items-center gap-2">
          <Globe className="w-6 h-6 text-green-400" />
          Total Online:
        </h3>
        <Card className="backdrop-blur-lg bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-green-500/30 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Accounts Online</p>
                <p className="text-5xl text-green-400 font-bold">{totalOnline.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/50 inline-block">
                <p className="text-green-300 text-sm">
                  <Activity className="w-4 h-4 inline mr-1" />
                  Live
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Account List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400" />
            Account List:
          </h3>
          <div className="text-gray-400 text-sm">
            Showing {filteredAccounts.length} of {onlineAccounts.length} accounts
          </div>
        </div>

        {/* Search */}
        <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by account, IP address or server..."
              className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none transition-colors"
            />
          </div>
        </Card>

        {/* Table */}
        {filteredAccounts.length > 0 ? (
          <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50 bg-black/30">
                    <th className="px-6 py-4 text-left text-gray-400 font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Account
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 font-medium">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        IP Address
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 font-medium">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        Server
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 font-medium">Login Time</th>
                    <th className="px-6 py-4 text-center text-gray-400 font-medium">Characters</th>
                    <th className="px-6 py-4 text-center text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-700/30 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewAccount(account.account)}
                          className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-2 transition-colors"
                        >
                          {account.account}
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-gray-300 bg-black/50 px-3 py-1 rounded border border-gray-700/50 text-sm font-mono">
                          {account.ipAddress}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm">
                          {account.server}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Activity className="w-4 h-4 text-green-500" />
                          {account.loginTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-semibold">
                          {account.characters}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          onClick={() => handleViewAccount(account.account)}
                          size="sm"
                          variant="outline"
                          className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
                        >
                          View Details
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl text-yellow-300 font-semibold mb-2">No Online Accounts</h3>
              <p className="text-gray-400">
                {searchTerm
                  ? 'No accounts match your search criteria.'
                  : 'There are no online accounts at this moment.'}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Info Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50 flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Online Accounts Information</h3>
            <p className="text-blue-300/70 text-sm mb-2">
              This page displays real-time information about currently connected accounts across all game servers.
            </p>
            <ul className="text-blue-300/70 text-sm space-y-1 list-disc list-inside">
              <li><strong>Data Source:</strong> MEMB_STAT table (ConnectStat = 1)</li>
              <li><strong>By Server:</strong> Accounts grouped by game server</li>
              <li><strong>Total Online:</strong> Sum of all online accounts across servers</li>
              <li><strong>Account List:</strong> Detailed view with IP addresses and server info</li>
              <li>Click on an account name to view detailed account information</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
