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
         case 26: //EvInventoryPutItem
          return EventData.EvInventoryPutItem.handle(event, 'case26')

        case 29: // EvNewCharacter
          return EventData.EvNewCharacter.handle(event)

        case 30: // EvNewEquipmentItem
          return EventData.EvNewEquipmentItem.handle(event)

        case 31: // EvNewSiegeBannerItem
          return EventData.EvNewSiegeBannerItem.handle(event)

        case 32: // EvNewSimpleItem
          return EventData.EvNewSimpleItem.handle(event)

        case 98: // EvNewLoot
          return EventData.EvNewLoot.handle(event)

        case 99: // EvAttachItemContainer
          return EventData.EvAttachItemContainer.handle(event)

        case 100: // EvDetachItemContainer
          return EventData.EvDetachItemContainer.handle(event)

        case 143: // EvCharacterStats
          return EventData.EvCharacterStats.handle(event)

        case 274: // EvOtherGrabbedLoot
          return EventData.EvOtherGrabbedLoot.handle(event, 'case274')

        case 165: // EvDeathEvent - KILLFEED (Real)
          return EventData.EvDeathEvent.handle(event)

        case 300: // EvNewLootChest
           return EventData.EvNewLootChest.handle(event)        
        
        // case 301: // EvUpdateLootChest - Uncomment when needed
        //   return EventData.EvUpdateLootChest.handle(event)

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
        case 29: // OpInventoryMoveItem
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
        case 2: // OpJoin
          return ResponseData.OpJoin.handle(event)

        case 75: // EvMarketData - Market Pages
          return EventData.EvMarketData.handle(event)

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
