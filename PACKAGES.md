# Notion for Linux - Packages

## Available Formats

### ✅ Successfully Built

#### 1. **DEB** (Debian/Ubuntu)
- **File**: `out/make/deb/x64/notion_1.1.0_amd64.deb` (80 MB)
- **Installation**: `sudo apt install ./notion_1.1.0_amd64.deb`
- **Supported**: Ubuntu 20.04+, Debian 11+
- **Build Command**: `npm run make:deb`

#### 2. **AppImage** (Universal Linux)
- **File**: `out/make/AppImage/x64/Notion-1.1.0-x64.AppImage` (112 MB)
- **Installation**: `chmod +x Notion-1.1.0-x64.AppImage && ./Notion-1.1.0-x64.AppImage`
- **Supported**: All Linux distributions (x86_64)
- **Build Command**: `npm run make:appimage`

#### 3. **TAR.GZ** (Portable Archive)
- **File**: `out/make/Notion-linux-x64-1.1.0.tar.gz` (110 MB)
- **Installation**: `tar xzf Notion-linux-x64-1.1.0.tar.gz && ./Notion-linux-x64/notion-for-linux`
- **Supported**: All Linux distributions
- **Build Command**: `npm run make:zip && (create tar.gz manually)`

#### 4. **ZIP** (Portable Archive)
- **File**: `out/make/zip/linux/x64/Notion-linux-x64-1.1.0.zip` (110 MB)
- **Installation**: `unzip Notion-linux-x64-1.1.0.zip && ./Notion-linux-x64/notion-for-linux`
- **Supported**: All Linux distributions
- **Build Command**: `npm run make:zip`

---

### ⚠️ Requires System Tools

#### 5. **RPM** (Fedora/RHEL)
- **Status**: Configuration ready, requires `rpmbuild` on build system
- **Files**: 
  - Spec file: `notion-for-linux.spec`
  - Build Command**: `npm run make:rpm`
- **Supported**: Fedora 38+, RHEL 9+, CentOS 9+
- **Manual Build**: `rpmbuild -bb notion-for-linux.spec`

#### 6. **Snap** (Ubuntu/Linux)
- **Status**: Configuration ready, requires `snapcraft` on build system
- **File**: `snapcraft.yaml`
- **Build Command**: `snapcraft` (requires snapcraft CLI)
- **Installation**: `snap install ./notion-for-linux_*.snap`

#### 7. **Flatpak** (Linux Desktop)
- **Status**: Configuration ready, requires `flatpak-builder` on build system
- **File**: `com.github.notyorch.notion-for-linux.json`
- **Build Command**: `flatpak-builder build-dir com.github.notyorch.notion-for-linux.json`
- **Installation**: `flatpak install ./com.github.notyorch.notion-for-linux.flatpak`

---

## Quick Start

### For Ubuntu/Debian Users:
```bash
sudo apt install ./notion_1.1.0_amd64.deb
```

### For Fedora/RHEL Users (with rpmbuild):
```bash
npm run make:rpm
sudo rpm -i out/make/rpm/x64/notion-for-linux-1.1.0-1.x86_64.rpm
```

### For Any Linux Distribution:
```bash
chmod +x Notion-1.1.0-x64.AppImage
./Notion-1.1.0-x64.AppImage
```

### Portable (No Installation):
```bash
tar xzf Notion-linux-x64-1.1.0.tar.gz
./Notion-linux-x64/notion-for-linux
```

---

## Build All Available Formats

```bash
npm run make:all
```

This builds: DEB, RPM, and AppImage (requires system tools for RPM).

## Build Custom Formats

```bash
npm run make:deb       # Build DEB only
npm run make:rpm       # Build RPM only (requires rpmbuild)
npm run make:appimage  # Build AppImage only
npm run make:zip       # Build portable ZIP
```

---

## Issues & Troubleshooting

### RPM Build Fails
- **Cause**: Missing `rpmbuild` or incompatible version
- **Solution**: Install `rpm-build` package: `sudo dnf install rpm-build`

### Snap Build Fails
- **Cause**: Missing `snapcraft`
- **Solution**: Install Snapcraft: `sudo apt install snapcraft`

### Flatpak Build Fails
- **Cause**: Missing `flatpak-builder`
- **Solution**: Install: `sudo apt install flatpak-builder`

### AppImage Won't Execute
- **Solution**: `chmod +x Notion-1.1.0-x64.AppImage`

### VSync Errors (Harmless)
These GPU warnings are normal on headless systems and don't affect functionality.

---

## File Locations

All built packages are in: `out/make/`

```
out/make/
├── deb/x64/notion_1.1.0_amd64.deb
├── rpm/x64/notion-for-linux-1.1.0-1.x86_64.rpm (if built)
├── AppImage/x64/Notion-1.1.0-x64.AppImage
├── zip/linux/x64/Notion-linux-x64-1.1.0.zip
└── Notion-linux-x64-1.1.0.tar.gz
```

---

## Package Metadata

| Format | Executable | Size | Arch | Portable |
|--------|-----------|------|------|----------|
| DEB | notion-for-linux | 80 MB | x64 | No (apt required) |
| RPM | notion-for-linux | ~80 MB | x64 | No (rpm required) |
| AppImage | Notion-1.1.0-x64.AppImage | 112 MB | x64 | ✅ Yes |
| TAR.GZ | notion-for-linux (in extracted dir) | 110 MB | x64 | ✅ Yes |
| ZIP | notion-for-linux (in extracted dir) | 110 MB | x64 | ✅ Yes |
| Snap | notion-for-linux (snap) | ~80 MB | x64 | ✅ Yes (snap required) |
| Flatpak | notion-for-linux (flatpak) | ~80 MB | x64 | ✅ Yes (flatpak required) |

