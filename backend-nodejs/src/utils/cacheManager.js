/**
 * Cache Manager - Sistema de Cache Centralizado
 * Baseado no WebEngine CMS Cache System
 * V.631 - Implementação Node.js
 */

const NodeCache = require('node-cache');

// ========================================================================
// CACHE INSTANCES
// ========================================================================

// Rankings cache - TTL: 5 minutos (300 segundos)
const rankingsCache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false
});

// Downloads cache - TTL: 1 hora (3600 segundos)
const downloadsCache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 120,
  useClones: false
});

// Online characters cache - TTL: 1 minuto (60 segundos)
const onlineCache = new NodeCache({
  stdTTL: 60,
  checkperiod: 15,
  useClones: false
});

// Guild cache - TTL: 10 minutos (600 segundos)
const guildCache = new NodeCache({
  stdTTL: 600,
  checkperiod: 120,
  useClones: false
});

// Server status cache - TTL: 30 segundos
const serverCache = new NodeCache({
  stdTTL: 30,
  checkperiod: 10,
  useClones: false
});

// Generic cache - TTL: 5 minutos (300 segundos)
const genericCache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false
});

// ========================================================================
// CACHE KEYS - Baseado no WebEngine
// ========================================================================

const CACHE_KEYS = {
  // Rankings
  RANKINGS_LEVEL: 'rankings:level',
  RANKINGS_RESETS: 'rankings:resets',
  RANKINGS_GRAND_RESETS: 'rankings:grand_resets',
  RANKINGS_PK: 'rankings:pk',
  RANKINGS_GUILDS: 'rankings:guilds',
  RANKINGS_MASTER_LEVEL: 'rankings:master_level',
  RANKINGS_GENS: 'rankings:gens',
  RANKINGS_ONLINE: 'rankings:online',
  
  // Downloads
  DOWNLOADS_LIST: 'downloads:list',
  
  // Online
  ONLINE_CHARACTERS: 'online:characters',
  ONLINE_COUNT: 'online:count',
  
  // Guilds
  GUILD_LIST: 'guild:list',
  GUILD_TOP: 'guild:top',
  
  // Server
  SERVER_STATUS: 'server:status',
  SERVER_INFO: 'server:info'
};

// ========================================================================
// CACHE MANAGER CLASS
// ========================================================================

class CacheManager {
  
  /**
   * Get cached data
   */
  static get(key, cacheType = 'generic') {
    const cache = this._getCache(cacheType);
    const data = cache.get(key);
    
    if (data !== undefined) {
      console.log(`✅ Cache HIT: ${key}`);
      return data;
    }
    
    console.log(`❌ Cache MISS: ${key}`);
    return null;
  }
  
  /**
   * Set cached data
   */
  static set(key, value, cacheType = 'generic', ttl = null) {
    const cache = this._getCache(cacheType);
    
    if (ttl) {
      cache.set(key, value, ttl);
    } else {
      cache.set(key, value);
    }
    
    console.log(`💾 Cache SET: ${key} (TTL: ${ttl || 'default'})`);
    return true;
  }
  
  /**
   * Delete cached data
   */
  static del(key, cacheType = 'generic') {
    const cache = this._getCache(cacheType);
    cache.del(key);
    console.log(`🗑️ Cache DELETE: ${key}`);
    return true;
  }
  
  /**
   * Clear specific cache type
   */
  static clearCache(cacheType = 'all') {
    if (cacheType === 'all') {
      rankingsCache.flushAll();
      downloadsCache.flushAll();
      onlineCache.flushAll();
      guildCache.flushAll();
      serverCache.flushAll();
      genericCache.flushAll();
      console.log('🗑️ ALL CACHES CLEARED');
    } else {
      const cache = this._getCache(cacheType);
      cache.flushAll();
      console.log(`🗑️ Cache cleared: ${cacheType}`);
    }
    return true;
  }
  
