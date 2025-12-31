/**
 * 👤 ACCOUNT TAB - Account Settings & Password Change
 * V561 - Refatoração PlayerDashboard
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { GlassCard } from '../../ui/glass-card';
import { toast } from 'sonner';
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../../../config/api';

interface AccountTabProps {
  accountInfo: any;
}

export function AccountTab({ accountInfo }: AccountTabProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos!');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    if (newPassword.length < 4) {
      toast.error('A nova senha deve ter pelo menos 4 caracteres!');
      return;
    }

    if (oldPassword === newPassword) {
      toast.error('A nova senha deve ser diferente da atual!');
      return;
    }

    try {
      setIsChangingPassword(true);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_CHANGE_PASSWORD), {
        method: 'PUT',  // ✅ V617: Backend usa PUT, não POST
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: oldPassword,  // ✅ V617: Backend espera "currentPassword"
          newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Senha alterada com sucesso!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Erro ao alterar senha!');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Account Info Card */}
      <GlassCard>
        <h3 className="text-xl text-yellow-500 mb-6 flex items-center gap-2">
          <User className="w-6 h-6" />
          Informações da Conta
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Usuário
            </label>
            <input
              type="text"
              value={accountInfo?.username || ''}
              disabled
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={accountInfo?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white cursor-not-allowed"
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-blue-300 text-sm">
                Para alterar seu email, entre em contato com o suporte.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Password Change Card */}
      <GlassCard>
        <h3 className="text-xl text-yellow-500 mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Alterar Senha
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
                placeholder="Digite sua senha atual"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Nova Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
                placeholder="Digite sua nova senha (mínimo 4 caracteres)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none transition-colors"
                placeholder="Confirme sua nova senha"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-yellow-300 text-sm space-y-1">
                <p className="font-semibold">Dicas de Segurança:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Use pelo menos 4 caracteres</li>
                  <li>Não compartilhe sua senha</li>
                  <li>Altere sua senha regularmente</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      </GlassCard>
    </motion.div>
  );
}