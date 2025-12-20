import { useState } from "react";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  Crown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface AdminLoginProps {
  onLoginSuccess: (adminData: any) => void;
}

/**
 * 🛡️ AdminCP - Sistema de Login Administrativo
 * Modo FAKE para testes e prototipagem
 */

export function AdminLogin({
  onLoginSuccess,
}: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 🎭 Dados MOCK do Admin (para testes)
  const MOCK_ADMIN = {
    user: {
      username: "admin_test",
      role: "Admin",
      email: "admin_test@meumu.dev",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
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
      token: "FAKE_JWT_TOKEN_12345",
      expiresIn: "2h",
    },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Validação FAKE (aceita qualquer usuário/senha para testes)
    // Para produção: validar com backend real
    if (username.trim() && password.trim()) {
      // Salvar no sessionStorage
      sessionStorage.setItem(
        "adminSession",
        JSON.stringify(MOCK_ADMIN),
      );

      // Callback com dados do admin
      onLoginSuccess(MOCK_ADMIN);
      setIsLoading(false);
    } else {
      setError("Por favor, preencha usuário e senha");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Glassmorphism Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-purple-900/20 to-amber-900/30 backdrop-blur-sm" />

      {/* Login Card */}
      <Card className="relative w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20">
        {/* Header com Crown Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-xl shadow-amber-500/50 mb-4 animate-pulse">
            <Crown className="w-10 h-10 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-2">
            MeuMU AdminCP
          </h1>
          <p className="text-slate-400 text-sm">
            Painel de Controle Administrativo
          </p>

          {/* Badge de Modo Fake */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-300 font-medium">
              MODO FAKE (Testes)
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <Label
              htmlFor="admin-username"
              className="text-amber-400 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Usuário Administrativo
            </Label>
            <Input
              id="admin-username"
              type="text"
              placeholder="admin_test"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label
              htmlFor="admin-password"
              className="text-amber-400 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Senha
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold py-3 rounded-lg shadow-xl shadow-amber-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Autenticando...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                Acessar Painel
              </div>
            )}
          </Button>
        </form>

        {/* Dica de Teste */}
        <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            💡{" "}
            <span className="text-amber-400 font-medium">
              Dica:
            </span>{" "}
            Qualquer usuário/senha funciona no modo fake
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>MeuMU Online Season 19-2-3 Épico</p>
          <p className="mt-1">Sistema Administrativo v1.0</p>
        </div>
      </Card>
    </div>
  );
}

export default AdminLogin;