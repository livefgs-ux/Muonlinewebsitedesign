/**
 * TELA DE INSTALAÇÃO COMPLETA
 */

import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Key, ExternalLink, Book } from 'lucide-react';

const InstallComplete = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
      >
        {/* Success Animation */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6"
          >
            <CheckCircle className="w-20 h-20 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-4"
          >
            Instalação Concluída!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400"
          >
            MeuMU Online foi instalado com sucesso
          </motion.p>
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-xl bg-black/60 rounded-2xl border border-[#FFB800]/20 p-8 mb-6"
        >
          {/* Access Info */}
          <div className="bg-gradient-to-r from-[#FFB800]/20 to-yellow-700/20 border border-[#FFB800]/30 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-6 h-6 text-[#FFB800]" />
              <h3 className="text-xl font-bold text-white">Informações de Acesso</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">URL do Site</p>
                <a
                  href="/"
                  className="text-[#FFB800] font-semibold hover:underline flex items-center gap-2"
                >
                  {window.location.origin}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="bg-black/40 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Painel Admin</p>
                <a
                  href="/admin"
                  className="text-[#FFB800] font-semibold hover:underline flex items-center gap-2"
                >
                  {window.location.origin}/admin
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="mt-4 bg-black/40 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Credenciais Administrativas</p>
              <p className="text-white">
                Use o usuário e senha que você definiu na instalação para acessar o painel administrativo.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white mb-4">Próximos Passos:</h3>

            {[
              {
                number: 1,
                title: 'Acesse o Painel Admin',
                description: 'Configure eventos, notícias e gerenciamento de jogadores',
                icon: '🎮'
              },
              {
                number: 2,
                title: 'Configure o Cash Shop',
                description: 'Defina pacotes de WCoin e sistema de pagamento',
                icon: '💰'
              },
              {
                number: 3,
                title: 'Personalize o Site',
                description: 'Ajuste cores, logos e conteúdo nas configurações',
                icon: '🎨'
              },
              {
                number: 4,
                title: 'Teste o Sistema',
                description: 'Crie um personagem e teste todas as funcionalidades',
                icon: '✅'
              }
            ].map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-4 bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-all"
              >
                <div className="w-10 h-10 bg-[#FFB800] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">
                    {step.number}. {step.title}
                  </h4>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Documentation Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <Book className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-blue-300 text-sm mb-2">
                <strong>Documentação Técnica:</strong> Para mais informações sobre configuração avançada,
                backup, segurança e troubleshooting, consulte a documentação completa no diretório <code className="bg-black/40 px-2 py-1 rounded">/docs</code>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <a
            href="/"
            className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all text-center"
          >
            Ver Site
          </a>

          <a
            href="/admin"
            className="px-6 py-4 bg-gradient-to-r from-[#FFB800] to-yellow-600 hover:from-[#FFC933] hover:to-yellow-700 text-black rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            Acessar Painel Admin
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <p>MeuMU Online Season 19-2-3 Épico © 2024</p>
          <p>Sistema completo de gerenciamento para servidor privado</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InstallComplete;
