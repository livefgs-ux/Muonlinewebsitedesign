-- =====================================================
-- TABELA DE EVENTOS - MEUMU ONLINE
-- Sistema completo de gerenciamento de eventos do servidor
-- =====================================================

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Informações básicas do evento
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    name_es VARCHAR(100),
    name_de VARCHAR(100),
    name_zh VARCHAR(100),
    name_ru VARCHAR(100),
    name_fil VARCHAR(100),
    name_vi VARCHAR(100),
    
    -- Descrição do evento
    description TEXT,
    description_en TEXT,
    description_es TEXT,
    description_de TEXT,
    description_zh TEXT,
    description_ru TEXT,
    description_fil TEXT,
    description_vi TEXT,
    
    -- Configuração visual
    icon VARCHAR(50) DEFAULT 'Trophy',  -- Nome do ícone do lucide-react
    color VARCHAR(20) DEFAULT 'yellow', -- red, purple, orange, yellow, blue, green
    imageUrl VARCHAR(500),
    
    -- Configuração de horários
    schedule_type ENUM('recurring', 'daily', 'weekly', 'specific') DEFAULT 'recurring',
    
    -- Para eventos recorrentes (a cada X horas)
    interval_hours INT DEFAULT NULL,
    interval_minutes INT DEFAULT 0,
    
    -- Para eventos diários (horários específicos)
    daily_times JSON DEFAULT NULL,  -- Ex: ["00:00", "06:00", "12:00", "18:00"]
    
    -- Para eventos semanais
    weekly_day INT DEFAULT NULL,  -- 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    weekly_time TIME DEFAULT NULL,
    
    -- Para eventos específicos (data/hora única)
    specific_datetime DATETIME DEFAULT NULL,
    
    -- Duração do evento em minutos
    duration INT DEFAULT 60,
    
    -- Status e configurações
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,  -- Destacar na home
    priority INT DEFAULT 0,  -- Ordem de exibição
    
    -- Recompensas
    rewards TEXT,  -- Descrição das recompensas
    
    -- Requisitos
    min_level INT DEFAULT 1,
    max_level INT DEFAULT 400,
    min_reset INT DEFAULT 0,
    
    -- Metadados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    
    -- Índices para performance
    INDEX idx_is_active (is_active),
    INDEX idx_schedule_type (schedule_type),
    INDEX idx_priority (priority),
    INDEX idx_is_featured (is_featured)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERIR EVENTOS PADRÃO DO MU ONLINE
-- =====================================================

INSERT INTO events (
    name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
    description, description_en, description_es, description_de, description_zh, description_ru, description_fil, description_vi,
    icon, color, schedule_type, interval_hours, duration, is_active, is_featured, priority, rewards, min_level, max_level
) VALUES
-- Blood Castle (A cada 2 horas)
(
    'Blood Castle', 'Blood Castle', 'Blood Castle', 'Blood Castle', '血腥城堡', 'Кровавый Замок', 'Blood Castle', 'Lâu Đài Máu',
    'Entre no castelo maldito e derrote as criaturas das trevas para conquistar recompensas épicas!',
    'Enter the cursed castle and defeat creatures of darkness to earn epic rewards!',
    '¡Entra en el castillo maldito y derrota a las criaturas de la oscuridad para ganar recompensas épicas!',
    'Betreten Sie das verfluchte Schloss und besiegen Sie die Kreaturen der Dunkelheit für epische Belohnungen!',
    '进入被诅咒的城堡，击败黑暗生物以获得史诗般的奖励！',
    'Войдите в проклятый замок и победите существ тьмы, чтобы получить эпические награды!',
    'Pumasok sa sumpa na kastilyo at talunin ang mga nilalang ng kadiliman para makakuha ng epic na rewards!',
    'Vào lâu đài bị nguyền rủa và đánh bại những sinh vật bóng tối để nhận phần thưởng hoành tráng!',
    'Castle', 'red', 'recurring', 2, 30, TRUE, TRUE, 1, 
    '💎 Jewels, 🗡️ Excellent Items, 📜 Ancient Items', 10, 400
),

