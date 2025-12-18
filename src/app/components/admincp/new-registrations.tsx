import { UserPlus, Calendar, Mail, Globe, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import { mockAccounts } from '../../data/admincp-state';

export function NewRegistrations() {
  // Sort by creation date (newest first)
  const recentAccounts = [...mockAccounts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} atrás`;
    if (diffHours < 24) return `${diffHours} hora${diffHours !== 1 ? 's' : ''} atrás`;
    return `${diffDays} dia${diffDays !== 1 ? 's' : ''} atrás`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl text-white mb-2">New Registrations</h1>
        <p className="text-gray-400">Recently created accounts (Last 50)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-lg bg-emerald-500/5 border-emerald-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Registrations</p>
              <p className="text-3xl text-emerald-500 font-bold">{recentAccounts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-green-500/5 border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Activated</p>
              <p className="text-3xl text-green-500 font-bold">
                {recentAccounts.filter(a => a.activated).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-3xl text-yellow-500 font-bold">
                {recentAccounts.filter(a => !a.activated).length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Registrations List */}
      <Card className="backdrop-blur-lg bg-gray-900/50 border-emerald-500/30 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50 bg-emerald-500/5">
          <h3 className="text-xl text-white font-semibold">Recent Accounts</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/40 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {recentAccounts.map((account, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="text-white font-medium">{account.account}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{account.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 font-mono text-sm">{account.ip}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {account.activated ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-500 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Ativado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-xs">
                        <Clock className="w-3 h-3" />
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-white text-sm">
                          {new Date(account.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-gray-500 text-xs">{getTimeAgo(account.created_at)}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
