-- ═════════════════════════════════════════════════════════════════
-- MEUMU ONLINE - SEEDER DE EVENTOS
-- Popula eventos padrão do MU Online Season 19
-- ═════════════════════════════════════════════════════════════════

USE meuweb;

-- Limpar eventos existentes (CUIDADO: usar apenas em desenvolvimento)
-- TRUNCATE TABLE events;

-- ═════════════════════════════════════════════════════════════════
-- EVENTOS RECORRENTES (A CADA X HORAS)
-- ═════════════════════════════════════════════════════════════════

-- Blood Castle (A cada 2 horas)
INSERT INTO events (
  name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
  description, description_en, description_es, description_de, 
  description_zh, description_ru, description_fil, description_vi,
  icon, color, schedule_type, interval_hours, interval_minutes,
  duration, is_featured, is_active, priority, min_level, max_level,
  rewards
) VALUES (
  'Blood Castle',
  'Blood Castle',
  'Castillo de Sangre',
  'Blutschloss',
  '血腥城堡',
  'Кровавый Замок',
  'Blood Castle',
  'Lâu Đài Máu',
  'A cada 2 horas',
  'Every 2 hours',
  'Cada 2 horas',
  'Alle 2 Stunden',
  '每2小时',
  'Каждые 2 часа',
  'Bawat 2 oras',
  'Mỗi 2 giờ',
  'Skull',
  'red',
  'recurring',
  2, 0, -- Intervalo de 2 horas
  15, -- Duração de 15 minutos
  TRUE, TRUE, 10,
  10, 400,
  JSON_OBJECT(
    'soul', '1-3 Souls',
    'items', 'Ancient Items',
    'experience', 'High EXP'
  )
);

-- Chaos Castle (A cada 3 horas)
INSERT INTO events (
  name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
  description, description_en, description_es, description_de,
  description_zh, description_ru, description_fil, description_vi,
  icon, color, schedule_type, interval_hours, interval_minutes,
  duration, is_featured, is_active, priority, min_level, max_level,
  rewards
) VALUES (
  'Chaos Castle',
  'Chaos Castle',
  'Castillo del Caos',
  'Chaosschloss',
  '混沌城堡',
  'Замок Хаоса',
  'Chaos Castle',
  'Lâu Đài Hỗn Loạn',
  'A cada 3 horas',
  'Every 3 hours',
  'Cada 3 horas',
  'Alle 3 Stunden',
  '每3小时',
  'Каждые 3 часа',
  'Bawat 3 oras',
  'Mỗi 3 giờ',
  'Swords',
  'purple',
  'recurring',
  3, 0, -- Intervalo de 3 horas
  15, -- Duração de 15 minutos
  TRUE, TRUE, 9,
  10, 400,
  JSON_OBJECT(
    'jewels', 'Jewels of Bless/Soul/Chaos',
    'items', 'Excellent Items',
    'experience', 'Very High EXP'
  )
);

-- Devil Square (A cada 4 horas)
INSERT INTO events (
  name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
  description, description_en, description_es, description_de,
  description_zh, description_ru, description_fil, description_vi,
  icon, color, schedule_type, interval_hours, interval_minutes,
  duration, is_featured, is_active, priority, min_level, max_level,
  rewards
) VALUES (
  'Devil Square',
  'Devil Square',
  'Plaza del Diablo',
  'Teufelsplatz',
  '恶魔广场',
  'Площадь Дьявола',
  'Devil Square',
  'Quảng Trường Ác Quỷ',
  'A cada 4 horas',
  'Every 4 hours',
  'Cada 4 horas',
  'Alle 4 Stunden',
  '每4小时',
  'Каждые 4 часа',
  'Bawat 4 oras',
  'Mỗi 4 giờ',
  'Flame',
  'orange',
  'recurring',
  4, 0, -- Intervalo de 4 horas
  15, -- Duração de 15 minutos
  TRUE, TRUE, 8,
  10, 400,
  JSON_OBJECT(
    'zen', 'High Zen',
    'items', 'Rare Items',
    'experience', 'High EXP'
  )
);

-- ═════════════════════════════════════════════════════════════════
-- EVENTOS SEMANAIS
-- ═════════════════════════════════════════════════════════════════

