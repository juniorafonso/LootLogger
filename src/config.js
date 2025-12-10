const axios = require('axios')

const { version } = require('../package.json')

class Config {
  constructor() {
    this.events = {}
    this.players = {}

    this.ROTATE_LOGGER_FILE_KEY = 'd'
    this.RESTART_NETWORK_FILE_KEY = 'r'
    this.SYNC_TIMESTAMP_KEY = 't'
    this.DEBUG_TIMESTAMP_KEY = 'y'
    this.AUTO_SYNC_TOGGLE_KEY = 'a'
    this.AUTO_SYNC_STATUS_KEY = 's'
    this.TITLE = `AO Loot Logger - v${version}`
  }

  async init({ eventsOverride, configsOverrride } = {}) {
    return Promise.all([
      this.loadEvents(eventsOverride)
    ])
  }

  async loadEvents(eventsOverride) {
    // Event IDs hardcoded localmente para não depender da API externa
    this.events = {
      EvInventoryPutItem: 26,
      EvNewCharacter: 29,
      EvNewEquipmentItem: 30,
      EvNewSiegeBannerItem: 31,
      EvNewSimpleItem: 32,
      EvNewLoot: 98,
      EvAttachItemContainer: 99,
      EvDetachItemContainer: 100,
      EvCharacterStats: 143,
      EvOtherGrabbedLoot: 275,
      EvDeathEvent: 165,
      EvNewLootChest: 300, // Placeholder - ajustar quando descoberto
      EvUpdateLootChest: 301, // Placeholder - ajustar quando descoberto
      EvMarketData: 75,
      OpInventoryMoveItem: 29,
      OpJoin: 2
    }

    console.info('✅ Event IDs loaded locally (no external dependency required)')
    return this.events
  }


}

module.exports = new Config()