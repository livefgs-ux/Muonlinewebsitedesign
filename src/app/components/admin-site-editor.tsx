import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { 
  Palette, Type, Layout, Image, Move, Eye, Save, 
  RotateCcw, ChevronDown, ChevronUp, Home, Users, Trophy, 
  Calendar, Download, Link as LinkIcon, Plus, Trash2
} from 'lucide-react';

// Configurações padrão do site (com comentários explicativos)
const defaultConfig = {
  // ========== PÁGINA INICIAL (HOME) ==========
  home: {
    // HERO SECTION (Seção principal do topo)
    hero: {
      title: 'MeuMU Online',
      subtitle: 'Season 19-2-3 - Épico',
      description: 'Aventure-se no mundo medieval sombrio do MU Online',
      
      // CORES DO HERO
      titleColor: '#fbbf24', // Cor do título principal (dourado)
      subtitleColor: '#ffffff', // Cor do subtítulo (branco)
      descriptionColor: '#9ca3af', // Cor da descrição (cinza claro)
      backgroundColor: '#000000', // Cor de fundo (preto)
      overlayOpacity: '80', // Opacidade da camada escura sobre a imagem (0-100)
      
      // TAMANHOS DE FONTE
      titleSize: '4xl', // Tamanho do título (xl, 2xl, 3xl, 4xl, 5xl, 6xl)
      subtitleSize: 'xl', // Tamanho do subtítulo
      descriptionSize: 'lg', // Tamanho da descrição
      
      // ESPAÇAMENTO
      sectionPadding: '20', // Espaçamento interno da seção (em px)
      titleMarginBottom: '4', // Espaço abaixo do título
      subtitleMarginBottom: '6', // Espaço abaixo do subtítulo
    },
    
    // WIDGET DE STATUS DO SERVIDOR
    serverWidget: {
      title: 'Status do Servidor',
      serverName: 'MeuMU Epic',
      
      // CORES DO WIDGET
      borderColor: '#fbbf24', // Cor da borda (dourado)
      backgroundColor: '#000000', // Cor de fundo (preto)
      backgroundOpacity: '70', // Opacidade do fundo (0-100)
      
      // STATUS ONLINE/OFFLINE
      onlineColor: '#10b981', // Cor quando servidor está online (verde)
      offlineColor: '#ef4444', // Cor quando servidor está offline (vermelho)
      
      // ESPAÇAMENTO
      widgetPadding: '6', // Espaçamento interno do widget
      itemSpacing: '4', // Espaço entre itens de informação
    },
    
    // SEÇÃO DE FEATURES (Características do servidor)
    features: {
      // CORES
      cardBackgroundColor: '#000000', // Cor de fundo dos cards
      cardBackgroundOpacity: '50', // Opacidade do fundo dos cards (0-100)
      cardBorderColor: '#fbbf24', // Cor da borda dos cards
      iconColor: '#fbbf24', // Cor dos ícones
      titleColor: '#ffffff', // Cor dos títulos dos cards
      descriptionColor: '#9ca3af', // Cor das descrições
      
      // LAYOUT
      columns: '3', // Número de colunas no grid (1, 2, 3, 4)
      gap: '6', // Espaçamento entre cards
      
      // TAMANHOS
      iconSize: '8', // Tamanho dos ícones (6, 8, 10, 12)
      cardPadding: '6', // Espaçamento interno dos cards
    }
  },
  
  // ========== DASHBOARD ==========
  dashboard: {
    // ÁREA DE LOGIN
    login: {
      title: 'Área do Jogador',
      subtitle: 'Faça login para acessar sua conta',
      
      // CORES
      cardBackgroundColor: '#000000', // Cor de fundo do card de login
      cardBackgroundOpacity: '50', // Opacidade do fundo
      cardBorderColor: '#fbbf24', // Cor da borda
      buttonColor: '#fbbf24', // Cor do botão de login (dourado)
      inputBorderColor: '#fbbf24', // Cor da borda dos campos de entrada
      
      // TAMANHOS
      cardPadding: '8', // Espaçamento interno do card
      inputHeight: '12', // Altura dos campos de entrada
      buttonHeight: '12', // Altura do botão
    },
    
    // CARDS DE PERSONAGENS
    characters: {
      // CORES
      cardBackgroundColor: '#000000', // Cor de fundo dos cards de personagens
      cardBackgroundOpacity: '70', // Opacidade do fundo
      cardBorderColor: '#fbbf24', // Cor da borda normal
      selectedBorderColor: '#fbbf24', // Cor da borda quando selecionado
      nameColor: '#fbbf24', // Cor do nome do personagem
      levelColor: '#ffffff', // Cor do level
      
      // BADGES (Online/Offline)
      onlineBadgeColor: '#10b981', // Cor do badge quando online (verde)
      offlineBadgeColor: '#ef4444', // Cor do badge quando offline (vermelho)
      
      // LAYOUT
      columns: '4', // Número de colunas no grid (1, 2, 3, 4)
      gap: '6', // Espaçamento entre cards
      imageHeight: '64', // Altura da imagem do personagem
    },
    
    // TABS (Abas)
    tabs: {
      // CORES
      backgroundColor: '#000000', // Cor de fundo das tabs
      borderColor: '#fbbf24', // Cor da borda
      activeBackgroundColor: '#fbbf24', // Cor de fundo da tab ativa
      activeTextColor: '#fbbf24', // Cor do texto da tab ativa
      inactiveTextColor: '#9ca3af', // Cor do texto das tabs inativas
    }
  },
  
  // ========== RANKINGS ==========
  rankings: {
    title: 'Rankings',
    subtitle: 'Top jogadores do servidor',
    
    // CORES DA TABELA
    headerBackgroundColor: '#fbbf24', // Cor de fundo do cabeçalho da tabela
    headerTextColor: '#000000', // Cor do texto do cabeçalho
    rowBackgroundColor: '#000000', // Cor de fundo das linhas
    rowBackgroundOpacity: '30', // Opacidade do fundo das linhas
    rowBorderColor: '#fbbf24', // Cor da borda das linhas
    
    // CORES DOS RANKINGS
    firstPlaceColor: '#fbbf24', // Cor da 1ª posição (dourado)
    secondPlaceColor: '#9ca3af', // Cor da 2ª posição (prata)
    thirdPlaceColor: '#cd7f32', // Cor da 3ª posição (bronze)
    
    // LAYOUT
    rowPadding: '4', // Espaçamento interno das linhas
    tableSpacing: '2', // Espaçamento entre linhas
  },
  
  // ========== EVENTOS ==========
  events: {
    title: 'Eventos do Servidor',
    subtitle: 'Cronograma de eventos em tempo real',
    
    // CORES DOS CARDS DE EVENTOS
    cardBackgroundColor: '#000000', // Cor de fundo dos cards
    cardBackgroundOpacity: '70', // Opacidade do fundo
    cardBorderColor: '#fbbf24', // Cor da borda
    titleColor: '#fbbf24', // Cor do título do evento
    timeColor: '#ffffff', // Cor do horário
    statusActiveColor: '#10b981', // Cor quando evento está ativo (verde)
    statusInactiveColor: '#6b7280', // Cor quando evento não está ativo (cinza)
    
    // LAYOUT
    columns: '2', // Número de colunas no grid (1, 2, 3)
    gap: '6', // Espaçamento entre cards
    cardPadding: '6', // Espaçamento interno dos cards
  },
  
  // ========== DOWNLOADS ==========
  downloads: {
    title: 'Downloads',
    subtitle: 'Baixe o cliente e ferramentas necessárias',
    
    // CORES DOS BOTÕES DE DOWNLOAD
    primaryButtonColor: '#fbbf24', // Cor do botão principal (dourado)
    primaryButtonTextColor: '#000000', // Cor do texto do botão principal
    secondaryButtonColor: '#3b82f6', // Cor do botão secundário (azul)
    secondaryButtonTextColor: '#ffffff', // Cor do texto do botão secundário
    
    // CARDS DE DOWNLOAD
    cardBackgroundColor: '#000000', // Cor de fundo dos cards
    cardBackgroundOpacity: '70', // Opacidade do fundo
    cardBorderColor: '#fbbf24', // Cor da borda
    
    // LAYOUT
    cardPadding: '8', // Espaçamento interno dos cards
    buttonHeight: '14', // Altura dos botões
    spacing: '6', // Espaçamento entre elementos
  },
  
  // ========== CONFIGURAÇÕES GLOBAIS ==========
  global: {
    // NAVEGAÇÃO (Menu superior)
    navigation: {
      backgroundColor: '#000000', // Cor de fundo do menu
      backgroundOpacity: '30', // Opacidade do fundo
      borderColor: '#fbbf24', // Cor da borda inferior
      linkColor: '#9ca3af', // Cor dos links normais (cinza claro)
      linkHoverColor: '#fbbf24', // Cor dos links ao passar o mouse (dourado)
      activeLinkColor: '#fbbf24', // Cor do link da página ativa
      height: '20', // Altura do menu (em unidades)
    },
    
    // CORES PRINCIPAIS DO TEMA
    theme: {
      primaryColor: '#fbbf24', // Cor primária (dourado)
      secondaryColor: '#3b82f6', // Cor secundária (azul)
      successColor: '#10b981', // Cor de sucesso (verde)
      dangerColor: '#ef4444', // Cor de perigo (vermelho)
      warningColor: '#f59e0b', // Cor de aviso (amarelo/laranja)
      backgroundColor: '#000000', // Cor de fundo principal (preto)
      textColor: '#ffffff', // Cor do texto principal (branco)
      textSecondaryColor: '#9ca3af', // Cor do texto secundário (cinza)
    },
    
    // FONTES
    fonts: {
      primaryFont: 'Inter', // Fonte principal (Inter, Arial, Roboto, etc)
      headingSize: '3xl', // Tamanho dos títulos principais
      bodySize: 'base', // Tamanho do texto normal
      smallSize: 'sm', // Tamanho do texto pequeno
    },
    
    // ESPAÇAMENTOS GERAIS
    spacing: {
      sectionSpacing: '20', // Espaçamento entre seções
      containerPadding: '4', // Espaçamento interno dos containers
      elementGap: '4', // Espaço padrão entre elementos
    }
  }
};

