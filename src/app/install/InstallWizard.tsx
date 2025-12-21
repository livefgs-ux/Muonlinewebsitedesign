/**
 * INSTALL WIZARD - PÁGINA PRINCIPAL
 * Sistema de instalação visual em 3 etapas
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  User, 
  CheckCircle, 
  Settings,
  Loader,
  AlertCircle
} from 'lucide-react';
import StepDatabase from './steps/StepDatabase';
import StepAdmin from './steps/StepAdmin';
import StepConfirm from './steps/StepConfirm';
import InstallComplete from './steps/InstallComplete';

export interface DatabaseConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  db_muonline: string;
  db_webmu: string;
}

export interface AdminConfig {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

const InstallWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [databaseConfig, setDatabaseConfig] = useState<DatabaseConfig>({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    db_muonline: 'MuOnline',
    db_webmu: 'webmu'
  });
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { number: 1, title: 'Banco de Dados', icon: Database },
    { number: 2, title: 'Conta Admin', icon: User },
    { number: 3, title: 'Confirmação', icon: Settings }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInstallComplete = () => {
    setIsComplete(true);
  };

  if (isComplete) {
    return <InstallComplete />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-2">
            MeuMU Online
          </h1>
          <p className="text-xl text-gray-400">
            Assistente de Instalação
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center mb-12"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex items-center">
                {/* Step Circle */}
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-green-500 border-green-500'
                        : isActive
                        ? 'bg-[#FFB800] border-[#FFB800]'
                        : 'bg-black/40 border-gray-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <Icon className={`w-8 h-8 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <p className={`text-sm font-semibold ${isActive ? 'text-[#FFB800]' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-32 h-1 mx-4 transition-all ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Step Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-black/60 rounded-2xl border border-[#FFB800]/20 p-8 mt-16"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepDatabase
                key="step1"
                config={databaseConfig}
                setConfig={setDatabaseConfig}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <StepAdmin
                key="step2"
                config={adminConfig}
                setConfig={setAdminConfig}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
            {currentStep === 3 && (
              <StepConfirm
                key="step3"
                databaseConfig={databaseConfig}
                adminConfig={adminConfig}
                onPrevious={handlePrevious}
                onComplete={handleInstallComplete}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <p>MeuMU Online Season 19-2-3 Épico © 2024</p>
          <p>Sistema de gerenciamento completo para servidor privado</p>
        </motion.div>
      </div>
    </div>
  );
};

export default InstallWizard;
