/**
 * ⚙️ SETTINGS TAB - Account Settings
 * V561 - Refatoração PlayerDashboard
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Lock, Bell, Trash2, Shield } from 'lucide-react';
import { GlassCard } from '../../ui/glass-card';

interface SettingsTabProps {
  onNavigateToAccount?: () => void;
}

export function SettingsTab({ onNavigateToAccount }: SettingsTabProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <GlassCard padding="lg">
        <h3 className="text-2xl text-yellow-500 mb-6 flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Configurações da Conta
        </h3>

        <div className="space-y-6">
          {/* Security Section */}
          <div className="border-b border-gray-700 pb-6">
            <h4 className="text-white text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-500" />
              Segurança
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Altere sua senha regularmente para manter sua conta segura.
            </p>
            <button
              onClick={onNavigateToAccount}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Alterar Senha
            </button>
          </div>

          {/* Notifications Section */}
          <div className="border-b border-gray-700 pb-6">
            <h4 className="text-white text-lg mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              Notificações
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Receba notificações por email sobre atualizações e eventos.
            </p>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </div>
              <span className="text-white group-hover:text-yellow-400 transition-colors">
                Receber emails promocionais
              </span>
            </label>
          </div>

          {/* Danger Zone */}
          <div>
            <h4 className="text-white text-lg mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Zona de Perigo
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Esta ação é irreversível. Todos os seus personagens e dados serão excluídos permanentemente.
            </p>
            <button
              disabled
              className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 font-bold rounded-lg cursor-not-allowed opacity-50"
            >
              <Trash2 className="w-4 h-4 inline mr-2" />
              Excluir Conta (Desabilitado)
            </button>
            <p className="text-gray-500 text-xs mt-2">
              Entre em contato com o suporte para excluir sua conta.
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
