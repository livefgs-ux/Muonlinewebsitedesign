import { useState } from 'react';
import { Search, User, Mail, Globe, CheckCircle, XCircle, Clock, Shield, Ban } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Account } from '../../types/admincp';
import { mockAccounts } from '../../data/admincp-state';

export function AccountSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'account' | 'email' | 'ip'>('account');
  const [results, setResults] = useState<Account[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const filtered = mockAccounts.filter(acc => {
        const searchLower = searchTerm.toLowerCase();
        if (searchType === 'account') {
          return acc.account.toLowerCase().includes(searchLower);
        } else if (searchType === 'email') {
          return acc.email.toLowerCase().includes(searchLower);
        } else if (searchType === 'ip') {
          return acc.ip.includes(searchTerm);
        }
        return false;
      });
      
      setResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="backdrop-blur-lg bg-gray-900/50 border-gray-700/50 p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Tipo de Busca</label>
            <div className="flex gap-2">
              <Button
                onClick={() => setSearchType('account')}
                variant={searchType === 'account' ? 'default' : 'outline'}
                className={searchType === 'account' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
              <Button
                onClick={() => setSearchType('email')}
                variant={searchType === 'email' ? 'default' : 'outline'}
                className={searchType === 'email' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button
                onClick={() => setSearchType('ip')}
                variant={searchType === 'ip' ? 'default' : 'outline'}
                className={searchType === 'ip' ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                <Globe className="w-4 h-4 mr-2" />
                IP Address
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={`Buscar por ${searchType === 'account' ? 'nome da conta' : searchType === 'email' ? 'email' : 'IP'}...`}
                className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!searchTerm || isSearching}
              className="bg-blue-500 hover:bg-blue-600 px-8"
            >
              <Search className="w-4 h-4 mr-2" />
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card className="backdrop-blur-lg bg-gray-900/50 border-gray-700/50 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h3 className="text-xl text-white font-semibold">
              Resultados da Busca ({results.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {results.map((account, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-white font-medium">{account.account}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300">{account.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-400 font-mono text-sm">{account.ip}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {account.blocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-500 text-xs">
                            <Ban className="w-3 h-3" />
                            Banido
                          </span>
                        ) : account.activated ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-500 text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-xs">
                            <Clock className="w-3 h-3" />
                            Pendente
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                      {new Date(account.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-500 hover:bg-blue-500/10"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          Detalhes
                        </Button>
                        {!account.blocked && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:bg-red-500/10"
                          >
                            <Ban className="w-3 h-3 mr-1" />
                            Banir
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* No Results */}
      {searchTerm && results.length === 0 && !isSearching && (
        <Card className="backdrop-blur-lg bg-gray-900/50 border-gray-700/50 p-8">
          <div className="text-center text-gray-400">
            <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhum resultado encontrado</p>
            <p className="text-sm mt-2">Tente buscar por outro termo</p>
          </div>
        </Card>
      )}
    </div>
  );
}
