const RequestData = require('./request-data')
const ResponseData = require('./response-data')
const EventData = require('./event-data')
const Logger = require('../utils/logger')
const ParserError = require('./parser-error')
const Config = require('../config')

class DataHandler {
  static handleEventData(event) {
    try {
      if (!event || event.eventCode !== 1) {
        return
      }

      const eventId = event?.parameters?.[252]
      

      switch (eventId) {
        case Config.events.EvInventoryPutItem: // 26 - EvInventoryPutItem
          return EventData.EvInventoryPutItem.handle(event, 'case26')

        case Config.events.EvNewCharacter: // 29 - EvNewCharacter
          return EventData.EvNewCharacter.handle(event)

        case Config.events.EvNewEquipmentItem: // 30 - EvNewEquipmentItem
          return EventData.EvNewEquipmentItem.handle(event)

        case Config.events.EvNewSiegeBannerItem: // 31 - EvNewSiegeBannerItem
          return EventData.EvNewSiegeBannerItem.handle(event)

        case Config.events.EvNewSimpleItem: // 32 - EvNewSimpleItem
          return EventData.EvNewSimpleItem.handle(event)

        case Config.events.EvNewLoot: // 98 - EvNewLoot
          return EventData.EvNewLoot.handle(event)

        case Config.events.EvAttachItemContainer: // 99 - EvAttachItemContainer
          return EventData.EvAttachItemContainer.handle(event)

        case Config.events.EvDetachItemContainer: // 100 - EvDetachItemContainer
          return EventData.EvDetachItemContainer.handle(event)

        case Config.events.EvCharacterStats: // 143 - EvCharacterStats
          return EventData.EvCharacterStats.handle(event)

        case Config.events.EvOtherGrabbedLoot: // 275 - EvOtherGrabbedLoot
          return EventData.EvOtherGrabbedLoot.handle(event, 'case275')

        case Config.events.EvDeathEvent: // 165 - EvDeathEvent - KILLFEED
          return EventData.EvDeathEvent.handle(event)

        case Config.events.EvNewLootChest: // 300 - EvNewLootChest
           return EventData.EvNewLootChest.handle(event)        
        
        case Config.events.EvUpdateLootChest: // 301 - EvUpdateLootChest
          return EventData.EvUpdateLootChest.handle(event)

        default:
          if (process.env.LOG_UNPROCESSED)
            Logger.silly('handleEventData', event.parameters)
      }
    } catch (error) {
      if (error instanceof ParserError) {
        // Logger.warn(error, event)
      } else {
        // Logger.error(error, event)
      }
    }
  }

  static handleRequestData(event) {
    const eventId = event?.parameters?.[253]

    try {
      switch (eventId) {
        case Config.events.OpInventoryMoveItem: // 29 - OpInventoryMoveItem
          return RequestData.OpInventoryMoveItem.handle(event, 'case29')

        default:
          if (process.env.LOG_UNPROCESSED) Logger.silly('handleRequestData', event.parameters)
      }
    } catch (error) {
      if (error instanceof ParserError) {
        Logger.warn(error, event)
      } else {
        Logger.error(error, event)
      }
    }
  }

  static handleResponseData(event) {
    const eventId = event?.parameters?.[253]

    try {
      switch (eventId) {
        case Config.events.OpJoin: // 2 - OpJoin
          return ResponseData.OpJoin.handle(event)

        case Config.events.EvMarketData: // 75 - EvMarketData - Market Pages
          return EventData.EvMarketData.handle(event)

        case Config.events.EvMightRanking: // 443 - EvMightRanking - Might Rankings
          return EventData.EvMightRanking.handle(event)

        default:
          if (process.env.LOG_UNPROCESSED) Logger.silly('handleResponseData', event.parameters)
      }
    } catch (error) {
      if (error instanceof ParserError) {
        Logger.warn(error, event)
      } else {
        Logger.error(error, event)
      }
    }
  }
}

module.exports = DataHandler
