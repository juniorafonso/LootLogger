# LootLogger

## 🚀 100% Transparent & Fair Loot Logging

This is a **transparent and fair** loot logging tool that logs **ALL players** without any exceptions or paid exclusions.

### ✅ Key Features:
- **Complete transparency** - Every loot event is logged
- **No player filtering** - No whitelist/blacklist system
- **Fair for everyone** - Equal treatment for all players
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
- **Fair treatment** for all players
- **Complete data integrity** for your analysis
- **Independence** from external filtering services

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

- `date`: EU format (dd-mm-yyyy)
- `utc_time`: UTC time format (hh:mm:ss)
- `logger_version`: Version of LootLogger that created the log entry (e.g., "v1.2.3")

Perfect for importing into spreadsheets, databases, or custom analysis tools.

## 🛠️ Technical Requirements

- Node.js v16 or higher
- Windows: Npcap with WinPcap compatibility
- Linux: libpcap-dev package
- No VPN or Geforce Now (packet capture limitation)

---

**This version ensures fair and transparent loot logging for the entire Albion Online community.**
