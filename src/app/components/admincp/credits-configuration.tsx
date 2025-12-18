import { useState } from 'react';
import { DollarSign, CreditCard, Save, Eye, EyeOff, Check, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { mockCreditProviders } from '../../data/admincp-state';

export function CreditsConfiguration() {
  const [providers, setProviders] = useState(mockCreditProviders);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleProvider = (providerName: string) => {
    setProviders(providers.map(p => 
      p.provider === providerName ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const providerIcons = {
    paypal: '💳',
    mercadopago: '💰',
    pix: '🇧🇷',
    stripe: '💎'
  };

  const providerNames = {
    paypal: 'PayPal',
    mercadopago: 'MercadoPago',
    pix: 'PIX',
    stripe: 'Stripe'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl text-white mb-2">Credits Configuration</h1>
        <p className="text-gray-400">Configure payment providers for credits system</p>
      </div>

      {/* Warning Banner */}
      <Card className="backdrop-blur-lg bg-yellow-500/5 border-yellow-500/30 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg text-yellow-500 font-semibold mb-2">⚠️ Sistema Não Configurado</h3>
            <p className="text-gray-400 text-sm mb-2">
              Nenhum provedor de pagamento está configurado. Para ativar o sistema de créditos, você precisa:
            </p>
            <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
              <li>Configurar pelo menos um provedor de pagamento</li>
              <li>Adicionar as credenciais (Client ID e Secret Key)</li>
              <li>Ativar o provedor desejado</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Payment Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <Card 
            key={provider.provider}
            className={`backdrop-blur-lg border p-6 transition-all ${
              provider.enabled 
                ? 'bg-green-500/5 border-green-500/30' 
                : 'bg-gray-900/50 border-amber-500/20'
            }`}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{providerIcons[provider.provider]}</span>
                  <div>
                    <h3 className="text-xl text-white font-semibold">
                      {providerNames[provider.provider]}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {provider.configured ? 'Configurado' : 'Não configurado'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleProvider(provider.provider)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    provider.enabled ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      provider.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Configuration Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Client ID / Public Key</label>
                  <div className="relative">
                    <input
                      type={showSecrets[provider.provider] ? 'text' : 'password'}
                      placeholder="Digite o Client ID..."
                      className="w-full px-4 py-3 pr-12 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => setShowSecrets({
                        ...showSecrets,
                        [provider.provider]: !showSecrets[provider.provider]
                      })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showSecrets[provider.provider] ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Secret Key</label>
                  <div className="relative">
                    <input
                      type={showSecrets[`${provider.provider}_secret`] ? 'text' : 'password'}
                      placeholder="Digite a Secret Key..."
                      className="w-full px-4 py-3 pr-12 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => setShowSecrets({
                        ...showSecrets,
                        [`${provider.provider}_secret`]: !showSecrets[`${provider.provider}_secret`]
                      })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showSecrets[`${provider.provider}_secret`] ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="pt-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {provider.enabled ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 text-sm">Ativo</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500 text-sm">Desativado</span>
                      </>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600 text-black"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Help Card */}
      <Card className="backdrop-blur-lg bg-blue-500/5 border-blue-500/30 p-6">
        <h3 className="text-lg text-blue-400 font-semibold mb-3">📚 Como Configurar</h3>
        <div className="space-y-2 text-gray-400 text-sm">
          <p><strong className="text-white">PayPal:</strong> Acesse o Developer Dashboard do PayPal para obter suas credenciais</p>
          <p><strong className="text-white">MercadoPago:</strong> Entre em Sua Conta → Seu negócio → Credenciais</p>
          <p><strong className="text-white">PIX:</strong> Configure sua chave PIX e sistema de verificação manual</p>
          <p><strong className="text-white">Stripe:</strong> Acesse o Dashboard do Stripe → API Keys</p>
        </div>
      </Card>
    </div>
  );
}
