import { useState } from 'react';
import { Globe, Ban, Calendar, Shield, Trash2, Plus, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { motion } from 'motion/react';

interface BlockedIP {
  id: number;
  ip: string;
  reason: string;
  blockedBy: string;
  blockedAt: string;
  expiresAt?: string;
  accountsBlocked: number;
  lastAttempt?: string;
  attemptCount: number;
}

// Mock data de IPs bloqueados
const mockBlockedIPs: BlockedIP[] = [
  {
    id: 1,
    ip: '45.123.45.67',
    reason: 'Multiple hack attempts detected',
    blockedBy: 'AutoBan System',
    blockedAt: '2025-01-15T10:30:00',
    accountsBlocked: 3,
    lastAttempt: '2025-01-15T09:45:00',
    attemptCount: 127,
  },
  {
    id: 2,
    ip: '192.168.100.50',
    reason: 'DDoS Attack Pattern',
    blockedBy: 'Admin1',
    blockedAt: '2025-01-14T15:20:00',
    expiresAt: '2025-01-21T15:20:00',
    accountsBlocked: 1,
    lastAttempt: '2025-01-14T15:19:00',
    attemptCount: 1543,
  },
  {
    id: 3,
    ip: '88.99.77.66',
    reason: 'Spam/Bot Activity',
    blockedBy: 'Admin2',
    blockedAt: '2025-01-13T09:00:00',
    accountsBlocked: 5,
    lastAttempt: '2025-01-13T08:55:00',
    attemptCount: 89,
  },
  {
    id: 4,
    ip: '203.45.67.89',
    reason: 'Repeated login failures',
    blockedBy: 'AutoBan System',
    blockedAt: '2025-01-12T18:45:00',
    expiresAt: '2025-01-19T18:45:00',
    accountsBlocked: 2,
    lastAttempt: '2025-01-12T18:44:00',
    attemptCount: 45,
  },
  {
    id: 5,
    ip: '111.222.333.444',
    reason: 'Known VPN/Proxy abuse',
    blockedBy: 'Admin1',
    blockedAt: '2025-01-10T12:00:00',
    accountsBlocked: 8,
    lastAttempt: '2025-01-10T11:58:00',
    attemptCount: 234,
  },
  {
    id: 6,
    ip: '156.78.90.12',
    reason: 'Cheat engine detected',
    blockedBy: 'Admin3',
    blockedAt: '2025-01-08T20:15:00',
    expiresAt: '2025-01-22T20:15:00',
    accountsBlocked: 1,
    lastAttempt: '2025-01-08T20:14:00',
    attemptCount: 12,
  },
];

export function BlockedIPs() {
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>(mockBlockedIPs);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUnblockConfirm, setShowUnblockConfirm] = useState<number | null>(null);
  const [newIP, setNewIP] = useState({
    ip: '',
    reason: '',
    duration: 'permanent',
  });

  // Filter IPs by search term
  const filteredIPs = blockedIPs.filter(item =>
    item.ip.includes(searchTerm) ||
    item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.blockedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnblock = (id: number) => {
    setBlockedIPs(blockedIPs.filter(item => item.id !== id));
    setShowUnblockConfirm(null);
  };

  const handleAddIP = () => {
    if (!newIP.ip || !newIP.reason) return;

    const newBlock: BlockedIP = {
      id: Math.max(...blockedIPs.map(b => b.id)) + 1,
      ip: newIP.ip,
      reason: newIP.reason,
      blockedBy: 'Admin (You)',
      blockedAt: new Date().toISOString(),
      accountsBlocked: 0,
      attemptCount: 0,
      ...(newIP.duration !== 'permanent' && {
        expiresAt: new Date(Date.now() + parseInt(newIP.duration) * 24 * 60 * 60 * 1000).toISOString()
      })
    };

    setBlockedIPs([newBlock, ...blockedIPs]);
    setNewIP({ ip: '', reason: '', duration: 'permanent' });
    setShowAddForm(false);
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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return `${diffDays}d atrás`;
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-white mb-2">Blocked IPs</h1>
          <p className="text-gray-400">Manage IP address blacklist</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-rose-500 hover:bg-rose-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Block New IP
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-lg bg-rose-500/5 border-rose-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Blocked</p>
              <p className="text-3xl text-rose-500 font-bold">{blockedIPs.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <Ban className="w-6 h-6 text-rose-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-orange-500/5 border-orange-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Permanent</p>
              <p className="text-3xl text-orange-500 font-bold">
                {blockedIPs.filter(ip => !ip.expiresAt).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Temporary</p>
              <p className="text-3xl text-yellow-500 font-bold">
                {blockedIPs.filter(ip => ip.expiresAt && !isExpired(ip.expiresAt)).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Attempts</p>
              <p className="text-3xl text-blue-500 font-bold">
                {blockedIPs.reduce((sum, ip) => sum + ip.attemptCount, 0).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add IP Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="backdrop-blur-lg bg-rose-500/5 border-rose-500/30 p-6">
            <h3 className="text-xl text-rose-400 font-semibold mb-4">Block New IP Address</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">IP Address</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={newIP.ip}
                    onChange={(e) => setNewIP({ ...newIP, ip: e.target.value })}
                    placeholder="Ex: 192.168.1.1"
                    className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-rose-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Reason</label>
                <textarea
                  value={newIP.reason}
                  onChange={(e) => setNewIP({ ...newIP, reason: e.target.value })}
                  placeholder="Motivo do bloqueio..."
                  rows={3}
                  className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-rose-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Duration</label>
                <select
                  value={newIP.duration}
                  onChange={(e) => setNewIP({ ...newIP, duration: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-rose-500 focus:outline-none transition-colors"
                >
                  <option value="permanent">Permanente</option>
                  <option value="7">7 Dias</option>
                  <option value="14">14 Dias</option>
                  <option value="30">30 Dias</option>
                  <option value="90">90 Dias</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleAddIP}
                  disabled={!newIP.ip || !newIP.reason}
                  className="flex-1 bg-rose-500 hover:bg-rose-600"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Block IP
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewIP({ ip: '', reason: '', duration: 'permanent' });
                  }}
                  variant="outline"
                  className="border-gray-500 text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <Card className="backdrop-blur-lg bg-gray-900/50 border-rose-500/30 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por IP, motivo ou admin..."
            className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-rose-500 focus:outline-none transition-colors"
          />
        </div>
      </Card>

      {/* Blocked IPs List */}
      <div className="space-y-4">
        {filteredIPs.length === 0 ? (
          <Card className="backdrop-blur-lg bg-gray-900/50 border-gray-700/50 p-12">
            <div className="text-center text-gray-400">
              <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhum IP bloqueado encontrado</p>
              {searchTerm && <p className="text-sm mt-2">Tente buscar por outro termo</p>}
            </div>
          </Card>
        ) : (
          filteredIPs.map((blockedIP) => {
            const expired = isExpired(blockedIP.expiresAt);
            
            return (
              <motion.div
                key={blockedIP.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`backdrop-blur-lg border overflow-hidden ${
                  expired 
                    ? 'bg-gray-500/5 border-gray-500/30' 
                    : 'bg-gray-900/50 border-rose-500/30'
                }`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      {/* IP Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                          expired
                            ? 'bg-gray-500/20 border-gray-500/30'
                            : 'bg-rose-500/20 border-rose-500/30'
                        }`}>
                          <Globe className={`w-6 h-6 ${expired ? 'text-gray-500' : 'text-rose-500'}`} />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          {/* IP Address */}
                          <div>
                            <h3 className="text-xl text-white font-semibold font-mono mb-2">
                              {blockedIP.ip}
                            </h3>
                            {expired && (
                              <span className="inline-block px-3 py-1 rounded-full bg-gray-500/20 border border-gray-500/30 text-gray-500 text-xs">
                                Expirado
                              </span>
                            )}
                          </div>

                          {/* Reason */}
                          <div className="bg-black/30 rounded-lg p-3 border border-gray-700/50">
                            <p className="text-sm text-gray-300">
                              <span className="text-gray-500">Motivo:</span> {blockedIP.reason}
                            </p>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-black/20 rounded-lg p-3 border border-gray-700/50">
                              <p className="text-xs text-gray-500 mb-1">Contas Bloqueadas</p>
                              <p className="text-lg text-white font-semibold">{blockedIP.accountsBlocked}</p>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3 border border-gray-700/50">
                              <p className="text-xs text-gray-500 mb-1">Tentativas</p>
                              <p className="text-lg text-orange-500 font-semibold">
                                {blockedIP.attemptCount.toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3 border border-gray-700/50">
                              <p className="text-xs text-gray-500 mb-1">Bloqueado Por</p>
                              <p className="text-sm text-yellow-500">{blockedIP.blockedBy}</p>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3 border border-gray-700/50">
                              <p className="text-xs text-gray-500 mb-1">Última Tentativa</p>
                              <p className="text-xs text-gray-400">
                                {blockedIP.lastAttempt ? getTimeAgo(blockedIP.lastAttempt) : 'N/A'}
                              </p>
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-2 border-t border-gray-700/50">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Bloqueado em: {formatDate(blockedIP.blockedAt)}</span>
                            </div>
                            {blockedIP.expiresAt ? (
                              <div className="flex items-center gap-1">
                                {expired ? (
                                  <span className="text-gray-500">
                                    Expirou em: {formatDate(blockedIP.expiresAt)}
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-xs">
                                    Expira em: {formatDate(blockedIP.expiresAt)}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-500 text-xs">
                                Permanente
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="ml-4">
                        <Button
                          onClick={() => setShowUnblockConfirm(blockedIP.id)}
                          size="sm"
                          variant="outline"
                          className="text-green-500 hover:bg-green-500/10 border-green-500/30"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Desbloquear
                        </Button>
                      </div>
                    </div>

                    {/* Unblock Confirmation */}
                    {showUnblockConfirm === blockedIP.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-green-500/30 bg-green-500/5 -mx-6 -mb-6 px-6 pb-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg text-white font-semibold mb-2">Confirmar Desbloqueio</h4>
                            <p className="text-gray-400 text-sm mb-4">
                              Tem certeza que deseja desbloquear o IP <strong className="text-white font-mono">{blockedIP.ip}</strong>? 
                              Este IP poderá acessar o servidor novamente.
                            </p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleUnblock(blockedIP.id)}
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Sim, Desbloquear
                              </Button>
                              <Button
                                onClick={() => setShowUnblockConfirm(null)}
                                size="sm"
                                variant="outline"
                                className="border-gray-500 text-gray-400 hover:text-white"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
