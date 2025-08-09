/**
 * Test the automatic time synchronization service
 * This will show how the auto-sync keeps all clients synchronized
 */

const AutoTimeSync = require('./src/utils/auto-time-sync')
const EventTimestamp = require('./src/utils/event-timestamp')

console.log('🚀 === TESTE DE SINCRONIZAÇÃO AUTOMÁTICA ===\n')

async function demonstrateAutoSync() {
  console.log('1. Estado inicial:')
  console.log('   Calibrado:', EventTimestamp.getCalibrationInfo().isCalibrated)
  console.log('   Auto-sync:', AutoTimeSync.getStatus().isRunning)
  
  console.log('\n2. Iniciando sincronização automática...')
  AutoTimeSync.start(10) // Sync every 10 seconds for demo
  
  // Wait for first sync
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  console.log('\n3. Status após primeira sincronização:')
  AutoTimeSync.showStatus()
  
  console.log('4. Simulando eventos durante auto-sync...')
  for (let i = 0; i < 3; i++) {
    const eventTime = EventTimestamp.getEventTime()
    console.log(`   Evento ${i + 1}: ${eventTime.toISOString()}`)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n5. Aguardando próxima sincronização (10s)...')
  await new Promise(resolve => setTimeout(resolve, 8000))
  
  console.log('\n6. Status final:')
  AutoTimeSync.showStatus()
  
  console.log('7. Parando auto-sync...')
  AutoTimeSync.stop()
  
  console.log('\n✅ DEMONSTRAÇÃO COMPLETA!')
  console.log('💡 Com auto-sync, todos os clientes terão timestamps idênticos automaticamente!')
  console.log('🎯 No LootLogger: Pressione A para ativar/desativar, S para ver status')
}

// Run the demonstration
demonstrateAutoSync().catch(console.error)
