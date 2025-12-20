import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Filter, UserPlus, Ban, Edit, Trash2, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Table } from '../../ui/table';

/**
 * 👥 Account Management Section
 * Gerenciamento completo de contas de usuário
 */

// Mock data
const MOCK_ACCOUNTS = [
  { id: 1, username: 'DarkLord99', email: 'darklord@email.com', status: 'online', credits: 1250, registered: '2024-01-15', lastLogin: '2 min atrás' },
  { id: 2, username: 'MageSupreme', email: 'mage@email.com', status: 'online', credits: 890, registered: '2024-02-20', lastLogin: '5 min atrás' },
  { id: 3, username: 'WarriorKing', email: 'warrior@email.com', status: 'offline', credits: 450, registered: '2024-03-10', lastLogin: '2 horas atrás' },
  { id: 4, username: 'NinjaStrike', email: 'ninja@email.com', status: 'banned', credits: 0, registered: '2024-04-05', lastLogin: '1 dia atrás' },
  { id: 5, username: 'HealerPro', email: 'healer@email.com', status: 'online', credits: 2100, registered: '2024-01-08', lastLogin: '10 min atrás' },
];

export function AccountManagement() {
  const [searchTerm, setSearchTerm] = useState('');

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
                placeholder="Buscar por usuário, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
              />
            </div>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Users className="w-5 h-5" />
            Lista de Contas ({MOCK_ACCOUNTS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50 text-slate-400 text-sm">
                  <th className="text-left p-3 font-semibold">Usuário</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Créditos</th>
                  <th className="text-left p-3 font-semibold">Último Login</th>
                  <th className="text-right p-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ACCOUNTS.map((account, index) => (
                  <motion.tr
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-900 font-bold text-sm">
                          {account.username[0]}
                        </div>
                        <span className="font-semibold text-white">{account.username}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-400 text-sm">{account.email}</td>
                    <td className="p-3">
                      {account.status === 'online' && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Online
                        </Badge>
                      )}
                      {account.status === 'offline' && (
                        <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                          <XCircle className="w-3 h-3 mr-1" />
                          Offline
                        </Badge>
                      )}
                      {account.status === 'banned' && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          <Ban className="w-3 h-3 mr-1" />
                          Banido
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-amber-400 font-bold">{account.credits}</span>
                      <span className="text-slate-500 text-sm ml-1">créditos</span>
                    </td>
                    <td className="p-3 text-slate-400 text-sm">{account.lastLogin}</td>
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
        </CardContent>
      </Card>
    </div>
  );
}
