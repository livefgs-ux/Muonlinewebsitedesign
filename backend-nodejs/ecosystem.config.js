/**
 * Configuração PM2 para rodar o servidor 24/7
 * 
 * Comandos:
 * - Iniciar: pm2 start ecosystem.config.js
 * - Parar: pm2 stop meumu-api
 * - Reiniciar: pm2 restart meumu-api
 * - Logs: pm2 logs meumu-api
 * - Monitorar: pm2 monit
 */

module.exports = {
  apps: [{
    name: 'meumu-api',
    script: './src/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
