# AO Loot Logger - Clean Version

## 🚀 100% Transparent & Fair Loot Logging

This is a **clean, unfiltered version** of the AO Loot Logger that logs **ALL players** without any exceptions or paid exclusions.

### ✅ Key Features:
- **Complete transparency** - Every loot event is logged
- **No player filtering** - No whitelist/blacklist system
- **Fair for everyone** - Equal treatment for all players
- **Independent** - No external dependencies for filtering

**NOTE:** It does not work with a VPN (i.e. Exit Lag) or playing through Geforce Now.

## 🔧 How to Use (Windows)

1. Install [Npcap with WinPcap compatibility](https://nmap.org/npcap).
2. Download Node.js from https://nodejs.org
3. Clone or download this repository
4. Open terminal in the project folder and run:
   ```bash
   npm install
   npm start
   ```
5. The log is written to file in the same folder (you can see the full path when the application starts).

## 🔧 How to Use (Linux)

1. Install `libpcap-dev`: `sudo apt-get install libpcap-dev`.
2. Install Node.js from your package manager
5. The log is written to file in the same folder (you can see the full path when the application starts).

## 🎯 What Makes This Version Different?

### ❌ Removed from Original:
- Player filtering/blacklist system
- Remote configuration loading for exclusions
- Hash-based player exclusion
- Version checking and update notifications
- Links to original developer's services

### ✅ What You Get:
- **100% of all loot events** logged without exception
- **Fair treatment** for all players
- **Complete data integrity** for your analysis
- **Independence** from external filtering services

## 📊 Log Format

The application creates CSV-like files with the following format:
```
timestamp_utc;looted_by__alliance;looted_by__guild;looted_by__name;item_id;item_name;quantity;looted_from__alliance;looted_from__guild;looted_from__name
```

Perfect for importing into spreadsheets, databases, or custom analysis tools.

## 🛠️ Technical Requirements

- Node.js v16 or higher
- Windows: Npcap with WinPcap compatibility
- Linux: libpcap-dev package
- No VPN or Geforce Now (packet capture limitation)

---

**This clean version ensures fair and transparent loot logging for the entire Albion Online community.**

Start a [discussion](https://github.com/matheussampaio/ao-loot-logger/discussions).

## Found any problem?

Create an [issue](https://github.com/matheussampaio/ao-loot-logger/issues) so we can get it fixed.
