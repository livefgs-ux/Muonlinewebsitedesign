export type Language = 'pt-BR' | 'en' | 'es' | 'de' | 'zh' | 'ru' | 'fil' | 'vi';

import { admincpTranslations } from './admincp-translations';
import { dashboardTranslations } from './dashboard-translations';

// Translations interface with all supported keys
export interface Translations {
  // Navigation
  nav: {
    home: string;
    dashboard: string;
    rankings: string;
    events: string;
    downloads: string;
    news: string;
    admincp: string;
  };
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    seasonBadge: string;
    tagline: string;
    description: string;
    playNow: string;
    learnMore: string;
    downloadNow: string;
    viewEvents: string;
    onlinePlayers: string;
    totalAccounts: string;
    activeGuilds: string;
    expRate: string;
    dropRate: string;
    uptime: string;
  };
  // Server Status Widget
  serverStatus: {
    title: string;
    status: string;
    online: string;
    offline: string;
    players: string;
    uptime: string;
    experience: string;
    drop: string;
    aliveBosses: string;
  };
  // Rankings
  rankings: {
    title: string;
    topResets: string;
    topPK: string;
    topGuilds: string;
    rank: string;
    name: string;
    level: string;
    resets: string;
    kills: string;
    class: string;
    guildName: string;
    members: string;
    score: string;
    master: string;
  };
  // Events
  events: {
    title: string;
    subtitle: string;
    bloodCastle: string;
    chaosCastle: string;
    devilSquare: string;
    castleSiege: string;
    startsIn: string;
    inProgress: string;
    ended: string;
    happeningNow: string;
    everyXHours: string;
    saturdaysAt: string;
  };
  // Downloads
  downloads: {
    title: string;
    client: string;
    clientDesc: string;
    patch: string;
    patchDesc: string;
    download: string;
    size: string;
    version: string;
    // Novos campos para Downloads completo
    subtitle: string;
    fullClient: string;
    fullClientDesc: string;
    launcher: string;
    launcherDesc: string;
    directx: string;
    directxDesc: string;
    downloadButton: string;
    installationGuide: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    minimumReqs: string;
    recommendedReqs: string;
    downloadMirrors: string;
    needHelp: string;
    needHelpDesc: string;
    // Requisitos do sistema
    sysReqWindows7: string;
    sysReqWindows10: string;
    sysReqProcessor: string;
    sysReqProcessorDuo: string;
    sysReqProcessorI5: string;
    sysReqMemory: string;
    sysReqMemory2gb: string;
    sysReqMemory4gb: string;
    sysReqGraphics: string;
    sysReqGraphics512mb: string;
    sysReqGraphics1gb: string;
    sysReqDirectx: string;
    sysReqDirectxVersion: string;
    sysReqStorage: string;
    sysReqStorage3gb: string;
    sysReqStorage5gb: string;
  };
  // News Section ← NOVO!
  news: {
    title: string;
    subtitle: string;
    readMore: string;
    loadMore: string;
    by: string;
    publishedOn: string;
    latestNews: string;
    noNews: string;
    viewAllNews: string; // ← ADICIONAR ESTE
  };
  // Login/Register
  auth: {
    login: string;
    register: string;
    username: string;
    password: string;
    email: string;
    confirmPassword: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    loginButton: string;
    registerButton: string;
    logout: string;
    welcome: string;
    welcomeMessage: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    emailPlaceholder: string;
    confirmPasswordPlaceholder: string;
    loggingIn: string;
    registering: string;
    passwordMismatch: string;
    passwordTooShort: string;
    usernameTooShort: string;
  };
  // Dashboard
  dashboard: {
    welcome: string;
    welcomeBack: string;
    manageCharacters: string;
    characters: string;
    myAccount: string;
    addStats: string;
    resetSystem: string;
    cashShop: string;
    vipBenefits: string;
    lastCharacters: string;
    viewAllCharacters: string;
    createCharacter: string;
    selectCharacter: string;
    characterName: string;
    characterClass: string;
    resetCharacter: string;
    distributePoints: string;
    strength: string;
    agility: string;
    vitality: string;
    energy: string;
    command: string;
    availablePoints: string;
    apply: string;
    level: string;
    resets: string;
    lastLogin: string;
    location: string;
    selectCharacterFirst: string;
    noCharacters: string;
    characterList: string;
    total: string;
    accountInformation: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    updatePassword: string;
    updating: string;
    email: string;
    registeredOn: string;
    lastAccess: string;
    accountStatus: string;
    active: string;
    vipStatus: string;
    notVip: string;
    cashBalance: string;
    selectCharacterToDistribute: string;
    distributeStatsFor: string;
    pointsAvailable: string;
    totalDistributed: string;
    resetStats: string;
    resetting: string;
    applyPoints: string;
    applying: string;
    confirmResetStats: string;
    allPointsWillReturn: string;
    selectCharacterToReset: string;
    resetInformation: string;
    currentResets: string;
    requiredLevel: string;
    resetBonus: string;
    perReset: string;
    performReset: string;
    confirmReset: string;
    characterWillReturn: string;
    zenTransfer: string;
    transferZenBetweenChars: string;
    fromCharacter: string;
    toCharacter: string;
    amount: string;
    currentZen: string;
    transferZen: string;
    transferring: string;
    selectOriginAndDestination: string;
    passwordUpdatedSuccess: string;
    statsResetSuccess: string;
    pointsAppliedSuccess: string;
    resetPerformedSuccess: string;
    zenTransferredSuccess: string;
    errorUpdatingPassword: string;
    errorResettingStats: string;
    errorApplyingPoints: string;
    errorPerformingReset: string;
    errorTransferringZen: string;
    insufficientLevel: string;
    noPointsToDistribute: string;
    insufficientZen: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    search: string;
    filter: string;
    season: string;
  };
  // AdminCP
  admincp: {
    // Navigation
    dashboard: string;
    siteEditor: string;
    systemManagement: string;
    securityDashboard: string;
    logViewer: string;
    cronManager: string;
    pluginManager: string;
    diagnostics: string;
    backupManager: string;
    logout: string;
    
    // Site Editor
    visualEditor: string;
    visualEditorDesc: string;
    homeBanner: string;
    socialNetworks: string;
    appearance: string;
    settings: string;
    preview: string;
    
    // Home Banner
    bannerTitle: string;
    editBanner: string;
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    saveBanner: string;
    saving: string;
    
    // Social Networks
    socialLinks: string;
    configureSocial: string;
    discord: string;
    whatsapp: string;
    facebook: string;
    instagram: string;
    youtube: string;
    saveSocial: string;
    
    // Visual Customization
    visualCustomization: string;
    visualCustomizationDesc: string;
    backgroundSpecs: string;
    formatsAccepted: string;
    recommendedResolution: string;
    maxSize: string;
    aspectRatio: string;
    quality: string;
    tip: string;
    tipDarkImages: string;
    uploadBackground: string;
    backgroundPreview: string;
    previewYourBackground: string;
    saveBackground: string;
    cancel: string;
    customBackgroundActive: string;
    restoreDefault: string;
    particleColor: string;
    particlesFloating: string;
    defaultColor: string;
    saveColor: string;
    reset: string;
    note: string;
    noteMessage: string;
    
    // Settings
    generalSettings: string;
    configureBasicInfo: string;
    serverName: string;
    season: string;
    metaDescription: string;
    metaKeywords: string;
    googleAnalytics: string;
    maintenanceMode: string;
    maintenanceModeDesc: string;
    saveSettings: string;
    
    // Preview
    sitePreview: string;
    visualizeChanges: string;
    socialConfigured: string;
    siteSettings: string;
    server: string;
    maintenance: string;
    activated: string;
    deactivated: string;
    notConfigured: string;
    
    // Quick Actions
    quickActions: string;
    reload: string;
    reloadConfirm: string;
    viewLive: string;
    
    // Messages
    bannerUpdated: string;
    socialUpdated: string;
    settingsUpdated: string;
    errorLoading: string;
    errorSaving: string;
    backgroundSaved: string;
    backgroundRestored: string;
    colorSaved: string;
    colorRestored: string;
    invalidFormat: string;
    imageTooLarge: string;
    reloadPage: string;
  };
}

