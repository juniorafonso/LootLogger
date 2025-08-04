const MemoryStorage = require('../../storage/memory-storage')
const MarketLogger = require('../../market-logger')
const ParserError = require('../parser-error')
const Logger = require('../../utils/logger')

const name = 'EvMarketData'

function handle(event) {
  const { marketItems } = parse(event)

  Logger.debug('EvMarketData', {
    itemCount: marketItems.length,
    allParameters: event.parameters
  })

  // If no market items found, skip processing
  if (!marketItems || marketItems.length === 0) {
    return Logger.warn('Market event without items data. Skipping.')
  }

  // Precise timestamp for historical timeline
  const date = new Date()
  const unixTimestamp = Math.floor(date.getTime() / 1000)

  // Additional log for historical timeline debugging
  Logger.info(`MARKET: ${marketItems.length} items processed at ${date.toISOString()} (Unix: ${unixTimestamp})`)

  // Process each market item
  marketItems.forEach(item => {
    MarketLogger.write({
      date,
      itemTypeId: item.itemTypeId,
      qualityLevel: item.qualityLevel,
      amount: item.amount,
      unitPrice: item.unitPrice,
      sellerName: item.sellerName,
      itemId: item.id
    })
  })
}

function parse(event) {
  try {
    // Based on Event ID 75 - market data structure
    const marketData = event.parameters[0] || []
    const marketItems = []
    
    if (!Array.isArray(marketData)) {
      throw new ParserError('Market event has invalid parameters structure')
    }

    // Process each market entry
    marketData.forEach(entry => {
      try {
        const obj = JSON.parse(entry)
        
        marketItems.push({
          id: obj["Id"],
          itemTypeId: obj["ItemTypeId"],
          qualityLevel: obj["QualityLevel"],
          amount: obj["Amount"],
          unitPrice: Math.round(Number(obj["UnitPriceSilver"]) / 10000),
          sellerName: obj["SellerName"]
        })
      } catch (parseError) {
        Logger.warn('Failed to parse market entry:', parseError)
      }
    })

    return { 
      marketItems
    }
  } catch (error) {
    throw new ParserError(`EvMarketData parsing error: ${error.message}`)
  }
}

module.exports = { name, handle, parse }
