import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Lock, Mail, User, Shield, Sparkles, ArrowLeft, Check, X } from 'lucide-react';
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

  // 🔐 V595: Validação em tempo real da senha
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // 🔐 V595: Validação em tempo real do nome de usuário
  const [usernameValid, setUsernameValid] = useState(true);
  const [usernameError, setUsernameError] = useState('');

  // 🔐 V595: Validação em tempo real do email
  const [emailValid, setEmailValid] = useState(true);
  const [emailError, setEmailError] = useState('');

  // 🔐 V600: Estado para "Esqueci minha senha"
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // 🔐 V595: Função de validação de senha em tempo real
  const validatePassword = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  // 🔐 V595: Função de validação de nome de usuário
  const validateUsername = (username: string) => {
    // Apenas letras (a-z, A-Z), números (0-9) e ponto (.)
    const validUsernameRegex = /^[a-zA-Z0-9.]*$/;
    
    if (!validUsernameRegex.test(username)) {
      setUsernameValid(false);
      setUsernameError('Apenas letras, números e ponto (.) são permitidos');
      return false;
    }
    
    setUsernameValid(true);
    setUsernameError('');
    return true;
  };

  // 🔐 V595: Função de validação de email
  const validateEmail = (email: string) => {
    // Email: apenas letras, números, ponto e @
    const validEmailRegex = /^[a-zA-Z0-9.@]*$/;
    
    if (!validEmailRegex.test(email)) {
      setEmailValid(false);
      setEmailError('Apenas letras, números, ponto e @ são permitidos');
      return false;
    }
    
    setEmailValid(true);
    setEmailError('');
    return true;
  };

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
        
        // ✅ CHAMAR IMEDIATAMENTE - useEffect no App.tsx vai esperar isLoggedIn atualizar
        console.log('✅ Login bem-sucedido! Aguardando contexto atualizar...');
        onLoginSuccess?.();
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
    
    // ========================================================================
    // VALIDAÇÕES DO FRONTEND (antes de enviar para o backend)
    // ========================================================================
    
    // 1. Verificar campos obrigatórios
    if (!registerUsername || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setRegisterError('Todos os campos são obrigatórios');
      return;
    }
    
    // 2. Validar tamanho do username (4-15 caracteres)
    if (registerUsername.length < 4) {
      setRegisterError('Username deve ter no mínimo 4 caracteres');
      return;
    }
    
    if (registerUsername.length > 15) {
      setRegisterError('Username deve ter no máximo 15 caracteres');
      return;
    }
    
    // 3. Validar caracteres do username (apenas letras e números)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(registerUsername)) {
      setRegisterError('Username deve conter apenas letras e números (sem espaços ou caracteres especiais)');
      return;
    }
    
    // 4. Validar tamanho da senha (6-20 caracteres)
    if (registerPassword.length < 6) {
      setRegisterError('Senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    if (registerPassword.length > 20) {
      setRegisterError('Senha deve ter no máximo 20 caracteres');
      return;
    }
    
    // 5. Verificar se senhas coincidem
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('As senhas não coincidem');
      return;
    }
    
    // 6. Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      setRegisterError('Email inválido');
      return;
    }

    setRegisterLoading(true);

    try {
      const result = await register(registerUsername, registerPassword, registerEmail);
      
      if (result.success) {
        setRegisterSuccess(result.message);
        // Limpar formulário
        setRegisterUsername('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
        
        // Chamar onLoginSuccess se fornecido
        onLoginSuccess?.();
      } else {
        // ✅ MOSTRAR ERRO ESPECÍFICO DO BACKEND
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
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterUsername(value);
                            validateUsername(value);
                          }}
                          required
                          minLength={4}
                          maxLength={10}
                          className={`bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500 ${
                            !usernameValid && registerUsername ? 'border-red-500' : ''
                          }`}
                        />
                        {!usernameValid && registerUsername && (
                          <p className="text-xs text-red-400 flex items-center gap-1">
                            <X className="size-3" />
                            {usernameError}
                          </p>
                        )}
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
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterEmail(value);
                            validateEmail(value);
                          }}
                          required
                          className={`bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500 ${
                            !emailValid && registerEmail ? 'border-red-500' : ''
                          }`}
                        />
                        {!emailValid && registerEmail && (
                          <p className="text-xs text-red-400 flex items-center gap-1">
                            <X className="size-3" />
                            {emailError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-slate-200 flex items-center gap-2">
                          <Lock className="size-4" />
                          {t('auth.password')}
                        </Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder={t('auth.passwordPlaceholder') || 'Mínimo 8 caracteres'}
                          value={registerPassword}
                          onChange={(e) => {
                            const value = e.target.value;
                            setRegisterPassword(value);
                            validatePassword(value);
                          }}
                          required
                          minLength={8}
                          className="bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500"
                        />
                        
                        {/* 🔐 V595: REQUISITOS DE SENHA EM TEMPO REAL */}
                        {registerPassword && (
                          <div className="space-y-1 mt-2 p-3 bg-black/40 border border-slate-700 rounded-lg">
                            <p className="text-xs text-slate-400 mb-2">Requisitos:</p>
                            
                            <div className={`flex items-center gap-2 text-xs ${
                              passwordRequirements.minLength ? 'text-green-400' : 'text-slate-500'
                            }`}>
                              {passwordRequirements.minLength ? (
                                <Check className="size-3" />
                              ) : (
                                <X className="size-3" />
                              )}
                              <span>Pelo menos 8 caracteres</span>
                            </div>
                            
                            <div className={`flex items-center gap-2 text-xs ${
                              passwordRequirements.hasUpperCase ? 'text-green-400' : 'text-slate-500'
                            }`}>
                              {passwordRequirements.hasUpperCase ? (
                                <Check className="size-3" />
                              ) : (
                                <X className="size-3" />
                              )}
                              <span>Uma letra maiúscula</span>
                            </div>
                            
                            <div className={`flex items-center gap-2 text-xs ${
                              passwordRequirements.hasNumber ? 'text-green-400' : 'text-slate-500'
                            }`}>
                              {passwordRequirements.hasNumber ? (
                                <Check className="size-3" />
                              ) : (
                                <X className="size-3" />
                              )}
                              <span>Um número</span>
                            </div>
                            
                            <div className={`flex items-center gap-2 text-xs ${
                              passwordRequirements.hasSpecialChar ? 'text-green-400' : 'text-slate-500'
                            }`}>
                              {passwordRequirements.hasSpecialChar ? (
                                <Check className="size-3" />
                              ) : (
                                <X className="size-3" />
                              )}
                              <span>Um caractere especial</span>
                            </div>
                          </div>
                        )}
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
                          minLength={8}
                          className={`bg-black/40 border-slate-700 focus:border-amber-500 text-white placeholder:text-slate-500 ${
                            registerConfirmPassword && registerPassword !== registerConfirmPassword ? 'border-red-500' : ''
                          }`}
                        />
                        {registerConfirmPassword && registerPassword !== registerConfirmPassword && (
                          <p className="text-xs text-red-400 flex items-center gap-1">
                            <X className="size-3" />
                            As senhas não coincidem
                          </p>
                        )}
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