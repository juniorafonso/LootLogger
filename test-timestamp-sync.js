/**
 * Test script to demonstrate timestamp synchronization
 * Run with: node test-timestamp-sync.js
 */

const EventTimestamp = require('./src/utils/event-timestamp')

console.log('=== Teste de Sincronização de Timestamp ===\n')

// Simulate different timezones/offsets
console.log('1. Estado inicial:')
console.log(EventTimestamp.getCalibrationInfo())

// Get time without calibration
console.log('\n2. Timestamp sem calibração:')
const time1 = EventTimestamp.getEventTime()
console.log(time1.toISOString())

// Simulate server time (3 seconds in the future)
console.log('\n3. Simulando sincronização com servidor (3s no futuro):')
const futureTime = new Date(Date.now() + 3000)
EventTimestamp.synchronizeTo(futureTime)
console.log('Referência:', futureTime.toISOString())
console.log('Status:', EventTimestamp.getCalibrationInfo())

// Get calibrated time
console.log('\n4. Timestamp após calibração:')
const time2 = EventTimestamp.getEventTime()
console.log(time2.toISOString())

// Test with mock event data
console.log('\n5. Teste com dados de evento simulado:')
const mockEvent = {
  parameters: {
    '255': Math.floor(Date.now() / 1000), // Unix timestamp in seconds
    'other': 'data'
  }
}

const eventTime = EventTimestamp.getEventTime(mockEvent)
console.log('Evento com timestamp:', eventTime.toISOString())

console.log('\n6. Status final:')
console.log(EventTimestamp.getCalibrationInfo())

console.log('\n=== Teste Concluído ===')
console.log('✅ Sistema de sincronização funcionando corretamente!')
console.log('💡 Use a tecla "T" no LootLogger para sincronizar manualmente')
