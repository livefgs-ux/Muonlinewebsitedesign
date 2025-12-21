/**
 * EVENTS CONTROLLER - MEUMU ONLINE
 * Gerenciamento completo de eventos do servidor
 */

const db = require('../config/database');
const { validateRequired } = require('../utils/validators');

/**
 * Obter todos os eventos ativos
 * GET /api/events
 */
exports.getActiveEvents = async (req, res, next) => {
  try {
    const [events] = await db.query(`
      SELECT 
        id, name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
        description, description_en, description_es, description_de, 
        description_zh, description_ru, description_fil, description_vi,
        icon, color, imageUrl,
        schedule_type, interval_hours, interval_minutes,
        daily_times, weekly_day, weekly_time, specific_datetime,
        duration, is_featured, priority, rewards,
        min_level, max_level, min_reset
      FROM events
      WHERE is_active = TRUE
      ORDER BY priority DESC, name ASC
    `);

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obter eventos em destaque (para home)
 * GET /api/events/featured
 */
exports.getFeaturedEvents = async (req, res, next) => {
  try {
    const [events] = await db.query(`
      SELECT 
        id, name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
        description, description_en, description_es, description_de,
        description_zh, description_ru, description_fil, description_vi,
        icon, color, imageUrl,
        schedule_type, interval_hours, interval_minutes,
        daily_times, weekly_day, weekly_time,
        duration, rewards
      FROM events
      WHERE is_active = TRUE AND is_featured = TRUE
      ORDER BY priority DESC
      LIMIT 8
    `);

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obter detalhes de um evento específico
 * GET /api/events/:id
 */
exports.getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [events] = await db.query(`
      SELECT * FROM events WHERE id = ?
    `, [id]);

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Evento não encontrado'
      });
    }

    res.json({
      success: true,
      data: events[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calcular próxima ocorrência de um evento
 * GET /api/events/:id/next-occurrence
 */
exports.getNextOccurrence = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [events] = await db.query(`
      SELECT schedule_type, interval_hours, interval_minutes,
             daily_times, weekly_day, weekly_time, specific_datetime
      FROM events 
      WHERE id = ? AND is_active = TRUE
    `, [id]);

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Evento não encontrado'
      });
    }

    const event = events[0];
    const now = new Date();
    let nextOccurrence = null;

    switch (event.schedule_type) {
      case 'recurring':
        // Evento recorrente (a cada X horas)
        const intervalMs = (event.interval_hours * 60 + event.interval_minutes) * 60 * 1000;
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        
        let currentTime = startOfDay.getTime();
        while (currentTime <= now.getTime()) {
          currentTime += intervalMs;
        }
        nextOccurrence = new Date(currentTime);
        break;

      case 'daily':
        // Evento diário (horários específicos)
        if (event.daily_times) {
          const times = JSON.parse(event.daily_times);
          const today = new Date(now);
          
          for (const time of times) {
            const [hours, minutes] = time.split(':');
            const eventTime = new Date(today);
            eventTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            if (eventTime > now) {
              nextOccurrence = eventTime;
              break;
            }
          }
          
          // Se não encontrou hoje, pegar primeiro horário de amanhã
          if (!nextOccurrence) {
            const [hours, minutes] = times[0].split(':');
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            nextOccurrence = tomorrow;
          }
        }
        break;

      case 'weekly':
        // Evento semanal (dia e hora específicos)
        if (event.weekly_day !== null && event.weekly_time) {
          const targetDay = event.weekly_day;
          const [hours, minutes] = event.weekly_time.split(':');
          
          let daysUntilEvent = targetDay - now.getDay();
          if (daysUntilEvent < 0 || (daysUntilEvent === 0 && now.getHours() >= parseInt(hours))) {
            daysUntilEvent += 7;
          }
          
          nextOccurrence = new Date(now);
          nextOccurrence.setDate(now.getDate() + daysUntilEvent);
          nextOccurrence.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }
        break;

      case 'specific':
        // Evento específico (data/hora única)
        if (event.specific_datetime) {
          const specificDate = new Date(event.specific_datetime);
          if (specificDate > now) {
            nextOccurrence = specificDate;
          }
        }
        break;
    }

    res.json({
      success: true,
      data: {
        nextOccurrence,
        timeUntil: nextOccurrence ? nextOccurrence.getTime() - now.getTime() : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ==========================================
 * ADMIN ENDPOINTS (Requerem autenticação)
 * ==========================================
 */

/**
 * Listar todos os eventos (incluindo inativos)
 * GET /api/admin/events
 */
exports.getAllEventsAdmin = async (req, res, next) => {
  try {
    const [events] = await db.query(`
      SELECT * FROM events
      ORDER BY priority DESC, name ASC
    `);

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Criar novo evento
 * POST /api/admin/events
 */
exports.createEvent = async (req, res, next) => {
  try {
    const {
      name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
      description, description_en, description_es, description_de,
      description_zh, description_ru, description_fil, description_vi,
      icon, color, imageUrl,
      schedule_type, interval_hours, interval_minutes,
      daily_times, weekly_day, weekly_time, specific_datetime,
      duration, is_active, is_featured, priority, rewards,
      min_level, max_level, min_reset
    } = req.body;

    // Validações
    const validation = validateRequired({ name, schedule_type });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Inserir evento
    const [result] = await db.query(`
      INSERT INTO events (
        name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
        description, description_en, description_es, description_de,
        description_zh, description_ru, description_fil, description_vi,
        icon, color, imageUrl,
        schedule_type, interval_hours, interval_minutes,
        daily_times, weekly_day, weekly_time, specific_datetime,
        duration, is_active, is_featured, priority, rewards,
        min_level, max_level, min_reset,
        created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, name_en, name_es, name_de, name_zh, name_ru, name_fil, name_vi,
      description, description_en, description_es, description_de,
      description_zh, description_ru, description_fil, description_vi,
      icon || 'Trophy', color || 'yellow', imageUrl,
      schedule_type, interval_hours, interval_minutes,
      daily_times ? JSON.stringify(daily_times) : null,
      weekly_day, weekly_time, specific_datetime,
      duration || 60, is_active !== false, is_featured || false,
      priority || 0, rewards,
      min_level || 1, max_level || 400, min_reset || 0,
      req.user?.username || 'admin'
    ]);

    res.status(201).json({
      success: true,
      message: 'Evento criado com sucesso',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Atualizar evento existente
 * PUT /api/admin/events/:id
 */
exports.updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verificar se evento existe
    const [existing] = await db.query('SELECT id FROM events WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Evento não encontrado'
      });
    }

    // Construir query de atualização dinamicamente
    const allowedFields = [
      'name', 'name_en', 'name_es', 'name_de', 'name_zh', 'name_ru', 'name_fil', 'name_vi',
      'description', 'description_en', 'description_es', 'description_de',
      'description_zh', 'description_ru', 'description_fil', 'description_vi',
      'icon', 'color', 'imageUrl',
      'schedule_type', 'interval_hours', 'interval_minutes',
      'daily_times', 'weekly_day', 'weekly_time', 'specific_datetime',
      'duration', 'is_active', 'is_featured', 'priority', 'rewards',
      'min_level', 'max_level', 'min_reset'
    ];

    const updateFields = [];
    const updateValues = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        
        // Converter arrays para JSON
        if (field === 'daily_times' && Array.isArray(updates[field])) {
          updateValues.push(JSON.stringify(updates[field]));
        } else {
          updateValues.push(updates[field]);
        }
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo para atualizar'
      });
    }

    updateValues.push(id);

    await db.query(`
      UPDATE events 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues);

    res.json({
      success: true,
      message: 'Evento atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletar evento
 * DELETE /api/admin/events/:id
 */
exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Evento não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Evento deletado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Alternar status do evento (ativar/desativar)
 * PATCH /api/admin/events/:id/toggle
 */
exports.toggleEventStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.query(`
      UPDATE events 
      SET is_active = NOT is_active
      WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Status do evento alterado'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obter estatísticas de eventos
 * GET /api/admin/events/stats
 */
exports.getEventStats = async (req, res, next) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_featured = TRUE THEN 1 ELSE 0 END) as featured,
        COUNT(DISTINCT schedule_type) as types
      FROM events
    `);

    const [byType] = await db.query(`
      SELECT 
        schedule_type,
        COUNT(*) as count
      FROM events
      WHERE is_active = TRUE
      GROUP BY schedule_type
    `);

    res.json({
      success: true,
      data: {
        summary: stats[0],
        byType
      }
    });
  } catch (error) {
    next(error);
  }
};
