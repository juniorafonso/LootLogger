process.on('uncaughtException', async (error) => {
  console.error(error)

  await new Promise((resolve) => setTimeout(resolve, 25000))
})

process.on('unhandledRejection', async (reason) => {
  console.error(reason)

  await new Promise((resolve) => setTimeout(resolve, 25000))
})

const LootLogger = require('./loot-logger')

const path = require('path')

const { green, red, cyan, yellow } = require('./utils/colors')
const AlbionNetwork = require('./network/albion-network')
const DataHandler = require('./data-handler/data-handler')
const Items = require('./items')
const KeyboardInput = require('./keyboard-input')
const EventTimestamp = require('./utils/event-timestamp')
const AutoTimeSync = require('./utils/auto-time-sync')
const VersionManager = require('./version')

const Config = require('./config')

main()

async function main() {
  setWindowTitle(Config.TITLE)

  console.info(`${Config.TITLE}\n`)

  // Store connection status and startup state
  let isAlbionDetected = false
  let startupComplete = false

  // Initialize network listeners first to show them cleanly
  AlbionNetwork.on('add-listener', (device) => {
    console.info(`Listening to ${device.name}`)
  })

  AlbionNetwork.on('event-data', DataHandler.handleEventData)
  AlbionNetwork.on('request-data', DataHandler.handleRequestData)
  AlbionNetwork.on('response-data', DataHandler.handleResponseData)

  AlbionNetwork.on('online', () => {
    isAlbionDetected = true
    if (startupComplete) {
      console.info(`\n\t${green('ALBION DETECTED')}. Loot events should be logged.\n`)
    }
    setWindowTitle(`[ON] ${Config.TITLE}`)
  })

  AlbionNetwork.on('offline', () => {
    isAlbionDetected = false
    if (startupComplete) {
      console.info(
        `\n\t${red(
          'ALBION NOT DETECTED'
        )}.\n\n\tIf Albion is running, press "${Config.RESTART_NETWORK_FILE_KEY}" to restart the network listeners or restart AO Loot Logger.\n`
      )
    }
    setWindowTitle(`[OFF] ${Config.TITLE}`)
  })

  // Start network initialization (this will trigger the listener messages)
  AlbionNetwork.init()

  // Now show version info and other startup information
  console.info(`\n`)
  const updateInfo = await VersionManager.showVersionInfoAndCheck()

  await Items.init()

  try {
    await Config.init()
  } catch (error) {
    console.info(yellow(`    Problem fetching configurations. Try again or restart the application.`))

    await new Promise(resolve => setTimeout(resolve, 20000))

    return process.exit(1)
  }

  KeyboardInput.on('key-pressed', (key) => {
    const CTRL_C = '\u0003'

    switch (key) {
      case CTRL_C:
        return exit()

      case Config.RESTART_NETWORK_FILE_KEY.toLocaleLowerCase():
      case Config.RESTART_NETWORK_FILE_KEY.toUpperCase():
        return restartNetwork()

      case Config.ROTATE_LOGGER_FILE_KEY.toLocaleLowerCase():
      case Config.ROTATE_LOGGER_FILE_KEY.toUpperCase():
        return rotateLogFile()
    }
  })

  KeyboardInput.init()

  // ========================================
  // 📋 === TIME SYNC === ===================
  // ========================================
  console.info(`📋 === TIME SYNC ===`)
  console.info(`🌐 ${green('Synchronizing with time servers...')}`)
  console.info(`   Ensuring accurate timestamps for all events`)
  
  // Perform sync and wait for completion
  try {
    await AutoTimeSync.performSync()
    const status = AutoTimeSync.getStatus()
    if (status.isCalibrated) {
      console.info(`✅ ${green('Time synchronization completed!')} Offset: ${status.offsetSeconds}s`)
      
      // Show current date/time that will be used in logs (UTC synchronized)
      const now = EventTimestamp.getEventTime()
      const date = now.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        timeZone: 'UTC'
      })
      const time = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        timeZone: 'UTC'
      })
      console.info(`📅 Current time for logs: ${date} ${time} UTC`)
    } else {
      console.info(`⚠️ ${yellow('Time sync failed - using local time as fallback')}`)
    }
  } catch (error) {
    console.info(`⚠️ ${yellow('Time sync failed - using local time as fallback')}`)
  }
  
  console.info(`${'='.repeat(20)}`)

  // ========================================
  // 📋 === STARTUP COMPLETE === ============
  // ========================================
  console.info([
    '',
    `💰 DONATIONS & SUPPORT : Join https://discord.gg/geXXZsbzJb`,
    '',
    `📂 Logs will be written to ${path.join(process.cwd(), LootLogger.logFileName)}`,
    '',
    `⌨️  You can press "${Config.ROTATE_LOGGER_FILE_KEY}" anytime to start a new log file`,
    '',
    `🎮 Start playing Albion Online to begin logging events...`,
    ''
  ].join('\n'))

  // Show update warning if new version is available
  if (updateInfo && updateInfo.hasUpdate) {
    console.info([
      '',
      `🔥 ${red('='.repeat(60))}`,
      `🚨 ${yellow('WARNING: NEW VERSION AVAILABLE!')}`,
      `📥 Latest Version: ${green(`LootLogger v${updateInfo.latestVersion}`)} (${updateInfo.releaseDate})`,
      `🔗 Download: ${cyan(updateInfo.downloadUrl)}`,
      `⚠️  ${yellow('PLEASE UPDATE TO GET THE LATEST FEATURES AND BUG FIXES!')}`,
      `🔥 ${red('='.repeat(60))}`,
      ''
    ].join('\n'))
  }

  // Mark startup as complete and show connection status
  startupComplete = true
  
  // Show current Albion detection status (only if online, offline will be handled by event)
  if (isAlbionDetected) {
    console.info(`\t${green('ALBION DETECTED')}. Loot events should be logged.\n`)
  }
}

function restartNetwork() {
  console.info(`\n\tRestarting network listeners...\n`)

  AlbionNetwork.close()
  AlbionNetwork.init()

  setWindowTitle(Config.TITLE)
}

function setWindowTitle(title) {
  process.stdout.write(
    String.fromCharCode(27) + ']0;' + title + String.fromCharCode(7)
  )
}

function exit() {
  console.info('Exiting...')

  // Stop auto-sync before exiting
  if (AutoTimeSync.getStatus().isRunning) {
    AutoTimeSync.stop()
  }

  process.exit(0)
}

function rotateLogFile() {
  LootLogger.close()
  LootLogger.createNewLogFileName()

  console.info(
    `From now on, logs will be written to ${path.join(
      process.cwd(),
      LootLogger.logFileName
    )}. The file is only created when the first loot event is detected.\n`
  )
}
