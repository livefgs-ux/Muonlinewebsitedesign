import { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Key,
  DollarSign,
  Shield,
  Globe,
  Clock,
  Server,
  AlertCircle,
  CheckCircle,
  XCircle,
  Save,
  Send,
  ChevronRight,
  Fingerprint,
  Activity,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface AccountInfoData {
  id: number;
  username: string;
  email: string;
  credits: number;
  tempCredits: number;
  masterKey: string;
  banned: boolean;
  banReason?: string;
  registeredDate: string;
  lastLogin: string;
  status: {
    online: boolean;
    server: string;
    connectedSince?: string;
  };
  characters: string[];
  ipAddresses: string[];
  connectionHistory: Array<{
    date: string;
    server: string;
    ip: string;
    hwid: string;
  }>;
}

// Mock data
const mockAccountData: AccountInfoData = {
  id: 10458,
  username: 'DarkKnight',
  email: 'darkknight@exemplo.com',
  credits: 1250,
  tempCredits: 300,
  masterKey: 'ABC123XYZ',
  banned: false,
  registeredDate: '2024-06-15T14:30:00',
  lastLogin: '2025-01-18T10:45:00',
  status: {
    online: true,
    server: 'Server 1',
    connectedSince: '2025-01-18T10:45:00'
  },
  characters: [
    'DarkKnight',
    'HolyPriest',
    'IceMage',
    'BladeMaster'
  ],
  ipAddresses: [
    '192.168.1.100',
    '192.168.1.105',
    '10.0.0.50'
  ],
  connectionHistory: [
    { date: '2025-01-18 10:45:23', server: 'Server 1', ip: '192.168.1.100', hwid: 'HWID-ABC123' },
    { date: '2025-01-17 18:20:15', server: 'Server 1', ip: '192.168.1.100', hwid: 'HWID-ABC123' },
    { date: '2025-01-17 14:30:45', server: 'Server 1', ip: '192.168.1.105', hwid: 'HWID-ABC123' },
    { date: '2025-01-16 20:15:30', server: 'Server 1', ip: '192.168.1.100', hwid: 'HWID-ABC123' },
    { date: '2025-01-16 09:00:12', server: 'Server 1', ip: '10.0.0.50', hwid: 'HWID-XYZ789' },
    { date: '2025-01-15 22:45:00', server: 'Server 1', ip: '192.168.1.100', hwid: 'HWID-ABC123' },
    { date: '2025-01-15 16:30:20', server: 'Server 1', ip: '192.168.1.100', hwid: 'HWID-ABC123' },
    { date: '2025-01-14 19:10:55', server: 'Server 1', ip: '192.168.1.105', hwid: 'HWID-ABC123' },
  ]
};

interface AccountInfoProps {
  accountId?: string;
}

export function AccountInfo({ accountId }: AccountInfoProps) {
  const [accountData] = useState<AccountInfoData>(mockAccountData);
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleChangePassword = () => {
    if (!newPassword) {
      alert('Please enter a new password');
      return;
    }
    // Simulate password change
    alert(`Password changed successfully! ${sendEmailNotification ? 'Email notification sent to user.' : ''}`);
    setNewPassword('');
    setShowPasswordForm(false);
  };

  const handleChangeEmail = () => {
    if (!newEmail) {
      alert('Please enter a new email');
      return;
    }
    // Simulate email change
    alert(`Email changed successfully! ${sendEmailNotification ? 'Email notification sent to previous email.' : ''}`);
    setNewEmail('');
    setShowEmailForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!accountId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl text-white mb-2">Account Information</h1>
          <p className="text-gray-400">View and manage account details</p>
        </div>

        <Card className="backdrop-blur-lg bg-gray-900/50 border-yellow-500/30 p-12">
          <div className="text-center text-gray-400">
            <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No account selected</p>
            <p className="text-sm mt-2">Please search for an account first</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl text-white mb-2">
          Account Information: <span className="text-emerald-500">{accountData.username}</span>
        </h1>
        <p className="text-gray-400">Complete account details and management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* General Information */}
          <Card className="backdrop-blur-lg bg-emerald-500/5 border-emerald-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xl text-emerald-400 font-semibold">General Information</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-700/50">
                <span className="text-gray-400">ID:</span>
                <span className="text-white font-mono">{accountData.id}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-700/50">
                <span className="text-gray-400">Username:</span>
                <span className="text-white font-semibold">{accountData.username}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-700/50">
                <span className="text-gray-400">Email:</span>
                <span className="text-sky-400">{accountData.email}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-700/50">
                <span className="text-gray-400">Credits:</span>
                <span className="text-yellow-500 font-semibold">{accountData.credits.toLocaleString('pt-BR')}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-700/50">
                <span className="text-gray-400">Temp Credits:</span>
                <span className="text-orange-500 font-semibold">{accountData.tempCredits.toLocaleString('pt-BR')}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-700/50">
                <span className="text-gray-400">Master Key:</span>
                <span className="text-purple-400 font-mono">{accountData.masterKey}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-700/50">
                <span className="text-gray-400">Banned:</span>
                {accountData.banned ? (
                  <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-500 text-sm flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Banned
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-500 text-sm flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                )}
              </div>
            </div>
          </Card>

          {/* Status Information */}
          <Card className="backdrop-blur-lg bg-sky-500/5 border-sky-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-sky-500" />
              </div>
              <h3 className="text-xl text-sky-400 font-semibold">Status Information</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-700/50">
                <span className="text-gray-400">Status:</span>
                {accountData.status.online ? (
                  <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-500 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-gray-500/20 border border-gray-500/30 text-gray-500 text-sm">
                    Offline
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-700/50">
                <span className="text-gray-400">Server:</span>
                <span className="text-white">{accountData.status.server}</span>
              </div>

              {accountData.status.connectedSince && (
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-gray-700/50">
                  <span className="text-gray-400">Connected Since:</span>
                  <span className="text-gray-300 text-sm">{formatDate(accountData.status.connectedSince)}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Characters */}
          <Card className="backdrop-blur-lg bg-violet-500/5 border-violet-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-violet-500" />
              </div>
              <h3 className="text-xl text-violet-400 font-semibold">Characters</h3>
            </div>

            {accountData.characters.length > 0 ? (
              <div className="space-y-2">
                {accountData.characters.map((character, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-700/50 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group"
                  >
                    <span className="text-white">{character}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-violet-500 transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                <p className="text-sm">No characters found</p>
              </div>
            )}
          </Card>

          {/* Change Password */}
          <Card className="backdrop-blur-lg bg-gray-900/50 border-yellow-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                <Key className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-xl text-yellow-400 font-semibold">Change Account's Password</h3>
            </div>

            {!showPasswordForm ? (
              <Button
                onClick={() => setShowPasswordForm(true)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">New Password:</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendEmail1"
                    checked={sendEmailNotification}
                    onChange={(e) => setSendEmailNotification(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-black/40 text-yellow-500 focus:ring-yellow-500"
                  />
                  <label htmlFor="sendEmail1" className="text-gray-400 text-sm cursor-pointer">
                    Send email to user about this change
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleChangePassword}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Password
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setNewPassword('');
                    }}
                    variant="outline"
                    className="border-gray-500 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Change Email */}
          <Card className="backdrop-blur-lg bg-gray-900/50 border-sky-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                <Mail className="w-5 h-5 text-sky-500" />
              </div>
              <h3 className="text-xl text-sky-400 font-semibold">Change Account's Email</h3>
            </div>

            {!showEmailForm ? (
              <Button
                onClick={() => setShowEmailForm(true)}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                <Mail className="w-4 h-4 mr-2" />
                Change Email
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">New Email:</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email address..."
                    className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendEmail2"
                    checked={sendEmailNotification}
                    onChange={(e) => setSendEmailNotification(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-black/40 text-sky-500 focus:ring-sky-500"
                  />
                  <label htmlFor="sendEmail2" className="text-gray-400 text-sm cursor-pointer">
                    Send email to user about this change
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleChangeEmail}
                    className="flex-1 bg-sky-500 hover:bg-sky-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Email
                  </Button>
                  <Button
                    onClick={() => {
                      setShowEmailForm(false);
                      setNewEmail('');
                    }}
                    variant="outline"
                    className="border-gray-500 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* IP Addresses */}
          <Card className="backdrop-blur-lg bg-orange-500/5 border-orange-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-xl text-orange-400 font-semibold">Account's IP Addresses</h3>
            </div>

            {accountData.ipAddresses.length > 0 ? (
              <div className="space-y-2">
                {accountData.ipAddresses.map((ip, index) => (
                  <a
                    key={index}
                    href={`http://whatismyipaddress.com/ip/${ip}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-700/50 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
                  >
                    <span className="text-white font-mono">{ip}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                <p className="text-sm">No IP addresses found</p>
              </div>
            )}
          </Card>

          {/* Connection History */}
          <Card className="backdrop-blur-lg bg-cyan-500/5 border-cyan-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-500" />
              </div>
              <h3 className="text-xl text-cyan-400 font-semibold">Connection History (Last 25)</h3>
            </div>

            {accountData.connectionHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left text-gray-400 text-sm py-3 px-2">Date</th>
                      <th className="text-left text-gray-400 text-sm py-3 px-2 hidden md:table-cell">Server</th>
                      <th className="text-left text-gray-400 text-sm py-3 px-2">IP</th>
                      <th className="text-left text-gray-400 text-sm py-3 px-2 hidden lg:table-cell">HWID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountData.connectionHistory.map((connection, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-700/30 hover:bg-cyan-500/5 transition-colors"
                      >
                        <td className="text-gray-300 text-sm py-3 px-2">{connection.date}</td>
                        <td className="text-gray-300 text-sm py-3 px-2 hidden md:table-cell">{connection.server}</td>
                        <td className="text-sky-400 text-sm py-3 px-2 font-mono">{connection.ip}</td>
                        <td className="text-gray-400 text-xs py-3 px-2 font-mono hidden lg:table-cell">{connection.hwid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                <p className="text-sm">No connection history found</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
