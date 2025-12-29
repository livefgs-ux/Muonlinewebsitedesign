/**
 * 🛒 WCOIN SHOP - Componente Reutilizável
 * Usado em: PlayerDashboard + AdminCP
 * V561 - Refatoração completa
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Coins, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { LoadingSpinner } from '../ui/loading-spinner';
import { API_CONFIG, getApiUrl } from '../../config/api';

interface WCoinPackage {
  id: number;
  wcoin: number;
  price: number;
  bonus: number;
  currency: string;
}

interface WCoinShopProps {
  isAdminMode?: boolean;
  onPurchase?: (packageId: number) => void;
}

export function WCoinShop({ 
  isAdminMode = false,
  onPurchase
}: WCoinShopProps) {
  const [packages, setPackages] = useState<WCoinPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WCOIN_PACKAGES));
      const data = await response.json();
      
      if (data.success && data.data) {
        setPackages(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar pacotes de WCoin:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const handlePurchase = (packageId: number) => {
    if (onPurchase) {
      onPurchase(packageId);
    } else {
      console.log('Comprar pacote:', packageId);
      // TODO: Integrar com sistema de pagamento
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando pacotes de WCoin..." />;
  }

  if (packages.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Nenhum pacote disponível no momento</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <motion.div
          key={pkg.id}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <GlassCard hover className="h-full">
            {/* WCoin Amount */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="w-8 h-8 text-yellow-500" />
                <p className="text-4xl text-yellow-500 font-bold">{pkg.wcoin}</p>
              </div>
              <p className="text-gray-400">WCoin</p>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <p className="text-2xl text-white font-bold">
                {formatCurrency(pkg.price, pkg.currency)}
              </p>
            </div>

            {/* Bonus Badge */}
            {pkg.bonus > 0 && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-2 mb-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <p className="text-green-400 text-sm font-bold">+{pkg.bonus} Bônus</p>
                </div>
              </div>
            )}

            {/* Buy Button */}
            <button 
              onClick={() => handlePurchase(pkg.id)}
              className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {isAdminMode ? 'Gerenciar' : 'Comprar Agora'}
            </button>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
