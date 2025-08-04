const fs = require('fs')

const { red, green, cyan } = require('./utils/colors')

class MarketLogger {
  constructor() {
    this.stream = null
    this.logFileName = null
    this.processedItems = new Set()

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
      'item_type_id',
      'quality_level',
      'amount',
      'unit_price',
      'seller_name',
      'item_id'
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

    this.logFileName = `market-events-${datetime}.txt`
  }

  write({ date, itemTypeId, qualityLevel, amount, unitPrice, sellerName, itemId }) {
    if (this.stream == null) {
      this.init()
    }

    // Avoid duplicates using item ID
    if (this.processedItems.has(itemId)) {
      return
    }
    this.processedItems.add(itemId)

    // Detailed timestamps for historical timeline
    const unixTimestamp = Math.floor(date.getTime() / 1000)
    const dateFormatted = date.toISOString().split('T')[0] // YYYY-MM-DD
    const timeFormatted = date.toISOString().split('T')[1].split('.')[0] // HH:MM:SS

    const line = [
      date.toISOString(),
      unixTimestamp,
      dateFormatted,
      timeFormatted,
      itemTypeId,
      qualityLevel,
      amount,
      unitPrice,
      sellerName,
      itemId
    ].join(';')

    this.stream.write(line + '\n')

    console.info(
      this.formatMarketLog({
        date,
        itemTypeId,
        qualityLevel,
        amount,
        unitPrice,
        sellerName
      })
    )
  }

  formatMarketLog({ date, itemTypeId, qualityLevel, amount, unitPrice, sellerName }) {
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minute = date.getUTCMinutes().toString().padStart(2, '0')
    const seconds = date.getUTCSeconds().toString().padStart(2, '0')

    return `${hours}:${minute}:${seconds} UTC: ${cyan(sellerName)} listed ${amount}x Item(${itemTypeId}) Q${qualityLevel} for ${green(unitPrice)} silver`
  }

  close() {
    if (this.stream != null) {
      this.stream.close()
    }

    this.stream = null
  }
}

module.exports = new MarketLogger()
