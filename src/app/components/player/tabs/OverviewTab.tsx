/**
 * 📊 OVERVIEW TAB - Dashboard Overview
 * V561 - Refatoração PlayerDashboard
 */

import React from 'react';
import { motion } from 'motion/react';
import { Shield, TrendingUp, Coins, Users, Calendar } from 'lucide-react';
import { GlassCard } from '../../ui/glass-card';
import { formatNumber } from '../../../../utils/formatters';

interface OverviewTabProps {
  accountInfo: any;
  characters: any[];
  activities: any[];
}

export function OverviewTab({ accountInfo, characters, activities }: OverviewTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WCoin */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">WCoin</p>
                <p className="text-2xl text-yellow-500 font-bold">
                  {formatNumber(accountInfo?.cashCredits || 0)}
                </p>
              </div>
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Goblin Points */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Goblin Points</p>
                <p className="text-2xl text-green-500 font-bold">0</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Characters */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Personagens</p>
                <p className="text-2xl text-blue-500 font-bold">{characters.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Account Info */}
      <GlassCard>
        <h3 className="text-xl text-yellow-500 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Informações da Conta
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="text-gray-400">Usuário:</span>
            <span className="text-white font-semibold">{accountInfo?.username}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="text-gray-400">Email:</span>
            <span className="text-white">{accountInfo?.email}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="text-gray-400">VIP Level:</span>
            <span className="text-yellow-500 font-bold">Level {accountInfo?.vipLevel || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Membro desde:</span>
            <span className="text-white">
              {accountInfo?.createdAt ? new Date(accountInfo.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Recent Activity */}
      {activities.length > 0 && (
        <GlassCard>
          <h3 className="text-xl text-yellow-500 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Atividade Recente
          </h3>
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 border-b border-gray-700 pb-2 last:border-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.description}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(activity.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}
