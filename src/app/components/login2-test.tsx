import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Login2TestProps {
  onLoginSuccess: () => void;
}

export function Login2Test({ onLoginSuccess }: Login2TestProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginFake } = useAuth(); // 🧪 Usar loginFake em vez de login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação mínima - apenas verificar se não está vazio
    if (!username.trim() || !password.trim()) {
      alert('Por favor, preencha usuário e senha');
      return;
    }

    setIsLoading(true);

    // Simular delay de rede
    setTimeout(() => {
      // LOGIN FAKE - aceita qualquer credencial (SEM fetch!)
      loginFake({
        username: username,
        email: `${username}@test.com`,
        isAdmin: false,
        accountId: '12345-TEST',
      });

      setIsLoading(false);
      onLoginSuccess();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md bg-black/80 backdrop-blur-xl border-2 border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full mb-4 shadow-lg shadow-yellow-500/50">
              <LogIn className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-3xl text-white mb-2">
              Login 2 - <span className="text-yellow-500">TESTE</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Área de teste - Aceita qualquer login/senha
            </p>
          </div>

          {/* Alert de Teste */}
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-500 font-bold mb-1">🧪 MODO DE TESTE</p>
                <p className="text-gray-300">
                  Digite <strong>qualquer</strong> usuário e senha para acessar o Dashboard.
                  Este login não valida credenciais.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Usuário (qualquer nome)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite qualquer usuário"
                  className="pl-10 bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Senha (qualquer senha)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite qualquer senha"
                  className="pl-10 bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-6 text-lg shadow-lg shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Entrar (Teste)
                </>
              )}
            </Button>
          </form>

          {/* Sugestões */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-400 font-bold mb-2">💡 Sugestões de Teste:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Usuário: <code className="text-yellow-500">test</code></li>
              <li>• Senha: <code className="text-yellow-500">123</code></li>
              <li>• Ou qualquer outra combinação!</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              ⚠️ Esta é uma área temporária para testes
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Será removida após validação do Dashboard
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Login2Test;