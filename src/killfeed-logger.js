const fs = require('fs')
const EventTimestamp = require('./utils/event-timestamp')

const { red, green } = require('./utils/colors')
const formatPlayerName = require('./utils/format-player-name')
const VersionManager = require('./version')

class KillfeedLogger {
  constructor() {
    this.stream = null
    this.logFileName = null

    this.createNewLogFileName()
  }

  init() {
    if (this.stream != null) {
      this.stream.close()
    }

    this.stream = fs.createWriteStream(this.logFileName, { flags: 'a' })

    const header = [
      'date',
      'utc_time',
      'killed_player__guild',
      'killed_player__name',
      'killer_player__guild',
      'killer_player__name',
      'event_type',
      'logger_version'
    ].join(';')

    this.stream.write(header + '\n')

    process.on('exit', () => {
      this.close()
    })
  }

  createNewLogFileName() {
    // Use UTC synchronized time for consistent file names
    const d = EventTimestamp.getEventTime()

    const datetime = [
      d.getUTCFullYear(),
      d.getUTCMonth() + 1,
      d.getUTCDate(),
      d.getUTCHours(),
      d.getUTCMinutes(),
      d.getUTCSeconds()
    ]
      .map((n) => n.toString().padStart(2, '0'))
      .join('-')

    this.logFileName = `killfeed-events-${datetime}.txt`
  }

  write({ date, killedPlayer, killerPlayer, eventType }) {
    if (this.stream == null) {
      this.init()
    }

    // Format timestamps for EU format (dd-mm-yyyy) and UTC time (hh:mm:ss)
    const day = date.getUTCDate().toString().padStart(2, '0')
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const year = date.getUTCFullYear()
    const dateFormatted = `${day}-${month}-${year}` // dd-mm-yyyy

    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')
    const seconds = date.getUTCSeconds().toString().padStart(2, '0')
    const timeFormatted = `${hours}:${minutes}:${seconds}` // hh:mm:ss

    const line = [
      dateFormatted,
      timeFormatted,
      killedPlayer.guildName ?? '',
      killedPlayer.playerName,
      killerPlayer?.guildName ?? '',
      killerPlayer?.playerName ?? 'Unknown',
      eventType ?? 'death',
      VersionManager.getVersionForLog()
    ].join(';')

    this.stream.write(line + '\n')

    console.info(
      this.formatKillfeedLog({
        date,
        killedPlayer,
        killerPlayer,
        eventType
      })
    )
  }

  formatKillfeedLog({ date, killedPlayer, killerPlayer, eventType }) {
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minute = date.getUTCMinutes().toString().padStart(2, '0')
    const seconds = date.getUTCSeconds().toString().padStart(2, '0')

    const killedName = formatPlayerName(killedPlayer, red)
    const killerName = killerPlayer ? formatPlayerName(killerPlayer, green) : 'Unknown'

    if (killerPlayer) {
      return `${hours}:${minute}:${seconds} UTC: ${killedName} was killed by ${killerName}`
    } else {
      return `${hours}:${minute}:${seconds} UTC: ${killedName} died`
    }
  }

  close() {
    if (this.stream != null) {
      this.stream.close()
    }

    this.stream = null
  }
}

module.exports = new KillfeedLogger()
