/**
 * 🛒 SHOP TAB - WCoin Purchase
 * V561 - Refatoração PlayerDashboard
 * V586 - Sistema de pagamento integrado
 */

import React from 'react';
import { motion } from 'motion/react';
import { WCoinShop } from '../../shop/WCoinShop';

export function ShopTab() {
  // V586: handlePurchase agora é gerenciado internamente pelo WCoinShop
  // Não precisa mais passar onPurchase como prop
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <WCoinShop />
    </motion.div>
  );
}