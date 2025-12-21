/**
 * WCOIN PACKAGES CONTROLLER
 * Gerencia pacotes de WCoin configuráveis
 */

const db = require('../config/database');

/**
 * Listar todos os pacotes de WCoin
 */
const getAllPackages = async (req, res) => {
  try {
    const [packages] = await db.query(`
      SELECT 
        id,
        name,
        wcoin_amount,
        bonus_amount,
        price,
        currency,
        purchase_link,
        is_active,
        display_order,
        created_at,
        updated_at
      FROM wcoin_packages
      WHERE is_active = 1
      ORDER BY display_order ASC, wcoin_amount ASC
    `);

    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error('Erro ao buscar pacotes de WCoin:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pacotes de WCoin'
    });
  }
};

/**
 * Buscar pacote por ID
 */
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const [packages] = await db.query(`
      SELECT * FROM wcoin_packages WHERE id = ?
    `, [id]);

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pacote não encontrado'
      });
    }

    res.json({
      success: true,
      data: packages[0]
    });
  } catch (error) {
    console.error('Erro ao buscar pacote:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pacote'
    });
  }
};

/**
 * Criar novo pacote
 */
const createPackage = async (req, res) => {
  try {
    const {
      name,
      wcoin_amount,
      bonus_amount = 0,
      price,
      currency = 'BRL',
      purchase_link,
      is_active = 1,
      display_order = 0
    } = req.body;

    // Validações
    if (!name || !wcoin_amount || !price) {
      return res.status(400).json({
        success: false,
        error: 'Nome, quantidade de WCoin e preço são obrigatórios'
      });
    }

    if (wcoin_amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade de WCoin deve ser maior que zero'
      });
    }

    const [result] = await db.query(`
      INSERT INTO wcoin_packages (
        name,
        wcoin_amount,
        bonus_amount,
        price,
        currency,
        purchase_link,
        is_active,
        display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      wcoin_amount,
      bonus_amount,
      price,
      currency,
      purchase_link || '#',
      is_active,
      display_order
    ]);

    res.status(201).json({
      success: true,
      message: 'Pacote criado com sucesso',
      data: {
        id: result.insertId,
        name,
        wcoin_amount,
        bonus_amount,
        price,
        currency,
        purchase_link,
        is_active,
        display_order
      }
    });
  } catch (error) {
    console.error('Erro ao criar pacote:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar pacote'
    });
  }
};

/**
 * Atualizar pacote existente
 */
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      wcoin_amount,
      bonus_amount,
      price,
      currency,
      purchase_link,
      is_active,
      display_order
    } = req.body;

    // Verificar se pacote existe
    const [existing] = await db.query('SELECT id FROM wcoin_packages WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pacote não encontrado'
      });
    }

    // Validações
    if (wcoin_amount !== undefined && wcoin_amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade de WCoin deve ser maior que zero'
      });
    }

    // Construir query dinamicamente
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (wcoin_amount !== undefined) {
      updates.push('wcoin_amount = ?');
      values.push(wcoin_amount);
    }
    if (bonus_amount !== undefined) {
      updates.push('bonus_amount = ?');
      values.push(bonus_amount);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (currency !== undefined) {
      updates.push('currency = ?');
      values.push(currency);
    }
    if (purchase_link !== undefined) {
      updates.push('purchase_link = ?');
      values.push(purchase_link);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }

    updates.push('updated_at = NOW()');
    values.push(id);

    await db.query(`
      UPDATE wcoin_packages 
      SET ${updates.join(', ')}
      WHERE id = ?
    `, values);

    // Buscar pacote atualizado
    const [updated] = await db.query('SELECT * FROM wcoin_packages WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Pacote atualizado com sucesso',
      data: updated[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar pacote:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar pacote'
    });
  }
};

/**
 * Deletar pacote (soft delete)
 */
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM wcoin_packages WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pacote não encontrado'
      });
    }

    // Soft delete - apenas desativa
    await db.query(`
      UPDATE wcoin_packages 
      SET is_active = 0, updated_at = NOW()
      WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Pacote desativado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar pacote:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar pacote'
    });
  }
};

/**
 * Deletar pacote permanentemente
 */
const permanentDeletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM wcoin_packages WHERE id = ?', [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pacote não encontrado'
      });
    }

    await db.query('DELETE FROM wcoin_packages WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Pacote removido permanentemente'
    });
  } catch (error) {
    console.error('Erro ao deletar pacote:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar pacote'
    });
  }
};

/**
 * Listar todos os pacotes (incluindo inativos) - Admin
 */
const getAllPackagesAdmin = async (req, res) => {
  try {
    const [packages] = await db.query(`
      SELECT * FROM wcoin_packages
      ORDER BY display_order ASC, wcoin_amount ASC
    `);

    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pacotes'
    });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  permanentDeletePackage,
  getAllPackagesAdmin
};
