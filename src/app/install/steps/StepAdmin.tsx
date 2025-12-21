/**
 * ETAPA 2 - CONFIGURAÇÃO DO ADMIN
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AdminConfig } from '../InstallWizard';

interface Props {
  config: AdminConfig;
  setConfig: (config: AdminConfig) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const StepAdmin = ({ config, setConfig, onNext, onPrevious }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  /**
   * Validar formulário
   */
  const validate = () => {
    const newErrors: string[] = [];

    if (!config.username || config.username.length < 3) {
      newErrors.push('Nome de usuário deve ter pelo menos 3 caracteres');
    }

    if (!config.email || !config.email.includes('@')) {
      newErrors.push('Email inválido');
    }

    if (!config.password || config.password.length < 6) {
      newErrors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (config.password !== config.password_confirm) {
      newErrors.push('As senhas não coincidem');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <User className="w-8 h-8 text-[#FFB800]" />
        <div>
          <h2 className="text-2xl font-bold text-white">Conta Administrativa</h2>
          <p className="text-gray-400">Crie sua conta de administrador</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Nome de Usuário
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
              placeholder="admin"
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Mínimo 3 caracteres, sem espaços</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={config.email}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
              placeholder="admin@meumuonline.com"
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Usado para recuperação de senha</p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        {/* Password Confirm */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Confirmar Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              value={config.password_confirm}
              onChange={(e) => setConfig({ ...config, password_confirm: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#FFB800] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 p-4 rounded-lg mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-semibold mb-2">Erros encontrados:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-300">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-1">Dicas de Segurança:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use uma senha forte e única</li>
              <li>Evite senhas óbvias como "admin123"</li>
              <li>Combine letras maiúsculas, minúsculas, números e símbolos</li>
              <li>Não compartilhe suas credenciais de admin</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
        >
          ← Voltar
        </button>

        <button
          onClick={handleNext}
          className="flex-1 px-6 py-3 bg-[#FFB800] hover:bg-[#FFC933] text-black rounded-lg font-semibold transition-all"
        >
          Próxima Etapa →
        </button>
      </div>
    </motion.div>
  );
};

export default StepAdmin;
