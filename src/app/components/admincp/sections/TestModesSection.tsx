import { useState } from 'react';
import { Eye, EyeOff, UserCircle2, Shield, AlertTriangle, Info, Key, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';

interface TestModesSectionProps {
  onNavigate?: (section: string) => void;
}

export function TestModesSection({ onNavigate }: TestModesSectionProps) {
  const [dashboardTestMode, setDashboardTestMode] = useState(false);
  const [adminTestMode, setAdminTestMode] = useState(false);

  const handleActivateDashboardTest = () => {
    setDashboardTestMode(true);
    // Navegar para login2 (modo test do dashboard)
    if (onNavigate) {
      onNavigate('login2');
    }
  };

  const handleActivateAdminTest = () => {
    setAdminTestMode(true);
    // Navegar para admin login (modo fake)
    if (onNavigate) {
      onNavigate('admin');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
            Modos de Teste
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Ative modos de visualização para teste (somente leitura)
          </p>
        </div>
        <Badge variant="outline" className="border-amber-500/50 text-amber-400">
          <Eye className="w-3 h-3 mr-1" />
          Somente Visualização
        </Badge>
      </div>

      {/* Alert de Segurança */}
      <Alert className="bg-amber-500/10 border-amber-500/30">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-200">
          <strong>Importante:</strong> Os modos de teste são somente para visualização. 
          Nenhuma alteração ou ação de salvamento será permitida nesses modos.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dashboard Test Mode */}
        <Card className="bg-black/40 backdrop-blur-xl border-blue-500/30 hover:border-blue-500/50 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <UserCircle2 className="w-6 h-6 text-white" />
              </div>
              <Badge 
                variant={dashboardTestMode ? "default" : "outline"} 
                className={dashboardTestMode ? "bg-green-500/20 text-green-400 border-green-500/50" : "border-slate-600 text-slate-400"}
              >
                {dashboardTestMode ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Ativo
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Inativo
                  </>
                )}
              </Badge>
            </div>
            <CardTitle className="text-xl text-blue-400">
              Dashboard do Jogador (Teste)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Acesso rápido para visualização do painel do jogador
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Info */}
            <div className="bg-black/60 border border-blue-500/20 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2 text-sm text-slate-300">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-300 mb-1">O que você pode ver:</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Informações da conta</li>
                    <li>• Status de personagens</li>
                    <li>• Sistema de distribuição de pontos</li>
                    <li>• Sistema de reset</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Restrições */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <Lock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-300 mb-1">Restrições:</p>
                  <ul className="text-xs text-amber-200/70 space-y-1">
                    <li>• Sem permissão para alterar dados</li>
                    <li>• Botões de salvar desabilitados</li>
                    <li>• Modo somente leitura</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Credenciais de Teste */}
            <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-4 h-4 text-slate-400" />
                <p className="text-xs font-semibold text-slate-300">Credenciais de Teste:</p>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <p>Usuário: <code className="text-blue-400 bg-black/40 px-2 py-0.5 rounded">test</code></p>
                <p>Senha: <code className="text-blue-400 bg-black/40 px-2 py-0.5 rounded">123</code></p>
                <p className="text-amber-300 mt-2">* Aceita qualquer combinação</p>
              </div>
            </div>

            {/* Botão de Ativação */}
            <Button
              onClick={handleActivateDashboardTest}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ativar Modo de Visualização
            </Button>
          </CardContent>
        </Card>

        {/* AdminCP Test Mode */}
        <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 hover:border-amber-500/50 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-slate-900" />
              </div>
              <Badge 
                variant={adminTestMode ? "default" : "outline"} 
                className={adminTestMode ? "bg-green-500/20 text-green-400 border-green-500/50" : "border-slate-600 text-slate-400"}
              >
                {adminTestMode ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Ativo
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Inativo
                  </>
                )}
              </Badge>
            </div>
            <CardTitle className="text-xl text-amber-400">
              AdminCP (Modo Fake)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Visualização completa do painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Info */}
            <div className="bg-black/60 border border-amber-500/20 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2 text-sm text-slate-300">
                <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-300 mb-1">O que você pode ver:</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Dashboard administrativo completo</li>
                    <li>• Gestão de contas e personagens</li>
                    <li>• Sistema de doações e logs</li>
                    <li>• Configurações do servidor</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Restrições */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <Lock className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-300 mb-1">Restrições:</p>
                  <ul className="text-xs text-red-200/70 space-y-1">
                    <li>• <strong>ZERO</strong> permissões de edição</li>
                    <li>• Todos os botões de ação bloqueados</li>
                    <li>• Interface totalmente READ-ONLY</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Credenciais de Teste */}
            <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-4 h-4 text-slate-400" />
                <p className="text-xs font-semibold text-slate-300">Credenciais de Teste:</p>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <p>Usuário: <code className="text-amber-400 bg-black/40 px-2 py-0.5 rounded">admin</code></p>
                <p>Senha: <code className="text-amber-400 bg-black/40 px-2 py-0.5 rounded">admin</code></p>
                <p className="text-amber-300 mt-2">* Aceita qualquer combinação</p>
              </div>
            </div>

            {/* Botão de Ativação */}
            <Button
              onClick={handleActivateAdminTest}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ativar Modo de Visualização
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            Como Funciona
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-400">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              1
            </div>
            <p>
              Clique em <strong className="text-slate-200">"Ativar Modo de Visualização"</strong> no cartão desejado
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              2
            </div>
            <p>
              Você será redirecionado para a tela de login do modo selecionado
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              3
            </div>
            <p>
              Use as credenciais de teste fornecidas (ou qualquer outra combinação)
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
              4
            </div>
            <p>
              Explore a interface em modo <strong className="text-amber-400">READ-ONLY</strong> - todas as ações de edição estarão bloqueadas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TestModesSection;
