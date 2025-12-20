import { Layout, Eye, Save, Undo, Image, Type, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Input } from '../../ui/input';

export function SiteEditorSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Editor de Site</h2>
          <p className="text-sm text-slate-400">Personalize o visual e conteúdo do site</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
            <Save className="w-4 h-4 mr-2" />
            Salvar Mudanças
          </Button>
        </div>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="bg-slate-900/60 border border-amber-500/20">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="theme">Tema</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-6">
          <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Layout className="w-5 h-5" />
                Editor da Página Inicial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                <Input
                  type="text"
                  defaultValue="Bem-vindo ao MeuMU Online"
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                <Input
                  type="text"
                  defaultValue="Season 19.2.3 - Épico"
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Imagem de Fundo (URL)</label>
                <Input
                  type="text"
                  placeholder="https://..."
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="mt-6">
          <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Image className="w-5 h-5" />
                Seção de Downloads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Link do Cliente Completo</label>
                <Input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Link do Patch</label>
                <Input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="mt-6">
          <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Type className="w-5 h-5" />
                Editor do Footer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Texto de Copyright</label>
                <Input
                  type="text"
                  defaultValue="© 2024 MeuMU Online. Todos os direitos reservados."
                  className="bg-slate-800/50 border-slate-700/50 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-6">
          <Card className="bg-slate-900/40 backdrop-blur-2xl border-amber-500/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Palette className="w-5 h-5" />
                Personalização de Tema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#FFB800" className="w-16 h-10" />
                    <Input type="text" defaultValue="#FFB800" className="flex-1 bg-slate-800/50 border-slate-700/50 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#10B981" className="w-16 h-10" />
                    <Input type="text" defaultValue="#10B981" className="flex-1 bg-slate-800/50 border-slate-700/50 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cor de Fundo</label>
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#0A0A0A" className="w-16 h-10" />
                    <Input type="text" defaultValue="#0A0A0A" className="flex-1 bg-slate-800/50 border-slate-700/50 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
