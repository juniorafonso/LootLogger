/**
 * Test script to analyze Albion events for server timestamps
 * This simulates real Albion events to test timestamp detection
 */

const EventTimestamp = require('./src/utils/event-timestamp')

console.log('🔍 === TESTE DE ANÁLISE DE EVENTOS ALBION ===\n')

// Enable debug mode
EventTimestamp.debugMode = true

// Simulate different types of Albion events
const testEvents = [
  {
    name: 'EvInventoryPutItem (sem server time)',
    event: {
      parameters: {
        '0': 12345,
        '1': 'T4_BAG',
        '2': 1,
        'other': 'data'
      }
    }
  },
  {
    name: 'EvOtherGrabbedLoot (com possível server time)',
    event: {
      parameters: {
        '0': [100, 200],
        '1': 'PlayerName',
        '2': 'T6_SWORD',
        '3': 1,
        '255': Math.floor(Date.now() / 1000) - 2, // Server time 2 seconds ago
        'timestamp': Date.now() - 1500 // Alternative timestamp
      }
    }
  },
  {
    name: 'EvDeathEvent (com server time em ms)',
    event: {
      parameters: {
        '0': [150.5, 250.8],
        '1': 'DeadPlayer',
        '2': 'KillerPlayer',
        '252': Date.now() - 3000, // Server time 3 seconds ago (in ms)
        'extra': 'info'
      }
    }
  },
  {
    name: 'EvMarketData (sem timestamps)',
    event: {
      parameters: {
        '0': 'T8_CAPE',
        '1': 1000000, // Price (not timestamp)
        '2': 5,
        'seller': 'MerchantName'
      }
    }
  },
  {
    name: 'Evento com timestamp inválido',
    event: {
      parameters: {
        '0': 123, // Too small to be timestamp
        '1': 999999999999999, // Too large
        '2': 'normal_data',
        'timestamp': 'not_a_number'
      }
    }
  }
]

// Test each event
testEvents.forEach((test, index) => {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📋 TESTE ${index + 1}: ${test.name}`)
  console.log(`${'='.repeat(60)}`)
  
  const result = EventTimestamp.analyzeEventForServerTime(test.event, test.name)
  
  console.log(`\n📊 RESULTADO:`)
  console.log(`   Server Time: ${result.hasServerTime ? '✅ ENCONTRADO' : '❌ NÃO ENCONTRADO'}`)
  if (result.hasServerTime) {
    console.log(`   Fonte: ${result.source}`)
    console.log(`   Diferença: ${result.difference}ms`)
  } else {
    console.log(`   Usando: ${result.source}`)
  }
})

console.log(`\n${'='.repeat(60)}`)
console.log(`✅ ANÁLISE COMPLETA`)
console.log(`💡 No LootLogger real, pressione Y para ativar esta análise`)
console.log(`🎮 Quando eventos reais do Albion acontecerem, você verá se contêm server time`)
console.log(`${'='.repeat(60)}`)

// Show current timestamp for reference
const now = new Date()
console.log(`\n📅 Timestamp atual: ${now.toISOString()} (${now.getTime()})`)
