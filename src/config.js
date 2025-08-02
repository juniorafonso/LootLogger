const axios = require('axios')

const { version } = require('../package.json')

class Config {
  constructor() {
    this.events = {}

    this.ROTATE_LOGGER_FILE_KEY = 'd'
    this.RESTART_NETWORK_FILE_KEY = 'r'
    this.TITLE = `AO Loot Logger Clean - v${version} - All Players Logged`
  }

  async init({ eventsOverride } = {}) {
    return this.loadEvents(eventsOverride)
  }

  async loadEvents(eventsOverride) {
    if (eventsOverride) {
      return (this.events = eventsOverride)
    }

    const response = await axios.get(
      'https://matheus.sampaio.us/ao-loot-logger-configs/events-v8.0.0.json'
    )

    this.events = response.data
  }
}

module.exports = new Config()