-- Castle Siege (Sábado 20:00)
INSERT INTO events (
  name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
  description, description_en, description_es, description_de,
  description_zh, description_ru, description_fil, description_vi,
  icon, color, schedule_type, weekly_day, weekly_time,
  duration, is_featured, is_active, priority, min_level, max_level,
  rewards
) VALUES (
  'Castle Siege',
  'Castle Siege',
  'Asedio al Castillo',
  'Burgbelagerung',
  '城堡攻防战',
  'Осада Замка',
  'Castle Siege',
  'Công Thành Chiến',
  'Sábados 20:00',
  'Saturdays 20:00',
  'Sábados 20:00',
  'Samstag 20:00',
  '星期六 20:00',
  'Суббота 20:00',
  'Sabado 20:00',
  'Thứ Bảy 20:00',
  'Castle',
  'yellow',
  'weekly',
  6, '20:00', -- Sábado (6 = Saturday), 20:00
  120, -- Duração de 2 horas
  TRUE, TRUE, 100,
  1, 400,
  JSON_OBJECT(
    'guild_rewards', 'Guild Master Marks + Tax Control',
    'items', 'Epic Guild Items',
    'glory', 'Server Recognition'
  )
);

-- ═════════════════════════════════════════════════════════════════
-- EVENTOS DIÁRIOS MÚLTIPLOS
-- ═════════════════════════════════════════════════════════════════

-- Invasões de Monstros (Horários fixos do dia)
INSERT INTO events (
  name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
  description, description_en, description_es, description_de,
  description_zh, description_ru, description_fil, description_vi,
  icon, color, schedule_type, daily_times,
  duration, is_featured, is_active, priority, min_level, max_level,
  rewards
) VALUES (
  'Golden Invasion',
  'Golden Invasion',
  'Invasión Dorada',
  'Goldene Invasion',
  '黄金入侵',
  'Золотое Вторжение',
  'Golden Invasion',
  'Cuộc Xâm Lược Vàng',
  'Todos os dias',
  'Daily',
  'Todos los días',
  'Täglich',
  '每天',
  'Ежедневно',
  'Araw-araw',
  'Hàng ngày',
  'Trophy',
  'gold',
  'daily',
  JSON_ARRAY('12:00', '18:00', '22:00'), -- 3 horários por dia
  30, -- Duração de 30 minutos
  FALSE, TRUE, 5,
  1, 400,
  JSON_OBJECT(
    'zen', 'Massive Zen',
    'items', 'Golden Items',
    'experience', 'Bonus EXP'
  )
);

-- Arca Mu (Happy Hour)
INSERT INTO events (
  name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
  description, description_en, description_es, description_de,
  description_zh, description_ru, description_fil, description_vi,
  icon, color, schedule_type, daily_times,
  duration, is_featured, is_active, priority, min_level, max_level,
  rewards
) VALUES (
  'Arca Mu (Happy Hour)',
  'Arca Mu (Happy Hour)',
  'Arca Mu (Hora Feliz)',
  'Arca Mu (Happy Hour)',
  'Arca Mu (快乐时光)',
  'Arca Mu (Счастливый Час)',
  'Arca Mu (Happy Hour)',
  'Arca Mu (Giờ Vui Vẻ)',
  'XP Dobrado!',
  'Double XP!',
  '¡XP Doble!',
  'Doppelte EP!',
  '双倍经验!',
  'Двойной опыт!',
  'Double XP!',
  'Kinh Nghiệm Gấp Đôi!',
  'Shield',
  'blue',
  'daily',
  JSON_ARRAY('14:00', '20:00'), -- 2 horários por dia
  60, -- Duração de 1 hora
  FALSE, TRUE, 6,
  1, 400,
  JSON_OBJECT(
    'experience', '2x EXP',
    'drop', '2x Drop Rate'
  )
);

-- White Wizard (Merchant NPC)
INSERT INTO events (
  name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
  description, description_en, description_es, description_de,
  description_zh, description_ru, description_fil, description_vi,
  icon, color, schedule_type, daily_times,
  duration, is_featured, is_active, priority, min_level, max_level,
  rewards
) VALUES (
  'White Wizard',
  'White Wizard',
  'Mago Blanco',
  'Weißer Zauberer',
  '白色巫师',
  'Белый Волшебник',
  'White Wizard',
  'Phù Thủy Trắng',
  'Vendedor especial',
  'Special Merchant',
  'Vendedor especial',
  'Spezieller Händler',
  '特殊商人',
  'Специальный торговец',
  'Espesyal na Merchant',
  'Thương Nhân Đặc Biệt',
  'Trophy',
  'ethereal',
  'daily',
  JSON_ARRAY('10:00', '15:00', '21:00'), -- 3 horários por dia
  30, -- Duração de 30 minutos
  FALSE, TRUE, 4,
  1, 400,
  JSON_OBJECT(
    'items', 'Special Shop Items',
    'jewels', 'Rare Jewels'
  )
);

-- ═════════════════════════════════════════════════════════════════
-- FIM DO SEEDER
-- ═════════════════════════════════════════════════════════════════

SELECT '✅ Eventos populados com sucesso!' AS resultado;
SELECT COUNT(*) AS total_eventos FROM events;
