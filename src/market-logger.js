const fs = require('fs')
const EventTimestamp = require('./utils/event-timestamp')

const { red, green, cyan } = require('./utils/colors')
const VersionManager = require('./version')

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
      'date',
      'utc_time',
      'item_type_id',
      'quality_level',
      'amount',
      'unit_price',
      'seller_name',
      'item_id',
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
      itemTypeId,
      qualityLevel,
      amount,
      unitPrice,
      sellerName,
      itemId,
      VersionManager.getVersionForLog()
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
