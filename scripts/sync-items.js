#!/usr/bin/env node

const axios = require('axios')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// URLs e caminhos
const REMOTE_URL = 'https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.txt'
const FALLBACK_FILE = path.join(__dirname, '..', 'src', 'items-fallback.js')

/**
 * Calcula hash SHA-256 de uma string
 */
function calculateHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Lê o conteúdo atual do fallback (apenas os dados, sem module.exports)
 */
function getCurrentFallbackData() {
  try {
    const content = fs.readFileSync(FALLBACK_FILE, 'utf8')
    // Extrair apenas a parte dos dados entre ` `
    const match = content.match(/module\.exports = `([^`]+)`/)
    return match ? match[1] : ''
  } catch (error) {
    console.log('⚠️  Erro ao ler fallback atual:', error.message)
    return ''
  }
}

/**
 * Atualiza o arquivo items-fallback.js com novos dados
 */
function updateFallbackFile(newData) {
  const fileContent = `module.exports = \`${newData}\``
  
  try {
    fs.writeFileSync(FALLBACK_FILE, fileContent, 'utf8')
    console.log('✅ Arquivo items-fallback.js atualizado com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro ao atualizar fallback:', error.message)
    return false
  }
}

/**
 * Baixa dados do repositório ao-data
 */
async function downloadRemoteData() {
  try {
    console.log('📥 Baixando dados do ao-data...')
    const response = await axios.get(REMOTE_URL, {
      timeout: 30000, // 30 segundos
      headers: {
        'User-Agent': 'LootLogger-AutoSync/1.0'
      }
    })
    
    console.log(`📊 Dados baixados: ${response.data.length} caracteres`)
    return response.data.trim()
  } catch (error) {
    console.error('❌ Erro ao baixar dados remotos:', error.message)
    throw error
  }
}

/**
 * Função principal de sincronização
 */
async function syncItems() {
  console.log('🔄 Iniciando sincronização de itens...')
  console.log('⏰ Timestamp:', new Date().toISOString())
  
  try {
    // 1. Baixar dados remotos
    const remoteData = await downloadRemoteData()
    const remoteHash = calculateHash(remoteData)
    console.log('🔗 Hash dos dados remotos:', remoteHash)
    
    // 2. Ler dados locais
    const localData = getCurrentFallbackData()
    const localHash = calculateHash(localData)
    console.log('💾 Hash dos dados locais:', localHash)
    
    // 3. Comparar
    if (remoteHash === localHash) {
      console.log('✅ Dados já estão sincronizados - nenhuma ação necessária')
      console.log('📄 Total de linhas:', remoteData.split('\n').length)
      process.exit(0) // Exit code 0 = sem mudança
    }
    
    console.log('🔄 Dados diferentes detectados - atualizando...')
    
    // 4. Criar backup
    const backupFile = `${FALLBACK_FILE}.backup.${Date.now()}`
    if (localData) {
      fs.writeFileSync(backupFile, `module.exports = \`${localData}\``, 'utf8')
      console.log('💾 Backup criado:', path.basename(backupFile))
    }
    
    // 5. Atualizar arquivo
    if (updateFallbackFile(remoteData)) {
      const newLines = remoteData.split('\n').length
      const oldLines = localData.split('\n').length
      
      console.log('📊 Estatísticas da atualização:')
      console.log(`   • Linhas antigas: ${oldLines}`)
      console.log(`   • Linhas novas: ${newLines}`)
      console.log(`   • Diferença: ${newLines - oldLines > 0 ? '+' : ''}${newLines - oldLines}`)
      
      console.log('🎉 Sincronização concluída com sucesso!')
      process.exit(1) // Exit code 1 = arquivo atualizado
    } else {
      console.error('❌ Falha ao atualizar arquivo')
      process.exit(2) // Exit code 2 = erro na atualização
    }
    
  } catch (error) {
    console.error('💥 Erro durante sincronização:', error.message)
    process.exit(2) // Exit code 2 = erro geral
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  syncItems()
}

module.exports = { syncItems, calculateHash, downloadRemoteData }