/**
 * 🛒 SHOP TAB - WCoin Purchase
 * V561 - Refatoração PlayerDashboard
 */

import React from 'react';
import { motion } from 'motion/react';
import { WCoinShop } from '../../shop/WCoinShop';

export function ShopTab() {
  const handlePurchase = (packageId: number) => {
    console.log('Comprar pacote:', packageId);
    // TODO: Implementar lógica de compra
    // Integração com gateway de pagamento
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <WCoinShop onPurchase={handlePurchase} />
    </motion.div>
  );
}