-- Chaos Castle (A cada 3 horas)
(
    'Chaos Castle', 'Chaos Castle', 'Castillo del Caos', 'Chaos Schloss', '混乱城堡', 'Замок Хаоса', 'Chaos Castle', 'Lâu Đài Hỗn Loạn',
    'Sobreviva ao caos e seja o último guerreiro em pé nesta arena mortal!',
    'Survive the chaos and be the last warrior standing in this deadly arena!',
    '¡Sobrevive al caos y sé el último guerrero en pie en esta arena mortal!',
    'Überleben Sie das Chaos und seien Sie der letzte stehende Krieger in dieser tödlichen Arena!',
    '在这个致命的竞技场中幸存下来，成为最后一个站立的战士！',
    'Переживите хаос и станьте последним воином в этой смертельной арене!',
    'Makaligtas sa kaguluhan at maging huling mandirigma na nakatayo sa mapaminsalang arena!',
    'Sống sót qua hỗn loạn và trở thành chiến binh cuối cùng đứng vững trong đấu trường chết chóc này!',
    'Swords', 'purple', 'recurring', 3, 20, TRUE, TRUE, 2,
    '🏆 Chaos Weapons, 💰 Zen, 🔮 Jewel of Bless', 15, 400
),

-- Devil Square (A cada 4 horas)
(
    'Devil Square', 'Devil Square', 'Plaza del Diablo', 'Teufelsplatz', '恶魔广场', 'Площадь Дьявола', 'Devil Square', 'Quảng Trường Ác Quỷ',
    'Enfrente hordas de demônios em ondas cada vez mais difíceis!',
    'Face hordes of demons in increasingly difficult waves!',
    '¡Enfrenta hordas de demonios en oleadas cada vez más difíciles!',
    'Stellen Sie sich Horden von Dämonen in immer schwierigeren Wellen!',
    '面对越来越困难的恶魔浪潮！',
    'Сразитесь с ордами демонов во все более сложных волнах!',
    'Harapin ang mga horde ng demonyo sa lalong tumataas na mahirap na waves!',
    'Đối mặt với đám quỷ trong các làn sóng ngày càng khó khăn hơn!',
    'Skull', 'orange', 'recurring', 4, 15, TRUE, TRUE, 3,
    '👹 Devil Items, 💎 Jewels Bundle, 🎁 Random Box', 50, 400
),

-- Castle Siege (Sábados 20:00)
(
    'Castle Siege', 'Castle Siege', 'Asedio del Castillo', 'Burgbelagerung', '城堡攻城', 'Осада Замка', 'Paglusob sa Kastilyo', 'Công Thành',
    'Guerra épica de guildas pelo controle do castelo! A guild vencedora recebe benefícios exclusivos durante toda a semana.',
    'Epic guild war for castle control! The winning guild receives exclusive benefits throughout the week.',
    '¡Guerra épica de gremios por el control del castillo! El gremio ganador recibe beneficios exclusivos durante toda la semana.',
    'Epischer Gildenkrieg um die Kontrolle der Burg! Die Sieger-Gilde erhält exklusive Vorteile für die ganze Woche.',
    '史诗公会战争争夺城堡控制权！获胜公会在整个星期内获得独家福利。',
    'Эпическая война гильдий за контроль над замком! Победившая гильдия получает эксклюзивные преимущества на всю неделю.',
    'Epic na digmaan ng guild para sa kontrol ng kastilyo! Ang panalo na guild ay makakatanggap ng exclusive benefits buong linggo.',
    'Chiến tranh bang hội hoành tráng để kiểm soát lâu đài! Bang hội chiến thắng nhận lợi ích độc quyền suốt cả tuần.',
    'Shield', 'yellow', 'weekly', NULL, 120, TRUE, TRUE, 4,
    '👑 Castle Lord Mark, 💰 Weekly Tax Revenue, 🏰 Castle Benefits', 100, 400
),

