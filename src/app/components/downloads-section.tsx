import { Download, FileArchive, Settings, HardDrive, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { motion } from 'motion/react';

const downloads = [
  {
    id: '1',
    title: 'Cliente Completo',
    description: 'Download completo do cliente MeuMU Online Season 19-2-3 - Épico. Inclui todos os arquivos necessários.',
    size: '2.5 GB',
    icon: FileArchive,
    color: 'yellow',
    version: 'v1.04.89',
  },
  {
    id: '2',
    title: 'Launcher',
    description: 'Launcher automático que mantém seu cliente sempre atualizado.',
    size: '5.2 MB',
    icon: Settings,
    color: 'blue',
    version: 'v2.1.0',
  },
  {
    id: '3',
    title: 'Drivers DirectX',
    description: 'Pacote de drivers necessários para rodar o jogo sem problemas.',
    size: '95 MB',
    icon: HardDrive,
    color: 'green',
    version: 'DirectX 9.0c',
  },
];

const systemRequirements = {
  minimum: [
    'Windows 7 ou superior',
    'Processador: Intel Core 2 Duo',
    'Memória: 2 GB RAM',
    'Placa de vídeo: 512 MB',
    'DirectX: Versão 9.0c',
    'Armazenamento: 3 GB',
  ],
  recommended: [
    'Windows 10/11',
    'Processador: Intel Core i5',
    'Memória: 4 GB RAM',
    'Placa de vídeo: 1 GB',
    'DirectX: Versão 9.0c',
    'Armazenamento: 5 GB',
  ],
};

export function DownloadsSection() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string; shadow: string }> = {
      yellow: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-500', shadow: 'shadow-yellow-500/50' },
      blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-500', shadow: 'shadow-blue-500/50' },
      green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-500', shadow: 'shadow-green-500/50' },
    };
    return colors[color] || colors.yellow;
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background já está em App.tsx - não duplicar! */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Download className="w-8 h-8 text-yellow-500" />
              <h2 className="text-4xl text-white">Downloads</h2>
            </div>
            <p className="text-gray-400 text-lg">
              Baixe o cliente e comece sua jornada épica agora
            </p>
          </div>

          {/* Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {downloads.map((item, index) => {
              const colors = getColorClasses(item.color);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`backdrop-blur-md bg-black/50 border ${colors.border} p-6 hover:scale-105 transition-all h-full flex flex-col`}>
                    <div className={`w-16 h-16 ${colors.bg} rounded-lg flex items-center justify-center mb-4 shadow-lg ${colors.shadow}`}>
                      <item.icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    
                    <h3 className="text-xl text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 flex-grow">{item.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Tamanho:</span>
                        <span className={colors.text}>{item.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Versão:</span>
                        <span className={colors.text}>{item.version}</span>
                      </div>
                      
                      <Button className={`w-full ${colors.bg} ${colors.text} border ${colors.border} hover:bg-opacity-80`}>
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Installation Guide */}
          <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8 mb-8">
            <h3 className="text-2xl text-white mb-6">Guia de Instalação</h3>
            
            <div className="space-y-4">
              {[
                { step: 1, title: 'Baixe o Cliente', description: 'Faça o download do cliente completo (2.5 GB)' },
                { step: 2, title: 'Extraia os Arquivos', description: 'Descompacte o arquivo baixado em uma pasta de sua preferência' },
                { step: 3, title: 'Instale os Drivers', description: 'Execute o instalador do DirectX 9.0c se necessário' },
                { step: 4, title: 'Execute o Launcher', description: 'Abra o launcher e aguarde as atualizações' },
                { step: 5, title: 'Jogue!', description: 'Crie sua conta e comece sua aventura épica' },
              ].map((step) => (
                <div key={step.step} className="flex items-start gap-4 p-4 bg-black/30 rounded-lg border border-yellow-500/20">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-yellow-500/50">
                    <span className="text-yellow-500">{step.step}</span>
                  </div>
                  <div>
                    <h4 className="text-white mb-1">{step.title}</h4>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* System Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8">
              <h3 className="text-xl text-white mb-4">Requisitos Mínimos</h3>
              <ul className="space-y-2">
                {systemRequirements.minimum.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-400">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8">
              <h3 className="text-xl text-white mb-4">Requisitos Recomendados</h3>
              <ul className="space-y-2">
                {systemRequirements.recommended.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-400">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Mirrors & Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6">
              <h3 className="text-xl text-white mb-4">Mirrors de Download</h3>
              <div className="space-y-3">
                {['Google Drive', 'MEGA', 'MediaFire'].map((mirror) => (
                  <Button
                    key={mirror}
                    variant="outline"
                    className="w-full border-yellow-500/30 text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10 justify-between"
                  >
                    <span>{mirror}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-6">
              <h3 className="text-xl text-white mb-4">Precisa de Ajuda?</h3>
              <p className="text-gray-400 mb-4">
                Se você tiver problemas durante a instalação, nossa equipe de suporte está pronta para ajudar!
              </p>
              <div className="space-y-2">
                <Button className="w-full bg-blue-500/20 border border-blue-500/50 text-blue-500 hover:bg-blue-500/30">
                  Discord
                </Button>
                <Button className="w-full bg-green-500/20 border border-green-500/50 text-green-500 hover:bg-green-500/30">
                  WhatsApp
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DownloadsSection;