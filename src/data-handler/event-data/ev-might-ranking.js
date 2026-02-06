const MightLogger = require('../../might-logger')

class EvMightRanking {
  static handle(event) {
    try {
      const params = event?.parameters
      
      if (!params) {
        return
      }
      
      // Extract data according to the original implementation
      const category = params[1] // Category like "PVE", "PVP", etc
      const playerNames = params[6] // Array of player names  
      const mightValues = params[7] // Array of might points

      if (!category || !Array.isArray(playerNames) || !Array.isArray(mightValues)) {
        return
      }

      if (playerNames.length !== mightValues.length) {
        console.warn('[MIGHT] Mismatched array lengths:', playerNames.length, 'vs', mightValues.length)
        return
      }

      // Process each player in the ranking
      let newPlayersCount = 0
      let totalPlayersInBatch = playerNames.length

      for (let i = 0; i < playerNames.length && i < mightValues.length; i++) {
        const playerName = playerNames[i]
        const mightValue = mightValues[i]

        if (!playerName || mightValue == null) {
          continue
        }

        // Convert might points from game format (divide by 10000 and round)
        const mightPoints = Math.round(Number(mightValue) / 10000)

        // Check if this is a new player before writing
        const wasNewPlayer = MightLogger.write({
          category: category,
          playerName: playerName,
          mightPoints: mightPoints
        })

        if (wasNewPlayer) {
          newPlayersCount++
        }
      }

      // Show batch summary
      const stats = MightLogger.getProcessedStats()
      const totalInCategory = stats.byCategory[category] || 0
      
      console.log(
        `[MIGHT] ${category}: ${newPlayersCount} new players added. Total players in category: ${totalInCategory}. Ranking data received for ${totalPlayersInBatch} players.`
      )
    } catch (error) {
      console.error('[MIGHT] Error processing might ranking event:', error)
    }
  }
}

module.exports = EvMightRanking