export function AdminSiteEditor() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [config, setConfig] = useState(defaultConfig);
  const [expandedSections, setExpandedSections] = useState<string[]>(['hero']);
  const [hasChanges, setHasChanges] = useState(false);

  const pages = [
    { id: 'home', label: 'Página Inicial', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: Users },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'global', label: 'Configurações Globais', icon: Palette },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSave = () => {
    // Aqui você salvaria as configurações no banco de dados
    alert('✅ Configurações salvas com sucesso!');
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm('🔄 Tem certeza que deseja restaurar as configurações padrão?')) {
      setConfig(defaultConfig);
      setHasChanges(false);
    }
  };

  const updateConfig = (page: string, section: string, key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [page]: {
        ...prev[page as keyof typeof prev],
        [section]: {
          ...(prev[page as keyof typeof prev] as any)[section],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const renderColorInput = (label: string, value: string, comment: string, page: string, section: string, key: string) => (
    <div className="space-y-2">
      <label className="text-sm text-white flex items-center gap-2">
        <Palette className="w-4 h-4 text-yellow-500" />
        {label}
      </label>
      <p className="text-xs text-gray-400 italic">💡 {comment}</p>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => updateConfig(page, section, key, e.target.value)}
          className="w-16 h-10 rounded border border-yellow-500/30 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => updateConfig(page, section, key, e.target.value)}
          className="flex-1 bg-black/50 border border-yellow-500/30 rounded px-3 py-2 text-white text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const renderTextInput = (label: string, value: string, comment: string, page: string, section: string, key: string) => (
    <div className="space-y-2">
      <label className="text-sm text-white flex items-center gap-2">
        <Type className="w-4 h-4 text-yellow-500" />
        {label}
      </label>
      <p className="text-xs text-gray-400 italic">💡 {comment}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => updateConfig(page, section, key, e.target.value)}
        className="w-full bg-black/50 border border-yellow-500/30 rounded px-3 py-2 text-white text-sm"
      />
    </div>
  );

  const renderNumberInput = (label: string, value: string, comment: string, page: string, section: string, key: string, min?: string, max?: string) => (
    <div className="space-y-2">
      <label className="text-sm text-white flex items-center gap-2">
        <Move className="w-4 h-4 text-yellow-500" />
        {label}
      </label>
      <p className="text-xs text-gray-400 italic">💡 {comment}</p>
      <input
        type="number"
        value={value}
        onChange={(e) => updateConfig(page, section, key, e.target.value)}
        min={min}
        max={max}
        className="w-full bg-black/50 border border-yellow-500/30 rounded px-3 py-2 text-white text-sm"
      />
    </div>
  );

  const renderSelectInput = (label: string, value: string, comment: string, options: string[], page: string, section: string, key: string) => (
    <div className="space-y-2">
      <label className="text-sm text-white flex items-center gap-2">
        <Layout className="w-4 h-4 text-yellow-500" />
        {label}
      </label>
      <p className="text-xs text-gray-400 italic">💡 {comment}</p>
      <select
        value={value}
        onChange={(e) => updateConfig(page, section, key, e.target.value)}
        className="w-full bg-black/50 border border-yellow-500/30 rounded px-3 py-2 text-white text-sm"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const renderPageEditor = () => {
    const pageConfig = config[selectedPage as keyof typeof config];

    if (selectedPage === 'home') {
      return (
        <div className="space-y-6">
          {/* HERO SECTION */}
          <Card className="bg-black/70 border-yellow-500/30 p-6">
            <button
              onClick={() => toggleSection('hero')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h4 className="text-xl text-yellow-500">Hero Section (Topo da Página)</h4>
              {expandedSections.includes('hero') ? (
                <ChevronUp className="w-5 h-5 text-yellow-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            {expandedSections.includes('hero') && (
              <div className="space-y-6 pt-4 border-t border-yellow-500/20">
                {renderTextInput(
                  'Título Principal',
                  (pageConfig as any).hero.title,
                  'Este é o título grande que aparece no topo da página inicial',
                  'home', 'hero', 'title'
                )}
                {renderTextInput(
                  'Subtítulo',
                  (pageConfig as any).hero.subtitle,
                  'Texto menor que aparece logo abaixo do título',
                  'home', 'hero', 'subtitle'
                )}
                {renderTextInput(
                  'Descrição',
                  (pageConfig as any).hero.description,
                  'Texto de descrição que aparece abaixo do subtítulo',
                  'home', 'hero', 'description'
                )}
                {renderColorInput(
                  'Cor do Título',
                  (pageConfig as any).hero.titleColor,
                  'Muda a cor do título principal (padrão: dourado)',
                  'home', 'hero', 'titleColor'
                )}
                {renderColorInput(
                  'Cor do Subtítulo',
                  (pageConfig as any).hero.subtitleColor,
                  'Muda a cor do subtítulo (padrão: branco)',
                  'home', 'hero', 'subtitleColor'
                )}
                {renderSelectInput(
                  'Tamanho do Título',
                  (pageConfig as any).hero.titleSize,
                  'Define o tamanho da fonte do título principal',
                  ['xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
                  'home', 'hero', 'titleSize'
                )}
                {renderNumberInput(
                  'Opacidade da Camada Escura',
                  (pageConfig as any).hero.overlayOpacity,
                  'Define o quão escura fica a camada sobre a imagem de fundo (0 = transparente, 100 = totalmente escuro)',
                  'home', 'hero', 'overlayOpacity',
                  '0', '100'
                )}
              </div>
            )}
          </Card>

          {/* SERVER WIDGET */}
          <Card className="bg-black/70 border-yellow-500/30 p-6">
            <button
              onClick={() => toggleSection('serverWidget')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h4 className="text-xl text-yellow-500">Widget de Status do Servidor</h4>
              {expandedSections.includes('serverWidget') ? (
                <ChevronUp className="w-5 h-5 text-yellow-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            {expandedSections.includes('serverWidget') && (
              <div className="space-y-6 pt-4 border-t border-yellow-500/20">
                {renderTextInput(
                  'Título do Widget',
                  (pageConfig as any).serverWidget.title,
                  'Texto que aparece no topo do widget de status',
                  'home', 'serverWidget', 'title'
                )}
                {renderColorInput(
                  'Cor da Borda',
                  (pageConfig as any).serverWidget.borderColor,
                  'Cor da borda do widget (padrão: dourado)',
                  'home', 'serverWidget', 'borderColor'
                )}
                {renderColorInput(
                  'Cor quando Servidor Online',
                  (pageConfig as any).serverWidget.onlineColor,
                  'Cor exibida quando o servidor está online (padrão: verde)',
                  'home', 'serverWidget', 'onlineColor'
                )}
                {renderColorInput(
                  'Cor quando Servidor Offline',
                  (pageConfig as any).serverWidget.offlineColor,
                  'Cor exibida quando o servidor está offline (padrão: vermelho)',
                  'home', 'serverWidget', 'offlineColor'
                )}
                {renderNumberInput(
                  'Espaçamento Interno',
                  (pageConfig as any).serverWidget.widgetPadding,
                  'Define o espaço interno do widget (maior = mais espaçoso)',
                  'home', 'serverWidget', 'widgetPadding',
                  '0', '20'
                )}
              </div>
            )}
          </Card>

          {/* FEATURES */}
          <Card className="bg-black/70 border-yellow-500/30 p-6">
            <button
              onClick={() => toggleSection('features')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h4 className="text-xl text-yellow-500">Features (Cards de Características)</h4>
              {expandedSections.includes('features') ? (
                <ChevronUp className="w-5 h-5 text-yellow-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            {expandedSections.includes('features') && (
              <div className="space-y-6 pt-4 border-t border-yellow-500/20">
                {renderColorInput(
                  'Cor de Fundo dos Cards',
                  (pageConfig as any).features.cardBackgroundColor,
                  'Cor de fundo dos cards de características',
                  'home', 'features', 'cardBackgroundColor'
                )}
                {renderColorInput(
                  'Cor dos Ícones',
                  (pageConfig as any).features.iconColor,
                  'Cor dos ícones dentro dos cards',
                  'home', 'features', 'iconColor'
                )}
                {renderSelectInput(
                  'Número de Colunas',
                  (pageConfig as any).features.columns,
                  'Quantos cards aparecem lado a lado na mesma linha',
                  ['1', '2', '3', '4'],
                  'home', 'features', 'columns'
                )}
                {renderNumberInput(
                  'Espaço entre Cards',
                  (pageConfig as any).features.gap,
                  'Define o espaço entre os cards (maior = mais separado)',
                  'home', 'features', 'gap',
                  '0', '12'
                )}
              </div>
            )}
          </Card>
        </div>
      );
    }

    if (selectedPage === 'global') {
      return (
        <div className="space-y-6">
          {/* NAVIGATION */}
          <Card className="bg-black/70 border-yellow-500/30 p-6">
            <button
              onClick={() => toggleSection('navigation')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h4 className="text-xl text-yellow-500">Menu de Navegação (Topo)</h4>
              {expandedSections.includes('navigation') ? (
                <ChevronUp className="w-5 h-5 text-yellow-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            {expandedSections.includes('navigation') && (
              <div className="space-y-6 pt-4 border-t border-yellow-500/20">
                {renderColorInput(
                  'Cor de Fundo do Menu',
                  (pageConfig as any).navigation.backgroundColor,
                  'Cor de fundo da barra de navegação no topo',
                  'global', 'navigation', 'backgroundColor'
                )}
                {renderColorInput(
                  'Cor dos Links',
                  (pageConfig as any).navigation.linkColor,
                  'Cor dos links do menu quando não estão ativos',
                  'global', 'navigation', 'linkColor'
                )}
                {renderColorInput(
                  'Cor dos Links ao Passar o Mouse',
                  (pageConfig as any).navigation.linkHoverColor,
                  'Cor dos links quando você passa o mouse sobre eles',
                  'global', 'navigation', 'linkHoverColor'
                )}
                {renderColorInput(
                  'Cor do Link Ativo',
                  (pageConfig as any).navigation.activeLinkColor,
                  'Cor do link da página atual (ativa)',
                  'global', 'navigation', 'activeLinkColor'
                )}
              </div>
            )}
          </Card>

          {/* THEME COLORS */}
          <Card className="bg-black/70 border-yellow-500/30 p-6">
            <button
              onClick={() => toggleSection('theme')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h4 className="text-xl text-yellow-500">Cores do Tema (Global)</h4>
              {expandedSections.includes('theme') ? (
                <ChevronUp className="w-5 h-5 text-yellow-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            {expandedSections.includes('theme') && (
              <div className="space-y-6 pt-4 border-t border-yellow-500/20">
                {renderColorInput(
                  'Cor Primária (Principal)',
                  (pageConfig as any).theme.primaryColor,
                  'Cor principal usada em todo o site (botões, destaques, etc) - padrão: dourado',
                  'global', 'theme', 'primaryColor'
                )}
                {renderColorInput(
                  'Cor Secundária',
                  (pageConfig as any).theme.secondaryColor,
                  'Segunda cor mais usada no site - padrão: azul',
                  'global', 'theme', 'secondaryColor'
                )}
                {renderColorInput(
                  'Cor de Sucesso',
                  (pageConfig as any).theme.successColor,
                  'Cor para mensagens de sucesso e status online - padrão: verde',
                  'global', 'theme', 'successColor'
                )}
                {renderColorInput(
                  'Cor de Perigo/Erro',
                  (pageConfig as any).theme.dangerColor,
                  'Cor para erros, avisos críticos e status offline - padrão: vermelho',
                  'global', 'theme', 'dangerColor'
                )}
                {renderColorInput(
                  'Cor do Texto Principal',
                  (pageConfig as any).theme.textColor,
                  'Cor do texto principal do site - padrão: branco',
                  'global', 'theme', 'textColor'
                )}
                {renderColorInput(
                  'Cor do Texto Secundário',
                  (pageConfig as any).theme.textSecondaryColor,
                  'Cor do texto de menor importância (legendas, descrições) - padrão: cinza',
                  'global', 'theme', 'textSecondaryColor'
                )}
              </div>
            )}
          </Card>

          {/* FONTS */}
          <Card className="bg-black/70 border-yellow-500/30 p-6">
            <button
              onClick={() => toggleSection('fonts')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h4 className="text-xl text-yellow-500">Fontes (Tipografia)</h4>
              {expandedSections.includes('fonts') ? (
                <ChevronUp className="w-5 h-5 text-yellow-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            {expandedSections.includes('fonts') && (
              <div className="space-y-6 pt-4 border-t border-yellow-500/20">
                {renderSelectInput(
                  'Tamanho dos Títulos',
                  (pageConfig as any).fonts.headingSize,
                  'Define o tamanho das fontes dos títulos principais',
                  ['xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
                  'global', 'fonts', 'headingSize'
                )}
                {renderSelectInput(
                  'Tamanho do Texto Normal',
                  (pageConfig as any).fonts.bodySize,
                  'Define o tamanho da fonte do texto normal do site',
                  ['xs', 'sm', 'base', 'lg', 'xl'],
                  'global', 'fonts', 'bodySize'
                )}
                {renderSelectInput(
                  'Tamanho do Texto Pequeno',
                  (pageConfig as any).fonts.smallSize,
                  'Define o tamanho da fonte para textos pequenos (legendas, notas)',
                  ['xs', 'sm', 'base'],
                  'global', 'fonts', 'smallSize'
                )}
              </div>
            )}
          </Card>

          {/* SPACING */}
          <Card className="bg-black/70 border-yellow-500/30 p-6">
            <button
              onClick={() => toggleSection('spacing')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h4 className="text-xl text-yellow-500">Espaçamentos (Global)</h4>
              {expandedSections.includes('spacing') ? (
                <ChevronUp className="w-5 h-5 text-yellow-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            {expandedSections.includes('spacing') && (
              <div className="space-y-6 pt-4 border-t border-yellow-500/20">
                {renderNumberInput(
                  'Espaçamento entre Seções',
                  (pageConfig as any).spacing.sectionSpacing,
                  'Define o espaço vertical entre as grandes seções do site',
                  'global', 'spacing', 'sectionSpacing',
                  '0', '40'
                )}
                {renderNumberInput(
                  'Espaçamento Interno dos Containers',
                  (pageConfig as any).spacing.containerPadding,
                  'Define o espaço interno dos containers (maior = mais espaçoso)',
                  'global', 'spacing', 'containerPadding',
                  '0', '20'
                )}
                {renderNumberInput(
                  'Espaço entre Elementos',
                  (pageConfig as any).spacing.elementGap,
                  'Define o espaço padrão entre elementos próximos',
                  'global', 'spacing', 'elementGap',
                  '0', '12'
                )}
              </div>
            )}
          </Card>
        </div>
      );
    }

    return (
      <Card className="bg-black/70 border-yellow-500/30 p-8 text-center">
        <p className="text-gray-400">Editor para esta página em desenvolvimento...</p>
        <p className="text-sm text-gray-500 mt-2">As configurações desta página serão adicionadas em breve.</p>
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-white mb-2">Editor do Site</h1>
          <p className="text-gray-400">Personalize cores, fontes, layouts e conteúdo de todas as páginas</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black"
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4"
        >
          <p className="text-yellow-500 text-sm">
            ⚠️ Você tem alterações não salvas. Clique em "Salvar Alterações" para aplicar.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar - Page Selector */}
        <div className="col-span-3">
          <Card className="backdrop-blur-md bg-black/70 border-yellow-500/30 p-4 sticky top-28">
            <h3 className="text-lg text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-500" />
              Selecionar Página
            </h3>
            <div className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    selectedPage === page.id
                      ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <page.icon className="w-5 h-5" />
                  <span className="text-sm">{page.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Editor Area */}
        <div className="col-span-9">
          {renderPageEditor()}
        </div>
      </div>
    </motion.div>
  );
}