  /**
   * Get cache statistics
   */
  static getStats(cacheType = 'all') {
    if (cacheType === 'all') {
      return {
        rankings: rankingsCache.getStats(),
        downloads: downloadsCache.getStats(),
        online: onlineCache.getStats(),
        guild: guildCache.getStats(),
        server: serverCache.getStats(),
        generic: genericCache.getStats()
      };
    } else {
      const cache = this._getCache(cacheType);
      return cache.getStats();
    }
  }
  
  /**
   * Get all cache keys
   */
  static getKeys(cacheType = 'all') {
    if (cacheType === 'all') {
      return {
        rankings: rankingsCache.keys(),
        downloads: downloadsCache.keys(),
        online: onlineCache.keys(),
        guild: guildCache.keys(),
        server: serverCache.keys(),
        generic: genericCache.keys()
      };
    } else {
      const cache = this._getCache(cacheType);
      return cache.keys();
    }
  }
  
  /**
   * Check if key exists in cache
   */
  static has(key, cacheType = 'generic') {
    const cache = this._getCache(cacheType);
    return cache.has(key);
  }
  
  /**
   * Get TTL for a key
   */
  static getTTL(key, cacheType = 'generic') {
    const cache = this._getCache(cacheType);
    return cache.getTtl(key);
  }
  
  /**
   * Update TTL for a key
   */
  static setTTL(key, ttl, cacheType = 'generic') {
    const cache = this._getCache(cacheType);
    return cache.ttl(key, ttl);
  }
  
  /**
   * Get cache instance by type
   */
  static _getCache(type) {
    switch (type) {
      case 'rankings':
        return rankingsCache;
      case 'downloads':
        return downloadsCache;
      case 'online':
        return onlineCache;
      case 'guild':
        return guildCache;
      case 'server':
        return serverCache;
      case 'generic':
      default:
        return genericCache;
    }
  }
}

// ========================================================================
// HELPER FUNCTIONS - WebEngine Style
// ========================================================================

/**
 * Update Rankings Cache (WebEngine: UpdateRankingCache)
 */
async function updateRankingsCache(type, data) {
  const key = CACHE_KEYS[`RANKINGS_${type.toUpperCase()}`];
  if (key) {
    CacheManager.set(key, data, 'rankings');
    return true;
  }
  return false;
}

/**
 * Update Downloads Cache (WebEngine: updateDownloadsCache)
 */
async function updateDownloadsCache(data) {
  CacheManager.set(CACHE_KEYS.DOWNLOADS_LIST, data, 'downloads');
  return true;
}

/**
 * Update Online Characters Cache (WebEngine: online_characters.cache)
 */
async function updateOnlineCharactersCache(data) {
  CacheManager.set(CACHE_KEYS.ONLINE_CHARACTERS, data, 'online');
  CacheManager.set(CACHE_KEYS.ONLINE_COUNT, data.length, 'online');
  return true;
}

/**
 * Get Rankings from Cache (WebEngine: LoadCacheData)
 */
function getRankingsCache(type) {
  const key = CACHE_KEYS[`RANKINGS_${type.toUpperCase()}`];
  if (key) {
    return CacheManager.get(key, 'rankings');
  }
  return null;
}

/**
 * Get Downloads from Cache
 */
function getDownloadsCache() {
  return CacheManager.get(CACHE_KEYS.DOWNLOADS_LIST, 'downloads');
}

/**
 * Get Online Characters from Cache
 */
function getOnlineCharactersCache() {
  return CacheManager.get(CACHE_KEYS.ONLINE_CHARACTERS, 'online');
}

// ========================================================================
// EXPORTS
// ========================================================================

module.exports = {
  CacheManager,
  CACHE_KEYS,
  
  // Helper functions
  updateRankingsCache,
  updateDownloadsCache,
  updateOnlineCharactersCache,
  getRankingsCache,
  getDownloadsCache,
  getOnlineCharactersCache,
  
  // Direct cache instances (for advanced usage)
  rankingsCache,
  downloadsCache,
  onlineCache,
  guildCache,
  serverCache,
  genericCache
};