export const translations: Record<Language, Translations> = {
  'pt-BR': {
    nav: {
      home: 'Início',
      dashboard: 'Dashboard',
      rankings: 'Rankings',
      events: 'Eventos',
      downloads: 'Downloads',
      news: 'Notícias',
      admincp: 'AdminCP',
    },
    hero: {
      title: 'Bem-vindo ao MeuMU Online',
      subtitle: 'Servidor Season 19-2-3 Épico',
      seasonBadge: 'Season 19-2-3 - Épico',
      tagline: 'Entre na lenda. Domine os reinos. Torne-se imortal.',
      description: 'Experiência completa com rates balanceados, eventos épicos diários e uma comunidade ativa. Junte-se a milhares de jogadores!',
      playNow: 'Jogar Agora',
      learnMore: 'Saiba Mais',
      downloadNow: 'Baixar Agora',
      viewEvents: 'Ver Eventos',
      onlinePlayers: 'Jogadores Online',
      totalAccounts: 'Contas Totais',
      activeGuilds: 'Guildas Ativas',
      expRate: 'EXP Rate',
      dropRate: 'Drop Rate',
      uptime: 'Uptime',
    },
    serverStatus: {
      title: 'Status do Servidor',
      status: 'Status',
      online: 'Online',
      offline: 'Offline',
      players: 'Jogadores',
      uptime: 'Tempo Ativo',
      experience: 'Experiência',
      drop: 'Drop',
      aliveBosses: 'Bosses Vivos',
    },
    rankings: {
      title: 'Rankings',
      topResets: 'Top Resets',
      topPK: 'Top PK',
      topGuilds: 'Top Guildas',
      rank: 'Rank',
      name: 'Nome',
      level: 'Nível',
      resets: 'Resets',
      kills: 'Kills',
      class: 'Classe',
      guildName: 'Guilda',
      members: 'Membros',
      score: 'Pontos',
      master: 'Mestre',
    },
    events: {
      title: 'Eventos',
      subtitle: 'Cronograma de eventos em tempo real',
      bloodCastle: 'Blood Castle',
      chaosCastle: 'Chaos Castle',
      devilSquare: 'Devil Square',
      castleSiege: 'Castle Siege',
      startsIn: 'Começa em',
      inProgress: 'Em Andamento',
      ended: 'Finalizado',
      happeningNow: 'Acontecendo Agora!',
      everyXHours: 'A cada {hours} horas',
      saturdaysAt: 'Sábados {time}',
    },
    downloads: {
      title: 'Downloads',
      client: 'Cliente Completo',
      clientDesc: 'Baixe o cliente completo do jogo',
      patch: 'Patch de Atualização',
      patchDesc: 'Atualize seu cliente para a versão mais recente',
      download: 'Baixar',
      size: 'Tamanho',
      version: 'Versão',
      // Novos campos para Downloads completo
      subtitle: 'Baixe o cliente e comece sua jornada épica agora',
      fullClient: 'Cliente Completo',
      fullClientDesc: 'Download completo do cliente MeuMU Online Season 19-2-3 - Épico. Inclui todos os arquivos necessários.',
      launcher: 'Launcher',
      launcherDesc: 'Launcher automático que mantém seu cliente sempre atualizado.',
      directx: 'Drivers DirectX',
      directxDesc: 'Pacote de drivers necessários para rodar o jogo sem problemas.',
      downloadButton: 'Baixar',
      installationGuide: 'Guia de Instalação',
      step1Title: 'Baixe o Cliente',
      step1Desc: 'Faça o download do cliente completo (2.5 GB)',
      step2Title: 'Extraia os Arquivos',
      step2Desc: 'Descompacte o arquivo baixado em uma pasta de sua preferência',
      step3Title: 'Instale os Drivers',
      step3Desc: 'Execute o instalador do DirectX 9.0c se necessário',
      step4Title: 'Execute o Launcher',
      step4Desc: 'Abra o launcher e aguarde as atualizações',
      step5Title: 'Jogue!',
      step5Desc: 'Crie sua conta e comece sua aventura épica',
      minimumReqs: 'Requisitos Mínimos',
      recommendedReqs: 'Requisitos Recomendados',
      downloadMirrors: 'Mirrors de Download',
      needHelp: 'Precisa de Ajuda?',
      needHelpDesc: 'Se você tiver problemas durante a instalação, nossa equipe de suporte está pronta para ajudar!',
      // Requisitos do sistema
      sysReqWindows7: 'Windows 7 ou superior',
      sysReqWindows10: 'Windows 10/11',
      sysReqProcessor: 'Processador',
      sysReqProcessorDuo: 'Processador: Intel Core 2 Duo',
      sysReqProcessorI5: 'Processador: Intel Core i5',
      sysReqMemory: 'Memória',
      sysReqMemory2gb: 'Memória: 2 GB RAM',
      sysReqMemory4gb: 'Memória: 4 GB RAM',
      sysReqGraphics: 'Placa de vídeo',
      sysReqGraphics512mb: 'Placa de vídeo: 512 MB',
      sysReqGraphics1gb: 'Placa de vídeo: 1 GB',
      sysReqDirectx: 'DirectX',
      sysReqDirectxVersion: 'DirectX: Versão 9.0c',
      sysReqStorage: 'Armazenamento',
      sysReqStorage3gb: 'Armazenamento: 3 GB',
      sysReqStorage5gb: 'Armazenamento: 5 GB',
    },
    news: {
      title: 'Notícias',
      subtitle: 'Fique por dentro de todas as atualizações, eventos e novidades do MeuMU Online',
      readMore: 'Ler Mais',
      loadMore: 'Carregar Mais Notícias',
      by: 'Por',
      publishedOn: 'Publicado em',
      latestNews: 'Últimas Notícias',
      noNews: 'Nenhuma notícia disponível no momento.',
      viewAllNews: 'Ver Todas as Notícias',
    },
    auth: {
      login: 'Entrar',
      register: 'Registrar',
      username: 'Usuário',
      password: 'Senha',
      email: 'E-mail',
      confirmPassword: 'Confirmar Senha',
      forgotPassword: 'Esqueceu a senha?',
      noAccount: 'Não tem uma conta?',
      hasAccount: 'Já tem uma conta?',
      loginButton: 'Entrar',
      registerButton: 'Criar Conta',
      logout: 'Sair',
      welcome: 'Bem-vindo',
      welcomeMessage: 'Bem-vindo ao MeuMU Online',
      usernamePlaceholder: 'Digite seu nome de usuário',
      passwordPlaceholder: 'Digite sua senha',
      emailPlaceholder: 'Digite seu e-mail',
      confirmPasswordPlaceholder: 'Confirme sua senha',
      loggingIn: 'Entrando...',
      registering: 'Registrando...',
      passwordMismatch: 'As senhas não coincidem',
      passwordTooShort: 'A senha deve ter pelo menos 6 caracteres',
      usernameTooShort: 'O nome de usuário deve ter pelo menos 3 caracteres',
    },
    dashboard: dashboardTranslations['pt-BR'],
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      close: 'Fechar',
      search: 'Buscar',
      filter: 'Filtrar',
      season: 'Season 19-2-3 Epic Server',
    },
    admincp: {
      // Navigation
      dashboard: 'Painel',
      siteEditor: 'Editor de Site',
      systemManagement: 'Gerenciamento',
      securityDashboard: 'Segurança',
      logViewer: 'Logs',
      cronManager: 'Tarefas Agendadas',
      pluginManager: 'Plugins',
      diagnostics: 'Diagnósticos',
      backupManager: 'Backups',
      logout: 'Sair',
      
      // Site Editor
      visualEditor: 'Editor Visual do Site',
      visualEditorDesc: 'Personalize a aparência e conteúdo do site sem mexer no código',
      homeBanner: 'Home Banner',
      socialNetworks: 'Redes Sociais',
      appearance: 'Aparência',
      settings: 'Configurações',
      preview: 'Preview',
      
      // Home Banner
      bannerTitle: 'Banner Principal',
      editBanner: 'Edite o banner exibido na página inicial',
      title: 'Título',
      subtitle: 'Subtítulo',
      description: 'Descrição',
      buttonText: 'Texto do Botão',
      buttonLink: 'Link do Botão',
      saveBanner: 'Salvar Banner',
      saving: 'Salvando...',
      
      // Social Networks
      socialLinks: 'Redes Sociais',
      configureSocial: 'Configure os links das redes sociais exibidos no site',
      discord: 'Discord',
      whatsapp: 'WhatsApp',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
      saveSocial: 'Salvar Redes Sociais',
      
      // Visual Customization
      visualCustomization: 'Personalização Visual Global',
      visualCustomizationDesc: '🎨 Personalize background e partículas do site (apenas para Administradores)',
      backgroundSpecs: '📸 Especificações da Imagem de Background:',
      formatsAccepted: 'Formatos aceitos: JPG, PNG, WebP',
      recommendedResolution: 'Resolução recomendada: 1920x1080px (Full HD) ou superior',
      maxSize: 'Tamanho máximo: 5MB',
      aspectRatio: 'Proporção: 16:9 (widescreen) - ideal para telas modernas',
      quality: 'Qualidade: 80-90% (equilíbrio entre qualidade e tamanho)',
      tip: 'Dica:',
      tipDarkImages: 'Use imagens escuras para melhor contraste com o texto',
      uploadBackground: 'Upload de Background Customizado',
      backgroundPreview: 'Preview do Background:',
      previewYourBackground: 'Preview - Seu novo background',
      saveBackground: 'Salvar Background',
      cancel: 'Cancelar',
      customBackgroundActive: 'Background customizado ativo',
      restoreDefault: 'Restaurar Background Padrão',
      particleColor: 'Cor das Partículas',
      particlesFloating: 'Cor das Partículas Flutuantes',
      defaultColor: '💡 Cor padrão: #FFB800 (Dourado Épico)',
      saveColor: 'Salvar Cor das Partículas',
      reset: 'Resetar',
      note: 'Nota:',
      noteMessage: 'As alterações serão salvas no localStorage do navegador. Para ver as mudanças aplicadas, recarregue a página após salvar.',
      
      // Settings
      generalSettings: 'Configurações Gerais',
      configureBasicInfo: 'Configure informações básicas do site e SEO',
      serverName: 'Nome do Servidor',
      season: 'Season',
      metaDescription: 'Meta Description (SEO)',
      metaKeywords: 'Meta Keywords (SEO)',
      googleAnalytics: 'Google Analytics ID',
      maintenanceMode: 'Modo Manutenção',
      maintenanceModeDesc: 'Desativa o site temporariamente (apenas admin pode acessar)',
      saveSettings: 'Salvar Configurações',
      
      // Preview
      sitePreview: 'Preview do Site',
      visualizeChanges: 'Visualize como ficará o site com as alterações',
      socialConfigured: 'Redes Sociais Configuradas:',
      siteSettings: 'Configurações do Site:',
      server: 'Servidor:',
      maintenance: 'Modo Manutenção:',
      activated: 'Ativado',
      deactivated: 'Desativado',
      notConfigured: 'Não configurado',
      
      // Quick Actions
      quickActions: 'Ações Rápidas',
      reload: 'Recarregar',
      reloadConfirm: 'Recarregar configurações? Alterações não salvas serão perdidas.',
      viewLive: 'Ver Site ao Vivo',
      
      // Messages
      bannerUpdated: 'Banner da home atualizado com sucesso!',
      socialUpdated: 'Links de redes sociais atualizados!',
      settingsUpdated: 'Configurações do site atualizadas!',
      errorLoading: 'Erro ao carregar configurações',
      errorSaving: 'Erro ao salvar',
      backgroundSaved: '✅ Background salvo com sucesso! Recarregue a página para ver as mudanças.',
      backgroundRestored: '✅ Background padrão restaurado! Recarregue a página para ver as mudanças.',
      colorSaved: '✅ Cor das partículas salva! Recarregue a página para ver as mudanças.',
      colorRestored: '✅ Cor padrão restaurada! Recarregue a página para ver as mudanças.',
      invalidFormat: '❌ Formato inválido! Use apenas JPG, PNG ou WebP',
      imageTooLarge: '❌ Imagem muito grande! Tamanho máximo: 5MB',
      reloadPage: 'Recarregue a página para ver as mudanças',
    },
  },
  en: {
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      rankings: 'Rankings',
      events: 'Events',
      downloads: 'Downloads',
      news: 'News',
      admincp: 'AdminCP',
    },
    hero: {
      title: 'Welcome to MeuMU Online',
      subtitle: 'Season 19-2-3 Epic Server',
      seasonBadge: 'Season 19-2-3 - Epic',
      tagline: 'Enter the legend. Dominate the realms. Become immortal.',
      description: 'Complete experience with balanced rates, daily epic events and an active community. Join thousands of players!',
      playNow: 'Play Now',
      learnMore: 'Learn More',
      downloadNow: 'Download Now',
      viewEvents: 'View Events',
      onlinePlayers: 'Online Players',
      totalAccounts: 'Total Accounts',
      activeGuilds: 'Active Guilds',
      expRate: 'EXP Rate',
      dropRate: 'Drop Rate',
      uptime: 'Uptime',
    },
    serverStatus: {
      title: 'Server Status',
      status: 'Status',
      online: 'Online',
      offline: 'Offline',
      players: 'Players',
      uptime: 'Uptime',
      experience: 'Experience',
      drop: 'Drop',
      aliveBosses: 'Alive Bosses',
    },
    rankings: {
      title: 'Rankings',
      topResets: 'Top Resets',
      topPK: 'Top PK',
      topGuilds: 'Top Guilds',
      rank: 'Rank',
      name: 'Name',
      level: 'Level',
      resets: 'Resets',
      kills: 'Kills',
      class: 'Class',
      guildName: 'Guild',
      members: 'Members',
      score: 'Score',
      master: 'Master',
    },
    events: {
      title: 'Events',
      subtitle: 'Real-time event schedule',
      bloodCastle: 'Blood Castle',
      chaosCastle: 'Chaos Castle',
      devilSquare: 'Devil Square',
      castleSiege: 'Castle Siege',
      startsIn: 'Starts in',
      inProgress: 'In Progress',
      ended: 'Ended',
      happeningNow: 'Happening Now!',
      everyXHours: 'Every {hours} hours',
      saturdaysAt: 'Saturdays {time}',
    },
    downloads: {
      title: 'Downloads',
      client: 'Full Client',
      clientDesc: 'Download the complete game client',
      patch: 'Update Patch',
      patchDesc: 'Update your client to the latest version',
      download: 'Download',
      size: 'Size',
      version: 'Version',
      // Novos campos para Downloads completo
      subtitle: 'Download the client and start your epic journey now',
      fullClient: 'Full Client',
      fullClientDesc: 'Complete download of MeuMU Online Season 19-2-3 - Epic client. Includes all necessary files.',
      launcher: 'Launcher',
      launcherDesc: 'Automatic launcher that keeps your client always updated.',
      directx: 'DirectX Drivers',
      directxDesc: 'Driver package needed to run the game smoothly.',
      downloadButton: 'Download',
      installationGuide: 'Installation Guide',
      step1Title: 'Download the Client',
      step1Desc: 'Download the full client (2.5 GB)',
      step2Title: 'Extract the Files',
      step2Desc: 'Unzip the downloaded file to a folder of your choice',
      step3Title: 'Install the Drivers',
      step3Desc: 'Run the DirectX 9.0c installer if necessary',
      step4Title: 'Run the Launcher',
      step4Desc: 'Open the launcher and wait for updates',
      step5Title: 'Play!',
      step5Desc: 'Create your account and start your epic adventure',
      minimumReqs: 'Minimum Requirements',
      recommendedReqs: 'Recommended Requirements',
      downloadMirrors: 'Download Mirrors',
      needHelp: 'Need Help?',
      needHelpDesc: 'If you have problems during installation, our support team is ready to help!',
      // Requisitos do sistema
      sysReqWindows7: 'Windows 7 or higher',
      sysReqWindows10: 'Windows 10/11',
      sysReqProcessor: 'Processor',
      sysReqProcessorDuo: 'Processor: Intel Core 2 Duo',
      sysReqProcessorI5: 'Processor: Intel Core i5',
      sysReqMemory: 'Memory',
      sysReqMemory2gb: 'Memory: 2 GB RAM',
      sysReqMemory4gb: 'Memory: 4 GB RAM',
      sysReqGraphics: 'Graphics card',
      sysReqGraphics512mb: 'Graphics card: 512 MB',
      sysReqGraphics1gb: 'Graphics card: 1 GB',
      sysReqDirectx: 'DirectX',
      sysReqDirectxVersion: 'DirectX: Version 9.0c',
      sysReqStorage: 'Storage',
      sysReqStorage3gb: 'Storage: 3 GB',
      sysReqStorage5gb: 'Storage: 5 GB',
    },
    news: {
      title: 'News',
      subtitle: 'Stay up to date with all updates, events and news from MeuMU Online',
      readMore: 'Read More',
      loadMore: 'Load More News',
      by: 'By',
      publishedOn: 'Published on',
      latestNews: 'Latest News',
      noNews: 'No news available at the moment.',
      viewAllNews: 'View All News',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      email: 'Email',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      loginButton: 'Sign In',
      registerButton: 'Create Account',
      logout: 'Logout',
      welcome: 'Welcome',
      welcomeMessage: 'Welcome to MeuMU Online',
      usernamePlaceholder: 'Enter your username',
      passwordPlaceholder: 'Enter your password',
      emailPlaceholder: 'Enter your email',
      confirmPasswordPlaceholder: 'Confirm your password',
      loggingIn: 'Logging in...',
      registering: 'Registering...',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters long',
      usernameTooShort: 'Username must be at least 3 characters long',
    },
    dashboard: dashboardTranslations.en,
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      search: 'Search',
      filter: 'Filter',
      season: 'Season 19-2-3 Epic Server',
    },
    admincp: {
      // Navigation
      dashboard: 'Dashboard',
      siteEditor: 'Site Editor',
      systemManagement: 'Management',
      securityDashboard: 'Security',
      logViewer: 'Logs',
      cronManager: 'Scheduled Tasks',
      pluginManager: 'Plugins',
      diagnostics: 'Diagnostics',
      backupManager: 'Backups',
      logout: 'Logout',
      
      // Site Editor
      visualEditor: 'Visual Site Editor',
      visualEditorDesc: 'Customize the appearance and content of the site without touching the code',
      homeBanner: 'Home Banner',
      socialNetworks: 'Social Networks',
      appearance: 'Appearance',
      settings: 'Settings',
      preview: 'Preview',
      
      // Home Banner
      bannerTitle: 'Main Banner',
      editBanner: 'Edit the banner displayed on the home page',
      title: 'Title',
      subtitle: 'Subtitle',
      description: 'Description',
      buttonText: 'Button Text',
      buttonLink: 'Button Link',
      saveBanner: 'Save Banner',
      saving: 'Saving...',
      
      // Social Networks
      socialLinks: 'Social Networks',
      configureSocial: 'Configure the social media links displayed on the site',
      discord: 'Discord',
      whatsapp: 'WhatsApp',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
      saveSocial: 'Save Social Networks',
      
      // Visual Customization
      visualCustomization: 'Global Visual Customization',
      visualCustomizationDesc: '🎨 Customize background and particles of the site (Administrators only)',
      backgroundSpecs: '📸 Background Image Specifications:',
      formatsAccepted: 'Accepted formats: JPG, PNG, WebP',
      recommendedResolution: 'Recommended resolution: 1920x1080px (Full HD) or higher',
      maxSize: 'Maximum size: 5MB',
      aspectRatio: 'Aspect ratio: 16:9 (widescreen) - ideal for modern screens',
      quality: 'Quality: 80-90% (balance between quality and size)',
      tip: 'Tip:',
      tipDarkImages: 'Use dark images for better contrast with text',
      uploadBackground: 'Custom Background Upload',
      backgroundPreview: 'Background Preview:',
      previewYourBackground: 'Preview - Your new background',
      saveBackground: 'Save Background',
      cancel: 'Cancel',
      customBackgroundActive: 'Custom background active',
      restoreDefault: 'Restore Default Background',
      particleColor: 'Particle Color',
      particlesFloating: 'Floating Particle Color',
      defaultColor: '💡 Default color: #FFB800 (Epic Gold)',
      saveColor: 'Save Particle Color',
      reset: 'Reset',
      note: 'Note:',
      noteMessage: 'Changes will be saved to browser localStorage. To see the applied changes, reload the page after saving.',
      
      // Settings
      generalSettings: 'General Settings',
      configureBasicInfo: 'Configure basic site information and SEO',
      serverName: 'Server Name',
      season: 'Season',
      metaDescription: 'Meta Description (SEO)',
      metaKeywords: 'Meta Keywords (SEO)',
      googleAnalytics: 'Google Analytics ID',
      maintenanceMode: 'Maintenance Mode',
      maintenanceModeDesc: 'Temporarily disables the site (only admin can access)',
      saveSettings: 'Save Settings',
      
      // Preview
      sitePreview: 'Site Preview',
      visualizeChanges: 'Visualize how the site will look with the changes',
      socialConfigured: 'Configured Social Networks:',
      siteSettings: 'Site Settings:',
      server: 'Server:',
      maintenance: 'Maintenance Mode:',
      activated: 'Activated',
      deactivated: 'Deactivated',
      notConfigured: 'Not configured',
      
      // Quick Actions
      quickActions: 'Quick Actions',
      reload: 'Reload',
      reloadConfirm: 'Reload settings? Unsaved changes will be lost.',
      viewLive: 'View Live Site',
      
      // Messages
      bannerUpdated: 'Home banner updated successfully!',
      socialUpdated: 'Social media links updated!',
      settingsUpdated: 'Site settings updated!',
      errorLoading: 'Error loading settings',
      errorSaving: 'Error saving',
      backgroundSaved: '✅ Background saved successfully! Reload the page to see the changes.',
      backgroundRestored: '✅ Default background restored! Reload the page to see the changes.',
      colorSaved: '✅ Particle color saved! Reload the page to see the changes.',
      colorRestored: '✅ Default color restored! Reload the page to see the changes.',
      invalidFormat: '❌ Invalid format! Use only JPG, PNG or WebP',
      imageTooLarge: '❌ Image too large! Maximum size: 5MB',
      reloadPage: 'Reload the page to see the changes',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      dashboard: 'Panel',
      rankings: 'Rankings',
      events: 'Eventos',
      downloads: 'Descargas',
      news: 'Noticias',
      admincp: 'AdminCP',
    },
    hero: {
      title: 'Bienvenido a MeuMU Online',
      subtitle: 'Servidor Season 19-2-3 Épico',
      seasonBadge: 'Season 19-2-3 - Épico',
      tagline: 'Entra en la leyenda. Domina los reinos. Hazte inmortal.',
      description: 'Experiencia completa con tasas equilibradas, eventos épicos diarios y una comunidad activa. ¡Únete a miles de jugadores!',
      playNow: 'Jugar Ahora',
      learnMore: 'Saber Más',
      downloadNow: 'Descargar Ahora',
      viewEvents: 'Ver Eventos',
      onlinePlayers: 'Jugadores en Línea',
      totalAccounts: 'Cuentas Totales',
      activeGuilds: 'Gremios Activos',
      expRate: 'Tasa EXP',
      dropRate: 'Tasa Drop',
      uptime: 'Tiempo Activo',
    },
    serverStatus: {
      title: 'Estado del Servidor',
      status: 'Estado',
      online: 'En Línea',
      offline: 'Desconectado',
      players: 'Jugadores',
      uptime: 'Tiempo Activo',
      experience: 'Experiencia',
      drop: 'Drop',
      aliveBosses: 'Jefes Vivos',
    },
    rankings: {
      title: 'Rankings',
      topResets: 'Top Resets',
      topPK: 'Top PK',
      topGuilds: 'Top Gremios',
      rank: 'Rango',
      name: 'Nombre',
      level: 'Nivel',
      resets: 'Resets',
      kills: 'Kills',
      class: 'Clase',
      guildName: 'Gremio',
      members: 'Miembros',
      score: 'Puntos',
      master: 'Maestro',
    },
    events: {
      title: 'Eventos',
      subtitle: 'Cronograma de eventos en tiempo real',
      bloodCastle: 'Blood Castle',
      chaosCastle: 'Chaos Castle',
      devilSquare: 'Devil Square',
      castleSiege: 'Castle Siege',
      startsIn: 'Comienza en',
      inProgress: 'En Progreso',
      ended: 'Finalizado',
      happeningNow: '¡Sucediendo Ahora!',
      everyXHours: 'Cada {hours} horas',
      saturdaysAt: 'Sábados {time}',
    },
    downloads: {
      title: 'Descargas',
      client: 'Cliente Completo',
      clientDesc: 'Descarga el cliente completo del juego',
      patch: 'Parche de Actualización',
      patchDesc: 'Actualiza tu cliente a la última versión',
      download: 'Descargar',
      size: 'Tamaño',
      version: 'Versión',
      subtitle: 'Descarga el cliente y comienza tu viaje épico ahora',
      fullClient: 'Cliente Completo',
      fullClientDesc: 'Descarga completa del cliente MeuMU Online Season 19-2-3 - Épico. Incluye todos los archivos necesarios.',
      launcher: 'Launcher',
      launcherDesc: 'Launcher automático que mantiene tu cliente siempre actualizado.',
      directx: 'Drivers DirectX',
      directxDesc: 'Paquete de drivers necesarios para ejecutar el juego sin problemas.',
      downloadButton: 'Descargar',
      installationGuide: 'Guía de Instalación',
      step1Title: 'Descarga el Cliente',
      step1Desc: 'Descarga el cliente completo (2.5 GB)',
      step2Title: 'Extrae los Archivos',
      step2Desc: 'Descomprime el archivo descargado en una carpeta de tu preferencia',
      step3Title: 'Instala los Drivers',
      step3Desc: 'Ejecuta el instalador de DirectX 9.0c si es necesario',
      step4Title: 'Ejecuta el Launcher',
      step4Desc: 'Abre el launcher y espera las actualizaciones',
      step5Title: '¡Juega!',
      step5Desc: 'Crea tu cuenta y comienza tu aventura épica',
      minimumReqs: 'Requisitos Mínimos',
      recommendedReqs: 'Requisitos Recomendados',
      downloadMirrors: 'Mirrors de Descarga',
      needHelp: '¿Necesitas Ayuda?',
      needHelpDesc: '¡Si tienes problemas durante la instalación, nuestro equipo de soporte está listo para ayudar!',
      sysReqWindows7: 'Windows 7 o superior',
      sysReqWindows10: 'Windows 10/11',
      sysReqProcessor: 'Procesador',
      sysReqProcessorDuo: 'Procesador: Intel Core 2 Duo',
      sysReqProcessorI5: 'Procesador: Intel Core i5',
      sysReqMemory: 'Memoria',
      sysReqMemory2gb: 'Memoria: 2 GB RAM',
      sysReqMemory4gb: 'Memoria: 4 GB RAM',
      sysReqGraphics: 'Tarjeta gráfica',
      sysReqGraphics512mb: 'Tarjeta gráfica: 512 MB',
      sysReqGraphics1gb: 'Tarjeta gráfica: 1 GB',
      sysReqDirectx: 'DirectX',
      sysReqDirectxVersion: 'DirectX: Versión 9.0c',
      sysReqStorage: 'Almacenamiento',
      sysReqStorage3gb: 'Almacenamiento: 3 GB',
      sysReqStorage5gb: 'Almacenamiento: 5 GB',
    },
    news: {
      title: 'Noticias',
      subtitle: 'Mantente al día con todas las actualizaciones, eventos y noticias de MeuMU Online',
      readMore: 'Leer Más',
      loadMore: 'Cargar Más Noticias',
      by: 'Por',
      publishedOn: 'Publicado el',
      latestNews: 'Últimas Noticias',
      noNews: 'No hay noticias disponibles en este momento.',
      viewAllNews: 'Ver Todas las Noticias',
    },
    auth: {
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      username: 'Usuario',
      password: 'Contraseña',
      email: 'Correo',
      confirmPassword: 'Confirmar Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes cuenta?',
      hasAccount: '¿Ya tienes cuenta?',
      loginButton: 'Entrar',
      registerButton: 'Crear Cuenta',
      logout: 'Salir',
      welcome: 'Bienvenido',
      welcomeMessage: 'Bienvenido a MeuMU Online',
      usernamePlaceholder: 'Ingresa tu nombre de usuario',
      passwordPlaceholder: 'Ingresa tu contraseña',
      emailPlaceholder: 'Ingresa tu correo',
      confirmPasswordPlaceholder: 'Confirma tu contraseña',
      loggingIn: 'Iniciando sesión...',
      registering: 'Registrando...',
      passwordMismatch: 'Las contraseñas no coinciden',
      passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
      usernameTooShort: 'El nombre de usuario debe tener al menos 3 caracteres',
    },
    dashboard: dashboardTranslations.es,
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      search: 'Buscar',
      filter: 'Filtrar',
      season: 'Season 19-2-3 Servidor Épico',
    },
    admincp: admincpTranslations.es,
  },
  de: {
    nav: {
      home: 'Startseite',
      dashboard: 'Dashboard',
      rankings: 'Ranglisten',
      events: 'Events',
      downloads: 'Downloads',
      news: 'Neuigkeiten',
      admincp: 'AdminCP',
    },
    hero: {
      title: 'Willkommen bei MeuMU Online',
      subtitle: 'Season 19-2-3 Epic Server',
      seasonBadge: 'Season 19-2-3 - Episch',
      tagline: 'Tritt in die Legende ein. Beherrsche die Reiche. Werde unsterblich.',
      description: 'Vollständiges Erlebnis mit ausgewogenen Raten, täglichen epischen Events und einer aktiven Community. Schließe dich Tausenden von Spielern an!',
      playNow: 'Jetzt Spielen',
      learnMore: 'Mehr Erfahren',
      downloadNow: 'Jetzt Herunterladen',
      viewEvents: 'Events Ansehen',
      onlinePlayers: 'Online Spieler',
      totalAccounts: 'Gesamte Konten',
      activeGuilds: 'Aktive Gilden',
      expRate: 'EXP Rate',
      dropRate: 'Drop Rate',
      uptime: 'Betriebszeit',
    },
    serverStatus: {
      title: 'Serverstatus',
      status: 'Status',
      online: 'Online',
      offline: 'Offline',
      players: 'Spieler',
      uptime: 'Laufzeit',
      experience: 'Erfahrung',
      drop: 'Drop',
      aliveBosses: 'Lebende Bosse',
    },
    rankings: {
      title: 'Ranglisten',
      topResets: 'Top Resets',
      topPK: 'Top PK',
      topGuilds: 'Top Gilden',
      rank: 'Rang',
      name: 'Name',
      level: 'Level',
      resets: 'Resets',
      kills: 'Kills',
      class: 'Klasse',
      guildName: 'Gilde',
      members: 'Mitglieder',
      score: 'Punkte',
      master: 'Meister',
    },
    events: {
      title: 'Events',
      subtitle: 'Echtzeit-Event-Zeitplan',
      bloodCastle: 'Blood Castle',
      chaosCastle: 'Chaos Castle',
      devilSquare: 'Devil Square',
      castleSiege: 'Castle Siege',
      startsIn: 'Startet in',
      inProgress: 'Im Gange',
      ended: 'Beendet',
      happeningNow: 'Geschieht Jetzt!',
      everyXHours: 'Alle {hours} Stunden',
      saturdaysAt: 'Samstags {time}',
    },
    downloads: {
      title: 'Downloads',
      client: 'Vollständiger Client',
      clientDesc: 'Laden Sie den vollständigen Spiel-Client herunter',
      patch: 'Update-Patch',
      patchDesc: 'Aktualisieren Sie Ihren Client auf die neueste Version',
      download: 'Herunterladen',
      size: 'Größe',
      version: 'Version',
      subtitle: 'Laden Sie den Client herunter und starten Sie jetzt Ihre epische Reise',
      fullClient: 'Vollständiger Client',
      fullClientDesc: 'Vollständiger Download des MeuMU Online Season 19-2-3 - Epic Client. Enthält alle erforderlichen Dateien.',
      launcher: 'Launcher',
      launcherDesc: 'Automatischer Launcher, der Ihren Client immer auf dem neuesten Stand hält.',
      directx: 'DirectX Treiber',
      directxDesc: 'Treiberpaket, das zum reibungslosen Ausführen des Spiels erforderlich ist.',
      downloadButton: 'Herunterladen',
      installationGuide: 'Installationsanleitung',
      step1Title: 'Client herunterladen',
      step1Desc: 'Laden Sie den vollständigen Client herunter (2.5 GB)',
      step2Title: 'Dateien extrahieren',
      step2Desc: 'Entpacken Sie die heruntergeladene Datei in einen Ordner Ihrer Wahl',
      step3Title: 'Treiber installieren',
      step3Desc: 'Führen Sie bei Bedarf das DirectX 9.0c-Installationsprogramm aus',
      step4Title: 'Launcher ausführen',
      step4Desc: 'Öffnen Sie den Launcher und warten Sie auf Updates',
      step5Title: 'Spielen!',
      step5Desc: 'Erstellen Sie Ihr Konto und beginnen Sie Ihr episches Abenteuer',
      minimumReqs: 'Mindestanforderungen',
      recommendedReqs: 'Empfohlene Anforderungen',
      downloadMirrors: 'Download-Spiegel',
      needHelp: 'Brauchen Sie Hilfe?',
      needHelpDesc: 'Wenn Sie während der Installation Probleme haben, ist unser Support-Team bereit zu helfen!',
      sysReqWindows7: 'Windows 7 oder höher',
      sysReqWindows10: 'Windows 10/11',
      sysReqProcessor: 'Prozessor',
      sysReqProcessorDuo: 'Prozessor: Intel Core 2 Duo',
      sysReqProcessorI5: 'Prozessor: Intel Core i5',
      sysReqMemory: 'Speicher',
      sysReqMemory2gb: 'Speicher: 2 GB RAM',
      sysReqMemory4gb: 'Speicher: 4 GB RAM',
      sysReqGraphics: 'Grafikkarte',
      sysReqGraphics512mb: 'Grafikkarte: 512 MB',
      sysReqGraphics1gb: 'Grafikkarte: 1 GB',
      sysReqDirectx: 'DirectX',
      sysReqDirectxVersion: 'DirectX: Version 9.0c',
      sysReqStorage: 'Speicherplatz',
      sysReqStorage3gb: 'Speicherplatz: 3 GB',
      sysReqStorage5gb: 'Speicherplatz: 5 GB',
    },
    news: {
      title: 'Neuigkeiten',
      subtitle: 'Bleiben Sie auf dem Laufenden über alle Updates, Events und Neuigkeiten von MeuMU Online',
      readMore: 'Mehr Lesen',
      loadMore: 'Mehr Nachrichten Laden',
      by: 'Von',
      publishedOn: 'Veröffentlicht am',
      latestNews: 'Neueste Nachrichten',
      noNews: 'Derzeit keine Nachrichten verfügbar.',
      viewAllNews: 'Alle Nachrichten anzeigen',
    },
    auth: {
      login: 'Anmelden',
      register: 'Registrieren',
      username: 'Benutzername',
      password: 'Passwort',
      email: 'E-Mail',
      confirmPassword: 'Passwort Bestätigen',
      forgotPassword: 'Passwort vergessen?',
      noAccount: 'Kein Konto?',
      hasAccount: 'Bereits ein Konto?',
      loginButton: 'Einloggen',
      registerButton: 'Konto Erstellen',
      logout: 'Abmelden',
      welcome: 'Willkommen',
      welcomeMessage: 'Willkommen bei MeuMU Online',
      usernamePlaceholder: 'Geben Sie Ihren Benutzernamen ein',
      passwordPlaceholder: 'Geben Sie Ihr Passwort ein',
      emailPlaceholder: 'Geben Sie Ihre E-Mail ein',
      confirmPasswordPlaceholder: 'Bestätigen Sie Ihr Passwort',
      loggingIn: 'Anmelden...',
      registering: 'Registrieren...',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      passwordTooShort: 'Das Passwort muss mindestens 6 Zeichen lang sein',
      usernameTooShort: 'Der Benutzername muss mindestens 3 Zeichen lang sein',
    },
    dashboard: dashboardTranslations.de,
    common: {
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      close: 'Schließen',
      search: 'Suchen',
      filter: 'Filter',
      season: 'Season 19-2-3 Epic Server',
    },
    admincp: admincpTranslations.de,
  },
  zh: {
    nav: {
      home: '首页',
      dashboard: '仪表板',
      rankings: '排行榜',
      events: '活动',
      downloads: '下载',
      news: '新闻',
      admincp: '管理面板',
    },
    hero: {
      title: '欢迎来到 MeuMU Online',
      subtitle: 'Season 19-2-3 史诗服务器',
      seasonBadge: 'Season 19-2-3 - 史诗',
      tagline: '进入传奇。统治王国。成为不朽。',
      description: '完整的游戏体验，平衡的倍率，每日史诗活动和活跃的社区。加入成千上万的玩家！',
      playNow: '立即游戏',
      learnMore: '了解更多',
      downloadNow: '立即下载',
      viewEvents: '查看活动',
      onlinePlayers: '在线玩家',
      totalAccounts: '总账户数',
      activeGuilds: '活跃公会',
      expRate: '经验倍率',
      dropRate: '掉落倍率',
      uptime: '运行时间',
    },
    serverStatus: {
      title: '服务器状态',
      status: '状态',
      online: '在线',
      offline: '离线',
      players: '玩家',
      uptime: '运行时间',
      experience: '经验',
      drop: '掉落',
      aliveBosses: '存活Boss',
    },
    rankings: {
      title: '排行榜',
      topResets: '重置榜',
      topPK: 'PK榜',
      topGuilds: '公会榜',
      rank: '排名',
      name: '名字',
      level: '等级',
      resets: '重置',
      kills: '击杀',
      class: '职业',
      guildName: '公会',
      members: '成员',
      score: '分数',
      master: '会长',
    },
    events: {
      title: '活动',
      subtitle: '实时活动时间表',
      bloodCastle: '血色城堡',
      chaosCastle: '混沌城堡',
      devilSquare: '恶魔广场',
      castleSiege: '攻城战',
      startsIn: '开始于',
      inProgress: '进行中',
      ended: '已结束',
      happeningNow: '正在进行！',
      everyXHours: '每 {hours} 小时',
      saturdaysAt: '星期六 {time}',
    },
    downloads: {
      title: '下载',
      client: '完整客户端',
      clientDesc: '下载完整游戏客户端',
      patch: '更新补丁',
      patchDesc: '将客户端更新到最新版本',
      download: '下载',
      size: '大小',
      version: '版本',
      subtitle: '下载客户端，立即开始您的史诗之旅',
      fullClient: '完整客户端',
      fullClientDesc: 'MeuMU Online Season 19-2-3 - Epic客户端的完整下载。包含所有必需文件。',
      launcher: '启动器',
      launcherDesc: '自动启动器，使您的客户端始终保持最新状态。',
      directx: 'DirectX 驱动程序',
      directxDesc: '运行游戏所需的驱动程序包。',
      downloadButton: '下载',
      installationGuide: '安装指南',
      step1Title: '下载客户端',
      step1Desc: '下载完整客户端（2.5 GB）',
      step2Title: '解压文件',
      step2Desc: '将下载的文件解压到您选择的文件夹',
      step3Title: '安装驱动程序',
      step3Desc: '如有必要，运行DirectX 9.0c安装程序',
      step4Title: '运行启动器',
      step4Desc: '打开启动器并等待更新',
      step5Title: '开始游戏！',
      step5Desc: '创建您的账户并开始您的史诗冒险',
      minimumReqs: '最低要求',
      recommendedReqs: '推荐要求',
      downloadMirrors: '下载镜像',
      needHelp: '需要帮助？',
      needHelpDesc: '如果您在安装过程中遇到问题，我们的支持团队随时准备帮助您！',
      sysReqWindows7: 'Windows 7 或更高版本',
      sysReqWindows10: 'Windows 10/11',
      sysReqProcessor: '处理器',
      sysReqProcessorDuo: '处理器：Intel Core 2 Duo',
      sysReqProcessorI5: '处理器：Intel Core i5',
      sysReqMemory: '内存',
      sysReqMemory2gb: '内存：2 GB RAM',
      sysReqMemory4gb: '内存：4 GB RAM',
      sysReqGraphics: '显卡',
      sysReqGraphics512mb: '显卡：512 MB',
      sysReqGraphics1gb: '显卡：1 GB',
      sysReqDirectx: 'DirectX',
      sysReqDirectxVersion: 'DirectX：版本 9.0c',
      sysReqStorage: '存储空间',
      sysReqStorage3gb: '存储空间：3 GB',
      sysReqStorage5gb: '存储空间：5 GB',
    },
    news: {
      title: '新闻',
      subtitle: '了解MeuMU Online的所有更新、活动和新闻',
      readMore: '阅读更多',
      loadMore: '加载更多新闻',
      by: '作',
      publishedOn: '发布于',
      latestNews: '最新新闻',
      noNews: '目前没有可用的新闻。',
      viewAllNews: '查看所有新闻',
    },
    auth: {
      login: '登录',
      register: '注册',
      username: '用户名',
      password: '密码',
      email: '邮箱',
      confirmPassword: '确认密码',
      forgotPassword: '忘记密码？',
      noAccount: '没有账户？',
      hasAccount: '已有账户？',
      loginButton: '登录',
      registerButton: '创建账户',
      logout: '登出',
      welcome: '欢迎',
      welcomeMessage: '欢迎来到 MeuMU Online',
      usernamePlaceholder: '输入您的用户名',
      passwordPlaceholder: '输入您的密码',
      emailPlaceholder: '输入您的邮箱',
      confirmPasswordPlaceholder: '确认您的密码',
      loggingIn: '登录中...',
      registering: '注册中...',
      passwordMismatch: '密码不匹配',
      passwordTooShort: '密码必须至少6个字符',
      usernameTooShort: '用户名必须至少3个字符',
    },
    dashboard: dashboardTranslations.zh,
    common: {
      loading: '加载中...',
      error: '错误',
      success: '成功',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      close: '关闭',
      search: '搜索',
      filter: '筛选',
      season: 'Season 19-2-3 史诗服务器',
    },
    admincp: admincpTranslations.zh,
  },
  ru: {
    nav: {
      home: 'Главная',
      dashboard: 'Панель',
      rankings: 'Рейтинги',
      events: 'События',
      downloads: 'Загрузки',
      news: 'Новости',
      admincp: 'AdminCP',
    },
    hero: {
      title: 'Добро пожаловать в MeuMU Online',
      subtitle: 'Season 19-2-3 Эпический Сервер',
      seasonBadge: 'Season 19-2-3 - Эпический',
      tagline: 'Войдите в легенду. Покорите королевства. Станьте бессмертным.',
      description: 'Полный игровой опыт со сбалансированными ставками, ежедневными эпическими событиями и активным сообществом. Присоединяйтесь к тысячам игроков!',
      playNow: 'Играть Сейчас',
      learnMore: 'Узнать Больше',
      downloadNow: 'Скачать Сейчас',
      viewEvents: 'Просмотр Событий',
      onlinePlayers: 'Игроков Онлайн',
      totalAccounts: 'Всего Аккаунтов',
      activeGuilds: 'Активных Гильдий',
      expRate: 'EXP Ставка',
      dropRate: 'Drop Ставка',
      uptime: 'Время Работы',
    },
    serverStatus: {
      title: 'Статус Сервера',
      status: 'Статус',
      online: 'Онлайн',
      offline: 'Оффлайн',
      players: 'Игроки',
      uptime: 'Время Работы',
      experience: 'Опыт',
      drop: 'Дроп',
      aliveBosses: 'Живых Боссов',
    },
    rankings: {
      title: 'Рейтинги',
      topResets: 'Топ Ресетов',
      topPK: 'Топ PK',
      topGuilds: 'Топ Гильдий',
      rank: 'Ранг',
      name: 'Имя',
      level: 'Уровень',
      resets: 'Ресеты',
      kills: 'Убийства',
      class: 'Класс',
      guildName: 'Гильдия',
      members: 'Члены',
      score: 'Очки',
      master: 'Мастер',
    },
    events: {
      title: 'События',
      subtitle: 'Расписание событий в реальном времени',
      bloodCastle: 'Кровавый Замок',
      chaosCastle: 'Замок Хаоса',
      devilSquare: 'Площадь Дьявола',
      castleSiege: 'Осада Замка',
      startsIn: 'Начнется через',
      inProgress: 'В Процессе',
      ended: 'Завершено',
      happeningNow: 'Происходит Сейчас!',
      everyXHours: 'Каждые {hours} часа',
      saturdaysAt: 'Субботы {time}',
    },
    downloads: {
      title: 'Загрузки',
      client: 'Полный Клиент',
      clientDesc: 'Скачать полный клиент игры',
      patch: 'Патч Обновления',
      patchDesc: 'Обновите клиент до последней версии',
      download: 'Скачать',
      size: 'Размер',
      version: 'Версия',
      subtitle: 'Скачайте клиент и начните свое эпическое путешествие прямо сейчас',
      fullClient: 'Полный Клиент',
      fullClientDesc: 'Полная загрузка клиента MeuMU Online Season 19-2-3 - Epic. Включает все необходимые файлы.',
      launcher: 'Лаунчер',
      launcherDesc: 'Автоматический лаунчер, который поддерживает ваш клиент всегда обновленным.',
      directx: 'Драйверы DirectX',
      directxDesc: 'Пакет драйверов, необходимых для бесперебойной работы игры.',
      downloadButton: 'Скачать',
      installationGuide: 'Руководство по Установке',
      step1Title: 'Скачайте Клиент',
      step1Desc: 'Скачайте полный клиент (2.5 ГБ)',
      step2Title: 'Распакуйте Файлы',
      step2Desc: 'Распакуйте скачанный файл в выбранную вами папку',
      step3Title: 'Установите Драйверы',
      step3Desc: 'При необходимости запустите установщик DirectX 9.0c',
      step4Title: 'Запустите Лаунчер',
      step4Desc: 'Откройте лаунчер и дождитесь обновлений',
      step5Title: 'Играйте!',
      step5Desc: 'Создайте свою учетную запись и начните свое эпическое приключение',
      minimumReqs: 'Минимальные Требования',
      recommendedReqs: 'Рекомендуемые Требования',
      downloadMirrors: 'Зеркала для Загрузки',
      needHelp: 'Нужна Помощь?',
      needHelpDesc: 'Если у вас возникли проблемы во время установки, наша служба поддержки готова помочь!',
      sysReqWindows7: 'Windows 7 или выше',
      sysReqWindows10: 'Windows 10/11',
      sysReqProcessor: 'Процессор',
      sysReqProcessorDuo: 'Процессор: Intel Core 2 Duo',
      sysReqProcessorI5: 'Процессор: Intel Core i5',
      sysReqMemory: 'Память',
      sysReqMemory2gb: 'Память: 2 ГБ ОЗУ',
      sysReqMemory4gb: 'Память: 4 ГБ ОЗУ',
      sysReqGraphics: 'Видеокарта',
      sysReqGraphics512mb: 'Видеокарта: 512 МБ',
      sysReqGraphics1gb: 'Видеокарта: 1 ГБ',
      sysReqDirectx: 'DirectX',
      sysReqDirectxVersion: 'DirectX: Версия 9.0c',
      sysReqStorage: 'Хранилище',
      sysReqStorage3gb: 'Хранилище: 3 ГБ',
      sysReqStorage5gb: 'Хранилище: 5 ГБ',
    },
    news: {
      title: 'Новости',
      subtitle: 'Будьте в курсе всех обновлений, событий и новостей MeuMU Online',
      readMore: 'Читать Далее',
      loadMore: 'Загрузить Еще Новости',
      by: 'От',
      publishedOn: 'Опубликовано',
      latestNews: 'Последние Новости',
      noNews: 'В данный момент нет доступных новостей.',
      viewAllNews: 'Просмотреть все новости',
    },
    auth: {
      login: 'Войти',
      register: 'Регистрация',
      username: 'Имя Пользователя',
      password: 'Пароль',
      email: 'Эл. Почта',
      confirmPassword: 'Подтвердите Пароль',
      forgotPassword: 'Забыли пароль?',
      noAccount: 'Нет аккаунта?',
      hasAccount: 'Уже есть аккаунт?',
      loginButton: 'Войти',
      registerButton: 'Создать Аккаунт',
      logout: 'Выйти',
      welcome: 'Добро пожаловать',
      welcomeMessage: 'Добро пожаловать в MeuMU Online',
      usernamePlaceholder: 'Введите ваше имя пользователя',
      passwordPlaceholder: 'Введите ваш пароль',
      emailPlaceholder: 'Введите вашу электронную почту',
      confirmPasswordPlaceholder: 'Подтвердите ваш пароль',
      loggingIn: 'Вход...',
      registering: 'Регистрация...',
      passwordMismatch: 'Пароли не совпадают',
      passwordTooShort: 'Пароль должен быть не менее 6 символов',
      usernameTooShort: 'Имя пользователя должно быть не менее 3 символов',
    },
    dashboard: dashboardTranslations.ru,
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успех',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Изменить',
      close: 'Закрыть',
      search: 'Поиск',
      filter: 'Фильтр',
      season: 'Season 19-2-3 Эпический Сервер',
    },
    admincp: admincpTranslations.ru,
  },
  fil: {
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      rankings: 'Rankings',
      events: 'Events',
      downloads: 'Downloads',
      news: 'Balita',
      admincp: 'AdminCP',
    },
    hero: {
      title: 'Maligayang pagdating sa MeuMU Online',
      subtitle: 'Season 19-2-3 Epic Server',
      seasonBadge: 'Season 19-2-3 - Epic',
      tagline: 'Pumasok sa alamat. Sakupin ang mga kaharian. Maging imortal.',
      description: 'Kumpletong karanasan na may balanseng rates, araw-araw na epic events at aktibong komunidad. Sumali sa libu-libong manlalaro!',
      playNow: 'Maglaro Ngayon',
      learnMore: 'Matuto Pa',
      downloadNow: 'I-download Ngayon',
      viewEvents: 'Tingnan ang Events',
      onlinePlayers: 'Online na Manlalaro',
      totalAccounts: 'Kabuuang Accounts',
      activeGuilds: 'Aktibong Guilds',
      expRate: 'EXP Rate',
      dropRate: 'Drop Rate',
      uptime: 'Uptime',
    },
    serverStatus: {
      title: 'Status ng Server',
      status: 'Status',
      online: 'Online',
      offline: 'Offline',
      players: 'Manlalaro',
      uptime: 'Uptime',
      experience: 'Experience',
      drop: 'Drop',
      aliveBosses: 'Buhay na Bosses',
    },
    rankings: {
      title: 'Rankings',
      topResets: 'Top Resets',
      topPK: 'Top PK',
      topGuilds: 'Top Guilds',
      rank: 'Rank',
      name: 'Pangalan',
      level: 'Level',
      resets: 'Resets',
      kills: 'Kills',
      class: 'Class',
      guildName: 'Guild',
      members: 'Mga Miyembro',
      score: 'Puntos',
      master: 'Master',
    },
    events: {
      title: 'Events',
      subtitle: 'Real-time na iskedyul ng events',
      bloodCastle: 'Blood Castle',
      chaosCastle: 'Chaos Castle',
      devilSquare: 'Devil Square',
      castleSiege: 'Castle Siege',
      startsIn: 'Magsisimula sa',
      inProgress: 'Ongoing',
      ended: 'Tapos Na',
      happeningNow: 'Nangyayari Ngayon!',
      everyXHours: 'Bawat {hours} oras',
      saturdaysAt: 'Sabado {time}',
    },
    downloads: {
      title: 'Downloads',
      client: 'Kumpletong Client',
      clientDesc: 'I-download ang kumpletong game client',
      patch: 'Update Patch',
      patchDesc: 'I-update ang iyong client sa pinakabagong bersyon',
      download: 'I-download',
      size: 'Laki',
      version: 'Bersyon',
      subtitle: 'I-download ang client at simulan ang iyong epic na paglalakbay ngayon',
      fullClient: 'Kumpletong Client',
      fullClientDesc: 'Kumpletong download ng MeuMU Online Season 19-2-3 - Epic client. Kasama ang lahat ng kinakailangang files.',
      launcher: 'Launcher',
      launcherDesc: 'Automatic launcher na nagpapanatiling updated ang iyong client.',
      directx: 'DirectX Drivers',
      directxDesc: 'Package ng drivers na kailangan para gumana nang maayos ang laro.',
      downloadButton: 'I-download',
      installationGuide: 'Gabay sa Pag-install',
      step1Title: 'I-download ang Client',
      step1Desc: 'I-download ang kumpletong client (2.5 GB)',
      step2Title: 'I-extract ang Files',
      step2Desc: 'I-unzip ang na-download na file sa folder na gusto mo',
      step3Title: 'I-install ang Drivers',
      step3Desc: 'Patakbuhin ang DirectX 9.0c installer kung kinakailangan',
      step4Title: 'Patakbuhin ang Launcher',
      step4Desc: 'Buksan ang launcher at maghintay ng updates',
      step5Title: 'Maglaro!',
      step5Desc: 'Gumawa ng iyong account at simulan ang iyong epic adventure',
      minimumReqs: 'Minimum Requirements',
      recommendedReqs: 'Recommended Requirements',
      downloadMirrors: 'Download Mirrors',
      needHelp: 'Kailangan ng Tulong?',
      needHelpDesc: 'Kung may problema ka sa pag-install, ang aming support team ay handa na tumulong!',
      sysReqWindows7: 'Windows 7 o mas mataas',
      sysReqWindows10: 'Windows 10/11',
      sysReqProcessor: 'Processor',
      sysReqProcessorDuo: 'Processor: Intel Core 2 Duo',
      sysReqProcessorI5: 'Processor: Intel Core i5',
      sysReqMemory: 'Memory',
      sysReqMemory2gb: 'Memory: 2 GB RAM',
      sysReqMemory4gb: 'Memory: 4 GB RAM',
      sysReqGraphics: 'Graphics card',
      sysReqGraphics512mb: 'Graphics card: 512 MB',
      sysReqGraphics1gb: 'Graphics card: 1 GB',
      sysReqDirectx: 'DirectX',
      sysReqDirectxVersion: 'DirectX: Bersyon 9.0c',
      sysReqStorage: 'Storage',
      sysReqStorage3gb: 'Storage: 3 GB',
      sysReqStorage5gb: 'Storage: 5 GB',
    },
    news: {
      title: 'Balita',
      subtitle: 'Manatiling updated sa lahat ng updates, events at balita ng MeuMU Online',
      readMore: 'Basahin Pa',
      loadMore: 'Mag-load ng Higit Pang Balita',
      by: 'Ni',
      publishedOn: 'Inilathala noong',
      latestNews: 'Pinakabagong Balita',
      noNews: 'Walang available na balita sa ngayon.',
      viewAllNews: 'Tingnan ang Lahat ng Balita',
    },
    auth: {
      login: 'Mag-login',
      register: 'Magrehistro',
      username: 'Username',
      password: 'Password',
      email: 'Email',
      confirmPassword: 'Kumpirmahin ang Password',
      forgotPassword: 'Nakalimutan ang password?',
      noAccount: 'Walang account?',
      hasAccount: 'May account na?',
      loginButton: 'Mag-sign In',
      registerButton: 'Gumawa ng Account',
      logout: 'Mag-logout',
      welcome: 'Maligayang pagdating',
      welcomeMessage: 'Maligayang pagdating sa MeuMU Online',
      usernamePlaceholder: 'Ilagay ang iyong username',
      passwordPlaceholder: 'Ilagay ang iyong password',
      emailPlaceholder: 'Ilagay ang iyong email',
      confirmPasswordPlaceholder: 'Kumpirmahin ang iyong password',
      loggingIn: 'Naglologin...',
      registering: 'Nagreheistro...',
      passwordMismatch: 'Hindi tugma ang password',
      passwordTooShort: 'Ang password ay dapat na mayroon sa huling 6 karakter',
      usernameTooShort: 'Ang username ay dapat na mayroon sa huling 3 karakter',
    },
    dashboard: dashboardTranslations.fil,
    common: {
      loading: 'Naglo-load...',
      error: 'Error',
      success: 'Tagumpay',
      cancel: 'Kanselahin',
      confirm: 'Kumpirmahin',
      save: 'I-save',
      delete: 'Tanggalin',
      edit: 'I-edit',
      close: 'Isara',
      search: 'Maghanap',
      filter: 'I-filter',
      season: 'Season 19-2-3 Epic Server',
    },
    admincp: admincpTranslations.fil,
  },
  vi: {
    nav: {
      home: 'Trang Chủ',
      dashboard: 'Bảng Điều Khiển',
      rankings: 'Xếp Hạng',
      events: 'Sự Kiện',
      downloads: 'Tải Xuống',
      news: 'Tin Tức',
      admincp: 'AdminCP',
    },
    hero: {
      title: 'Chào mừng đến MeuMU Online',
      subtitle: 'Season 19-2-3 Máy Chủ Huyền Thoại',
      seasonBadge: 'Season 19-2-3 - Huyền Thoại',
      tagline: 'Bước vào huyền thoại. Thống trị các vương quốc. Trở nên bất tử.',
      description: 'Trải nghiệm hoàn chỉnh với tỷ lệ cân bằng, sự kiện huyền thoại hàng ngày và cộng đồng sôi động. Tham gia cùng hàng nghìn người chơi!',
      playNow: 'Chơi Ngay',
      learnMore: 'Tìm Hiểu Thêm',
      downloadNow: 'Tải Ngay',
      viewEvents: 'Xem Sự Kiện',
      onlinePlayers: 'Người Chơi Trực Tuyến',
      totalAccounts: 'Tổng Tài Khoản',
      activeGuilds: 'Bang Hội Hoạt Động',
      expRate: 'Tỷ Lệ EXP',
      dropRate: 'Tỷ Lệ Drop',
      uptime: 'Thời Gian Hoạt Động',
    },
    serverStatus: {
      title: 'Trạng Thái Máy Chủ',
      status: 'Trạng Thái',
      online: 'Trực Tuyến',
      offline: 'Ngoại Tuyến',
      players: 'Người Chơi',
      uptime: 'Thời Gian Hoạt Động',
      experience: 'Kinh Nghiệm',
      drop: 'Drop',
      aliveBosses: 'Boss Đang Sống',
    },
    rankings: {
      title: 'Xếp Hạng',
      topResets: 'Top Reset',
      topPK: 'Top PK',
      topGuilds: 'Top Bang Hội',
      rank: 'Hạng',
      name: 'Tên',
      level: 'Cấp Độ',
      resets: 'Reset',
      kills: 'Giết',
      class: 'Lớp',
      guildName: 'Bang Hội',
      members: 'Thành Viên',
      score: 'Điểm',
      master: 'Bang Chủ',
    },
    events: {
      title: 'Sự Kiện',
      subtitle: 'Lịch sự kiện thời gian thực',
      bloodCastle: 'Lâu Đài Máu',
      chaosCastle: 'Lâu Đài Hỗn Loạn',
      devilSquare: 'Quảng Trường Ác Quỷ',
      castleSiege: 'Công Thành',
      startsIn: 'Bắt đầu sau',
      inProgress: 'Đang Diễn Ra',
      ended: 'Đã Kết Thúc',
      happeningNow: 'Đang Diễn Ra Ngay!',
      everyXHours: 'Mỗi {hours} giờ',
      saturdaysAt: 'Thứ Bảy {time}',
    },
    downloads: {
      title: 'Tải Xuống',
      client: 'Client Đầy Đủ',
      clientDesc: 'Tải xuống client game đầy đủ',
      patch: 'Bản Vá Cập Nhật',
      patchDesc: 'Cập nhật client của bạn lên phiên bản mới nhất',
      download: 'Tải Xuống',
      size: 'Kích Thước',
      version: 'Phiên Bản',
      subtitle: 'Tải xuống client và bắt đầu hành trình sử thi của bạn ngay bây giờ',
      fullClient: 'Client Đầy Đủ',
      fullClientDesc: 'Tải xuống đầy đủ client MeuMU Online Season 19-2-3 - Epic. Bao gồm tất cả các tệp cần thiết.',
      launcher: 'Trình Khởi Động',
      launcherDesc: 'Trình khởi động tự động giữ cho client của bạn luôn được cập nhật.',
      directx: 'Trình Điều Khiển DirectX',
      directxDesc: 'Gói trình điều khiển cần thiết để chạy game mượt mà.',
      downloadButton: 'Tải Xuống',
      installationGuide: 'Hướng Dẫn Cài Đặt',
      step1Title: 'Tải Client',
      step1Desc: 'Tải xuống client đầy đủ (2.5 GB)',
      step2Title: 'Giải Nén Tệp',
      step2Desc: 'Giải nén tệp đã tải xuống vào thư mục bạn chọn',
      step3Title: 'Cài Đặt Trình Điều Khiển',
      step3Desc: 'Chạy trình cài đặt DirectX 9.0c nếu cần thiết',
      step4Title: 'Chạy Trình Khởi Động',
      step4Desc: 'Mở trình khởi động và đợi cập nhật',
      step5Title: 'Chơi Game!',
      step5Desc: 'Tạo tài khoản của bạn và bắt đầu cuộc phiêu lưu sử thi',
      minimumReqs: 'Yêu Cầu Tối Thiểu',
      recommendedReqs: 'Yêu Cầu Được Đề Xuất',
      downloadMirrors: 'Mirror Tải Xuống',
      needHelp: 'Cần Giúp Đỡ?',
      needHelpDesc: 'Nếu bạn gặp vấn đề trong quá trình cài đặt, đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp đỡ!',
      sysReqWindows7: 'Windows 7 hoặc cao hơn',
      sysReqWindows10: 'Windows 10/11',
      sysReqProcessor: 'Bộ xử lý',
      sysReqProcessorDuo: 'Bộ xử lý: Intel Core 2 Duo',
      sysReqProcessorI5: 'Bộ xử lý: Intel Core i5',
      sysReqMemory: 'Bộ nhớ',
      sysReqMemory2gb: 'Bộ nhớ: 2 GB RAM',
      sysReqMemory4gb: 'Bộ nhớ: 4 GB RAM',
      sysReqGraphics: 'Card đồ họa',
      sysReqGraphics512mb: 'Card đồ họa: 512 MB',
      sysReqGraphics1gb: 'Card đồ họa: 1 GB',
      sysReqDirectx: 'DirectX',
      sysReqDirectxVersion: 'DirectX: Phiên bản 9.0c',
      sysReqStorage: 'Dung lượng lưu trữ',
      sysReqStorage3gb: 'Dung lượng lưu trữ: 3 GB',
      sysReqStorage5gb: 'Dung lượng lưu trữ: 5 GB',
    },
    news: {
      title: 'Tin Tức',
      subtitle: 'Cập nhật tất cả thông tin, sự kiện và tin tức mới nhất từ MeuMU Online',
      readMore: 'Đọc Thêm',
      loadMore: 'Tải Thêm Tin Tức',
      by: 'Bởi',
      publishedOn: 'Đăng ngày',
      latestNews: 'Tin Tức Mới Nhất',
      noNews: 'Hiện tại chưa có tin tức nào.',
      viewAllNews: 'Xem Tất Cả Tin Tức',
    },
    auth: {
      login: 'Đăng Nhập',
      register: 'Đăng Ký',
      username: 'Tên Đăng Nhập',
      password: 'Mật Khẩu',
      email: 'Email',
      confirmPassword: 'Xác Nhận Mật Khẩu',
      forgotPassword: 'Quên mật khẩu?',
      noAccount: 'Chưa có tài khoản?',
      hasAccount: 'Đã có tài khoản?',
      loginButton: 'Đăng Nhập',
      registerButton: 'Tạo Tài Khoản',
      logout: 'Đăng Xuất',
      welcome: 'Chào mừng',
      welcomeMessage: 'Chào mừng đến MeuMU Online',
      usernamePlaceholder: 'Nhập tên đăng nhập của bạn',
      passwordPlaceholder: 'Nhập mật khẩu của bạn',
      emailPlaceholder: 'Nhập email của bạn',
      confirmPasswordPlaceholder: 'Xác nhận mật khẩu của bạn',
      loggingIn: 'Đang đăng nhập...',
      registering: 'Đang đăng ký...',
      passwordMismatch: 'Mật khẩu không khớp',
      passwordTooShort: 'Mật khẩu phải có ít nhất 6 ký tự',
      usernameTooShort: 'Tên đăng nhập phải có ít nhất 3 ký tự',
    },
    dashboard: dashboardTranslations.vi,
    common: {
      loading: 'Đang tải...',
      error: 'Lỗi',
      success: 'Thành Công',
      cancel: 'Hủy',
      confirm: 'Xác Nhận',
      save: 'Lưu',
      delete: 'Xóa',
      edit: 'Chỉnh Sửa',
      close: 'Đóng',
      search: 'Tìm Kiếm',
      filter: 'Lọc',
      season: 'Season 19-2-3 Máy Chủ Huyền Thoại',
    },
    admincp: admincpTranslations.vi,
  },
};

export const languageNames: Record<Language, string> = {
  'pt-BR': 'Português',
  'en': 'English',
  'es': 'Español',
  'de': 'Deutsch',
  'zh': '中文',
  'ru': 'Русский',
  'fil': 'Filipino',
  'vi': 'Tiếng Việt',
};

export const languageFlags: Record<Language, string> = {
  'pt-BR': '🇧🇷',
  'en': '🇺🇸',
  'es': '🇪🇸',
  'de': '🇩🇪',
  'zh': '🇨🇳',
  'ru': '🇷🇺',
  'fil': '🇵🇭',
  'vi': '🇻🇳',
};