-- Golden Invasion (Diário: 12:00, 18:00, 22:00)
(
    'Golden Invasion', 'Golden Invasion', 'Invasión Dorada', 'Goldene Invasion', '黄金入侵', 'Золотое Вторжение', 'Gintong Pagsalakay', 'Cuộc Tấn Công Vàng',
    'Criaturas douradas invadem o continente! Derrote-as para ganhar ouro e itens raros.',
    'Golden creatures invade the continent! Defeat them to earn gold and rare items.',
    '¡Las criaturas doradas invaden el continente! Derrótalas para ganar oro y objetos raros.',
    'Goldene Kreaturen überfallen den Kontinent! Besiege sie für Gold und seltene Gegenstände.',
    '黄金生物入侵大陆！击败它们以获得黄金和稀有物品。',
    'Золотые существа вторгаются на континент! Победите их, чтобы получить золото и редкие предметы.',
    'Ang mga gintong nilalang ay sumalakay sa kontinente! Talunin sila para kumita ng ginto at rare items.',
    'Những sinh vật vàng xâm lược lục địa! Đánh bại chúng để kiếm vàng và vật phẩm hiếm.',
    'Coins', 'gold', 'daily', NULL, 45, TRUE, FALSE, 5,
    '💰 Zen x1000000, 🏅 Golden Items, 💎 Jewel Pack', 1, 400
),

-- White Wizard Invasion (Diário: 14:00, 20:00)
(
    'White Wizard', 'White Wizard', 'Mago Blanco', 'Weißer Zauberer', '白色法师', 'Белый Волшебник', 'Puting Wizard', 'Phù Thủy Trắng',
    'O poderoso Mago Branco aparece! Derrote-o para ganhar itens lendários.',
    'The mighty White Wizard appears! Defeat him to earn legendary items.',
    '¡El poderoso Mago Blanco aparece! Derrótalo para ganar objetos legendarios.',
    'Der mächtige Weiße Zauberer erscheint! Besiege ihn für legendäre Gegenstände.',
    '强大的白色法师出现了！击败他以获得传奇物品。',
    'Появляется могущественный Белый Волшебник! Победите его, чтобы получить легендарные предметы.',
    'Ang makapangyarihang Puting Wizard ay lumitaw! Talunin siya para makakuha ng legendary items.',
    'Phù thủy Trắng hùng mạnh xuất hiện! Đánh bại anh ta để nhận vật phẩm huyền thoại.',
    'Wand', 'ethereal', 'daily', NULL, 30, TRUE, FALSE, 6,
    '🧙 Wizard Ring, ⚡ Staff of Power, 🔮 Ancient Jewels', 80, 400
),

-- Arka War (Terças e Sextas 21:00)
(
    'Arka War', 'Arka War', 'Guerra de Arka', 'Arka Krieg', '阿卡战争', 'Война Арка', 'Digmaan ng Arka', 'Chiến Tranh Arka',
    'Batalha massiva entre jogadores pela conquista da Arka e seus tesouros!',
    'Massive battle between players for the conquest of Arka and its treasures!',
    '¡Batalla masiva entre jugadores por la conquista de Arka y sus tesoros!',
    'Massive Schlacht zwischen Spielern um die Eroberung von Arka und seinen Schätzen!',
    '玩家之间为征服阿卡及其宝藏而进行的大规模战斗！',
    'Массовая битва между игроками за завоевание Арки и ее сокровищ!',
    'Malaking labanan sa pagitan ng mga manlalaro para sa pagsakop ng Arka at mga kayamanan nito!',
    'Trận chiến khổng lồ giữa người chơi để chinh phục Arka và kho báu của nó!',
    'Mountain', 'blue', 'weekly', NULL, 90, TRUE, FALSE, 7,
    '⚔️ War Items, 💰 Massive Zen, 🎖️ PvP Points', 150, 400
);

-- =====================================================
-- CRIAR TABELA DE LOGS DE EVENTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS event_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    started_at DATETIME NOT NULL,
    ended_at DATETIME,
    participants INT DEFAULT 0,
    winner VARCHAR(50),
    notes TEXT,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event_id (event_id),
    INDEX idx_started_at (started_at)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para eventos ativos
CREATE OR REPLACE VIEW active_events AS
SELECT * FROM events 
WHERE is_active = TRUE 
ORDER BY priority DESC, name ASC;

-- View para eventos em destaque
CREATE OR REPLACE VIEW featured_events AS
SELECT * FROM events 
WHERE is_active = TRUE AND is_featured = TRUE 
ORDER BY priority DESC;
