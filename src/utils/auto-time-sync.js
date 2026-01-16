/**
 * Automatic Time Sync Service
 * Uses reliable time servers for consistent timestamps across all clients
 * Fast, reliable, no external dependencies on unstable APIs!
 */

const axios = require('axios')
const EventTimestamp = require('./event-timestamp')
const Logger = require('./logger')

class AutoTimeSyncService {
  constructor() {
    this.syncInterval = null
    this.isRunning = false
    this.syncIntervalMs = 30000 // 30 seconds default
    this.lastSyncTime = null
    this.syncErrorShown = false // Para mostrar erro apenas uma vez
    this.syncCount = 0
    this.failCount = 0
    
    // Sua API própria - rápida e confiável!
    this.timeAPIs = [
      {
        name: 'LootLogger Time API',
        url: 'https://time.recckless.com/time',
        parser: (data) => new Date(data.utc)
      }
    ]
  }

  /**
   * Starts automatic synchronization
   * @param {number} intervalSeconds - Not used anymore, kept for compatibility
   */
  start(intervalSeconds = null) {
    if (this.isRunning) {
      console.log(`⏰ [AutoSync] Synchronization already done`)
      return
    }

    this.isRunning = true
    
    console.log(`🚀 [AutoSync] Performing single synchronization at startup`)
    console.log(`⚠️ First synchronization still in progress...`)
    
    // Only sync once at startup
    this.performSync()
  }

  /**
   * Stops automatic synchronization
   */
  stop() {
    if (!this.isRunning) {
      console.log(`⏰ [AutoSync] Not running`)
      return
    }

    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
    
    this.isRunning = false
    console.log(`⏹️ [AutoSync] Automatic synchronization stopped`)
    console.log(`📊 [AutoSync] Statistics: ${this.syncCount} syncs, ${this.failCount} failures`)
  }

  /**
   * Performs a single synchronization attempt
   */
  async performSync() {
    try {
      const serverTime = await this.getServerTime()
      if (serverTime) {
        EventTimestamp.synchronizeTo(serverTime)
        this.lastSyncTime = new Date()
        this.syncCount++
        
        const calibrationInfo = EventTimestamp.getCalibrationInfo()
        console.log(`✅ [AutoSync] Time synchronized successfully! Offset: ${calibrationInfo.offsetSeconds}s`);
        console.log(`🌐 [AutoSync] Consistent timestamps enabled for all users`);
      }
    } catch (error) {
      this.failCount++
      // Erro já foi mostrado no getServerTime(), não precisa repetir aqui
    }
  }

  /**
   * Gets current time from your own API
   * @returns {Promise<Date>} Server time
   */
  async getServerTime() {
    const api = this.timeAPIs[0]; // Sua API própria

    // Tenta 2 vezes com timeouts rápidos
    const maxRetries = 2;
    const timeouts = [3000, 5000]; // 3s, 5s (muito mais rápido!)

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`🔄 [AutoSync] Connecting to time server ${attempt + 1}/${maxRetries} (timeout: ${timeouts[attempt]/1000}s)...`);
        
        const response = await axios.get(api.url, { 
          timeout: timeouts[attempt],
          headers: {
            'User-Agent': 'LootLogger-TimeSync/1.0'
          }
        });
        
        const serverTime = api.parser(response.data);
        
        if (serverTime && !isNaN(serverTime.getTime())) {
          console.log(`✅ [AutoSync] Successfully synchronized with ${api.name}`);
          return serverTime;
        }
      } catch (error) {
        console.log(`⚠️ [AutoSync] Attempt ${attempt + 1} failed: ${error.message}`);
        
        // Se não é a última tentativa, continue
        if (attempt < maxRetries - 1) {
          continue;
        }
        
        // Se chegou aqui, todas as tentativas falharam
        if (!this.syncErrorShown) {
          console.log(`❌ [AutoSync] Unable to connect to ${api.name} - using local time as fallback`);
          console.log(`🔧 [AutoSync] Check network connectivity for accurate timestamps`);
          this.syncErrorShown = true;
        }
        throw error;
      }
    }
    
    throw new Error(`${api.name} não respondeu após ${maxRetries} tentativas`);
  }

  /**
   * Gets synchronization status
   * @returns {Object} Status information
   */
  getStatus() {
    const calibrationInfo = EventTimestamp.getCalibrationInfo()
    return {
      isRunning: this.isRunning,
      intervalSeconds: this.syncIntervalMs / 1000,
      lastSyncTime: this.lastSyncTime,
      syncCount: this.syncCount,
      failCount: this.failCount,
      isCalibrated: calibrationInfo.isCalibrated,
      offsetMs: calibrationInfo.offsetMs,
      offsetSeconds: calibrationInfo.offsetSeconds,
      nextSyncIn: this.isRunning ? Math.max(0, this.syncIntervalMs - (Date.now() - (this.lastSyncTime?.getTime() || 0))) : null
    }
  }

  /**
   * Manual sync for testing
   */
  async syncNow() {
    console.log(`🔄 [AutoSync] Sincronização manual solicitada...`)
    await this.performSync()
  }

  /**
   * Shows detailed status
   */
  showStatus() {
    const status = this.getStatus()
    const localTime = new Date()
    
    console.log(`\n📊 === STATUS DA SINCRONIZAÇÃO AUTOMÁTICA ===`)
    console.log(`🔄 Estado: ${status.isRunning ? '🟢 ATIVO' : '🔴 PARADO'}`)
    if (status.isRunning) {
      console.log(`⏱️  Intervalo: ${status.intervalSeconds} segundos`)
      console.log(`⏰ Próximo sync: ${Math.round(status.nextSyncIn / 1000)}s`)
    }
    console.log(`📈 Syncs realizados: ${status.syncCount}`)
    console.log(`❌ Falhas: ${status.failCount}`)
    console.log(`🎯 Calibrado: ${status.isCalibrated ? 'SIM' : 'NÃO'}`)
    if (status.isCalibrated) {
      console.log(`🔄 Offset atual: ${status.offsetSeconds}s`)
      console.log(`🖥️  Tempo local: ${localTime.toISOString()}`)
      console.log(`🌐 Tempo sync:  ${new Date(localTime.getTime() + status.offsetMs).toISOString()}`)
    }
    if (status.lastSyncTime) {
      const timeSinceSync = Math.round((Date.now() - status.lastSyncTime.getTime()) / 1000)
      console.log(`⏳ Último sync: ${timeSinceSync}s atrás`)
    }
    console.log(`================================================\n`)
  }
}

module.exports = new AutoTimeSyncService()
