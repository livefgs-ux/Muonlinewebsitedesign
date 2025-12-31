import { useState } from "react";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  Crown,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import api from "../../services/api";

interface AdminLoginProps {
  onLoginSuccess: (adminData: any) => void;
}

/**
 * 🛡️ AdminCP - Sistema de Login Administrativo
 * ✅ LOGIN REAL - Conecta com banco de dados
 * ❌ SEM MOCKS - Segurança reforçada
 */

export function AdminLogin({
  onLoginSuccess,
}: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validações básicas
    if (!username.trim()) {
      setError("Por favor, insira o nome de usuário");
      return;
    }
    
    if (!password.trim()) {
      setError("Por favor, insira a senha");
      return;
    }

    if (password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔐 Tentando login admin:", username);
      
      // ✅ CHAMADA REAL À API
      const response = await api.admin.login(username, password);
      
      if (!response.success) {
        throw new Error(response.error || "Credenciais inválidas");
      }

      console.log("✅ Login admin bem-sucedido!");

      // Estruturar dados do admin
      const adminData = {
        user: {
          username: response.user.username,
          role: "Admin",
          email: response.user.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.user.username}`,
          isAdmin: true,
          permissions: {
            viewAccounts: true,
            editCharacters: true,
            banUsers: true,
            manageCredits: true,
            publishNews: true,
            manageAdmins: true,
            databaseConfig: true,
          },
        },
        session: {
          token: response.token,
          expiresIn: "7d",
        },
      };

      // Salvar token no localStorage (persistente)
      localStorage.setItem("admin_token", response.token);
      
      // Salvar sessão no sessionStorage (temporário)
      sessionStorage.setItem(
        "adminSession",
        JSON.stringify(adminData),
      );

      // Callback com dados do admin
      onLoginSuccess(adminData);
      
    } catch (error: any) {
      // ✅ Log de erro apenas em dev
      if (import.meta.env.DEV) {
        console.error("❌ Erro no login admin:", error);
      }
      
      // Mensagens de erro específicas
      if (error.message.includes("Network") || error.message.includes("fetch")) {
        setError("❌ Erro de conexão. Verifique se o servidor está online.");
      } else if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        setError("❌ Credenciais inválidas. Apenas administradores podem acessar.");
      } else if (error.message.includes("403") || error.message.includes("Forbidden")) {
        setError("❌ Acesso negado. Você não tem permissões de administrador.");
      } else {
        setError(error.message || "❌ Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full relative z-20">
        <Card className="backdrop-blur-xl bg-black/60 border-gold/30 shadow-2xl shadow-gold/20">
          {/* Header */}
          <div className="p-8 border-b border-gold/20">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-gold/50">
                <Shield className="w-10 h-10 text-black" />
              </div>
            </div>
            <h1 className="text-3xl text-center text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-gold mb-2">
              AdminCP
            </h1>
            <p className="text-center text-gray-400">
              Painel de Controle Administrativo
            </p>
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <Crown className="w-4 h-4 flex-shrink-0" />
                <p>Acesso restrito a administradores</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 text-sm font-semibold mb-1">
                    ⚠️ Sistema de Segurança Ativo
                  </p>
                  <p className="text-gray-400 text-xs">
                    • Apenas contas com nível de admin no banco de dados podem acessar
                  </p>
                  <p className="text-gray-400 text-xs">
                    • Todas as tentativas de login são registradas
                  </p>
                  <p className="text-gray-400 text-xs">
                    • Múltiplas tentativas falhas resultam em bloqueio temporário
                  </p>
                </div>
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="admin-username"
                className="text-gray-300 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-gold" />
                Usuário Administrador
              </Label>
              <Input
                id="admin-username"
                type="text"
                placeholder="Digite seu usuário admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="bg-black/50 border-gold/30 text-white placeholder:text-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/50"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="text-gray-300 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-gold" />
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-black/50 border-gold/30 text-white placeholder:text-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/50 pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-black font-bold py-6 text-lg shadow-lg shadow-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Autenticando...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Acessar Painel Administrativo
                </>
              )}
            </Button>

            {/* Info */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Protegido por autenticação JWT e validação de banco de dados
              </p>
            </div>
          </form>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 text-sm font-semibold mb-1">
                🚨 Aviso de Segurança
              </p>
              <p className="text-gray-400 text-xs">
                Tentativas não autorizadas de acesso são consideradas violação de segurança.
                Todas as atividades são monitoradas e registradas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;