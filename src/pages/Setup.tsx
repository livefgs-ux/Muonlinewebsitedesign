/**
 * 🧙‍♂️ Setup Wizard - MeuMU Online
 * 
 * Instalador GUI que detecta ambiente, verifica dependências
 * e configura automaticamente todo o sistema
 */

import { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Loader2, RefreshCw, Terminal, Database, Server, Globe, Wrench } from 'lucide-react';

// Tipos
interface SystemCheck {
  id: string;
  name: string;
  status: 'pending' | 'checking' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
  fixable?: boolean;
  autoFix?: boolean;
}

interface EnvironmentInfo {
  type: 'cyberpanel' | 'xampp' | 'vps' | 'docker' | 'unknown';
  webServer: 'litespeed' | 'apache' | 'nginx' | 'unknown';
  os: string;
  phpVersion: string;
  nodeVersion: string;
  paths: {
    webRoot: string;
    backend: string;
    database: string;
  };
}

interface SetupStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  status: 'pending' | 'current' | 'completed' | 'error';
}

export default function Setup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [environment, setEnvironment] = useState<EnvironmentInfo | null>(null);
  const [checks, setChecks] = useState<SystemCheck[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [autoFixing, setAutoFixing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const steps: SetupStep[] = [
    {
      id: 0,
      title: 'Detecção de Ambiente',
      description: 'Identificando servidor e configurações',
      icon: Server,
      status: currentStep === 0 ? 'current' : currentStep > 0 ? 'completed' : 'pending',
    },
    {
      id: 1,
      title: 'Verificação de Dependências',
      description: 'Node.js, PHP, MariaDB, PM2',
      icon: Database,
      status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending',
    },
    {
      id: 2,
      title: 'Configuração de Database',
      description: 'Conexão e estrutura do banco',
      icon: Database,
      status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending',
    },
    {
      id: 3,
      title: 'Configuração de API',
      description: 'Proxy reverso e backend',
      icon: Globe,
      status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending',
    },
    {
      id: 4,
      title: 'Testes Finais',
      description: 'Validando instalação',
      icon: Check,
      status: currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'pending',
    },
  ];

  // Adicionar log
  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    setLogs(prev => [...prev, `[${timestamp}] ${emoji} ${message}`]);
  };

  // Detectar ambiente
  const detectEnvironment = async () => {
    setIsScanning(true);
    addLog('Iniciando detecção de ambiente...', 'info');

    try {
      const response = await fetch('/setup-api/detect-environment', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setEnvironment(data.environment);
        addLog(`Ambiente detectado: ${data.environment.type.toUpperCase()}`, 'success');
        addLog(`Servidor Web: ${data.environment.webServer}`, 'info');
        addLog(`PHP: ${data.environment.phpVersion}`, 'info');
        addLog(`Node.js: ${data.environment.nodeVersion}`, 'info');
      } else {
        addLog('Erro ao detectar ambiente', 'error');
      }
    } catch (error) {
      addLog('Erro de conexão com API de setup', 'error');
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  // Verificar dependências
  const checkDependencies = async () => {
    setIsScanning(true);
    addLog('Verificando dependências...', 'info');

    try {
      const response = await fetch('/setup-api/check-dependencies', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setChecks(data.checks);
        
        const errors = data.checks.filter((c: SystemCheck) => c.status === 'error').length;
        const warnings = data.checks.filter((c: SystemCheck) => c.status === 'warning').length;
        
        if (errors === 0 && warnings === 0) {
          addLog('Todas as dependências OK!', 'success');
        } else {
          addLog(`${errors} erros e ${warnings} avisos encontrados`, 'warning');
        }
      }
    } catch (error) {
      addLog('Erro ao verificar dependências', 'error');
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  // Auto-fix
  const autoFix = async () => {
    setAutoFixing(true);
    addLog('Iniciando correções automáticas...', 'info');

    const fixableChecks = checks.filter(c => c.fixable && c.status !== 'success');

    for (const check of fixableChecks) {
      addLog(`Corrigindo: ${check.name}...`, 'info');

      try {
        const response = await fetch('/setup-api/auto-fix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkId: check.id }),
        });

        const data = await response.json();

        if (data.success) {
          addLog(`✅ ${check.name} corrigido`, 'success');
          
          // Atualizar status do check
          setChecks(prev => prev.map(c => 
            c.id === check.id ? { ...c, status: 'success', message: 'Corrigido automaticamente' } : c
          ));
        } else {
          addLog(`❌ Falha ao corrigir ${check.name}: ${data.error}`, 'error');
        }
      } catch (error) {
        addLog(`❌ Erro ao corrigir ${check.name}`, 'error');
      }
    }

    setAutoFixing(false);
    addLog('Correções automáticas concluídas', 'success');
  };

  // Configurar database
  const configureDatabaseStep = async (config: any) => {
    addLog('Configurando database...', 'info');

    try {
      const response = await fetch('/setup-api/configure-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.success) {
        addLog('Database configurado com sucesso!', 'success');
        setCurrentStep(3);
      } else {
        addLog(`Erro: ${data.error}`, 'error');
      }
    } catch (error) {
      addLog('Erro ao configurar database', 'error');
    }
  };

  // Configurar API/Proxy
  const configureAPIStep = async () => {
    addLog('Configurando API e Proxy...', 'info');

    try {
      const response = await fetch('/setup-api/configure-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment }),
      });

      const data = await response.json();

      if (data.success) {
        addLog('API e Proxy configurados!', 'success');
        setCurrentStep(4);
      } else {
        addLog(`Erro: ${data.error}`, 'error');
      }
    } catch (error) {
      addLog('Erro ao configurar API', 'error');
    }
  };

  // Testes finais
  const runFinalTests = async () => {
    addLog('Executando testes finais...', 'info');

    const tests = [
      { name: 'Conexão com Database', endpoint: '/setup-api/test-database' },
      { name: 'Backend Node.js', endpoint: '/setup-api/test-backend' },
      { name: 'Proxy API', endpoint: '/setup-api/test-proxy' },
      { name: 'Frontend Assets', endpoint: '/setup-api/test-frontend' },
    ];

    for (const test of tests) {
      addLog(`Testando: ${test.name}...`, 'info');

      try {
        const response = await fetch(test.endpoint, { method: 'POST' });
        const data = await response.json();

        if (data.success) {
          addLog(`✅ ${test.name} OK`, 'success');
        } else {
          addLog(`❌ ${test.name} FALHOU`, 'error');
        }
      } catch (error) {
        addLog(`❌ ${test.name} erro de conexão`, 'error');
      }
    }

    addLog('🎉 Instalação concluída!', 'success');
  };

  // Effect: Detectar ambiente ao montar
  useEffect(() => {
    detectEnvironment();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFB800] to-[#FFA000] bg-clip-text text-transparent">
                🧙‍♂️ Setup Wizard
              </h1>
              <p className="text-white/60 mt-1">
                Instalador Automático - MeuMU Online
              </p>
            </div>
            
            {environment && (
              <div className="px-4 py-2 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/20">
                <div className="text-sm text-white/60">Ambiente Detectado</div>
                <div className="text-[#FFB800] font-bold uppercase">{environment.type}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Etapas da Instalação</h2>
              
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  
                  return (
                    <div
                      key={step.id}
                      className={`
                        flex items-start gap-4 p-4 rounded-xl transition-all
                        ${step.status === 'current' ? 'bg-[#FFB800]/20 border-2 border-[#FFB800]' : ''}
                        ${step.status === 'completed' ? 'bg-green-500/10 border border-green-500/30' : ''}
                        ${step.status === 'pending' ? 'bg-white/5 border border-white/10' : ''}
                      `}
                    >
                      <div className={`
                        p-2 rounded-lg
                        ${step.status === 'current' ? 'bg-[#FFB800] text-black' : ''}
                        ${step.status === 'completed' ? 'bg-green-500 text-white' : ''}
                        ${step.status === 'pending' ? 'bg-white/10 text-white/40' : ''}
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-semibold">{step.title}</div>
                        <div className="text-sm text-white/60 mt-1">{step.description}</div>
                      </div>
                      
                      {step.status === 'completed' && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Step Content */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              {currentStep === 0 && (
                <StepEnvironment
                  environment={environment}
                  isScanning={isScanning}
                  onNext={() => setCurrentStep(1)}
                  onRescan={detectEnvironment}
                />
              )}

              {currentStep === 1 && (
                <StepDependencies
                  checks={checks}
                  isScanning={isScanning}
                  autoFixing={autoFixing}
                  onCheck={checkDependencies}
                  onAutoFix={autoFix}
                  onNext={() => setCurrentStep(2)}
                  onBack={() => setCurrentStep(0)}
                />
              )}

              {currentStep === 2 && (
                <StepDatabase
                  environment={environment}
                  onConfigure={configureDatabaseStep}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <StepAPI
                  environment={environment}
                  onConfigure={configureAPIStep}
                  onBack={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 4 && (
                <StepFinalTests
                  onTest={runFinalTests}
                  onBack={() => setCurrentStep(3)}
                />
              )}
            </div>

            {/* Live Logs */}
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#FFB800]" />
                  <h3 className="font-bold">Console de Logs</h3>
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="text-sm text-white/60 hover:text-white transition"
                >
                  Limpar
                </button>
              </div>

              <div className="bg-black/80 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-white/40">Aguardando ações...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-white/80 mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTES DE CADA STEP
// ============================================

function StepEnvironment({ environment, isScanning, onNext, onRescan }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🔍 Detecção de Ambiente</h2>
      <p className="text-white/60 mb-8">
        Identificando automaticamente seu servidor e configurações
      </p>

      {isScanning ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#FFB800] animate-spin" />
          <span className="ml-3">Detectando ambiente...</span>
        </div>
      ) : environment ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Tipo de Servidor" value={environment.type.toUpperCase()} />
            <InfoCard label="Servidor Web" value={environment.webServer} />
            <InfoCard label="Sistema Operacional" value={environment.os} />
            <InfoCard label="Versão PHP" value={environment.phpVersion} />
            <InfoCard label="Versão Node.js" value={environment.nodeVersion} />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Server className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-400">Caminhos Detectados</div>
                <div className="text-sm text-white/60 mt-2 space-y-1">
                  <div>Web Root: <code className="text-[#FFB800]">{environment.paths.webRoot}</code></div>
                  <div>Backend: <code className="text-[#FFB800]">{environment.paths.backend}</code></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onRescan}
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reescanear
            </button>
            <button
              onClick={onNext}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#FFB800] to-[#FFA000] hover:from-[#FFA000] hover:to-[#FF8C00] transition font-semibold text-black"
            >
              Próximo: Verificar Dependências →
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">Falha ao detectar ambiente</p>
          <button
            onClick={onRescan}
            className="mt-4 px-6 py-3 rounded-lg bg-[#FFB800] hover:bg-[#FFA000] transition font-semibold text-black"
          >
            Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
}

function StepDependencies({ checks, isScanning, autoFixing, onCheck, onAutoFix, onNext, onBack }: any) {
  const errors = checks.filter((c: SystemCheck) => c.status === 'error').length;
  const warnings = checks.filter((c: SystemCheck) => c.status === 'warning').length;
  const fixable = checks.filter((c: SystemCheck) => c.fixable && c.status !== 'success').length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">✅ Verificação de Dependências</h2>
      <p className="text-white/60 mb-8">
        Verificando se todos os componentes necessários estão instalados
      </p>

      {checks.length === 0 ? (
        <button
          onClick={onCheck}
          disabled={isScanning}
          className="w-full px-6 py-4 rounded-lg bg-[#FFB800] hover:bg-[#FFA000] transition font-semibold text-black disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          {isScanning ? 'Verificando...' : 'Iniciar Verificação'}
        </button>
      ) : (
        <div className="space-y-4">
          {checks.map((check: SystemCheck) => (
            <CheckItem key={check.id} check={check} />
          ))}

          {(errors > 0 || warnings > 0) && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-yellow-400">Ação Necessária</div>
                  <div className="text-sm text-white/60 mt-1">
                    {errors} erro(s) e {warnings} aviso(s) encontrados.
                    {fixable > 0 && ` ${fixable} podem ser corrigidos automaticamente.`}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              ← Voltar
            </button>

            {fixable > 0 && (
              <button
                onClick={onAutoFix}
                disabled={autoFixing}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {autoFixing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                {autoFixing ? 'Corrigindo...' : `Corrigir Automaticamente (${fixable})`}
              </button>
            )}

            <button
              onClick={onNext}
              disabled={errors > 0}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#FFB800] to-[#FFA000] hover:from-[#FFA000] hover:to-[#FF8C00] transition font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo: Configurar Database →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepDatabase({ environment, onConfigure, onBack }: any) {
  const [config, setConfig] = useState({
    host: 'localhost',
    port: '3306',
    database: 'MuOnline',
    username: 'root',
    password: '',
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/setup-api/test-database-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ success: false, error: 'Erro de conexão' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🗄️ Configuração de Database</h2>
      <p className="text-white/60 mb-8">
        Configure a conexão com o banco de dados MariaDB/MySQL do MU Online
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Host</label>
            <input
              type="text"
              value={config.host}
              onChange={(e) => setConfig({ ...config, host: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#FFB800] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Porta</label>
            <input
              type="text"
              value={config.port}
              onChange={(e) => setConfig({ ...config, port: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#FFB800] outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nome do Database</label>
          <input
            type="text"
            value={config.database}
            onChange={(e) => setConfig({ ...config, database: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#FFB800] outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Usuário</label>
          <input
            type="text"
            value={config.username}
            onChange={(e) => setConfig({ ...config, username: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#FFB800] outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Senha</label>
          <input
            type="password"
            value={config.password}
            onChange={(e) => setConfig({ ...config, password: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#FFB800] outline-none transition"
          />
        </div>

        <button
          onClick={testConnection}
          disabled={testing}
          className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {testing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
          {testing ? 'Testando Conexão...' : 'Testar Conexão'}
        </button>

        {testResult && (
          <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <div className="flex items-start gap-3">
              {testResult.success ? <Check className="w-5 h-5 text-green-400" /> : <X className="w-5 h-5 text-red-400" />}
              <div>
                <div className={`font-semibold ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {testResult.success ? 'Conexão Bem-Sucedida!' : 'Falha na Conexão'}
                </div>
                {testResult.message && (
                  <div className="text-sm text-white/60 mt-1">{testResult.message}</div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            ← Voltar
          </button>
          <button
            onClick={() => onConfigure(config)}
            disabled={!testResult?.success}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#FFB800] to-[#FFA000] hover:from-[#FFA000] hover:to-[#FF8C00] transition font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo: Configurar API →
          </button>
        </div>
      </div>
    </div>
  );
}

function StepAPI({ environment, onConfigure, onBack }: any) {
  const [configuring, setConfiguring] = useState(false);

  const handleConfigure = async () => {
    setConfiguring(true);
    await onConfigure();
    setConfiguring(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🌐 Configuração de API</h2>
      <p className="text-white/60 mb-8">
        Configurando proxy reverso e backend automaticamente
      </p>

      <div className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="font-semibold text-blue-400 mb-2">O que será configurado:</div>
          <ul className="text-sm text-white/60 space-y-2">
            <li>✅ Criar pasta <code className="text-[#FFB800]">/api</code> com proxy PHP</li>
            <li>✅ Configurar <code className="text-[#FFB800]">.htaccess</code> para rewrite</li>
            <li>✅ Configurar CORS no backend Node.js</li>
            <li>✅ Testar conectividade da API</li>
            <li>✅ Iniciar backend com PM2</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            ← Voltar
          </button>
          <button
            onClick={handleConfigure}
            disabled={configuring}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#FFB800] to-[#FFA000] hover:from-[#FFA000] hover:to-[#FF8C00] transition font-semibold text-black disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {configuring ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
            {configuring ? 'Configurando...' : 'Configurar Automaticamente'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepFinalTests({ onTest, onBack }: any) {
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    await onTest();
    setTesting(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🧪 Testes Finais</h2>
      <p className="text-white/60 mb-8">
        Validando toda a instalação
      </p>

      <div className="space-y-6">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="font-semibold text-green-400 mb-2">Testes a serem executados:</div>
          <ul className="text-sm text-white/60 space-y-2">
            <li>🔍 Conexão com Database MariaDB</li>
            <li>🔍 Backend Node.js respondendo</li>
            <li>🔍 Proxy API funcionando</li>
            <li>🔍 Frontend assets carregando</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            ← Voltar
          </button>
          <button
            onClick={handleTest}
            disabled={testing}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {testing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            {testing ? 'Testando...' : 'Executar Testes Finais'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="text-sm text-white/60 mb-1">{label}</div>
      <div className="font-semibold text-[#FFB800]">{value}</div>
    </div>
  );
}

function CheckItem({ check }: { check: SystemCheck }) {
  const icons = {
    pending: <Loader2 className="w-5 h-5 text-white/40 animate-spin" />,
    checking: <Loader2 className="w-5 h-5 text-[#FFB800] animate-spin" />,
    success: <Check className="w-5 h-5 text-green-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    error: <X className="w-5 h-5 text-red-400" />,
  };

  const colors = {
    pending: 'bg-white/5 border-white/10',
    checking: 'bg-[#FFB800]/10 border-[#FFB800]/30',
    success: 'bg-green-500/10 border-green-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    error: 'bg-red-500/10 border-red-500/30',
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[check.status]}`}>
      <div className="flex items-start gap-3">
        {icons[check.status]}
        <div className="flex-1">
          <div className="font-semibold">{check.name}</div>
          <div className="text-sm text-white/60 mt-1">{check.message}</div>
          {check.details && (
            <div className="text-xs text-white/40 mt-2 font-mono">{check.details}</div>
          )}
        </div>
        {check.fixable && check.status !== 'success' && (
          <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
            Corrigível
          </div>
        )}
      </div>
    </div>
  );
}
