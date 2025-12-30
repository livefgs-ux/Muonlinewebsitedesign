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
import { toast } from 'sonner';

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

interface PurchaseLinks {
  default: string;
  package_500: string;
  package_1000: string;
  package_2000: string;
  package_5000: string;
  package_10000: string;
  package_20000: string;
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

  // V586: Mapeamento de WCoin para chave do link
  const getPackageKey = (wcoin: number): keyof PurchaseLinks => {
    const packageMap: Record<number, keyof PurchaseLinks> = {
      500: 'package_500',
      1000: 'package_1000',
      2000: 'package_2000',
      5000: 'package_5000',
      10000: 'package_10000',
      20000: 'package_20000',
    };
    return packageMap[wcoin] || 'default';
  };

  const handlePurchase = (packageId: number) => {
    // Se for AdminMode, chamar função customizada
    if (isAdminMode && onPurchase) {
      onPurchase(packageId);
      return;
    }

    // V586: Verificar se há link de pagamento configurado
    try {
      const savedLinks = localStorage.getItem('wcoin_purchase_links');
      
      if (!savedLinks) {
        // Nenhum link configurado
        toast.error('⚠️ Sistema de pagamento não configurado!', {
          description: 'Entre em contato com a administração do servidor para habilitar a compra de WCoin.',
          duration: 5000
        });
        return;
      }

      const links: PurchaseLinks = JSON.parse(savedLinks);
      
      // Encontrar o pacote pelo ID
      const pkg = packages.find(p => p.id === packageId);
      if (!pkg) {
        toast.error('Pacote não encontrado!');
        return;
      }

      // Obter a chave do link baseado no WCoin
      const linkKey = getPackageKey(pkg.wcoin);
      const packageLink = links[linkKey] || links.default;

      if (!packageLink) {
        // Link específico não configurado
        toast.warning('⚠️ Link de pagamento não disponível para este pacote!', {
          description: 'Este pacote ainda não está disponível para compra. Tente outro ou entre em contato com a administração.',
          duration: 5000
        });
        return;
      }

      // Redirecionar para o link de pagamento
      toast.success('🚀 Redirecionando para pagamento...', {
        description: `Pacote: ${pkg.wcoin} WCoin - ${formatCurrency(pkg.price, pkg.currency)}`,
        duration: 3000
      });
      
      // Abrir em nova aba após 1 segundo (para usuário ver o toast)
      setTimeout(() => {
        window.open(packageLink, '_blank', 'noopener,noreferrer');
      }, 1000);

    } catch (error) {
      console.error('Erro ao processar compra:', error);
      toast.error('Erro ao processar pagamento', {
        description: 'Tente novamente ou entre em contato com o suporte.',
        duration: 5000
      });
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