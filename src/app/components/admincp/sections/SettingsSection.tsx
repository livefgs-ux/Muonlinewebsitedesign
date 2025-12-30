import { useState, useEffect } from 'react';
import { Settings, Save, Database, Globe, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toast } from 'sonner';

/**
 * ⚙️ Settings Section
 * Configurações gerais do site e servidor - CONECTADO À API REAL
 */

export function SettingsSection() {
  // Estados para General
  const [siteName, setSiteName] = useState('');
  const [discordLink, setDiscordLink] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [savingGeneral, setSavingGeneral] = useState(false);

  // Estados para Database
  const [dbHost, setDbHost] = useState('');
  const [dbPort, setDbPort] = useState('');
  const [dbName, setDbName] = useState('');
  const [dbUser, setDbUser] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [savingDatabase, setSavingDatabase] = useState(false);

  // Estados para Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [auditLogsEnabled, setAuditLogsEnabled] = useState(true);
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(false);

  // Estados para Notifications
  const [notifyRegistrations, setNotifyRegistrations] = useState(true);
  const [notifyTransactions, setNotifyTransactions] = useState(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const settings = data.data;
        
        // Carregar General
        setSiteName(settings.siteName || 'MeuMU Online');
        setDiscordLink(settings.discordLink || '');
        setWhatsappLink(settings.whatsappLink || '');

        // Carregar Database
        setDbHost(settings.dbHost || 'localhost');
        setDbPort(settings.dbPort || '3306');
        setDbName(settings.dbName || 'MuOnline');
        setDbUser(settings.dbUser || '');
        setDbPassword(''); // Nunca carregar senha do servidor

        // Carregar Security
        setTwoFactorEnabled(settings.twoFactorEnabled || false);
        setAuditLogsEnabled(settings.auditLogsEnabled !== false);
        setIpWhitelistEnabled(settings.ipWhitelistEnabled || false);

        // Carregar Notifications
        setNotifyRegistrations(settings.notifyRegistrations !== false);
        setNotifyTransactions(settings.notifyTransactions !== false);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    try {
      setSavingGeneral(true);
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('/api/admin/settings/general', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          siteName,
          discordLink,
          whatsappLink
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Configurações gerais salvas com sucesso!');
      } else {
        toast.error(data.message || 'Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar configurações gerais:', error);
      toast.error('Erro ao salvar configurações gerais');
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleSaveDatabase = async () => {
    if (!dbHost || !dbPort || !dbName) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setSavingDatabase(true);
      const token = sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('/api/admin/settings/database', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dbHost,
          dbPort,
          dbName,
          dbUser,
          dbPassword: dbPassword || undefined // Só envia se foi alterada
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Configurações de banco de dados salvas com sucesso!');
        setDbPassword(''); // Limpar campo senha
      } else {
        toast.error(data.message || 'Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar configurações de banco:', error);
      toast.error('Erro ao salvar configurações de banco de dados');
    } finally {
      setSavingDatabase(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Configurações</h2>
          <p className="text-sm text-slate-400">Gerencie as configurações do site e servidor</p>
        </div>
        <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
          <CardContent className="p-6 text-center text-slate-400">
            Carregando configurações...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Configurações</h2>
        <p className="text-sm text-slate-400">Gerencie as configurações do site e servidor</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-slate-900/60 border border-amber-500/20">
          <TabsTrigger value="general" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-white text-slate-200">Geral</TabsTrigger>
          <TabsTrigger value="database" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-white text-slate-200">Banco de Dados</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-white text-slate-200">Segurança</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-white text-slate-200">Notificações</TabsTrigger>
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
                  placeholder="https://discord.gg/..."
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
              <Button 
                onClick={handleSaveGeneral}
                disabled={savingGeneral}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
              >
                <Save className="w-4 h-4 mr-2" />
                {savingGeneral ? 'Salvando...' : 'Salvar Alterações'}
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
                    value={dbHost}
                    onChange={(e) => setDbHost(e.target.value)}
                    placeholder="localhost"
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Porta</label>
                  <Input
                    type="text"
                    value={dbPort}
                    onChange={(e) => setDbPort(e.target.value)}
                    placeholder="3306"
                    className="bg-slate-800/50 border-slate-700/50 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Banco (Servidor MU)</label>
                <Input
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="MuOnline"
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Usuário do Banco</label>
                <Input
                  type="text"
                  value={dbUser}
                  onChange={(e) => setDbUser(e.target.value)}
                  placeholder="root"
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Senha do Banco</label>
                <Input
                  type="password"
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  placeholder="Deixe em branco para não alterar"
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">Por segurança, a senha não é carregada. Preencha apenas se quiser alterar.</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-sm text-amber-400">
                  ⚠️ <strong>ATENÇÃO:</strong> Alterar estas configurações pode interromper a conexão com o banco de dados. Certifique-se de que os dados estão corretos antes de salvar.
                </p>
              </div>
              <Button 
                onClick={handleSaveDatabase}
                disabled={savingDatabase}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold"
              >
                <Save className="w-4 h-4 mr-2" />
                {savingDatabase ? 'Salvando...' : 'Salvar Configurações'}
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
              <CardDescription>Configure opções de segurança do painel administrativo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                <div>
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-400">Ativar 2FA para admins</p>
                </div>
                <Switch 
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                <div>
                  <p className="font-medium text-white">Logs de Auditoria</p>
                  <p className="text-sm text-slate-400">Registrar todas as ações administrativas</p>
                </div>
                <Switch 
                  checked={auditLogsEnabled}
                  onCheckedChange={setAuditLogsEnabled}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                <div>
                  <p className="font-medium text-white">IP Whitelist</p>
                  <p className="text-sm text-slate-400">Permitir apenas IPs específicos</p>
                </div>
                <Switch 
                  checked={ipWhitelistEnabled}
                  onCheckedChange={setIpWhitelistEnabled}
                />
              </div>
              <p className="text-xs text-slate-500">
                Estas configurações de segurança serão implementadas na próxima versão do AdminCP.
              </p>
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
              <CardDescription>Configure quais eventos devem gerar notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                <div>
                  <p className="font-medium text-white">Novos Registros</p>
                  <p className="text-sm text-slate-400">Notificar sobre novos cadastros</p>
                </div>
                <Switch 
                  checked={notifyRegistrations}
                  onCheckedChange={setNotifyRegistrations}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                <div>
                  <p className="font-medium text-white">Transações</p>
                  <p className="text-sm text-slate-400">Notificar sobre compras de créditos</p>
                </div>
                <Switch 
                  checked={notifyTransactions}
                  onCheckedChange={setNotifyTransactions}
                />
              </div>
              <p className="text-xs text-slate-500">
                Sistema de notificações será implementado na próxima versão do AdminCP.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
