import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { 
  Link as LinkIcon, 
  Save, 
  RefreshCw,
  ExternalLink,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Eye,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface PurchaseLinks {
  default: string;
  package_500: string;
  package_1000: string;
  package_2000: string;
  package_5000: string;
  package_10000: string;
  package_20000: string;
}

export function DonationLinksSection() {
  const [links, setLinks] = useState<PurchaseLinks>({
    default: '',
    package_500: '',
    package_1000: '',
    package_2000: '',
    package_5000: '',
    package_10000: '',
    package_20000: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = () => {
    try {
      setLoading(true);
      const savedLinks = localStorage.getItem('wcoin_purchase_links');
      if (savedLinks) {
        setLinks(JSON.parse(savedLinks));
      }
    } catch (error) {
      console.error('Error loading purchase links:', error);
      toast.error('Erro ao carregar links de compra');
    } finally {
      setLoading(false);
    }
  };

  const saveLinks = () => {
    try {
      setSaving(true);
      localStorage.setItem('wcoin_purchase_links', JSON.stringify(links));
      toast.success('✅ Links de compra salvos com sucesso!');
    } catch (error) {
      console.error('Error saving purchase links:', error);
      toast.error('❌ Erro ao salvar links de compra');
    } finally {
      setSaving(false);
    }
  };

  const updateLink = (key: keyof PurchaseLinks, value: string) => {
    setLinks({ ...links, [key]: value });
  };

  const testLink = (url: string) => {
    if (!url) {
      toast.error('Link vazio!');
      return;
    }
    window.open(url, '_blank');
    toast.info('Link aberto em nova aba para teste');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copiado para a área de transferência!');
  };

  const resetLinks = () => {
    const confirmed = window.confirm('Deseja realmente resetar todos os links? Esta ação não pode ser desfeita.');
    if (confirmed) {
      setLinks({
        default: '',
        package_500: '',
        package_1000: '',
        package_2000: '',
        package_5000: '',
        package_10000: '',
        package_20000: '',
      });
      toast.success('Links resetados. Não esqueça de salvar!');
    }
  };

  const packages = [
    { key: 'default', label: 'Link Padrão (Fallback)', wcoin: 0, price: '-', description: 'Usado quando um pacote específico não tem link configurado' },
    { key: 'package_500', label: 'Pacote 500 WCoin', wcoin: 500, price: 'R$ 25,00', description: 'Pacote inicial' },
    { key: 'package_1000', label: 'Pacote 1.000 WCoin', wcoin: 1000, price: 'R$ 50,00', description: '+50 bônus' },
    { key: 'package_2000', label: 'Pacote 2.000 WCoin', wcoin: 2000, price: 'R$ 100,00', description: '+200 bônus' },
    { key: 'package_5000', label: 'Pacote 5.000 WCoin', wcoin: 5000, price: 'R$ 250,00', description: '+750 bônus' },
    { key: 'package_10000', label: 'Pacote 10.000 WCoin', wcoin: 10000, price: 'R$ 500,00', description: '+2.000 bônus' },
    { key: 'package_20000', label: 'Pacote 20.000 WCoin', wcoin: 20000, price: 'R$ 1.000,00', description: '+5.000 bônus' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-gold/20 to-amber-500/20 rounded-xl border border-gold/30">
            <CreditCard className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-300">
              Links de Doação / Compra de WCoin
            </h2>
            <p className="text-gray-400 text-sm">
              Configure os links de pagamento para cada pacote de WCoin
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={resetLinks}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Resetar Tudo
          </Button>
          <Button
            onClick={saveLinks}
            disabled={saving}
            className="bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold text-black font-bold"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Links'}
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <Card className="bg-gradient-to-br from-blue-950/50 to-blue-900/30 border border-blue-500/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-blue-300 font-semibold mb-1">Como funciona?</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• <strong>Configure URLs</strong> de pagamento para cada pacote (MercadoPago, PagSeguro, PayPal, etc)</li>
                <li>• <strong>Link Padrão</strong> será usado se um pacote específico não tiver link configurado</li>
                <li>• <strong>Jogadores serão redirecionados</strong> ao clicar em "Comprar Agora" na Loja de Cash</li>
                <li>• <strong>Deixe vazio</strong> se não quiser ativar a venda daquele pacote</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Configuration */}
      <div className="space-y-4">
        {packages.map((pkg) => {
          const linkValue = links[pkg.key as keyof PurchaseLinks] || '';
          const hasLink = linkValue.length > 0;
          
          return (
            <Card
              key={pkg.key}
              className={`bg-gradient-to-br from-obsidian/95 to-obsidian-light/95 border-2 backdrop-blur-xl transition-all ${
                pkg.key === 'default'
                  ? 'border-purple-500/40'
                  : hasLink
                  ? 'border-green-500/40'
                  : 'border-gold/20'
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {pkg.key === 'default' ? (
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/50">
                        <LinkIcon className="w-4 h-4 text-purple-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center border border-gold/50">
                        <DollarSign className="w-4 h-4 text-gold" />
                      </div>
                    )}
                    <div>
                      <span className="text-gray-300">{pkg.label}</span>
                      {pkg.wcoin > 0 && (
                        <span className="text-gray-500 text-sm ml-2">({pkg.price})</span>
                      )}
                    </div>
                  </div>
                  {hasLink && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/50">
                      <CheckCircle className="w-3 h-3" />
                      Configurado
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-400 text-sm">{pkg.description}</p>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">URL de Pagamento</Label>
                  <div className="flex gap-2">
                    <Input
                      value={linkValue}
                      onChange={(e) => updateLink(pkg.key as keyof PurchaseLinks, e.target.value)}
                      placeholder="https://seu-gateway-de-pagamento.com/checkout/..."
                      className="flex-1 bg-black/30 border-gold/20 text-white placeholder:text-gray-500 focus:border-gold"
                    />
                    {hasLink && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testLink(linkValue)}
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(linkValue)}
                          className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Preview */}
                {hasLink && (
                  <div className="p-3 bg-black/30 border border-gold/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className="w-4 h-4 text-gold" />
                        <span className="text-gray-400">Link ativo:</span>
                        <code className="text-gold text-xs bg-black/40 px-2 py-1 rounded">
                          {linkValue.substring(0, 50)}{linkValue.length > 50 ? '...' : ''}
                        </code>
                      </div>
                      <span className="text-green-400 text-xs font-semibold">✓ Funcionando</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <Card className="bg-gradient-to-br from-amber-950/50 to-amber-900/30 border border-amber-500/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-amber-300 font-semibold mb-2">Gateways de Pagamento Recomendados</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• <strong>MercadoPago</strong> - mercadopago.com.br (Brasil)</li>
                <li>• <strong>PagSeguro</strong> - pagseguro.uol.com.br (Brasil)</li>
                <li>• <strong>PayPal</strong> - paypal.com (Internacional)</li>
                <li>• <strong>Stripe</strong> - stripe.com (Internacional)</li>
                <li>• <strong>PicPay</strong> - picpay.com (Brasil)</li>
              </ul>
              <p className="text-gray-500 text-xs mt-3">
                💡 Dica: Configure uma URL diferente para cada pacote para rastreamento de vendas, ou use o Link Padrão para todos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button Bottom */}
      <div className="flex justify-end">
        <Button
          onClick={saveLinks}
          disabled={saving}
          size="lg"
          className="bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold text-black font-bold"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Salvando Alterações...' : 'Salvar Todos os Links'}
        </Button>
      </div>
    </div>
  );
}
