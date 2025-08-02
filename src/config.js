const axios = require('axios')

const { version } = require('../package.json')

class Config {
  constructor() {
    this.events = {}

    this.ROTATE_LOGGER_FILE_KEY = 'd'
    this.RESTART_NETWORK_FILE_KEY = 'r'
    this.TITLE = `LootLogger - v${version} - Transparent Loot Logging`
  }

  async init({ eventsOverride } = {}) {
    return this.loadEvents(eventsOverride)
  }

  async loadEvents(eventsOverride) {
    if (eventsOverride) {
      return (this.events = eventsOverride)
    }

    const response = await axios.get(
      'https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/items.json'
    )

    this.events = response.data
  }
}

module.exports = new Config()
