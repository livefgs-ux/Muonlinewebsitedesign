/**
 * ⚠️ SUPABASE EDGE FUNCTIONS - DESATIVADO
 * 
 * Este servidor Supabase foi MIGRADO para backend Node.js próprio.
 * 
 * Migração completa documentada em:
 * - /MIGRACAO_SUPABASE_PARA_NODEJS.md
 * - /backend-nodejs/README.md
 * 
 * Backend Node.js rodando em:
 * - http://localhost:3001/api (desenvolvimento)
 * - https://seusite.com/api (produção)
 */

import { Hono } from 'npm:hono@4.11.1';
import { cors } from 'npm:hono/cors';

const app = new Hono();

// CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Todas as rotas retornam 410 Gone
app.all('*', (c) => {
  return c.json({
    error: 'Supabase Edge Functions Desativado',
    message: 'Este servidor foi migrado para backend Node.js próprio.',
    migrationDocs: '/MIGRACAO_SUPABASE_PARA_NODEJS.md',
    newBackend: {
      development: 'http://localhost:3001/api',
      production: 'https://seusite.com/api'
    },
    instructions: [
      '1. Inicie o backend Node.js na VPS',
      '2. Configure o .env com credenciais do MariaDB',
      '3. Execute: pm2 start ecosystem.config.js',
      '4. Verifique: curl http://localhost:3001/health'
    ]
  }, 410); // 410 Gone - Recurso não está mais disponível
});

Deno.serve(app.fetch);
