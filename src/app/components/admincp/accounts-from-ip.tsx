import { useState } from 'react';
import { Search, Globe, User, Calendar, AlertCircle, Shield, Info } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { mockAccounts } from '../../data/admincp-state';

interface AccountsFromIPProps {
  onViewAccount?: (accountId: string) => void;
}

export function AccountsFromIP({ onViewAccount }: AccountsFromIPProps) {
  const [ipAddress, setIpAddress] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedIP, setSearchedIP] = useState('');
  const [error, setError] = useState('');

  const validateIP = (ip: string): boolean => {
    // IPv4 validation
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;
    
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  const handleSearch = () => {
    if (!ipAddress) {
      setError('Por favor, digite um endereço IP');
      return;
    }
    
    if (!validateIP(ipAddress)) {
      setError('Você digitou um endereço IP inválido');
      return;
    }
    
    setError('');
    setIsSearching(true);
    setSearchedIP(ipAddress);
    
    // Simulate API call to MEMB_STAT table
    setTimeout(() => {
      const filtered = mockAccounts.filter(acc => acc.ip === ipAddress);
      setResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl text-white mb-2">Find Accounts from IP</h1>
        <p className="text-gray-400">Search all accounts registered from a specific IP address</p>
      </div>

      {/* Search Card */}
      <Card className="backdrop-blur-lg bg-gray-900/50 border-emerald-500/30 p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">IP Address</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Ex: 192.168.1.1"
                  className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!ipAddress || isSearching}
                className="bg-emerald-500 hover:bg-emerald-600 px-8"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="w-4 h-4" />
            <span>Digite o endereço IP completo para buscar contas associadas</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Results */}
      {results.length > 0 ? (
        <div>
          <div className="mb-4">
            <h4 className="text-xl text-white">
              Search results for <span className="text-red-500 font-bold italic">{searchedIP}</span>:
            </h4>
          </div>

          <Card className="backdrop-blur-lg bg-emerald-500/5 border-emerald-500/30 overflow-hidden">
            <div className="p-6 border-b border-emerald-500/30 bg-emerald-500/10">
              <h3 className="text-lg text-emerald-400 font-semibold">MEMB_STAT</h3>
            </div>
            
            <div className="p-6">
              {results.length > 0 ? (
                <table className="w-full">
                  <tbody className="divide-y divide-gray-700/30">
                    {results.map((account, index) => (
                      <tr key={index} className="hover:bg-emerald-500/5 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                              <User className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{account.account}</p>
                              <p className="text-gray-400 text-sm">{account.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {account.blocked ? (
                              <span className="px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-500 text-xs">
                                Banido
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-500 text-xs">
                                Ativo
                              </span>
                            )}
                            <Button
                              onClick={() => onViewAccount && onViewAccount(account.account)}
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600"
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              Account Information
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No accounts found linked to this IP.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : searchedIP && !isSearching && (
        <div>
          <div className="mb-4">
            <h4 className="text-xl text-white">
              Search results for <span className="text-red-500 font-bold italic">{searchedIP}</span>:
            </h4>
          </div>

          <Card className="backdrop-blur-lg bg-emerald-500/5 border-emerald-500/30 overflow-hidden">
            <div className="p-6 border-b border-emerald-500/30 bg-emerald-500/10">
              <h3 className="text-lg text-emerald-400 font-semibold">MEMB_STAT</h3>
            </div>
            
            <div className="p-6">
              <div className="text-center text-yellow-400 py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p>No accounts found linked to this IP.</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}