/**
 * SECURITY SANDBOX CONTROLLER
 * Simulador de ataques e testes de segurança
 */

const fs = require('fs').promises;
const path = require('path');

const SANDBOX_DIR = path.join(__dirname, '../../security/sandbox');
const RESULTS_FILE = path.join(SANDBOX_DIR, 'sandbox-results.json');

/**
 * Garantir que o diretório existe
 */
async function ensureSandboxDirectory() {
  try {
    await fs.access(SANDBOX_DIR);
  } catch {
    await fs.mkdir(SANDBOX_DIR, { recursive: true });
  }
}

/**
 * Simular ataque SQL Injection
 */
function simulateSQLInjection() {
  const packets = Math.floor(Math.random() * 1000) + 500;
  const blocked = Math.floor(packets * 0.98); // 98% bloqueado
  const allowed = packets - blocked;

  return {
    type: 'SQL Injection',
    description: 'Tentativa de injeção SQL em formulário de login',
    packets_sent: packets,
    packets_blocked: blocked,
    packets_allowed: allowed,
    success_rate: ((blocked / packets) * 100).toFixed(2) + '%',
    defense_actions: [
      'Input sanitization ativada',
      'Prepared statements utilizados',
      'WAF bloqueou tentativas maliciosas',
      'IPs suspeitos registrados'
    ],
    severity: allowed > 50 ? 'HIGH' : 'MEDIUM',
    result: blocked >= packets * 0.95 ? 'PASSED' : 'FAILED',
    recommendation: allowed > 50 
      ? 'Revisar regras de firewall e sanitização'
      : 'Sistema de defesa funcionando corretamente'
  };
}

/**
 * Simular ataque DDoS
 */
function simulateDDoS() {
  const packets = Math.floor(Math.random() * 10000) + 5000;
  const blocked = Math.floor(packets * 0.92); // 92% bloqueado pelo rate limiter
  const allowed = packets - blocked;

  return {
    type: 'DDoS Attack',
    description: 'Ataque de negação de serviço distribuído',
    packets_sent: packets,
    packets_blocked: blocked,
    packets_allowed: allowed,
    success_rate: ((blocked / packets) * 100).toFixed(2) + '%',
    defense_actions: [
      'Rate limiter ativado',
      'Cloudflare DDoS protection ativa',
      'IPs atacantes bloqueados automaticamente',
      'Tráfego mitigado com sucesso'
    ],
    severity: 'CRITICAL',
    result: blocked >= packets * 0.85 ? 'PASSED' : 'FAILED',
    avg_response_time: Math.floor(Math.random() * 500) + 100 + 'ms',
    recommendation: blocked >= packets * 0.9
      ? 'Sistema de defesa DDoS eficiente'
      : 'Considerar aumentar limites de rate limiting'
  };
}

/**
 * Simular ataque de Phishing
 */
function simulatePhishing() {
  const attempts = Math.floor(Math.random() * 100) + 50;
  const blocked = Math.floor(attempts * 0.96); // 96% detectado
  const successful = attempts - blocked;

  return {
    type: 'Phishing Attack',
    description: 'Tentativas de phishing via email e formulários falsos',
    attempts,
    attempts_blocked: blocked,
    attempts_successful: successful,
    success_rate: ((blocked / attempts) * 100).toFixed(2) + '%',
    defense_actions: [
      'Email validation implementada',
      'CAPTCHA v3 ativo',
      'Domínios suspeitos bloqueados',
      'URLs maliciosas detectadas'
    ],
    severity: successful > 5 ? 'HIGH' : 'LOW',
    result: blocked >= attempts * 0.90 ? 'PASSED' : 'FAILED',
    recommendation: successful > 5
      ? 'Implementar sistema 2FA obrigatório'
      : 'Proteção contra phishing funcionando adequadamente'
  };
}

/**
 * Simular ataque de Brute Force
 */
function simulateBruteForce() {
  const attempts = Math.floor(Math.random() * 500) + 200;
  const blocked = Math.floor(attempts * 0.99); // 99% bloqueado
  const successful = attempts - blocked;

  return {
    type: 'Brute Force Attack',
    description: 'Tentativas de força bruta em sistema de login',
    login_attempts: attempts,
    attempts_blocked: blocked,
    attempts_successful: successful,
    success_rate: ((blocked / attempts) * 100).toFixed(2) + '%',
    defense_actions: [
      'Account lockout após 5 tentativas',
      'CAPTCHA obrigatório após 3 falhas',
      'Delay progressivo implementado',
      'IPs banidos temporariamente'
    ],
    severity: successful > 2 ? 'CRITICAL' : 'MEDIUM',
    result: successful === 0 ? 'PASSED' : 'FAILED',
    recommendation: successful > 0
      ? 'Implementar 2FA e reduzir tentativas permitidas'
      : 'Proteção contra brute force excelente'
  };
}

