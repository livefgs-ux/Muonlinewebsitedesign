// Utilitários de hash e verificação de senha com bcrypt
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // Recomendado para segurança máxima

/**
 * Gera hash seguro da senha usando bcrypt
 * @param {string} password - Senha em texto plano
 * @returns {Promise<string>} Hash da senha
 */
export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Erro ao gerar hash da senha:', error);
    throw new Error('Falha ao processar senha');
  }
}

/**
 * Verifica se a senha corresponde ao hash armazenado
 * @param {string} password - Senha em texto plano
 * @param {string} hash - Hash armazenado no banco
 * @returns {Promise<boolean>} True se a senha é válida
 */
export async function verifyPassword(password, hash) {
  try {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return false;
  }
}
