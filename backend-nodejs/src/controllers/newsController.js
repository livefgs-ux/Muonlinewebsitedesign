/**
 * Controller de Notícias
 */

const { executeQuery } = require('../config/database');
const { formatDateForMySQL, successResponse, errorResponse } = require('../utils/helpers');

// Nome da tabela de notícias (criar manualmente no banco)
const NEWS_TABLE = 'website_news';

/**
 * Listar todas as notícias
 */
const getAllNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const category = req.query.category;
    
    let sql = `
      SELECT 
        id,
        title,
        content,
        category,
        priority,
        author,
        created_at,
        updated_at,
        views
      FROM ${NEWS_TABLE}
      WHERE 1=1
    `;
    
    const params = [];
    
    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }
    
    sql += ` ORDER BY priority DESC, created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const result = await executeQuery(sql, params);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao buscar notícias', 500);
    }
    
    return successResponse(res, result.data);
    
  } catch (error) {
    console.error('❌ Erro ao buscar notícias:', error);
    return errorResponse(res, 'Erro ao buscar notícias', 500);
  }
};

/**
 * Obter notícia por ID
 */
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `
      SELECT 
        id,
        title,
        content,
        category,
        priority,
        author,
        created_at,
        updated_at,
        views
      FROM ${NEWS_TABLE}
      WHERE id = ?
    `;
    
    const result = await executeQuery(sql, [id]);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao buscar notícia', 500);
    }
    
    if (result.data.length === 0) {
      return errorResponse(res, 'Notícia não encontrada', 404);
    }
    
    // Incrementar visualizações
    await executeQuery(`UPDATE ${NEWS_TABLE} SET views = views + 1 WHERE id = ?`, [id]);
    
    return successResponse(res, result.data[0]);
    
  } catch (error) {
    console.error('❌ Erro ao buscar notícia:', error);
    return errorResponse(res, 'Erro ao buscar notícia', 500);
  }
};

/**
 * Criar notícia (admin)
 */
const createNews = async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;
    const author = req.user.accountId;
    
    const sql = `
      INSERT INTO ${NEWS_TABLE} 
      (title, content, category, priority, author, created_at, updated_at, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `;
    
    const currentDate = formatDateForMySQL();
    
    const result = await executeQuery(sql, [
      title,
      content,
      category,
      priority || 'normal',
      author,
      currentDate,
      currentDate
    ]);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao criar notícia', 500);
    }
    
    return successResponse(res, {
      id: result.data.insertId,
      title,
      category,
      author
    }, 'Notícia criada com sucesso', 201);
    
  } catch (error) {
    console.error('❌ Erro ao criar notícia:', error);
    return errorResponse(res, 'Erro ao criar notícia', 500);
  }
};

/**
 * Atualizar notícia (admin)
 */
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, priority } = req.body;
    
    const sql = `
      UPDATE ${NEWS_TABLE}
      SET 
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        category = COALESCE(?, category),
        priority = COALESCE(?, priority),
        updated_at = ?
      WHERE id = ?
    `;
    
    const currentDate = formatDateForMySQL();
    
    const result = await executeQuery(sql, [
      title,
      content,
      category,
      priority,
      currentDate,
      id
    ]);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao atualizar notícia', 500);
    }
    
    if (result.data.affectedRows === 0) {
      return errorResponse(res, 'Notícia não encontrada', 404);
    }
    
    return successResponse(res, { id }, 'Notícia atualizada com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar notícia:', error);
    return errorResponse(res, 'Erro ao atualizar notícia', 500);
  }
};

/**
 * Deletar notícia (admin)
 */
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sql = `DELETE FROM ${NEWS_TABLE} WHERE id = ?`;
    
    const result = await executeQuery(sql, [id]);
    
    if (!result.success) {
      return errorResponse(res, 'Erro ao deletar notícia', 500);
    }
    
    if (result.data.affectedRows === 0) {
      return errorResponse(res, 'Notícia não encontrada', 404);
    }
    
    return successResponse(res, { id }, 'Notícia deletada com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao deletar notícia:', error);
    return errorResponse(res, 'Erro ao deletar notícia', 500);
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};
