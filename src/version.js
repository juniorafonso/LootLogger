/**
 * Version configuration and checking utilities
 */

const axios = require('axios')
const packageJson = require('../package.json')
const { green, red, yellow, cyan } = require('./utils/colors')

class VersionManager {
  constructor() {
    // Automatically read version from package.json - single source of truth
    this.currentVersion = packageJson.version
    this.releaseUrl = 'https://github.com/juniorafonso/LootLogger/releases'
    this.apiUrl = 'https://api.github.com/repos/juniorafonso/LootLogger/releases/latest'
  }

  /**
   * Get current version
   * @returns {string} Current version
   */
  getCurrentVersion() {
    return this.currentVersion
  }

  /**
   * Get version for logging (formatted for CSV)
   * @returns {string} Version string for logs
   */
  getVersionForLog() {
    return `v${this.currentVersion}`
  }

  /**
   * Check for updates on startup
   */
  async checkForUpdates() {
    try {
      console.log(`\n🔍 Checking for updates...`)
      console.log(`📦 Current version: ${green(`LootLogger v${this.currentVersion}`)}`)
      
      const response = await axios.get(this.apiUrl, {
        timeout: 15000, // Increased timeout
        headers: {
          'User-Agent': 'LootLogger-UpdateChecker',
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      const latestRelease = response.data
      const latestVersion = latestRelease.tag_name
      const latestVersionClean = latestVersion.replace(/^v/, '') // Remove 'v' prefix if present
      const releaseDate = new Date(latestRelease.published_at).toLocaleDateString('pt-BR')

      if (this.isNewerVersion(latestVersionClean, this.currentVersion)) {
        // GitHub has newer version - update available
        console.log(`\n🚀 ${yellow('NEW VERSION AVAILABLE!')}`)
        console.log(`📥 Latest: ${green(`LootLogger v${latestVersionClean}`)} (${releaseDate})`)
        console.log(`📥 Current: ${red(`LootLogger v${this.currentVersion}`)}`)
        
        if (latestRelease.body) {
          // Show first few lines of release notes
          const releaseNotes = latestRelease.body.split('\n').slice(0, 3).join('\n')
          if (releaseNotes.trim()) {
            console.log(`\n📝 Release Notes:`)
            console.log(`${releaseNotes}`)
          }
        }
        
        console.log(`\n📁 Download the latest version:`)
        console.log(`🔗 ${cyan(this.releaseUrl)}`)
        console.log(`\n⚠️  ${yellow('Please update to get the latest features and bug fixes!')}\n`)
        
        return {
          hasUpdate: true,
          currentVersion: this.currentVersion,
          latestVersion: latestVersionClean,
          releaseDate: releaseDate,
          releaseNotes: latestRelease.body || '',
          downloadUrl: this.releaseUrl,
          directDownloadUrl: latestRelease.html_url
        }
      } else if (this.currentVersion === latestVersionClean) {
        // Same version - running latest released version
        console.log(`✅ You are running the latest version! (Released: ${releaseDate})`)
        return {
          hasUpdate: false,
          currentVersion: this.currentVersion,
          latestVersion: latestVersionClean,
          releaseDate: releaseDate
        }
      } else {
        // Local version is newer - development/unreleased version
        console.log(`\n🚧 ${yellow('DEVELOPMENT VERSION DETECTED!')}`)
        console.log(`🔧 Current: ${green(`LootLogger v${this.currentVersion}`)} (unreleased)`)
        console.log(`📦 Latest Released: ${cyan(`LootLogger v${latestVersionClean}`)} (${releaseDate})`)
        console.log(`\n💡 You are running a development version that hasn't been released yet.`)
        console.log(`🏷️  Remember to create a release when ready: ${cyan(this.releaseUrl)}`)
        
        return {
          hasUpdate: false,
          isDevelopment: true,
          currentVersion: this.currentVersion,
          latestVersion: latestVersionClean,
          releaseDate: releaseDate,
          message: 'Running unreleased development version'
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not check for updates: ${error.message}`)
      console.log(`🔗 Check manually: ${cyan(this.releaseUrl)}`)
      
      return {
        hasUpdate: null,
        currentVersion: this.currentVersion,
        error: error.message,
        manualUrl: this.releaseUrl
      }
    }
  }

  /**
   * Compare version strings to determine if one is newer
   * @param {string} version1 - Version to check (e.g., "1.2.4")
   * @param {string} version2 - Current version (e.g., "1.2.3")
   * @returns {boolean} True if version1 is newer than version2
   */
  isNewerVersion(version1, version2) {
    const v1Parts = version1.split('.').map(Number)
    const v2Parts = version2.split('.').map(Number)
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0
      const v2Part = v2Parts[i] || 0
      
      if (v1Part > v2Part) return true
      if (v1Part < v2Part) return false
    }
    
    return false
  }

  /**
   * Get all releases from GitHub
   */
  async getAllReleases() {
    try {
      const response = await axios.get('https://api.github.com/repos/juniorafonso/LootLogger/releases', {
        timeout: 15000,
        headers: {
          'User-Agent': 'LootLogger-UpdateChecker',
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      return response.data.map(release => ({
        version: release.tag_name.replace(/^v/, ''),
        name: release.name,
        publishedAt: release.published_at,
        body: release.body,
        htmlUrl: release.html_url,
        isPrerelease: release.prerelease,
        isDraft: release.draft
      }))
    } catch (error) {
      console.log(`⚠️  Could not fetch releases: ${error.message}`)
      return []
    }
  }

  /**
   * Show version info with update checking - all in one clean block
   */
  async showVersionInfoAndCheck() {
    console.log(`\n📋 === VERSION INFO ===`)
    console.log(`📦 Version: ${green(`LootLogger v${this.currentVersion}`)}`)
    console.log(`🔗 Releases: ${cyan(this.releaseUrl)}`)
    console.log(`🏷️  Tag: ${this.currentVersion}`)
    
    try {
      console.log(`🔍 Checking for updates...`)
      
      const response = await axios.get(this.apiUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'LootLogger-UpdateChecker',
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      const latestRelease = response.data
      const latestVersion = latestRelease.tag_name
      const latestVersionClean = latestVersion.replace(/^v/, '')
      const releaseDate = new Date(latestRelease.published_at).toLocaleDateString('pt-BR')

      if (this.isNewerVersion(latestVersionClean, this.currentVersion)) {
        // GitHub has newer version - update available
        console.log(`🚀 ${yellow('NEW VERSION AVAILABLE!')}`)
        console.log(`📥 Latest: ${green(`LootLogger v${latestVersionClean}`)} (${releaseDate})`)
        console.log(`📥 Current: ${red(`LootLogger v${this.currentVersion}`)}`)
        
        if (latestRelease.body) {
          const releaseNotes = latestRelease.body.split('\n').slice(0, 3).join('\n')
          if (releaseNotes.trim()) {
            console.log(`📝 Release Notes: ${releaseNotes}`)
          }
        }
        
        console.log(`📁 Download: ${cyan(this.releaseUrl)}`)
        console.log(`⚠️  ${yellow('Please update to get the latest features and bug fixes!')}`)
        
        console.log(`========================\n`)
        
        return {
          hasUpdate: true,
          latestVersion: latestVersionClean,
          releaseDate: releaseDate,
          downloadUrl: this.releaseUrl
        }
        
      } else if (this.currentVersion === latestVersionClean) {
        // Same version - running latest released version
        console.log(`✅ Running latest version! (Released: ${releaseDate})`)
        
      } else {
        // Local version is newer - development/unreleased version
        console.log(`🚧 ${yellow('DEVELOPMENT VERSION DETECTED!')}`)
        console.log(`🔧 Current: ${green(`LootLogger v${this.currentVersion}`)} (unreleased)`)
        console.log(`📦 Latest Released: ${cyan(`LootLogger v${latestVersionClean}`)} (${releaseDate})`)
        console.log(`💡 Running development version - remember to create release when ready`)
      }
    } catch (error) {
      console.log(`⚠️  Could not check for updates: ${error.message}`)
      console.log(`🔗 Check manually: ${cyan(this.releaseUrl)}`)
    }
    
    console.log(`========================\n`)
    
    return { hasUpdate: false }
  }

  /**
   * Show version info
   */
  showVersionInfo() {
    console.log(`\n📋 === VERSION INFO ===`)
    console.log(`📦 Version: ${green(`LootLogger v${this.currentVersion}`)}`)
    console.log(`🔗 Releases: ${cyan(this.releaseUrl)}`)
    console.log(`🏷️  Tag: ${this.currentVersion}`)
    console.log(`========================\n`)
  }
}

module.exports = new VersionManager()
