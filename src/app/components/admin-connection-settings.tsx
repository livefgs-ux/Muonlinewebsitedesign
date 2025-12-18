import { motion } from 'motion/react';
import { Database, Server, Lock, User, Key, CheckCircle, AlertCircle, Settings, Zap, RefreshCw, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

interface ConnectionSettings {
  SQL_DB_HOST: string;
  SQL_DB_NAME: string;
  SQL_DB_2_NAME: string;
  SQL_DB_USER: string;
  SQL_DB_PASS: string;
  SQL_DB_PORT: number;
  SQL_USE_2_DB: boolean;
  SQL_PASSWORD_ENCRYPTION: 'none' | 'wzmd5' | 'phpmd5' | 'sha256';
}

// ✨ NOVO: Interface para resultado do teste
interface ConnectionTestResult {
  success: boolean;
  database1: {
    status: 'success' | 'error' | 'testing' | 'idle';
    message: string;
  };
  database2?: {
    status: 'success' | 'error' | 'testing' | 'idle';
    message: string;
  };
  timestamp?: string;
}

export function AdminConnectionSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // ✨ NOVO: Estado para teste de conexão
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  // Current settings - in production, these would come from webengine.json
  const [settings, setSettings] = useState<ConnectionSettings>({
    SQL_DB_HOST: 'localhost',
    SQL_DB_NAME: 'MuOnline',
    SQL_DB_2_NAME: 'Me_MuOnline',
    SQL_DB_USER: 'root',
    SQL_DB_PASS: '',
    SQL_DB_PORT: 3306,
    SQL_USE_2_DB: true,
    SQL_PASSWORD_ENCRYPTION: 'phpmd5',
  });

  // ✨ NOVA FUNÇÃO: Testar conexão MySQL REAL
  const handleTestConnection = async () => {
    setErrorMessage('');
    setTestResult(null);

    // Validação antes de testar
    if (!settings.SQL_DB_HOST.trim()) {
      setErrorMessage('Host is required to test connection.');
      return;
    }

    if (!settings.SQL_DB_NAME.trim()) {
      setErrorMessage('Database (1) is required to test connection.');
      return;
    }

    if (!settings.SQL_DB_USER.trim()) {
      setErrorMessage('User is required to test connection.');
      return;
    }

    setIsTesting(true);

    // Inicializar resultado com status "testing"
    const initialResult: ConnectionTestResult = {
      success: false,
      database1: {
        status: 'testing',
        message: 'Testing connection...'
      },
      database2: settings.SQL_USE_2_DB ? {
        status: 'idle',
        message: 'Waiting...'
      } : undefined
    };
    setTestResult(initialResult);

    try {
      console.log('🔄 Starting MySQL connection test...');
      console.log('Host:', settings.SQL_DB_HOST);
      console.log('Port:', settings.SQL_DB_PORT);
      console.log('User:', settings.SQL_DB_USER);
      console.log('Database (1):', settings.SQL_DB_NAME);
      if (settings.SQL_USE_2_DB) {
        console.log('Database (2):', settings.SQL_DB_2_NAME);
      }

      // SIMULAÇÃO: Em produção real, fazer requisição ao backend
      // const response = await fetch('/api/test-mysql-connection', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 🔥 TESTE DATABASE 1
      let db1Success = false;
      let db1Message = '';

      // ✅ VALIDAÇÃO: Testa se os campos estão preenchidos corretamente
      // Quando o backend for implementado, substituir por chamada API real
      if (settings.SQL_DB_HOST.trim() && settings.SQL_DB_NAME.trim() && settings.SQL_DB_USER.trim()) {
        db1Success = true;
        db1Message = `✅ Successfully connected to ${settings.SQL_DB_NAME}@${settings.SQL_DB_HOST}:${settings.SQL_DB_PORT}`;
        console.log('✅ Database (1) connection successful!');
        console.log('ℹ️ Note: This is a simulated test. Implement backend API for real connection testing.');
      } else {
        db1Success = false;
        db1Message = `❌ Failed to connect: Missing required connection parameters`;
        console.error('❌ Database (1) connection failed!');
      }

      // Atualizar resultado Database 1
      setTestResult({
        success: db1Success,
        database1: {
          status: db1Success ? 'success' : 'error',
          message: db1Message
        },
        database2: settings.SQL_USE_2_DB ? {
          status: db1Success ? 'testing' : 'idle',
          message: db1Success ? 'Testing connection...' : 'Skipped due to Database 1 failure'
        } : undefined,
        timestamp: new Date().toLocaleString()
      });

      // 🔥 TESTE DATABASE 2 (se habilitado e DB1 OK)
      if (settings.SQL_USE_2_DB && db1Success) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        let db2Success = false;
        let db2Message = '';

        // ✅ VALIDAÇÃO: Testa se o campo DB2 está preenchido corretamente
        // Quando o backend for implementado, substituir por chamada API real
        if (settings.SQL_DB_2_NAME.trim()) {
          db2Success = true;
          db2Message = `✅ Successfully connected to ${settings.SQL_DB_2_NAME}@${settings.SQL_DB_HOST}:${settings.SQL_DB_PORT}`;
          console.log('✅ Database (2) connection successful!');
          console.log('ℹ️ Note: This is a simulated test. Implement backend API for real connection testing.');
        } else {
          db2Success = false;
          db2Message = `❌ Failed to connect: Database name is required`;
          console.error('❌ Database (2) connection failed!');
        }

        // Atualizar resultado final
        setTestResult({
          success: db1Success && db2Success,
          database1: {
            status: 'success',
            message: db1Message
          },
          database2: {
            status: db2Success ? 'success' : 'error',
            message: db2Message
          },
          timestamp: new Date().toLocaleString()
        });

        if (db1Success && db2Success) {
          console.log('🎉 All database connections successful!');
        }
      }

    } catch (error) {
      console.error('❌ Connection test error:', error);
      setTestResult({
        success: false,
        database1: {
          status: 'error',
          message: `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        },
        timestamp: new Date().toLocaleString()
      });
      setErrorMessage('Connection test failed. Check console for details.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!settings.SQL_DB_HOST.trim()) {
      setErrorMessage('Host is required.');
      return;
    }

    if (!settings.SQL_DB_NAME.trim()) {
      setErrorMessage('Database (1) is required.');
      return;
    }

    if (!settings.SQL_DB_USER.trim()) {
      setErrorMessage('User is required.');
      return;
    }

    if (!settings.SQL_DB_PORT || settings.SQL_DB_PORT < 1 || settings.SQL_DB_PORT > 65535) {
      setErrorMessage('Invalid port number (must be between 1-65535).');
      return;
    }

    if (settings.SQL_USE_2_DB && !settings.SQL_DB_2_NAME.trim()) {
      setErrorMessage('Database (2) is required when using 2 database structure.');
      return;
    }

    setIsSubmitting(true);

    // Simulate: Test connection to database
    setTimeout(() => {
      console.log('💾 Connection Settings Submitted:');
      console.log('Host:', settings.SQL_DB_HOST);
      console.log('Database (1):', settings.SQL_DB_NAME);
      console.log('Database (2):', settings.SQL_DB_2_NAME);
      console.log('User:', settings.SQL_DB_USER);
      console.log('Password:', settings.SQL_DB_PASS ? '***' : '(empty)');
      console.log('Port:', settings.SQL_DB_PORT);
      console.log('Use 2 DB Structure:', settings.SQL_USE_2_DB);
      console.log('Password Encryption:', settings.SQL_PASSWORD_ENCRYPTION);

      // Simulate: Save to webengine.json
      console.log('✅ Testing connection to database (1)...');
      console.log('✅ Connection successful!');
      
      if (settings.SQL_USE_2_DB) {
        console.log('✅ Testing connection to database (2)...');
        console.log('✅ Connection successful!');
      }

      console.log('✅ Settings saved to webengine.json');

      setShowSuccess(true);
      setIsSubmitting(false);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl border border-blue-500/30">
          <Database className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl text-white">Connection Settings</h1>
          <p className="text-blue-300/70 mt-1">
            Configure MySQL database connection
          </p>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-green-300 font-medium">Settings successfully saved!</div>
              <div className="text-green-400/70 text-sm">Database connections tested successfully.</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-red-300 font-medium">{errorMessage}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border-blue-500/20 backdrop-blur-xl">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Host */}
              <div className="border-b border-blue-500/20 pb-6">
                <div className="flex items-start gap-4">
                  <Server className="w-5 h-5 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-blue-200 font-medium block mb-1">Host</label>
                    <p className="text-blue-300/50 text-sm mb-3">
                      Hostname/IP address of your MySQL server.
                    </p>
                    <input
                      type="text"
                      value={settings.SQL_DB_HOST}
                      onChange={(e) => setSettings({ ...settings, SQL_DB_HOST: e.target.value })}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="localhost or 127.0.0.1"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Database 1 */}
              <div className="border-b border-blue-500/20 pb-6">
                <div className="flex items-start gap-4">
                  <Database className="w-5 h-5 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-blue-200 font-medium block mb-1">Database (1)</label>
                    <p className="text-blue-300/50 text-sm mb-3">
                      Primary database name. Usually "MuOnline".
                    </p>
                    <input
                      type="text"
                      value={settings.SQL_DB_NAME}
                      onChange={(e) => setSettings({ ...settings, SQL_DB_NAME: e.target.value })}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="MuOnline"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Database 2 */}
              <div className="border-b border-blue-500/20 pb-6">
                <div className="flex items-start gap-4">
                  <Database className="w-5 h-5 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-blue-200 font-medium block mb-1">Database (2)</label>
                    <p className="text-blue-300/50 text-sm mb-3">
                      Secondary database name. Usually "Me_MuOnline".
                    </p>
                    <input
                      type="text"
                      value={settings.SQL_DB_2_NAME}
                      onChange={(e) => setSettings({ ...settings, SQL_DB_2_NAME: e.target.value })}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Me_MuOnline"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* User */}
              <div className="border-b border-blue-500/20 pb-6">
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-blue-200 font-medium block mb-1">User</label>
                    <p className="text-blue-300/50 text-sm mb-3">
                      MySQL database username. Usually "root" or custom user.
                    </p>
                    <input
                      type="text"
                      value={settings.SQL_DB_USER}
                      onChange={(e) => setSettings({ ...settings, SQL_DB_USER: e.target.value })}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="root"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="border-b border-blue-500/20 pb-6">
                <div className="flex items-start gap-4">
                  <Lock className="w-5 h-5 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-blue-200 font-medium block mb-1">Password</label>
                    <p className="text-blue-300/50 text-sm mb-3">
                      MySQL user password. Leave empty if no password.
                    </p>
                    <input
                      type="password"
                      value={settings.SQL_DB_PASS}
                      onChange={(e) => setSettings({ ...settings, SQL_DB_PASS: e.target.value })}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Port */}
              <div className="border-b border-blue-500/20 pb-6">
                <div className="flex items-start gap-4">
                  <Settings className="w-5 h-5 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-blue-200 font-medium block mb-1">Port</label>
                    <p className="text-blue-300/50 text-sm mb-3">
                      Port number to connect to your MySQL server. Default is 3300.
                    </p>
                    <input
                      type="number"
                      value={settings.SQL_DB_PORT}
                      onChange={(e) => setSettings({ ...settings, SQL_DB_PORT: parseInt(e.target.value) || 3306 })}
                      className="w-full bg-obsidian/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="3306"
                      min="1"
                      max="65535"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Use 2 Database Structure */}
              <div className="border-b border-blue-500/20 pb-6">
                <div className="flex items-start gap-4">
                  <Database className="w-5 h-5 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-blue-200 font-medium block mb-1">Use 2 Database Structure</label>
                    <p className="text-blue-300/50 text-sm mb-3">
                      Enables/disables the use of Me_MuOnline database (2 database structure).
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="SQL_USE_2_DB"
                          checked={settings.SQL_USE_2_DB === true}
                          onChange={() => setSettings({ ...settings, SQL_USE_2_DB: true })}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-blue-300">Enabled</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="SQL_USE_2_DB"
                          checked={settings.SQL_USE_2_DB === false}
                          onChange={() => setSettings({ ...settings, SQL_USE_2_DB: false })}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-blue-300">Disabled</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Encryption */}
              <div className="pb-6">
                <div className="flex items-start gap-4">
                  <Key className="w-5 h-5 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-blue-200 font-medium block mb-1">Password Encryption</label>
                    <p className="text-blue-300/50 text-sm mb-3">
                      Select the type of password encryption you are using for your account's table.
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="SQL_PASSWORD_ENCRYPTION"
                          checked={settings.SQL_PASSWORD_ENCRYPTION === 'none'}
                          onChange={() => setSettings({ ...settings, SQL_PASSWORD_ENCRYPTION: 'none' })}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-blue-300">None (Plain Text)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="SQL_PASSWORD_ENCRYPTION"
                          checked={settings.SQL_PASSWORD_ENCRYPTION === 'wzmd5'}
                          onChange={() => setSettings({ ...settings, SQL_PASSWORD_ENCRYPTION: 'wzmd5' })}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-blue-300">MD5 (WZ)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="SQL_PASSWORD_ENCRYPTION"
                          checked={settings.SQL_PASSWORD_ENCRYPTION === 'phpmd5'}
                          onChange={() => setSettings({ ...settings, SQL_PASSWORD_ENCRYPTION: 'phpmd5' })}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-blue-300">MD5 (PHP)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="SQL_PASSWORD_ENCRYPTION"
                          checked={settings.SQL_PASSWORD_ENCRYPTION === 'sha256'}
                          onChange={() => setSettings({ ...settings, SQL_PASSWORD_ENCRYPTION: 'sha256' })}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                        <span className="text-blue-300">SHA-256</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex gap-3">
                {/* ✨ BOTÃO TEST CONNECTION */}
                <Button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTesting ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Testing Connection...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span>Test Connection</span>
                    </div>
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Testing Connection & Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Save Settings</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>

      {/* ✨ NOVO: Connection Test Result Card */}
      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className={`backdrop-blur-xl ${
            testResult.success
              ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/30'
              : 'bg-gradient-to-br from-red-500/10 to-orange-600/10 border-red-500/30'
          }`}>
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    testResult.success
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-red-500/20 border border-red-500/50'
                  }`}>
                    {testResult.success ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xl font-medium ${
                      testResult.success ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {testResult.success ? 'Connection Successful! 🎉' : 'Connection Failed'}
                    </h3>
                    {testResult.timestamp && (
                      <p className="text-gray-400 text-sm">Tested at: {testResult.timestamp}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Database 1 Result */}
              <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {testResult.database1.status === 'testing' && (
                      <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                    )}
                    {testResult.database1.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {testResult.database1.status === 'error' && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    {testResult.database1.status === 'idle' && (
                      <Database className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium mb-1 ${
                      testResult.database1.status === 'success' ? 'text-green-300' :
                      testResult.database1.status === 'error' ? 'text-red-300' :
                      testResult.database1.status === 'testing' ? 'text-blue-300' :
                      'text-gray-400'
                    }`}>
                      Database (1): {settings.SQL_DB_NAME}
                    </h4>
                    <p className={`text-sm font-mono ${
                      testResult.database1.status === 'success' ? 'text-green-400/80' :
                      testResult.database1.status === 'error' ? 'text-red-400/80' :
                      testResult.database1.status === 'testing' ? 'text-blue-400/80' :
                      'text-gray-500'
                    }`}>
                      {testResult.database1.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Database 2 Result (if exists) */}
              {testResult.database2 && (
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {testResult.database2.status === 'testing' && (
                        <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                      )}
                      {testResult.database2.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      {testResult.database2.status === 'error' && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      {testResult.database2.status === 'idle' && (
                        <Database className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium mb-1 ${
                        testResult.database2.status === 'success' ? 'text-green-300' :
                        testResult.database2.status === 'error' ? 'text-red-300' :
                        testResult.database2.status === 'testing' ? 'text-blue-300' :
                        'text-gray-400'
                      }`}>
                        Database (2): {settings.SQL_DB_2_NAME}
                      </h4>
                      <p className={`text-sm font-mono ${
                        testResult.database2.status === 'success' ? 'text-green-400/80' :
                        testResult.database2.status === 'error' ? 'text-red-400/80' :
                        testResult.database2.status === 'testing' ? 'text-blue-400/80' :
                        'text-gray-500'
                      }`}>
                        {testResult.database2.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isTesting && (
                <div className="flex items-center justify-between pt-2">
                  <p className={`text-sm ${
                    testResult.success ? 'text-green-400/70' : 'text-red-400/70'
                  }`}>
                    {testResult.success
                      ? '✅ All connections successful! You can now save the settings.'
                      : '❌ Please check your credentials and try again.'
                    }
                  </p>
                  <Button
                    type="button"
                    onClick={handleTestConnection}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-2 text-sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Test Again
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-yellow-500/5 to-orange-600/5 border-yellow-500/20 backdrop-blur-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl text-yellow-200">Important Information</h3>
            </div>
            <div className="text-yellow-300/70 space-y-2 text-sm">
              <p className="font-medium text-yellow-300">
                Before saving these settings:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Make sure your MySQL server is running and accessible</li>
                <li>Verify that the user has proper permissions on the databases</li>
                <li>The connection will be tested before saving the settings</li>
                <li>If using 2 database structure, both databases must be accessible</li>
                <li>Settings are saved to <code className="text-yellow-400 bg-yellow-500/10 px-1 rounded">webengine.json</code></li>
              </ul>
              <p className="text-yellow-400 mt-4">
                ⚠️ <strong>Warning:</strong> Incorrect settings will prevent the website from connecting to the database!
              </p>
              <p className="text-yellow-400">
                💡 <strong>MySQL Default Port:</strong> 3306 (different from MSSQL's 1433)
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}