# Notion for Linux (Electron App)

![Notion icon](assets/notion-icon.png)

Unofficial Notion desktop client for Linux, built with Electron Forge.

## Features

* Wraps the official Notion web app in a native Linux desktop shell.
* Supports Debian/Ubuntu, Fedora/RHEL, and universal AppImage packaging.
* Uses a hardened Electron runtime with native menus and saved window state.

## Installation

![deb](https://img.shields.io/badge/package-.deb-0d6efd)
![rpm](https://img.shields.io/badge/package-.rpm-f28c28)
![AppImage](https://img.shields.io/badge/package-.AppImage-2ea44f)

### Build packages from source

```bash
npm run make:deb
npm run make:fedora
npm run make:appimage
```

To build all supported formats:

```bash
npm run make:all
```

### Distro compatibility

| Format | Recommended distros | Notes |
| --- | --- | --- |
| `.deb` | Ubuntu, Debian, Linux Mint | Best fit for Debian-based systems |
| `.rpm` | Fedora, RHEL, CentOS Stream, openSUSE | Best fit for RPM-based systems |
| `.AppImage` | Any modern Linux distribution | Portable, no install required |

## Build from source

```bash
git clone https://github.com/notyorch/Notion-for-Linux.git
cd Notion-for-Linux
npm install
npm start
```

## Repository

* GitHub: https://github.com/notyorch/Notion-for-Linux

## Disclaimer

This is an unofficial Electron wrapper for Notion and is not affiliated with or endorsed by Notion Labs, Inc.
