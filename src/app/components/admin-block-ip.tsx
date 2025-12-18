import { motion } from 'motion/react';
import { ShieldAlert, Lock, Unlock, User, Calendar, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface BlockedIP {
  id: string;
  block_ip: string;
  block_by: string;
  block_date: number;
}

export function AdminBlockIP() {
  const [ipAddress, setIpAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data - in production, this would come from database
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([
    {
      id: '1',
      block_ip: '192.168.1.100',
      block_by: 'Administrator',
      block_date: Date.now() - 86400000 * 2, // 2 days ago
    },
    {
      id: '2',
      block_ip: '10.0.0.50',
      block_by: 'GameMaster',
      block_date: Date.now() - 86400000 * 5, // 5 days ago
    },
    {
      id: '3',
      block_ip: '172.16.0.25',
      block_by: 'Administrator',
      block_date: Date.now() - 86400000 * 10, // 10 days ago
    },
  ]);

  const validateIP = (ip: string): boolean => {
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  const handleBlockIP = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!ipAddress.trim()) {
      alert('Please enter an IP address.');
      return;
    }

    if (!validateIP(ipAddress)) {
      alert('Invalid IP address format. Please use format: 0.0.0.0');
      return;
    }

    // Check if IP is already blocked
    const alreadyBlocked = blockedIPs.some(item => item.block_ip === ipAddress);
    if (alreadyBlocked) {
      alert('This IP address is already blocked.');
      return;
    }

    setIsSubmitting(true);

    // Simulate: INSERT INTO blocked_ips table
    setTimeout(() => {
      const newBlockedIP: BlockedIP = {
        id: Date.now().toString(),
        block_ip: ipAddress,
        block_by: 'Administrator', // Current session user
        block_date: Date.now(),
      };

      console.log('🚫 Block IP Submitted:');
      console.log('IP Address:', ipAddress);
      console.log('Blocked by:', 'Administrator (current session)');
      console.log('Block date:', new Date().toISOString());

      // Add to blocked IPs list
      setBlockedIPs([newBlockedIP, ...blockedIPs]);

      setSuccessMessage('IP address blocked successfully.');
      setShowSuccess(true);
      setIsSubmitting(false);

      // Reset form
      setIpAddress('');

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 800);
  };

  const handleUnblockIP = (id: string, ip: string) => {
    if (!confirm(`Are you sure you want to unblock IP address ${ip}?`)) {
      return;
    }

    console.log('✅ Unblock IP:', ip);
    
    // Remove from blocked IPs list
    setBlockedIPs(blockedIPs.filter(item => item.id !== id));

    setSuccessMessage('IP address unblocked successfully.');
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
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
        <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl border border-orange-500/30">
          <ShieldAlert className="w-8 h-8 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl text-white">
            Block IP Address <span className="text-orange-300/50 text-2xl">(web)</span>
          </h1>
          <p className="text-orange-300/70 mt-1">
            Block IP addresses from accessing the website
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
            <Lock className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-green-300 font-medium">{successMessage}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Block IP Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-orange-500/5 to-red-600/5 border-orange-500/20 backdrop-blur-xl">
          <div className="p-6">
            <form onSubmit={handleBlockIP} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full bg-obsidian/50 border border-orange-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  placeholder="0.0.0.0"
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Blocking...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    <span>Block</span>
                  </div>
                )}
              </Button>
            </form>
            <p className="text-orange-300/50 text-sm mt-3">
              Enter a valid IPv4 address (e.g., 192.168.1.1)
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Blocked IPs Table */}
      {blockedIPs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/5 to-red-600/5 border-orange-500/20 backdrop-blur-xl">
            <div className="p-6">
              <h2 className="text-xl text-orange-200 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Blocked IP Addresses ({blockedIPs.length})
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-500/20">
                      <th className="text-left py-3 px-4 text-orange-300/70 font-medium">
                        IP Address
                      </th>
                      <th className="text-left py-3 px-4 text-orange-300/70 font-medium">
                        Blocked By
                      </th>
                      <th className="text-left py-3 px-4 text-orange-300/70 font-medium">
                        Date Blocked
                      </th>
                      <th className="text-right py-3 px-4 text-orange-300/70 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedIPs.map((ip, index) => (
                      <motion.tr
                        key={ip.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b border-orange-500/10 hover:bg-orange-500/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-orange-400" />
                            <span className="text-white font-mono">{ip.block_ip}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-orange-300/90">
                            <User className="w-4 h-4" />
                            <span>{ip.block_by}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-orange-300/70">
                            <Calendar className="w-4 h-4" />
                            <span className="font-mono text-sm">
                              {formatDate(ip.block_date)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            onClick={() => handleUnblockIP(ip.id, ip.block_ip)}
                            variant="outline"
                            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 px-4 py-2 text-sm"
                          >
                            <Unlock className="w-4 h-4 mr-2" />
                            Lift Block
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {blockedIPs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/5 to-red-600/5 border-orange-500/20 backdrop-blur-xl">
            <div className="p-12 text-center">
              <ShieldAlert className="w-16 h-16 text-orange-400/30 mx-auto mb-4" />
              <h3 className="text-xl text-orange-300/70 mb-2">No Blocked IPs</h3>
              <p className="text-orange-400/50">
                No IP addresses have been blocked yet.
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl text-purple-200">About IP Blocking</h3>
            </div>
            <div className="text-purple-300/70 space-y-2 text-sm">
              <p className="font-medium text-purple-300">
                IP blocking prevents access to the website from specific IP addresses:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Blocks are immediate and affect only web access (not game server)</li>
                <li>Blocked IPs cannot view or access any website pages</li>
                <li>Use this for preventing spam, abuse, or malicious attacks</li>
                <li>You can unblock any IP at any time by clicking "Lift Block"</li>
                <li>All blocks are logged with the admin who blocked them</li>
              </ul>
              <p className="text-purple-400 mt-4">
                💡 <strong>Tip:</strong> For game server bans, use the "Ban Account" feature instead.
              </p>
              <p className="text-purple-400">
                💡 <strong>Note:</strong> This blocks web access only. Game server access is controlled separately.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
