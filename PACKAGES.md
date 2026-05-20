# Notion for Linux - Packages

Generated package exports live under `out/make/`.

| Format | Build command | Exported file | Install command |
| --- | --- | --- | --- |
| DEB | `npm run make:deb` | `out/make/deb/x64/notion_1.1.0_amd64.deb` | `sudo apt install ./notion_1.1.0_amd64.deb` |
| RPM | `npm run make:rpm` | `out/make/rpm/x64/notion-for-linux-1.1.0-1.x86_64.rpm` | `sudo rpm -i out/make/rpm/x64/notion-for-linux-1.1.0-1.x86_64.rpm` |
| AppImage | `npm run make:appimage` | `out/make/AppImage/x64/Notion-1.1.0-x64.AppImage` | `chmod +x Notion-1.1.0-x64.AppImage && ./Notion-1.1.0-x64.AppImage` |
| ZIP | `npm run make:zip` | `out/make/zip/linux/x64/Notion-linux-x64-1.1.0.zip` | `unzip Notion-linux-x64-1.1.0.zip && ./Notion-linux-x64/notion-for-linux` |
| Snap | `npm run make:snap` | `out/make/snap/*` | `snap install ./notion-for-linux_*.snap` |
| Flatpak | `npm run make:flatpak` | `out/make/flatpak/*` | `flatpak install ./com.github.notyorch.notion-for-linux.flatpak` |

## Build all formats

```bash
npm run make:all
```

## Notes

- AppImage, ZIP, Snap, and Flatpak are portable or containerized distributions.
- DEB and RPM are the native installable packages for Debian-based and RPM-based systems.
