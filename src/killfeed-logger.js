const fs = require('fs')

const { red, green } = require('./utils/colors')
const formatPlayerName = require('./utils/format-player-name')

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
      'timestamp_utc',
      'timestamp_unix',
      'date_formatted',
      'time_formatted',
      'killed_player__guild',
      'killed_player__name',
      'killer_player__guild',
      'killer_player__name',
      'event_type'
    ].join(';')

    this.stream.write(header + '\n')

    process.on('exit', () => {
      this.close()
    })
  }

  createNewLogFileName() {
    const d = new Date()

    const datetime = [
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    ]
      .map((n) => n.toString().padStart(2, '0'))
      .join('-')

    this.logFileName = `killfeed-events-${datetime}.txt`
  }

  write({ date, killedPlayer, killerPlayer, eventType }) {
    if (this.stream == null) {
      this.init()
    }

    // Detailed timestamps for historical timeline
    const unixTimestamp = Math.floor(date.getTime() / 1000)
    const dateFormatted = date.toISOString().split('T')[0] // YYYY-MM-DD
    const timeFormatted = date.toISOString().split('T')[1].split('.')[0] // HH:MM:SS

    const line = [
      date.toISOString(),
      unixTimestamp,
      dateFormatted,
      timeFormatted,
      killedPlayer.guildName ?? '',
      killedPlayer.playerName,
      killerPlayer?.guildName ?? '',
      killerPlayer?.playerName ?? 'Unknown',
      eventType ?? 'death'
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
