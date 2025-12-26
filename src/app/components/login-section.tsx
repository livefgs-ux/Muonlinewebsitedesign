import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Lock, Mail, User, Shield, Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginSectionProps {
  onLoginSuccess?: () => void;
}

export function LoginSection({ onLoginSuccess }: LoginSectionProps) {
  const { login, register, forgotPassword } = useAuth();
  const { t } = useLanguage();
  
  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Register state
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ PROTEÇÃO: Prevenir múltiplas chamadas simultâneas
    if (loginLoading) {
      console.log('⚠️ Login já está em andamento, ignorando duplo clique');
      return;
    }
    
    setLoginError('');
    setLoginSuccess('');
    setLoginLoading(true);

    try {
      const result = await login(loginUsername, loginPassword);
      
      if (result.success) {
        setLoginSuccess(result.message);
        
        // ⏰ ESPERAR 500ms para garantir que o contexto atualizou
        // (tempo suficiente para mostrar mensagem de sucesso + atualizar contexto)
        setTimeout(() => {
          console.log('✅ Redirecionando para dashboard...');
          onLoginSuccess?.();
        }, 500);
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setLoginError('Erro inesperado ao fazer login');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ PROTEÇÃO: Prevenir múltiplas chamadas simultâneas
    if (registerLoading) {
      console.log('⚠️ Registro já está em andamento, ignorando duplo clique');
      return;
    }
    
    setRegisterError('');
    setRegisterSuccess('');

    // Validações
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError(t('auth.passwordMismatch') || 'As senhas não coincidem');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError(t('auth.passwordTooShort') || 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (registerUsername.length < 4) {
      setRegisterError(t('auth.usernameTooShort') || 'O nome de usuário deve ter pelo menos 4 caracteres');
      return;
    }

    setRegisterLoading(true);

    try {
      const result = await register(registerUsername, registerEmail, registerPassword);
      
      if (result.success) {
        setRegisterSuccess(result.message);
        // Limpar campos
        setRegisterUsername('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
      } else {
        setRegisterError(result.message);
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      setRegisterError('Erro inesperado ao criar conta');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ PROTEÇÃO: Prevenir múltiplas chamadas simultâneas
    if (forgotLoading) {
      console.log('⚠️ Recuperação de senha já está em andamento, ignorando duplo clique');
      return;
    }
    
    setForgotError('');
    setForgotSuccess('');

    setForgotLoading(true);

    try {
      const result = await forgotPassword(forgotEmail);
      
      if (result.success) {
        setForgotSuccess(result.message);
        // Limpar campos
        setForgotEmail('');
      } else {
        setForgotError(result.message);
      }
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      setForgotError('Erro inesperado ao recuperar senha');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-amber-500/20 shadow-2xl shadow-amber-500/10">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-amber-500/20 to-blue-500/20 border border-amber-500/30">
                  <Shield className="size-8 text-amber-400" />
                </div>
              </div>
              <CardTitle className="text-3xl bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                {showForgotPassword ? (t('auth.forgotPassword') || 'Recuperar Senha') : (t('auth.welcome') || 'Bem-vindo')}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {showForgotPassword 
                  ? (t('auth.forgotPasswordMessage') || 'Digite seu email para recuperar a senha')
                  : (t('auth.welcomeMessage') || 'Entre para acessar sua conta')
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {showForgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="text-slate-200 flex items-center gap-2">
                      <Mail className="size-4" />
                      {t('auth.email')}
                    </Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder={t('auth.emailPlaceholder') || 'seu.email@exemplo.com'}
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500"
                    />
                  </div>

                  {forgotError && (
                    <Alert variant="destructive" className="bg-red-950/50 border-red-500/50">
                      <AlertDescription>{forgotError}</AlertDescription>
                    </Alert>
                  )}

                  {forgotSuccess && (
                    <Alert className="bg-green-950/50 border-green-500/50 text-green-400">
                      <AlertDescription className="flex items-center gap-2">
                        <Sparkles className="size-4" />
                        {forgotSuccess}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/50 transition-all duration-300"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        {t('auth.sending') || 'Enviando...'}
                      </>
                    ) : (
                      t('auth.sendResetLink') || 'Enviar Link de Recuperação'
                    )}
                  </Button>

                  <div className="text-center text-sm text-slate-400">
                    <button 
                      type="button"
                      className="hover:text-amber-400 transition-colors flex items-center gap-2 justify-center mx-auto" 
                      onClick={() => setShowForgotPassword(false)}
                    >
                      <ArrowLeft className="size-4" />
                      {t('auth.backToLogin') || 'Voltar para Login'}
                    </button>
                  </div>
                </form>
              ) : (
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-black/60 mb-4">
                    <TabsTrigger 
                      value="login" 
                      className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/50 text-gray-200 hover:text-white transition-colors"
                    >
                      {t('auth.login')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register" 
                      className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 data-[state=active]:border-amber-500/50 text-gray-200 hover:text-white transition-colors"
                    >
                      {t('auth.register')}
                    </TabsTrigger>
                  </TabsList>

                  {/* LOGIN TAB */}
                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username" className="text-slate-200 flex items-center gap-2">
                          <User className="size-4" />
                          {t('auth.username')}
                        </Label>
                        <Input
                          id="login-username"
                          type="text"
                          placeholder={t('auth.usernamePlaceholder') || 'Digite seu usuário'}
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          required
                          className="bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-slate-200 flex items-center gap-2">
                          <Lock className="size-4" />
                          {t('auth.password')}
                        </Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder={t('auth.passwordPlaceholder') || 'Digite sua senha'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500"
                        />
                      </div>

                      {loginError && (
                        <Alert variant="destructive" className="bg-red-950/50 border-red-500/50">
                          <AlertDescription>{loginError}</AlertDescription>
                        </Alert>
                      )}

                      {loginSuccess && (
                        <Alert className="bg-green-950/50 border-green-500/50 text-green-400">
                          <AlertDescription className="flex items-center gap-2">
                            <Sparkles className="size-4" />
                            {loginSuccess}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold shadow-lg shadow-amber-500/50 transition-all duration-300"
                      >
                        {loginLoading ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            {t('auth.loggingIn') || 'Entrando...'}
                          </>
                        ) : (
                          t('auth.loginButton')
                        )}
                      </Button>
                    </form>

                    <div className="text-center text-sm text-slate-400">
                      <button className="hover:text-amber-400 transition-colors" onClick={() => setShowForgotPassword(true)}>
                        {t('auth.forgotPassword')}
                      </button>
                    </div>
                  </TabsContent>

                  {/* REGISTER TAB */}
                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-username" className="text-slate-200 flex items-center gap-2">
                          <User className="size-4" />
                          {t('auth.username')}
                        </Label>
                        <Input
                          id="register-username"
                          type="text"
                          placeholder={t('auth.usernamePlaceholder') || 'Escolha um nome de usuário'}
                          value={registerUsername}
                          onChange={(e) => setRegisterUsername(e.target.value)}
                          required
                          minLength={4}
                          maxLength={10}
                          className="bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-slate-200 flex items-center gap-2">
                          <Mail className="size-4" />
                          {t('auth.email')}
                        </Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder={t('auth.emailPlaceholder') || 'seu.email@exemplo.com'}
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                          className="bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-slate-200 flex items-center gap-2">
                          <Lock className="size-4" />
                          {t('auth.password')}
                        </Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder={t('auth.passwordPlaceholder') || 'Mínimo 6 caracteres'}
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                          minLength={6}
                          className="bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-confirm" className="text-slate-200 flex items-center gap-2">
                          <Lock className="size-4" />
                          {t('auth.confirmPassword')}
                        </Label>
                        <Input
                          id="register-confirm"
                          type="password"
                          placeholder={t('auth.confirmPasswordPlaceholder') || 'Digite a senha novamente'}
                          value={registerConfirmPassword}
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          className="bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500"
                        />
                      </div>

                      {registerError && (
                        <Alert variant="destructive" className="bg-red-950/50 border-red-500/50">
                          <AlertDescription>{registerError}</AlertDescription>
                        </Alert>
                      )}

                      {registerSuccess && (
                        <Alert className="bg-green-950/50 border-green-500/50 text-green-400">
                          <AlertDescription className="flex items-center gap-2">
                            <Sparkles className="size-4" />
                            {registerSuccess}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        disabled={registerLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-blue-500/50 transition-all duration-300"
                      >
                        {registerLoading ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            {t('auth.registering') || 'Criando conta...'}
                          </>
                        ) : (
                          t('auth.registerButton')
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Exportação padrão para lazy loading
export default LoginSection;