# Development Guide

## Building Locally

### Prerequisites
- Node.js v18 or higher
- npm

### Build Commands

```bash
# Install dependencies (production only)
npm install --production

# Create build directory
mkdir loot-logger

# Copy required files
cp -r node_modules/ src/ loot-logger/
cp package.json loot-logger/

# Install packaging tool
npm install --global caxa

# Create Windows executable
caxa --input loot-logger --output "loot-logger-win.exe" -- "{{caxa}}/node_modules/.bin/node" "{{caxa}}/src/index.js"

# Create Linux executable
caxa --input loot-logger --output "loot-logger-linux" -- "{{caxa}}/node_modules/.bin/node" "{{caxa}}/src/index.js"
```

### Using the Build Script

For Linux/macOS users with bash:
```bash
# Build for current platform
./build.sh

# Build for Linux specifically
./build.sh -l
```

## GitHub Actions

The project automatically builds executables using GitHub Actions:

- **Triggered on**: Push to main, Pull Requests, Release creation
- **Platforms**: Windows and Linux
- **Output**: Standalone executables (no Node.js installation required)

## Release Process

1. Update version in `package.json`
2. Commit changes: `git commit -am "Release v1.x.x"`
3. Create tag: `git tag v1.x.x`
4. Push with tags: `git push origin main --tags`
5. GitHub Actions will automatically create the release with builds

## Testing

Before releasing, test the application:

```bash
# Install dependencies
npm install

# Run the application
npm start

# Test in development mode
node src/index.js
```
