import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Filter, UserPlus, Ban, Edit, Trash2, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner';

/**
 * 👥 Account Management Section
 * Gerenciamento completo de contas - CONECTADO À API REAL
 */

interface Account {
  guid: string;
  username: string;
  email: string;
  admin_level: number;
  cash: number;
  created_at: string;
  last_login: string;
  banned?: boolean;
}

export function AccountManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  const searchAccounts = async () => {
    if (!searchTerm.trim()) {
      toast.error('Digite um nome de usuário para buscar');
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/accounts/search?username=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setAccounts(data.data);
        if (data.data.length === 0) {
          toast.info('Nenhuma conta encontrada');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar contas:', error);
      toast.error('Erro ao buscar contas');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchAccounts();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Gerenciar Contas</h2>
          <p className="text-sm text-slate-400">Visualize e gerencie todas as contas de usuários</p>
        </div>
        
        <div className="flex gap-2">
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-lg shadow-amber-500/30">
            <UserPlus className="w-4 h-4 mr-2" />
            Nova Conta
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar por usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
              />
            </div>
            <Button 
              onClick={searchAccounts}
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Users className="w-5 h-5" />
            Resultados da Busca ({accounts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-slate-400">
              Buscando contas...
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Digite um nome de usuário e clique em "Buscar"
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50 text-slate-400 text-sm">
                    <th className="text-left p-3 font-semibold">Usuário</th>
                    <th className="text-left p-3 font-semibold">Email</th>
                    <th className="text-left p-3 font-semibold">Admin Level</th>
                    <th className="text-left p-3 font-semibold">Créditos</th>
                    <th className="text-left p-3 font-semibold">Cadastro</th>
                    <th className="text-left p-3 font-semibold">Último Login</th>
                    <th className="text-right p-3 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <motion.tr
                      key={account.guid}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Shield className={`w-4 h-4 ${account.admin_level > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
                          <span className="font-semibold text-white">{account.username}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-400 text-sm">{account.email || 'N/A'}</td>
                      <td className="p-3">
                        <Badge className={account.admin_level > 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}>
                          {account.admin_level > 0 ? `Admin ${account.admin_level}` : 'Normal'}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-400 text-sm">{account.cash?.toLocaleString() || 0}</td>
                      <td className="p-3 text-slate-400 text-sm">
                        {account.created_at ? new Date(account.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                      <td className="p-3 text-slate-400 text-sm">
                        {account.last_login ? new Date(account.last_login).toLocaleDateString('pt-BR') : 'Nunca'}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}