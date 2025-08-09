/**
 * Test script to demonstrate PC vs Server time differences
 * Run with: node test-pc-vs-server-time.js
 */

const EventTimestamp = require('./src/utils/event-timestamp')

console.log('=== Teste PC vs Server Time ===\n')

// Enable debug mode
EventTimestamp.debugMode = true

console.log('🔧 Debug mode ativado - mostrando todos os detalhes\n')

// Test 1: Local time (no calibration)
console.log('📍 TESTE 1: Tempo local (sem calibração)')
const localEvent = { parameters: { other: 'data' } }
const localTime = EventTimestamp.getEventTime(localEvent)
console.log('')

// Test 2: Simulate server time from event
console.log('📍 TESTE 2: Tempo do servidor (simulado)')
const serverEvent = {
  parameters: {
    '255': Math.floor(Date.now() / 1000) + 5, // Server 5 seconds in the future
    'other': 'data'
  }
}
const serverTime = EventTimestamp.getEventTime(serverEvent)
console.log('')

// Test 3: Calibrated time
console.log('📍 TESTE 3: Tempo calibrado (após sincronização)')
const calibratedEvent = { parameters: { other: 'data' } }
const calibratedTime = EventTimestamp.getEventTime(calibratedEvent)
console.log('')

// Show final comparison
console.log('📊 COMPARAÇÃO FINAL:')
console.log(`Local Time:      ${localTime.toISOString()}`)
console.log(`Server Time:     ${serverTime.toISOString()}`)
console.log(`Calibrated Time: ${calibratedTime.toISOString()}`)

const localUnix = Math.floor(localTime.getTime() / 1000)
const serverUnix = Math.floor(serverTime.getTime() / 1000)
const calibratedUnix = Math.floor(calibratedTime.getTime() / 1000)

console.log(`\nUnix Timestamps:`)
console.log(`Local:      ${localUnix}`)
console.log(`Server:     ${serverUnix}`)
console.log(`Calibrated: ${calibratedUnix}`)

console.log(`\nDiferenças:`)
console.log(`Server - Local:      ${serverUnix - localUnix} segundos`)
console.log(`Calibrated - Local:  ${calibratedUnix - localUnix} segundos`)

console.log('\n✅ Agora você pode ver a diferença entre PC time e Server time!')
console.log('💡 No LootLogger, pressione "T" para sincronizar e "Y" para ativar debug')
