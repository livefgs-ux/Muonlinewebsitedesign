/**
 * 📰 AdminCP - News Management Routes
 * Sistema de notícias multiidioma com editor
 */

const express = require('express');
const router = express.Router();
const db = require('../../config/database');

/**
 * GET /api/admin/news
 * Lista todas as notícias
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, language = 'pt_BR', category } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        n.id,
        n.category,
        n.author,
        n.published_at as publishedAt,
        n.visible_home as visibleHome,
        n.featured,
        t.title,
        t.content,
        t.excerpt,
        t.language
      FROM webmu_news n
      LEFT JOIN webmu_news_translations t ON n.id = t.news_id AND t.language = ?
      WHERE 1=1
    `;
    
    const params = [language];

    if (category) {
      query += ` AND n.category = ?`;
      params.push(category);
    }

    query += ` ORDER BY n.published_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [news] = await db.query(query, params);

    // Total count
    let countQuery = 'SELECT COUNT(*) as total FROM webmu_news WHERE 1=1';
    const countParams = [];
    
    if (category) {
      countQuery += ` AND category = ?`;
      countParams.push(category);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar notícias',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/news/:id
 * Detalhes de uma notícia (todas as traduções)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [newsItems] = await db.query(`
      SELECT 
        id,
        category,
        author,
        published_at as publishedAt,
        visible_home as visibleHome,
        featured,
        created_at as createdAt,
        updated_at as updatedAt
      FROM webmu_news
      WHERE id = ?
    `, [id]);

    if (newsItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notícia não encontrada'
      });
    }

    // Get all translations
    const [translations] = await db.query(`
      SELECT 
        language,
        title,
        content,
        excerpt
      FROM webmu_news_translations
      WHERE news_id = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        news: newsItems[0],
        translations: translations
      }
    });

  } catch (error) {
    console.error('Error fetching news details:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar detalhes da notícia',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/news
 * Criar nova notícia
 */
router.post('/', async (req, res) => {
  try {
    const { 
      category, 
      author, 
      visibleHome = false, 
      featured = false,
      translations 
    } = req.body;

    // Validate translations
    if (!translations || !Array.isArray(translations) || translations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pelo menos uma tradução é necessária'
      });
    }

    // Insert news
    const [result] = await db.query(`
      INSERT INTO webmu_news (category, author, visible_home, featured, published_at, created_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `, [category, author || req.user.username, visibleHome, featured]);

    const newsId = result.insertId;

    // Insert translations
    for (const translation of translations) {
      await db.query(`
        INSERT INTO webmu_news_translations (news_id, language, title, content, excerpt)
        VALUES (?, ?, ?, ?, ?)
      `, [
        newsId,
        translation.language,
        translation.title,
        translation.content,
        translation.excerpt || ''
      ]);
    }

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'news_create', ?, NOW())
    `, [req.user.username, JSON.stringify({ newsId, category })]);

    res.json({
      success: true,
      message: 'Notícia criada com sucesso',
      data: { id: newsId }
    });

  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar notícia',
      error: error.message
    });
  }
});

/**
 * PUT /api/admin/news/:id
 * Atualizar notícia existente
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      category, 
      visibleHome, 
      featured,
      translations 
    } = req.body;

    // Update news
    const updates = [];
    const params = [];

    if (category) {
      updates.push('category = ?');
      params.push(category);
    }

    if (visibleHome !== undefined) {
      updates.push('visible_home = ?');
      params.push(visibleHome);
    }

    if (featured !== undefined) {
      updates.push('featured = ?');
      params.push(featured);
    }

    if (updates.length > 0) {
      updates.push('updated_at = NOW()');
      params.push(id);

      await db.query(`
        UPDATE webmu_news
        SET ${updates.join(', ')}
        WHERE id = ?
      `, params);
    }

    // Update translations
    if (translations && Array.isArray(translations)) {
      for (const translation of translations) {
        // Check if translation exists
        const [existing] = await db.query(`
          SELECT id FROM webmu_news_translations
          WHERE news_id = ? AND language = ?
        `, [id, translation.language]);

        if (existing.length > 0) {
          // Update existing translation
          await db.query(`
            UPDATE webmu_news_translations
            SET title = ?, content = ?, excerpt = ?
            WHERE news_id = ? AND language = ?
          `, [
            translation.title,
            translation.content,
            translation.excerpt || '',
            id,
            translation.language
          ]);
        } else {
          // Insert new translation
          await db.query(`
            INSERT INTO webmu_news_translations (news_id, language, title, content, excerpt)
            VALUES (?, ?, ?, ?, ?)
          `, [
            id,
            translation.language,
            translation.title,
            translation.content,
            translation.excerpt || ''
          ]);
        }
      }
    }

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'news_update', ?, NOW())
    `, [req.user.username, JSON.stringify({ newsId: id, updates: req.body })]);

    res.json({
      success: true,
      message: 'Notícia atualizada com sucesso'
    });

  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar notícia',
      error: error.message
    });
  }
});

/**
 * DELETE /api/admin/news/:id
 * Deletar notícia
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete translations first
    await db.query(`
      DELETE FROM webmu_news_translations
      WHERE news_id = ?
    `, [id]);

    // Delete news
    await db.query(`
      DELETE FROM webmu_news
      WHERE id = ?
    `, [id]);

    // Log the action
    await db.query(`
      INSERT INTO webmu_logs (admin_user, action, details, created_at)
      VALUES (?, 'news_delete', ?, NOW())
    `, [req.user.username, JSON.stringify({ newsId: id })]);

    res.json({
      success: true,
      message: 'Notícia deletada com sucesso'
    });

  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar notícia',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/news/:id/toggle-home
 * Toggle visibilidade na home
 */
router.post('/:id/toggle-home', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`
      UPDATE webmu_news
      SET visible_home = NOT visible_home, updated_at = NOW()
      WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Visibilidade atualizada com sucesso'
    });

  } catch (error) {
    console.error('Error toggling home visibility:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar visibilidade',
      error: error.message
    });
  }
});

/**
 * POST /api/admin/news/:id/toggle-featured
 * Toggle destaque
 */
router.post('/:id/toggle-featured', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`
      UPDATE webmu_news
      SET featured = NOT featured, updated_at = NOW()
      WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Destaque atualizado com sucesso'
    });

  } catch (error) {
    console.error('Error toggling featured:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar destaque',
      error: error.message
    });
  }
});

module.exports = router;
