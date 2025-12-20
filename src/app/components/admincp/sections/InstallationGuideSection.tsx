import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon, 
  MoveUp, 
  MoveDown,
  X,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../../../utils/supabase/info';

interface InstallationStep {
  id: string;
  step: number;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export function InstallationGuideSection() {
  const [steps, setSteps] = useState<InstallationStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    try {
      setLoading(true);
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
        setSteps(data.steps || getDefaultSteps());
      } else {
        setSteps(getDefaultSteps());
      }
    } catch (error) {
      console.error('Error loading installation guide:', error);
      setSteps(getDefaultSteps());
      toast.error('Erro ao carregar guia de instalação');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSteps = (): InstallationStep[] => [
    {
      id: '1',
      step: 1,
      title: 'Baixe o Cliente Completo',
      description: 'Faça o download do cliente completo do jogo (2.5 GB) usando um dos mirrors disponíveis.',
    },
    {
      id: '2',
      step: 2,
      title: 'Extraia os Arquivos',
      description: 'Descompacte o arquivo baixado em uma pasta de sua preferência (ex: C:\\MeuMU).',
    },
    {
      id: '3',
      step: 3,
      title: 'Instale o DirectX 9.0c',
      description: 'Execute o instalador do DirectX 9.0c incluído no pacote para garantir compatibilidade.',
    },
    {
      id: '4',
      step: 4,
      title: 'Execute o Launcher',
      description: 'Abra o MeuMU Launcher.exe para atualizar o jogo automaticamente.',
    },
    {
      id: '5',
      step: 5,
      title: 'Crie sua Conta e Jogue!',
      description: 'Registre-se no site, faça login no jogo e comece sua jornada épica!',
    },
  ];

  const saveSteps = async () => {
    try {
      setSaving(true);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/installation-guide`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ steps }),
        }
      );

      if (response.ok) {
        toast.success('Guia de instalação salvo com sucesso!');
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error('Error saving installation guide:', error);
      toast.error('Erro ao salvar guia de instalação');
    } finally {
      setSaving(false);
    }
  };

  const addStep = () => {
    const newStep: InstallationStep = {
      id: Date.now().toString(),
      step: steps.length + 1,
      title: '',
      description: '',
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    const newSteps = steps
      .filter(s => s.id !== id)
      .map((s, index) => ({ ...s, step: index + 1 }));
    setSteps(newSteps);
  };

  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    newSteps.forEach((s, i) => s.step = i + 1);
    setSteps(newSteps);
  };

  const moveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    newSteps.forEach((s, i) => s.step = i + 1);
    setSteps(newSteps);
  };

  const updateStep = (id: string, field: keyof InstallationStep, value: string) => {
    setSteps(steps.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const handleImageUpload = async (stepId: string, file: File) => {
    try {
      setUploadingImage(stepId);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('stepId', stepId);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/upload-installation-image`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        updateStep(stepId, 'image', data.imageUrl);
        toast.success('Imagem carregada com sucesso!');
      } else {
        throw new Error('Erro ao fazer upload');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploadingImage(null);
    }
  };

  const removeImage = (stepId: string) => {
    updateStep(stepId, 'image', '');
    updateStep(stepId, 'imageAlt', '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-gold/20 to-amber-500/20 rounded-xl border border-gold/30">
            <BookOpen className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-300">
              Guia de Instalação
            </h2>
            <p className="text-gray-400 text-sm">
              Gerencie os passos de instalação exibidos na seção Downloads
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={addStep}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Passo
          </Button>
          <Button
            onClick={saveSteps}
            disabled={saving}
            className="bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold text-black font-bold"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card
            key={step.id}
            className="bg-gradient-to-br from-obsidian/95 to-obsidian-light/95 border-2 border-gold/20 backdrop-blur-xl"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center border border-gold/50">
                    <span className="text-gold text-sm font-bold">{step.step}</span>
                  </div>
                  <span className="text-gray-300">Passo {step.step}</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveStepUp(index)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gold"
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveStepDown(index)}
                    disabled={index === steps.length - 1}
                    className="text-gray-400 hover:text-gold"
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(step.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-gray-300">Título</Label>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                  placeholder="Ex: Baixe o Cliente Completo"
                  className="bg-black/30 border-gold/20 text-white placeholder:text-gray-500 focus:border-gold"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-gray-300">Descrição</Label>
                <Textarea
                  value={step.description}
                  onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                  placeholder="Descreva este passo em detalhes..."
                  rows={3}
                  className="bg-black/30 border-gold/20 text-white placeholder:text-gray-500 focus:border-gold resize-none"
                />
              </div>

              {/* Image Upload (Optional) */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Imagem (Opcional)
                </Label>
                
                {step.image ? (
                  <div className="relative group">
                    <img
                      src={step.image}
                      alt={step.imageAlt || `Screenshot do passo ${step.step}`}
                      className="w-full max-h-64 object-cover rounded-lg border-2 border-gold/30"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(step.id)}
                        className="bg-red-500/90 hover:bg-red-600"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gold/30 rounded-lg p-6 bg-black/20 hover:bg-black/30 transition-colors">
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="p-3 bg-gold/10 rounded-full">
                        <Upload className="w-6 h-6 text-gold" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-300 text-sm font-medium">
                          {uploadingImage === step.id ? 'Fazendo upload...' : 'Clique para fazer upload'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          PNG, JPG até 5MB (screenshot, tutorial, etc)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImage === step.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error('Imagem muito grande! Máximo 5MB');
                              return;
                            }
                            handleImageUpload(step.id, file);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}

                {/* Image Alt Text */}
                {step.image && (
                  <div className="mt-2">
                    <Label className="text-gray-400 text-xs">Texto alternativo (acessibilidade)</Label>
                    <Input
                      value={step.imageAlt || ''}
                      onChange={(e) => updateStep(step.id, 'imageAlt', e.target.value)}
                      placeholder="Ex: Screenshot mostrando onde clicar para iniciar"
                      className="bg-black/30 border-gold/20 text-white placeholder:text-gray-500 focus:border-gold text-sm mt-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {steps.length === 0 && (
        <Card className="bg-gradient-to-br from-obsidian/95 to-obsidian-light/95 border-2 border-gold/20 backdrop-blur-xl p-12">
          <div className="text-center">
            <div className="inline-flex p-4 bg-gold/10 rounded-full mb-4">
              <BookOpen className="w-12 h-12 text-gold" />
            </div>
            <h3 className="text-xl text-gray-300 mb-2">Nenhum passo cadastrado</h3>
            <p className="text-gray-500 mb-6">
              Adicione passos para criar o guia de instalação
            </p>
            <Button
              onClick={addStep}
              className="bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold text-black font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Passo
            </Button>
          </div>
        </Card>
      )}

      {/* Info Box */}
      <Card className="bg-gradient-to-br from-blue-950/50 to-blue-900/30 border border-blue-500/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-blue-300 font-semibold mb-1">Dicas de Uso</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• <strong>Imagens são opcionais</strong> - adicione apenas quando necessário para ilustrar passos complexos</li>
                <li>• <strong>Screenshots úteis</strong> - capture telas mostrando exatamente onde clicar ou o que fazer</li>
                <li>• <strong>Ordem dos passos</strong> - use os botões de setas para reorganizar a sequência</li>
                <li>• <strong>Descrições claras</strong> - escreva instruções simples e diretas para facilitar o entendimento</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}