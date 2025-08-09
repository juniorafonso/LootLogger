/**
 * Automatic Ti    this.timeAPIs = [
      {
        name: 'TimeAPI.io',
        url: 'https://timeapi.io/api/Time/current/zone?timeZone=UTC',
        parser: (data) => new Date(data.dateTime)
      }
    ]n Service
 * Keeps all clients synchronized with external time APIs
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
    
    // Multiple time APIs for redundancy
    this.timeAPIs = [
      {
        name: 'TimeAPI.io',
        url: 'https://timeapi.io/api/Time/current/zone?timeZone=UTC',
        parser: (data) => new Date(data.dateTime)
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
        console.log(`✅ [AutoSync] Synchronized successfully! Offset: ${calibrationInfo.offsetSeconds}s`)
      }
    } catch (error) {
      this.failCount++
      // Erro já foi mostrado no getServerTime(), não precisa repetir aqui
    }
  }

  /**
   * Gets current time from external APIs
   * @returns {Promise<Date>} Server time
   */
  async getServerTime() {
    // Usa APENAS TimeAPI.io para garantir que todos os players usem exatamente a mesma fonte
    const api = this.timeAPIs[0]; // TimeAPI.io

    try {
      const response = await axios.get(api.url, { 
        timeout: 3000,
        headers: {
          'User-Agent': 'LootLogger-TimeSync/1.0'
        }
      });
      
      const serverTime = api.parser(response.data);
      
      if (serverTime && !isNaN(serverTime.getTime())) {
        return serverTime;
      }
    } catch (error) {
      // Mostra erro apenas uma vez por sessão
      if (!this.syncErrorShown) {
        console.log(`❌ [AutoSync] Unable to synchronize with ${api.name}`);
        this.syncErrorShown = true;
      }
      throw error;
    }
    
    throw new Error('TimeAPI.io não retornou tempo válido');
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
