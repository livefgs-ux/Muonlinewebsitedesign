import { Download, FileArchive, Settings, HardDrive, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface InstallationStep {
  id: string;
  step: number;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export function DownloadsSection() {
  const { t } = useLanguage();
  const [installationSteps, setInstallationSteps] = useState<InstallationStep[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(true);
  
  useEffect(() => {
    const fetchInstallationSteps = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/installation-guide`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setInstallationSteps(data.steps || []);
        }
      } catch (error) {
        console.error('Error loading installation steps:', error);
      } finally {
        setLoadingSteps(false);
      }
    };

    fetchInstallationSteps();
  }, []);

  const downloads = [
    {
      id: '1',
      title: t('downloads.fullClient'),
      description: t('downloads.fullClientDesc'),
      size: '2.5 GB',
      icon: FileArchive,
      color: 'yellow',
      version: 'v1.04.89',
    },
    {
      id: '2',
      title: t('downloads.launcher'),
      description: t('downloads.launcherDesc'),
      size: '5.2 MB',
      icon: Settings,
      color: 'blue',
      version: 'v2.1.0',
    },
    {
      id: '3',
      title: t('downloads.directx'),
      description: t('downloads.directxDesc'),
      size: '95 MB',
      icon: HardDrive,
      color: 'green',
      version: 'DirectX 9.0c',
    },
  ];

  const systemRequirements = {
    minimum: [
      t('downloads.sysReqWindows7'),
      t('downloads.sysReqProcessorDuo'),
      t('downloads.sysReqMemory2gb'),
      t('downloads.sysReqGraphics512mb'),
      t('downloads.sysReqDirectxVersion'),
      t('downloads.sysReqStorage3gb'),
    ],
    recommended: [
      t('downloads.sysReqWindows10'),
      t('downloads.sysReqProcessorI5'),
      t('downloads.sysReqMemory4gb'),
      t('downloads.sysReqGraphics1gb'),
      t('downloads.sysReqDirectxVersion'),
      t('downloads.sysReqStorage5gb'),
    ],
  };
  
  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string; shadow: string }> = {
      yellow: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-500', shadow: 'shadow-yellow-500/50' },
      blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-500', shadow: 'shadow-blue-500/50' },
      green: { border: 'border-green-500/30', bg: 'bg-green-500/10', text: 'text-green-500', shadow: 'shadow-green-500/50' },
    };
    return colors[color] || colors.yellow;
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto relative z-20">
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
              <h2 className="text-4xl text-white">{t('downloads.title')}</h2>
            </div>
            <p className="text-gray-400 text-lg">
              {t('downloads.subtitle')}
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
                  <Card className={`backdrop-blur-md bg-black/50 border ${colors.border} p-6 transition-all h-full flex flex-col`}>
                    <div className={`w-16 h-16 ${colors.bg} rounded-lg flex items-center justify-center mb-4 shadow-lg ${colors.shadow}`}>
                      <item.icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    
                    <h3 className="text-xl text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 flex-grow">{item.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{t('downloads.size')}:</span>
                        <span className={colors.text}>{item.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{t('downloads.version')}:</span>
                        <span className={colors.text}>{item.version}</span>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button className={`w-full ${colors.bg} ${colors.text} border ${colors.border} hover:bg-opacity-80 transition-all shadow-lg hover:shadow-xl ${colors.shadow}`}>
                          <Download className="w-4 h-4 mr-2" />
                          {t('downloads.downloadButton')}
                        </Button>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Installation Guide */}
          <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8 mb-8">
            <h3 className="text-2xl text-white mb-6">{t('downloads.installationGuide')}</h3>
            
            <div className="space-y-4">
              {loadingSteps ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                installationSteps.map((step) => (
                  <div key={step.id} className="space-y-3">
                    <div className="flex items-start gap-4 p-4 bg-black/30 rounded-lg border border-yellow-500/20">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-yellow-500/50">
                        <span className="text-yellow-500 font-bold">{step.step}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white mb-1 font-semibold">{step.title}</h4>
                        <p className="text-gray-400 text-sm">{step.description}</p>
                      </div>
                    </div>
                    {step.image && (
                      <div className="ml-14 rounded-lg overflow-hidden border border-yellow-500/20 bg-black/20">
                        <img
                          src={step.image}
                          alt={step.imageAlt || `Screenshot do passo ${step.step}: ${step.title}`}
                          className="w-full h-auto object-contain max-h-96"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* System Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="backdrop-blur-md bg-black/50 border-yellow-500/30 p-8">
              <h3 className="text-xl text-white mb-4">{t('downloads.minimumReqs')}</h3>
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
              <h3 className="text-xl text-white mb-4">{t('downloads.recommendedReqs')}</h3>
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
              <h3 className="text-xl text-white mb-4">{t('downloads.downloadMirrors')}</h3>
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
              <h3 className="text-xl text-white mb-4">{t('downloads.needHelp')}</h3>
              <p className="text-gray-400 mb-4">
                {t('downloads.needHelpDesc')}
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