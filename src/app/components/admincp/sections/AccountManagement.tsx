import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Filter, UserPlus, Ban, Edit, Trash2, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Label } from '../../ui/label';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAccount, setNewAccount] = useState({
    username: '',
    password: '',
    email: '',
    adminLevel: 0
  });

  const searchAccount = async () => {
    if (!searchTerm || searchTerm.trim().length === 0) return;

    try {
      setLoading(true);
      // ✅ V574 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
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
      searchAccount();
    }
  };

  const handleCreateAccount = async () => {
    // Validações
    if (!newAccount.username || newAccount.username.length < 4 || newAccount.username.length > 10) {
      toast.error('Username deve ter entre 4 e 10 caracteres');
      return;
    }

    if (!newAccount.password || newAccount.password.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (!newAccount.email || !newAccount.email.includes('@')) {
      toast.error('Email inválido');
      return;
    }

    try {
      setCreating(true);
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('/api/admin/accounts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAccount)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Conta criada com sucesso!');
        setShowCreateModal(false);
        setNewAccount({ username: '', password: '', email: '', adminLevel: 0 });
        // Se houver busca ativa, recarregar
        if (searchTerm) searchAccount();
      } else {
        toast.error(data.message || 'Erro ao criar conta');
      }
    } catch (error) {
      console.error('❌ Erro ao criar conta:', error);
      toast.error('Erro ao criar conta');
    } finally {
      setCreating(false);
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
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-lg shadow-amber-500/30"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Nova Conta
          </Button>
        </div>
      </div>

      {/* Create Account Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-slate-900 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-400">Criar Nova Conta</DialogTitle>
            <DialogDescription className="text-slate-400">
              Preencha os dados para criar uma nova conta de jogador
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="new-username" className="text-white">Username</Label>
              <Input
                id="new-username"
                type="text"
                placeholder="Digite o username (4-10 caracteres)"
                value={newAccount.username}
                onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                maxLength={10}
                className="bg-black/40 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="new-password" className="text-white">Senha</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Digite a senha (mínimo 6 caracteres)"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                className="bg-black/40 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="new-email" className="text-white">Email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="Digite o email"
                value={newAccount.email}
                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                className="bg-black/40 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="new-admin-level" className="text-white">Nível Admin</Label>
              <Input
                id="new-admin-level"
                type="number"
                min="0"
                max="8"
                value={newAccount.adminLevel}
                onChange={(e) => setNewAccount({ ...newAccount, adminLevel: parseInt(e.target.value) || 0 })}
                className="bg-black/40 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-500 mt-1">0 = Jogador normal, 1-8 = Níveis de admin</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="border-slate-700 text-slate-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateAccount}
              disabled={creating}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
            >
              {creating ? 'Criando...' : 'Criar Conta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              onClick={searchAccount}
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