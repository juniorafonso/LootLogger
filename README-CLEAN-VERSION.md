# AO Loot Logger - Clean Version

## 🚀 What's Different?

This is a **clean, unfiltered version** of the original AO Loot Logger that removes the player whitelist/blacklist system.

### ❌ Removed Features:
- **Player filtering/blacklist** - No more paid exclusions
- **Remote config loading** for player lists
- **Hash-based player exclusion system**

### ✅ What You Get:
- **ALL loot events are logged** - No exceptions
- **Complete transparency** - Every player appears in logs
- **No remote dependencies** for filtering
- **Same core functionality** for packet capture and logging

## 🔧 Changes Made:

1. **Removed player filtering in `loot-logger.js`**
   - Eliminated the blacklist check that would skip certain players
   - Removed hash function and crypto dependency

2. **Cleaned up `config.js`**
   - Removed `Config.players` object
   - Removed `loadConfigs()` function
   - No more downloads from `configs.txt`

3. **Updated package.json**
   - Changed name to `ao-loot-logger-clean`
   - Updated description to reflect transparency

## 🎯 Perfect For:

- **Independent loot tracking websites**
- **Fair and transparent logging**
- **Community-driven projects**
- **Anyone who wants complete data**

## 📋 Installation & Usage:

Same as the original version:

```bash
npm install
npm start
```

## 🔍 Verification:

You can verify this is truly clean by checking:
- No player filtering code in `src/loot-logger.js` 
- No remote config loading in `src/config.js`
- All loot events appear in the output files

---

**Note**: This version maintains full compatibility with the original while ensuring complete transparency and fairness for all players.
