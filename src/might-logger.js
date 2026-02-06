const fs = require('fs')
const EventTimestamp = require('./utils/event-timestamp')

const { red, green, cyan } = require('./utils/colors')

class MightLogger {
  constructor() {
    this.stream = null
    this.logFileName = null
    this.processedEntries = new Map() // Map to track by category -> Set of names

    this.createNewLogFileName()
  }

  init() {
    if (this.stream != null) {
      this.stream.close()
    }

    this.stream = fs.createWriteStream(this.logFileName, { flags: 'a' })

    const header = [
      'category',
      'player_name', 
      'might_points'
    ].join(',')

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

    this.logFileName = `might-events-${datetime}.txt`
  }

  write({ category, playerName, mightPoints }) {
    if (this.stream == null) {
      this.init()
    }

    // Create unique key for this entry
    const entryKey = `${category}-${playerName}`
    
    // Initialize category map if doesn't exist
    if (!this.processedEntries.has(category)) {
      this.processedEntries.set(category, new Set())
    }

    // Check if already processed this player for this category
    const typeSet = this.processedEntries.get(category)
    if (typeSet.has(playerName)) {
      return false // Skip duplicates - not a new player
    }

    // Mark as processed
    typeSet.add(playerName)

    const data = [
      category,
      playerName,
      mightPoints
    ].join(',')

    this.stream.write(data + '\n')

    console.log(
      cyan('[MIGHT]'),
      green(category),
      'player:',
      green(playerName),
      'might:',
      green(mightPoints),
      'pts'
    )

    return true // This was a new player
  }

  close() {
    if (this.stream != null) {
      console.log(red(`[MIGHT] Log file closed: ${this.logFileName}`))
      this.stream.close()
      this.stream = null
    }
  }

  rotateLogFile() {
    this.close()
    this.processedEntries.clear() // Clear cache on rotation
    this.createNewLogFileName()
    this.init()

    console.log(green(`[MIGHT] New log file started: ${this.logFileName}`))
  }

  getProcessedStats() {
    let totalProcessed = 0
    const categoryStats = {}
    
    for (const [category, playerSet] of this.processedEntries.entries()) {
      categoryStats[category] = playerSet.size
      totalProcessed += playerSet.size
    }
    
    return {
      total: totalProcessed,
      byCategory: categoryStats,
      fileName: this.logFileName
    }
  }
}

module.exports = new MightLogger()