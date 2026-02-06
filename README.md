# LootLogger

## 🚀 100% Transparent & Fair Multi-Purpose Logging

This is a **transparent and fair** logging tool forked from [matheussampaio/ao-loot-logger](https://github.com/matheussampaio/ao-loot-logger) that logs **ALL players** without any exceptions or paid exclusions. Enhanced with market and might logging capabilities.

### ✅ Key Features:
- **Complete transparency** - Every event is logged (loot, market, might)
- **No player filtering** - No whitelist/blacklist system removed from original
- **Fair for everyone** - Equal treatment for all players
- **Market logging** - Track market transactions and pricing
- **Might logging** - Monitor might rankings and progression
- **Independent** - No external dependencies for filtering

**NOTE:** It does not work with a VPN (i.e. Exit Lag) or playing through Geforce Now.

## 🔧 How to Use

### 📥 Option 1: Download Pre-built Executable (Recommended)

1. Go to the [Releases page](../../releases)
2. Download the latest version:
   - **Windows**: `loot-logger-win.exe`
   - **Linux**: `loot-logger-linux`
3. Install the required dependencies:
   - **Windows**: [Npcap with WinPcap compatibility](https://nmap.org/npcap)
   - **Linux**: `sudo apt-get install libpcap-dev`
4. Run the executable
5. The log is written to file in the same folder (you can see the full path when the application starts)

### 💻 Option 2: Run from Source Code

#### Windows

1. Install [Npcap with WinPcap compatibility](https://nmap.org/npcap)
2. Download Node.js from https://nodejs.org
3. Clone or download this repository
4. Open terminal in the project folder and run:
   ```bash
   npm install
   npm start
   ```

#### Linux

1. Install `libpcap-dev`: `sudo apt-get install libpcap-dev`
2. Install Node.js from your package manager
3. Clone or download this repository
4. Open terminal in the project folder and run:
   ```bash
   npm install
   npm start
   ```

## 🔄 Automated Builds

This project uses GitHub Actions to automatically build executables for Windows and Linux:

- **Every push to main**: Creates development builds available in [Actions](../../actions)
- **Tagged releases**: Creates official releases with executables in [Releases](../../releases)
- **Pull requests**: Validates builds to ensure code quality

### Creating a Release

To create a new release with builds:
1. Create and push a git tag: `git tag v1.0.0 && git push origin v1.0.0`
2. GitHub will automatically create builds and a release
3. Download links will be available in the [Releases page](../../releases)

## 🎯 Features

### ✅ What You Get:
- **100% of all loot events** logged without exception
- **Complete market data** - Track all market transactions, prices, and trends
- **Might rankings** - Monitor player might progression and leaderboards
- **Killfeed events** - Full combat log with deaths and kills
- **Fair treatment** for all players
- **Complete data integrity** for your analysis
- **Independence** from external filtering services

### 📈 Market Logging:
- **Real-time market data** - Capture all buy/sell orders
- **Price tracking** - Monitor item price fluctuations
- **Volume analysis** - Track trading volumes per item
- **Quality levels** - Log item quality and enchantment levels

### ⚔️ Might Logging:
- **Player rankings** - Track might leaderboard changes
- **Progression monitoring** - See might gains/losses over time
- **Historical data** - Build comprehensive might progression databases

## 📊 Log Format

The application creates CSV-like files with the following format:

**Loot Events:**
```
date;utc_time;looted_by__alliance;looted_by__guild;looted_by__name;item_id;item_name;quantity;looted_from__alliance;looted_from__guild;looted_from__name;case_id;logger_version
```

**Killfeed Events:**
```
date;utc_time;killed_player__guild;killed_player__name;killer_player__guild;killer_player__name;event_type;logger_version
```

**Market Events:**
```
date;utc_time;item_type_id;quality_level;amount;unit_price;seller_name;item_id;logger_version
```

**Might Events:**
```
category,player_name,might_points
```

- `date`: EU format (dd-mm-yyyy) - for loot, killfeed and market events
- `utc_time`: UTC time format (hh:mm:ss) - for loot, killfeed and market events  
- `logger_version`: Version of LootLogger that created the log entry (e.g., "v1.2.3") - for loot, killfeed and market events
- `category`: Might category type (e.g., "GVGSEASON") - for might events only
- `might_points`: Player's might points in the specified category

Perfect for importing into spreadsheets, databases, or custom analysis tools.

## 🌐 Online Log Viewer

You can upload and analyze your log files using the **[Recckless.com](https://www.recckless.com)** website:

- **📊 Loot Analysis** - Comprehensive loot event analysis and insights
- **📈 Market Analysis** - Market data visualization and trend tracking  
- **📁 Multi-file Upload** - Upload multiple .txt or .csv log files simultaneously
- **🔍 Advanced Analytics** - Detailed analysis tools for your Albion Online data
- **💬 Community Support** - Discord support for questions and help

Simply upload your log files (.txt or .csv format) to get detailed analysis of your Albion Online loot and market data. The platform follows the same "No Pay-to-Hide" philosophy, ensuring fair analysis for all players.

## 🛠️ Technical Requirements

- Node.js v16 or higher
- Windows: Npcap with WinPcap compatibility
- Linux: libpcap-dev package
- No VPN or Geforce Now (packet capture limitation)

---

**This version ensures fair and transparent loot logging for the entire Albion Online community.**
