// ⚙️ CONFIGURAÇÃO DO BACKEND - Substitui as antigas referências ao Supabase
// 
// Este arquivo centraliza a configuração do backend para componentes legados
// que ainda usavam as antigas URLs do Supabase.
//
// MIGRAÇÃO: Todos os componentes devem usar /src/services/api.ts no futuro

import { API_CONFIG } from './api';

// Exporta a URL base do backend Node.js
export const backendUrl = API_CONFIG.BASE_URL;

// Para compatibilidade com componentes antigos que usavam projectId e publicAnonKey
// Estes não são mais necessários, mas mantemos para não quebrar código legado
export const projectId = 'deprecated'; // Não usado no novo backend
export const publicAnonKey = ''; // Não usado no novo backend

// Helper para construir URLs do backend (substitui as antigas URLs do Supabase)
export const getBackendUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper para headers de autenticação
export const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const authToken = token || localStorage.getItem('auth_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};
