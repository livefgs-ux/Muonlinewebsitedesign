export type Language = 'pt-BR' | 'en' | 'es' | 'de' | 'zh' | 'ru' | 'fil' | 'vi';

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
    playNow: string;
    learnMore: string;
    onlinePlayers: string;
    totalAccounts: string;
    activeGuilds: string;
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
    bloodCastle: string;
    chaosCastle: string;
    devilSquare: string;
    castleSiege: string;
    startsIn: string;
    inProgress: string;
    ended: string;
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
  };
  // Dashboard
  dashboard: {
    welcome: string;
    characters: string;
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
      playNow: 'Jogar Agora',
      learnMore: 'Saiba Mais',
      onlinePlayers: 'Jogadores Online',
      totalAccounts: 'Contas Totais',
      activeGuilds: 'Guildas Ativas',
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
      bloodCastle: 'Blood Castle',
      chaosCastle: 'Chaos Castle',
      devilSquare: 'Devil Square',
      castleSiege: 'Castle Siege',
      startsIn: 'Começa em',
      inProgress: 'Em Andamento',
      ended: 'Finalizado',
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
    },
    dashboard: {
      welcome: 'Bem-vindo',
      characters: 'Personagens',
      createCharacter: 'Criar Personagem',
      selectCharacter: 'Selecionar Personagem',
      characterName: 'Nome do Personagem',
      characterClass: 'Classe',
      resetCharacter: 'Resetar Personagem',
      distributePoints: 'Distribuir Pontos',
      strength: 'Força',
      agility: 'Agilidade',
      vitality: 'Vitalidade',
      energy: 'Energia',
      command: 'Comando',
      availablePoints: 'Pontos Disponíveis',
      apply: 'Aplicar',
    },
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
      playNow: 'Play Now',
      learnMore: 'Learn More',
      onlinePlayers: 'Online Players',
      totalAccounts: 'Total Accounts',
      activeGuilds: 'Active Guilds',
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
      bloodCastle: 'Blood Castle',
      chaosCastle: 'Chaos Castle',
      devilSquare: 'Devil Square',
      castleSiege: 'Castle Siege',
      startsIn: 'Starts in',
      inProgress: 'In Progress',
      ended: 'Ended',
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
    },
    dashboard: {
      welcome: 'Welcome',
      characters: 'Characters',
      createCharacter: 'Create Character',
      selectCharacter: 'Select Character',
      characterName: 'Character Name',
      characterClass: 'Class',
      resetCharacter: 'Reset Character',
      distributePoints: 'Distribute Points',
      strength: 'Strength',
      agility: 'Agility',
      vitality: 'Vitality',
      energy: 'Energy',
      command: 'Command',
      availablePoints: 'Available Points',
      apply: 'Apply',
    },
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
      playNow: 'Jugar Ahora',
      learnMore: 'Saber Más',
      onlinePlayers: 'Jugadores en Línea',
      totalAccounts: 'Cuentas Totales',
      activeGuilds: 'Gremios Activos',
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
      bloodCastle: 'Blood Castle',
      chaosCastle: 'Chaos Castle',
      devilSquare: 'Devil Square',
      castleSiege: 'Castle Siege',
      startsIn: 'Comienza en',
      inProgress: 'En Progreso',
      ended: 'Finalizado',
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
    },
    dashboard: {
      welcome: 'Bienvenido',
      characters: 'Personajes',
      createCharacter: 'Crear Personaje',
      selectCharacter: 'Seleccionar Personaje',
      characterName: 'Nombre del Personaje',
      characterClass: 'Clase',
      resetCharacter: 'Resetear Personaje',
      distributePoints: 'Distribuir Puntos',
      strength: 'Fuerza',
      agility: 'Agilidad',
      vitality: 'Vitalidad',
      energy: 'Energía',
      command: 'Comando',
      availablePoints: 'Puntos Disponibles',
      apply: 'Aplicar',
    },
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
      playNow: 'Jetzt Spielen',
      learnMore: 'Mehr Erfahren',
      onlinePlayers: 'Online Spieler',
      totalAccounts: 'Gesamte Konten',
      activeGuilds: 'Aktive Gilden',
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
      bloodCastle: 'Blood Castle',
      chaosCastle: 'Chaos Castle',
      devilSquare: 'Devil Square',
      castleSiege: 'Castle Siege',
      startsIn: 'Startet in',
      inProgress: 'Im Gange',
      ended: 'Beendet',
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
    },
    dashboard: {
      welcome: 'Willkommen',
      characters: 'Charaktere',
      createCharacter: 'Charakter Erstellen',
      selectCharacter: 'Charakter Auswählen',
      characterName: 'Charaktername',
      characterClass: 'Klasse',
      resetCharacter: 'Charakter Zurücksetzen',
      distributePoints: 'Punkte Verteilen',
      strength: 'Stärke',
      agility: 'Beweglichkeit',
      vitality: 'Vitalität',
      energy: 'Energie',
      command: 'Befehl',
      availablePoints: 'Verfügbare Punkte',
      apply: 'Anwenden',
    },
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
      playNow: '立即游戏',
      learnMore: '了解更多',
      onlinePlayers: '在线玩家',
      totalAccounts: '总账户数',
      activeGuilds: '活跃公会',
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
      bloodCastle: '血色城堡',
      chaosCastle: '混沌城堡',
      devilSquare: '恶魔广场',
      castleSiege: '攻城战',
      startsIn: '开始于',
      inProgress: '进行中',
      ended: '已结束',
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
    },
    dashboard: {
      welcome: '欢迎',
      characters: '角色',
      createCharacter: '创建角色',
      selectCharacter: '选择角色',
      characterName: '角色名',
      characterClass: '职业',
      resetCharacter: '重置角色',
      distributePoints: '分配点数',
      strength: '力量',
      agility: '敏捷',
      vitality: '体力',
      energy: '能量',
      command: '统率',
      availablePoints: '可用点数',
      apply: '应用',
    },
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
      playNow: 'Играть Сейчас',
      learnMore: 'Узнать Больше',
      onlinePlayers: 'Игроков Онлайн',
      totalAccounts: 'Всего Аккаунтов',
      activeGuilds: 'Активных Гильдий',
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
      bloodCastle: 'Кровавый Замок',
      chaosCastle: 'Замок Хаоса',
      devilSquare: 'Площадь Дьявола',
      castleSiege: 'Осада Замка',
      startsIn: 'Начнется через',
      inProgress: 'В Процессе',
      ended: 'Завершено',
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
    },
    dashboard: {
      welcome: 'Добро пожаловать',
      characters: 'Персонажи',
      createCharacter: 'Создать Персонажа',
      selectCharacter: 'Выбрать Персонажа',
      characterName: 'Имя Персонажа',
      characterClass: 'Класс',
      resetCharacter: 'Сбросить Персонажа',
      distributePoints: 'Распределить Очки',
      strength: 'Сила',
      agility: 'Ловкость',
      vitality: 'Живучесть',
      energy: 'Энергия',
      command: 'Командование',
      availablePoints: 'Доступных Очков',
      apply: 'Применить',
    },
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
      playNow: 'Maglaro Ngayon',
      learnMore: 'Matuto Pa',
      onlinePlayers: 'Online na Manlalaro',
      totalAccounts: 'Kabuuang Accounts',
      activeGuilds: 'Aktibong Guilds',
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
      bloodCastle: 'Blood Castle',
      chaosCastle: 'Chaos Castle',
      devilSquare: 'Devil Square',
      castleSiege: 'Castle Siege',
      startsIn: 'Magsisimula sa',
      inProgress: 'Ongoing',
      ended: 'Tapos Na',
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
    },
    dashboard: {
      welcome: 'Maligayang pagdating',
      characters: 'Mga Character',
      createCharacter: 'Gumawa ng Character',
      selectCharacter: 'Pumili ng Character',
      characterName: 'Pangalan ng Character',
      characterClass: 'Class',
      resetCharacter: 'I-reset ang Character',
      distributePoints: 'Ipamahagi ang Puntos',
      strength: 'Lakas',
      agility: 'Bilis',
      vitality: 'Buhay',
      energy: 'Enerhiya',
      command: 'Utos',
      availablePoints: 'Available na Puntos',
      apply: 'Ilapat',
    },
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
      playNow: 'Chơi Ngay',
      learnMore: 'Tìm Hiểu Thêm',
      onlinePlayers: 'Người Chơi Trực Tuyến',
      totalAccounts: 'Tổng Tài Khoản',
      activeGuilds: 'Bang Hội Hoạt Động',
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
      bloodCastle: 'Lâu Đài Máu',
      chaosCastle: 'Lâu Đài Hỗn Loạn',
      devilSquare: 'Quảng Trường Ác Quỷ',
      castleSiege: 'Công Thành',
      startsIn: 'Bắt đầu sau',
      inProgress: 'Đang Diễn Ra',
      ended: 'Đã Kết Thúc',
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
    },
    dashboard: {
      welcome: 'Chào mừng',
      characters: 'Nhân Vật',
      createCharacter: 'Tạo Nhân Vật',
      selectCharacter: 'Chọn Nhân Vật',
      characterName: 'Tên Nhân Vật',
      characterClass: 'Lớp',
      resetCharacter: 'Reset Nhân Vật',
      distributePoints: 'Phân Phối Điểm',
      strength: 'Sức Mạnh',
      agility: 'Nhanh Nhẹn',
      vitality: 'Sinh Lực',
      energy: 'Năng Lượng',
      command: 'Chỉ Huy',
      availablePoints: 'Điểm Khả Dụng',
      apply: 'Áp Dụng',
    },
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