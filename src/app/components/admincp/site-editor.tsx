/**
 * 🎨 AdminCP - Site Editor Module
 * Editor visual integrado para personalização do frontend
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { Palette, Globe, Image, Layout, Save, RefreshCw, Zap, Info, Upload, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SiteConfig {
  [key: string]: string | boolean;
}

interface SiteEditorProps {
  // Removido fakeMode - MODO PRODUÇÃO APENAS
}

export function SiteEditor({}: SiteEditorProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Config states
  const [homeBanner, setHomeBanner] = useState<SiteConfig>({
    title: 'MeuMU Online',
    subtitle: 'Season 19-2-3 - Épico',
    description: 'Servidor hardcore para quem gosta de emoção',
    buttonText: 'Começar Agora',
    buttonLink: '#downloads'
  });

  const [socialLinks, setSocialLinks] = useState<SiteConfig>({
    discord: 'https://discord.gg/meumu',
    whatsapp: 'https://wa.me/5511999999999',
    facebook: '',
    instagram: '',
    youtube: ''
  });

  const [siteSettings, setSiteSettings] = useState<SiteConfig>({
    serverName: 'MeuMU Online',
    serverSeason: '19-2-3',
    maintenanceMode: false,
    googleAnalytics: '',
    metaDescription: 'Melhor servidor de Mu Online - Season 19-2-3',
    metaKeywords: 'mu online, muonline, servidor mu, season 19'
  });

  // Visual customization states
  const [customBackground, setCustomBackground] = useState<string | null>(
    localStorage.getItem('admin_customBackground')
  );
  const [particleColor, setParticleColor] = useState<string>(
    localStorage.getItem('admin_particleColor') || '#FFB800'
  );
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      // ✅ V574 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch('/api/admin/site-editor/config', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const grouped = data.data.grouped;
          if (grouped.home_banner) setHomeBanner(grouped.home_banner);
          if (grouped.social) setSocialLinks(grouped.social);
          if (grouped.site) setSiteSettings(grouped.site);
        }
      }
    } catch (error) {
      console.error('Error loading site config:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const saveHomeBanner = async () => {
    setSaving(true);
    try {
      // ✅ V574 FIX: Buscar token do sessionStorage (auth_token) OU localStorage (admin_token)
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');
      
      const response = await fetch('/api/admin/site-editor/home-banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(homeBanner)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Banner da home atualizado com sucesso!');
      } else {
        toast.error(data.message || 'Erro ao atualizar banner');
      }
    } catch (error) {
      console.error('Error saving home banner:', error);
      toast.error('Erro ao salvar banner da home');
    } finally {
      setSaving(false);
    }
  };

  const saveSocialLinks = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/site-editor/social-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(socialLinks)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Links de redes sociais atualizados!');
      } else {
        toast.error(data.message || 'Erro ao atualizar links');
      }
    } catch (error) {
      console.error('Error saving social links:', error);
      toast.error('Erro ao salvar links de redes sociais');
    } finally {
      setSaving(false);
    }
  };

  const saveSiteSettings = async () => {
    setSaving(true);
    try {
      const configs = Object.entries(siteSettings).map(([key, value]) => ({
        section: 'site',
        key,
        value: value.toString()
      }));

      const response = await fetch('/api/admin/site-editor/config/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ configs })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Configurações do site atualizadas!');
      } else {
        toast.error(data.message || 'Erro ao atualizar configurações');
      }
    } catch (error) {
      console.error('Error saving site settings:', error);
      toast.error('Erro ao salvar configurações do site');
    } finally {
      setSaving(false);
    }
  };

  // Visual customization handlers
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('❌ Formato inválido! Use apenas JPG, PNG ou WebP');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('❌ Imagem muito grande! Tamanho máximo: 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setBackgroundPreview(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBackground = () => {
    if (backgroundPreview) {
      localStorage.setItem('admin_customBackground', backgroundPreview);
      setCustomBackground(backgroundPreview);
      toast.success('✅ Background salvo com sucesso! Recarregue a página para ver as mudanças.');
      setBackgroundPreview(null);
    }
  };

  const handleRemoveBackground = () => {
    localStorage.removeItem('admin_customBackground');
    setCustomBackground(null);
    setBackgroundPreview(null);
    toast.success('✅ Background padrão restaurado! Recarregue a página para ver as mudanças.');
  };

  const handleSaveParticleColor = () => {
    localStorage.setItem('admin_particleColor', particleColor);
    toast.success('✅ Cor das partículas salva! Recarregue a página para ver as mudanças.');
  };

  const handleResetParticleColor = () => {
    const defaultColor = '#FFB800';
    setParticleColor(defaultColor);
    localStorage.setItem('admin_particleColor', defaultColor);
    toast.success('✅ Cor padrão restaurada! Recarregue a página para ver as mudanças.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-amber-400/80">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-3">
            <Palette className="w-7 h-7 text-amber-500" />
            Editor Visual do Site
          </h2>
          <p className="text-slate-400 mt-1">
            Personalize a aparência e conteúdo do site sem mexer no código
          </p>
        </div>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-black/40 backdrop-blur-sm border border-amber-500/20">
          <TabsTrigger value="home" className="flex items-center gap-2 data-[state=active]:bg-amber-500/20 data-[state=active]:text-white text-slate-200">
            <Layout className="w-4 h-4" />
            Home Banner
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2 data-[state=active]:bg-amber-500/20 data-[state=active]:text-white text-slate-200">
            <Globe className="w-4 h-4" />
            Redes Sociais
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center gap-2 data-[state=active]:bg-amber-500/20 data-[state=active]:text-white text-slate-200">
            <Zap className="w-4 h-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-amber-500/20 data-[state=active]:text-white text-slate-200">
            <Palette className="w-4 h-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-amber-500/20 data-[state=active]:text-white text-slate-200">
            <Image className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Home Banner Tab */}
        <TabsContent value="home" className="space-y-4">
          <Card className="bg-black/60 backdrop-blur-sm border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Banner Principal</CardTitle>
              <CardDescription>
                Edite o banner exibido na página inicial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="banner-title">Título</Label>
                <Input
                  id="banner-title"
                  value={homeBanner.title as string}
                  onChange={(e) => setHomeBanner({ ...homeBanner, title: e.target.value })}
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-subtitle">Subtítulo</Label>
                <Input
                  id="banner-subtitle"
                  value={homeBanner.subtitle as string}
                  onChange={(e) => setHomeBanner({ ...homeBanner, subtitle: e.target.value })}
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-description">Descrição</Label>
                <Textarea
                  id="banner-description"
                  value={homeBanner.description as string}
                  onChange={(e) => setHomeBanner({ ...homeBanner, description: e.target.value })}
                  rows={3}
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banner-button-text">Texto do Botão</Label>
                  <Input
                    id="banner-button-text"
                    value={homeBanner.buttonText as string}
                    onChange={(e) => setHomeBanner({ ...homeBanner, buttonText: e.target.value })}
                    className="bg-black/40 border-amber-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner-button-link">Link do Botão</Label>
                  <Input
                    id="banner-button-link"
                    value={homeBanner.buttonLink as string}
                    onChange={(e) => setHomeBanner({ ...homeBanner, buttonLink: e.target.value })}
                    placeholder="#downloads"
                    className="bg-black/40 border-amber-500/20"
                  />
                </div>
              </div>

              <Button
                onClick={saveHomeBanner}
                disabled={saving}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Banner'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card className="bg-black/60 backdrop-blur-sm border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Redes Sociais</CardTitle>
              <CardDescription>
                Configure os links das redes sociais exibidos no site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social-discord">Discord</Label>
                <Input
                  id="social-discord"
                  type="url"
                  value={socialLinks.discord as string}
                  onChange={(e) => setSocialLinks({ ...socialLinks, discord: e.target.value })}
                  placeholder="https://discord.gg/meumu"
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social-whatsapp">WhatsApp</Label>
                <Input
                  id="social-whatsapp"
                  type="url"
                  value={socialLinks.whatsapp as string}
                  onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                  placeholder="https://wa.me/5511999999999"
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social-facebook">Facebook</Label>
                <Input
                  id="social-facebook"
                  type="url"
                  value={socialLinks.facebook as string}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  placeholder="https://facebook.com/meumu"
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social-instagram">Instagram</Label>
                <Input
                  id="social-instagram"
                  type="url"
                  value={socialLinks.instagram as string}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  placeholder="https://instagram.com/meumu"
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social-youtube">YouTube</Label>
                <Input
                  id="social-youtube"
                  type="url"
                  value={socialLinks.youtube as string}
                  onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                  placeholder="https://youtube.com/@meumu"
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <Button
                onClick={saveSocialLinks}
                disabled={saving}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Redes Sociais'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visual Customization Tab */}
        <TabsContent value="visual" className="space-y-4">
          <Card className="bg-black/60 backdrop-blur-sm border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Personalização Visual Global
              </CardTitle>
              <CardDescription>
                🎨 Personalize background e partículas do site (apenas para Administradores)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Background Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-300 space-y-1">
                    <p className="font-semibold">📸 Especificações da Imagem de Background:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li><strong>Formatos aceitos:</strong> JPG, PNG, WebP</li>
                      <li><strong>Resolução recomendada:</strong> 1920x1080px (Full HD) ou superior</li>
                      <li><strong>Tamanho máximo:</strong> 5MB</li>
                      <li><strong>Proporção:</strong> 16:9 (widescreen) - ideal para telas modernas</li>
                      <li><strong>Qualidade:</strong> 80-90% (equilíbrio entre qualidade e tamanho)</li>
                      <li><strong>Dica:</strong> Use imagens escuras para melhor contraste com o texto</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-background" className="flex items-center gap-2 text-base">
                    <Upload className="w-4 h-4" />
                    Upload de Background Customizado
                  </Label>
                  <Input
                    id="custom-background"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleBackgroundUpload}
                    className="bg-black/40 border-amber-500/20 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-amber-500 file:text-black file:font-semibold hover:file:bg-amber-400 file:cursor-pointer"
                  />
                </div>

                {backgroundPreview && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400 font-semibold">Preview do Background:</p>
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-amber-500/50 shadow-xl">
                      <img 
                        src={backgroundPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <p className="text-white font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          Preview - Seu novo background
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleSaveBackground}
                        className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Salvar Background
                      </Button>
                      <Button 
                        onClick={() => setBackgroundPreview(null)}
                        variant="outline"
                        className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {customBackground && !backgroundPreview && (
                  <div className="space-y-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <p className="text-sm text-emerald-400 flex items-center gap-2 font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      Background customizado ativo
                    </p>
                    <Button 
                      onClick={handleRemoveBackground}
                      variant="outline"
                      className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Restaurar Background Padrão
                    </Button>
                  </div>
                )}
              </div>

              {/* Particle Color Customization Section */}
              <div className="border-t border-amber-500/20 pt-6 space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="particle-color" className="flex items-center gap-2 text-base">
                    <Zap className="w-4 h-4" />
                    Cor das Partículas Flutuantes
                  </Label>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Input
                        id="particle-color"
                        type="color"
                        value={particleColor}
                        onChange={(e) => setParticleColor(e.target.value)}
                        className="w-full h-12 rounded-md cursor-pointer border-2 border-amber-500/30 bg-black/40"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <span className="text-sm font-mono text-gray-400 bg-black/60 px-2 py-1 rounded">
                          {particleColor}
                        </span>
                      </div>
                    </div>
                    
                    <div 
                      className="w-16 h-12 rounded-md border-2 border-amber-500/30 shadow-lg"
                      style={{ backgroundColor: particleColor }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    💡 Cor padrão: #FFB800 (Dourado Épico)
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleSaveParticleColor}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Salvar Cor das Partículas
                  </Button>
                  <Button 
                    onClick={handleResetParticleColor}
                    variant="outline"
                    className="border-amber-500/30 hover:bg-amber-500/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resetar
                  </Button>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-sm text-amber-300 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Nota:</strong> As alterações serão salvas no <code className="bg-black/40 px-1 py-0.5 rounded">localStorage</code> do navegador. 
                    Para ver as mudanças aplicadas, <strong>recarregue a página</strong> após salvar.
                  </span>
                </p>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-black/60 backdrop-blur-sm border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Configurações Gerais</CardTitle>
              <CardDescription>
                Configure informações básicas do site e SEO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="server-name">Nome do Servidor</Label>
                  <Input
                    id="server-name"
                    value={siteSettings.serverName as string}
                    onChange={(e) => setSiteSettings({ ...siteSettings, serverName: e.target.value })}
                    className="bg-black/40 border-amber-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="server-season">Season</Label>
                  <Input
                    id="server-season"
                    value={siteSettings.serverSeason as string}
                    onChange={(e) => setSiteSettings({ ...siteSettings, serverSeason: e.target.value })}
                    className="bg-black/40 border-amber-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description (SEO)</Label>
                <Textarea
                  id="meta-description"
                  value={siteSettings.metaDescription as string}
                  onChange={(e) => setSiteSettings({ ...siteSettings, metaDescription: e.target.value })}
                  rows={2}
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Meta Keywords (SEO)</Label>
                <Input
                  id="meta-keywords"
                  value={siteSettings.metaKeywords as string}
                  onChange={(e) => setSiteSettings({ ...siteSettings, metaKeywords: e.target.value })}
                  placeholder="mu online, muonline, servidor mu"
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input
                  id="google-analytics"
                  value={siteSettings.googleAnalytics as string}
                  onChange={(e) => setSiteSettings({ ...siteSettings, googleAnalytics: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="bg-black/40 border-amber-500/20"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-amber-500/10">
                <div>
                  <Label htmlFor="maintenance-mode" className="cursor-pointer">
                    Modo Manutenção
                  </Label>
                  <p className="text-sm text-slate-400">
                    Desativa o site temporariamente (apenas admin pode acessar)
                  </p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={siteSettings.maintenanceMode as boolean}
                  onCheckedChange={(checked) => 
                    setSiteSettings({ ...siteSettings, maintenanceMode: checked })
                  }
                />
              </div>

              <Button
                onClick={saveSiteSettings}
                disabled={saving}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card className="bg-black/60 backdrop-blur-sm border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Preview do Site</CardTitle>
              <CardDescription>
                Visualize como ficará o site com as alterações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Home Banner Preview */}
                <div className="border border-amber-500/20 rounded-lg p-6 bg-gradient-to-br from-black/80 to-slate-900/80">
                  <h3 className="text-2xl text-amber-400 mb-2">{homeBanner.title}</h3>
                  <p className="text-amber-500/80 mb-2">{homeBanner.subtitle}</p>
                  <p className="text-slate-300 mb-4">{homeBanner.description}</p>
                  <Button className="bg-gradient-to-r from-amber-600 to-amber-500">
                    {homeBanner.buttonText}
                  </Button>
                </div>

                {/* Social Links Preview */}
                <div className="border border-amber-500/20 rounded-lg p-6 bg-black/40">
                  <h4 className="text-amber-400 mb-3">Redes Sociais Configuradas:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(socialLinks).map(([platform, url]) => (
                      <div key={platform} className="flex items-center gap-2">
                        <span className="text-slate-400 capitalize">{platform}:</span>
                        <span className="text-amber-500/80 truncate">
                          {url || <span className="text-slate-600 italic">Não configurado</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Site Settings Preview */}
                <div className="border border-amber-500/20 rounded-lg p-6 bg-black/40">
                  <h4 className="text-amber-400 mb-3">Configurações do Site:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-400">Servidor:</span>{' '}
                      <span className="text-white">{siteSettings.serverName} - {siteSettings.serverSeason}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Modo Manutenção:</span>{' '}
                      <span className={siteSettings.maintenanceMode ? 'text-red-400' : 'text-emerald-400'}>
                        {siteSettings.maintenanceMode ? 'Ativado' : 'Desativado'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Google Analytics:</span>{' '}
                      <span className="text-amber-500/80">
                        {siteSettings.googleAnalytics || <span className="text-slate-600 italic">Não configurado</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 backdrop-blur-sm border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-amber-400 text-sm">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('Recarregar configurações? Alterações não salvas serão perdidas.')) {
                loadConfig();
              }
            }}
            className="border-amber-500/30 hover:bg-amber-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Recarregar
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/', '_blank')}
            className="border-amber-500/30 hover:bg-amber-500/10"
          >
            <Globe className="w-4 h-4 mr-2" />
            Ver Site ao Vivo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}