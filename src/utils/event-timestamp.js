/**
 * Utility for creating consistent timestamps across different clients
 * Uses external time synchronization for consistent timestamps
 */

class EventTimestamp {
  constructor() {
    // Store the time offset between local and server time
    this.localTimeOffset = 0
    this.isCalibrated = false
  }

  /**
   * Gets consistent event timestamp
   * @param {Object} event - The network event (unused, kept for compatibility)
   * @returns {Date} Synchronized timestamp in UTC
   */
  getEventTime(event) {
    const localTime = new Date()
    
    if (this.isCalibrated) {
      // Apply the calibrated offset to get server-synchronized time
      const resultTime = new Date(localTime.getTime() + this.localTimeOffset)
      return resultTime
    } else {
      // Use local UTC time if not calibrated yet
      return localTime
    }
  }

  /**
   * Synchronizes local time with server time
   * @param {Date} serverTime - Reference server time (UTC)
   */
  synchronizeTo(serverTime) {
    const localTime = new Date()
    // Simple offset: server UTC time - local UTC time
    this.localTimeOffset = serverTime.getTime() - localTime.getTime()
    this.isCalibrated = true
  }

  /**
   * Gets calibration information
   * @returns {Object} Calibration details
   */
  getCalibrationInfo() {
    return {
      isCalibrated: this.isCalibrated,
      offsetMs: this.localTimeOffset,
      offsetSeconds: Math.round(this.localTimeOffset / 1000)
    }
  }
}

module.exports = new EventTimestamp()
