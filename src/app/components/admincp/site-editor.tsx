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
import { Palette, Globe, Image, Layout, Save, RefreshCw } from 'lucide-react';

interface SiteConfig {
  [key: string]: string | boolean;
}

interface SiteEditorProps {
  fakeMode?: boolean;
}

export function SiteEditor({ fakeMode = false }: SiteEditorProps) {
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

  useEffect(() => {
    if (!fakeMode) {
      loadSiteConfig();
    }
  }, [fakeMode]);

  const loadSiteConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/site-editor/config', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
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
      if (fakeMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.success('Banner da home atualizado com sucesso!');
      } else {
        const response = await fetch('/api/admin/site-editor/home-banner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
          },
          body: JSON.stringify(homeBanner)
        });

        const data = await response.json();
        
        if (data.success) {
          toast.success('Banner da home atualizado com sucesso!');
        } else {
          toast.error(data.message || 'Erro ao atualizar banner');
        }
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
      if (fakeMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.success('Links de redes sociais atualizados!');
      } else {
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
      if (fakeMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.success('Configurações do site atualizadas!');
      } else {
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
      }
    } catch (error) {
      console.error('Error saving site settings:', error);
      toast.error('Erro ao salvar configurações do site');
    } finally {
      setSaving(false);
    }
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
        <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-sm border border-amber-500/20">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Home Banner
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Redes Sociais
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
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
              if (fakeMode || confirm('Recarregar configurações? Alterações não salvas serão perdidas.')) {
                loadSiteConfig();
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
