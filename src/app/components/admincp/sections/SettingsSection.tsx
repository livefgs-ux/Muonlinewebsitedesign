import { useState } from 'react';
import { Settings, Save, Database, Globe, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

/**
 * ⚙️ Settings Section
 * Configurações gerais do site e servidor
 */

export function SettingsSection() {
  const [siteName, setSiteName] = useState('MeuMU Online');
  const [discordLink, setDiscordLink] = useState('https://discord.gg/meumu');
  const [whatsappLink, setWhatsappLink] = useState('');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Configurações</h2>
        <p className="text-sm text-slate-400">Gerencie as configurações do site e servidor</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-slate-900/60 border border-amber-500/20">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Globe className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>Configure informações básicas do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                <Input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Link do Discord</label>
                <Input
                  type="text"
                  value={discordLink}
                  onChange={(e) => setDiscordLink(e.target.value)}
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Link do WhatsApp</label>
                <Input
                  type="text"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  placeholder="https://wa.me/..."
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Database className="w-5 h-5" />
                Configurações do Banco de Dados
              </CardTitle>
              <CardDescription>Configure a conexão com o banco de dados MySQL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Host</label>
                  <Input
                    type="text"
                    defaultValue="localhost"
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Porta</label>
                  <Input
                    type="text"
                    defaultValue="3306"
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Banco</label>
                <Input
                  type="text"
                  defaultValue="MuOnline"
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Shield className="w-5 h-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                <div>
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-400">Ativar 2FA para admins</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                <div>
                  <p className="font-medium text-white">Logs de Auditoria</p>
                  <p className="text-sm text-slate-400">Registrar todas as ações administrativas</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                <div>
                  <p className="font-medium text-white">IP Whitelist</p>
                  <p className="text-sm text-slate-400">Permitir apenas IPs específicos</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                <div>
                  <p className="font-medium text-white">Novos Registros</p>
                  <p className="text-sm text-slate-400">Notificar sobre novos cadastros</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                <div>
                  <p className="font-medium text-white">Transações</p>
                  <p className="text-sm text-slate-400">Notificar sobre compras de créditos</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
