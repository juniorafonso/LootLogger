const MemoryStorage = require('../../storage/memory-storage')
const KillfeedLogger = require('../../killfeed-logger')
const ParserError = require('../parser-error')
const Logger = require('../../utils/logger')
const EventTimestamp = require('../../utils/event-timestamp')

const name = 'EvDeathEvent'

// Deduplication set to prevent duplicate death events
const processedDeaths = new Set()

function handle(event) {
  const { killedPlayer, killerPlayer, location, eventType, killedGuild, killerGuild, coordinates } = parse(event)

  Logger.debug('EvDeathEvent', {
    killedPlayer,
    killerPlayer,
    location,
    eventType,
    killedGuild,
    killerGuild,
    coordinates,
    allParameters: event.parameters
  })

  // If unable to extract necessary data, skip processing
  if (!killedPlayer) {
    return Logger.warn('Death event without killed player data. Skipping.')
  }

  // Create unique identifier for this death event
  const deathId = `${killedPlayer}-${killerPlayer}-${Date.now()}`
  
  // Check if we already processed this death event recently (within 1 second)
  const currentTime = Date.now()
  const recentDeathId = `${killedPlayer}-${killerPlayer}`
  
  // Clean old entries (older than 5 seconds)
  const oldEntries = Array.from(processedDeaths).filter(entry => {
    const [, , timestamp] = entry.split('-')
    return currentTime - parseInt(timestamp) > 5000
  })
  oldEntries.forEach(entry => processedDeaths.delete(entry))
  
  // Check for recent duplicate
  const isDuplicate = Array.from(processedDeaths).some(entry => {
    const [player, killer, timestamp] = entry.split('-')
    return player === killedPlayer && killer === killerPlayer && 
           (currentTime - parseInt(timestamp)) < 1000 // Within 1 second
  })
  
  if (isDuplicate) {
    return Logger.debug('Duplicate death event detected, skipping.')
  }
  
  // Add to processed set
  processedDeaths.add(deathId)

  // Precise timestamp for historical timeline
  const date = EventTimestamp.getEventTime(event)
  const unixTimestamp = Math.floor(date.getTime() / 1000)

  // Create death record using KillfeedLogger
  const killedPlayerObj = MemoryStorage.players.getByName(killedPlayer) ?? 
    MemoryStorage.players.add({ playerName: killedPlayer, guildName: killedGuild })
  
  const killerPlayerObj = killerPlayer && killerPlayer !== 'Unknown' ? 
    (MemoryStorage.players.getByName(killerPlayer) ?? 
     MemoryStorage.players.add({ playerName: killerPlayer, guildName: killerGuild })) : 
    null

  KillfeedLogger.write({
    date,
    killedPlayer: killedPlayerObj,
    killerPlayer: killerPlayerObj,
    eventType
  })
}

function parse(event) {
  try {
    // Based on Event ID 165 discovery - real killfeed structure
    const victim = event.parameters['2'] || event.parameters[2]
    const victimGuild = event.parameters['3'] || event.parameters[3] || ''
    const killer = event.parameters['10'] || event.parameters[10] || 'Unknown'
    const killerGuild = event.parameters['11'] || event.parameters[11] || ''
    const coords = event.parameters['0'] || event.parameters[0] || [0, 0]
    
    let location = ''
    let coordinates = [0, 0]
    
    if (Array.isArray(coords) && coords.length >= 2) {
      coordinates = [parseFloat(coords[0]), parseFloat(coords[1])]
      location = `[${coordinates[0].toFixed(1)}, ${coordinates[1].toFixed(1)}]`
    }

    return { 
      killedPlayer: victim, 
      killerPlayer: killer, 
      location, 
      eventType: 'killfeed',
      killedGuild: victimGuild,
      killerGuild: killerGuild,
      coordinates
    }
  } catch (error) {
    throw new ParserError(`EvDeathEvent parsing error: ${error.message}`)
  }
}

module.exports = { name, handle, parse }