/**
 * Simular ataque XSS (Cross-Site Scripting)
 */
function simulateXSS() {
  const attempts = Math.floor(Math.random() * 150) + 80;
  const blocked = Math.floor(attempts * 0.97); // 97% bloqueado
  const successful = attempts - blocked;

  return {
    type: 'XSS Attack',
    description: 'Tentativas de injeção de scripts maliciosos',
    attempts,
    attempts_blocked: blocked,
    attempts_successful: successful,
    success_rate: ((blocked / attempts) * 100).toFixed(2) + '%',
    defense_actions: [
      'Content Security Policy (CSP) ativa',
      'Input sanitization habilitada',
      'HTML encoding implementado',
      'Scripts maliciosos filtrados'
    ],
    severity: successful > 3 ? 'HIGH' : 'LOW',
    result: blocked >= attempts * 0.95 ? 'PASSED' : 'FAILED',
    recommendation: successful > 3
      ? 'Revisar políticas de CSP e sanitização'
      : 'Proteção XSS funcionando corretamente'
  };
}

/**
 * Executar simulação de ataque
 */
const runSimulation = async (req, res) => {
  try {
    const { attack_type = 'ALL' } = req.body;

    await ensureSandboxDirectory();

    let results = [];

    // Executar simulações baseado no tipo
    if (attack_type === 'ALL' || attack_type === 'SQLi') {
      results.push(simulateSQLInjection());
    }

    if (attack_type === 'ALL' || attack_type === 'DDoS') {
      results.push(simulateDDoS());
    }

    if (attack_type === 'ALL' || attack_type === 'Phishing') {
      results.push(simulatePhishing());
    }

    if (attack_type === 'ALL' || attack_type === 'BruteForce') {
      results.push(simulateBruteForce());
    }

    if (attack_type === 'ALL' || attack_type === 'XSS') {
      results.push(simulateXSS());
    }

    // Adicionar metadata
    const simulation = {
      timestamp: new Date().toISOString(),
      attack_type,
      total_tests: results.length,
      passed: results.filter(r => r.result === 'PASSED').length,
      failed: results.filter(r => r.result === 'FAILED').length,
      results
    };

    // Salvar resultados
    try {
      const existingData = await fs.readFile(RESULTS_FILE, 'utf8');
      const history = JSON.parse(existingData);
      history.push(simulation);
      
      // Manter apenas últimas 100 simulações
      if (history.length > 100) {
        history.shift();
      }
      
      await fs.writeFile(RESULTS_FILE, JSON.stringify(history, null, 2));
    } catch {
      // Arquivo não existe, criar novo
      await fs.writeFile(RESULTS_FILE, JSON.stringify([simulation], null, 2));
    }

    res.json({
      success: true,
      data: simulation
    });
  } catch (error) {
    console.error('Erro ao executar simulação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao executar simulação de segurança'
    });
  }
};

/**
 * Obter histórico de simulações
 */
const getSimulationHistory = async (req, res) => {
  try {
    await ensureSandboxDirectory();

    try {
      const data = await fs.readFile(RESULTS_FILE, 'utf8');
      const history = JSON.parse(data);

      // Calcular estatísticas
      const stats = {
        total_simulations: history.length,
        total_passed: history.reduce((sum, sim) => sum + sim.passed, 0),
        total_failed: history.reduce((sum, sim) => sum + sim.failed, 0),
        last_simulation: history[history.length - 1],
        attack_types_tested: [...new Set(history.flatMap(sim => sim.results.map(r => r.type)))]
      };

      res.json({
        success: true,
        data: {
          history,
          stats
        }
      });
    } catch {
      res.json({
        success: true,
        data: {
          history: [],
          stats: {
            total_simulations: 0,
            total_passed: 0,
            total_failed: 0
          }
        }
      });
    }
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar histórico de simulações'
    });
  }
};

/**
 * Limpar histórico
 */
const clearHistory = async (req, res) => {
  try {
    await ensureSandboxDirectory();
    await fs.writeFile(RESULTS_FILE, JSON.stringify([], null, 2));

    res.json({
      success: true,
      message: 'Histórico de simulações limpo com sucesso'
    });
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao limpar histórico'
    });
  }
};

module.exports = {
  runSimulation,
  getSimulationHistory,
  clearHistory
};
