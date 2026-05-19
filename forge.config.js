const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  // Package the app for Linux targets with shared branding and icons.
  packagerConfig: {
    asar: true,
    executableName: 'notion-for-linux',
    icon: 'assets/notion-icon.png',
    linux: {
      target: ['deb', 'rpm', 'AppImage'],
      icon: 'assets/notion-icon.png'
    }
  },
  rebuildConfig: {},
  makers: [
    // Debian/Ubuntu package output.
    {
      name: '@electron-forge/maker-deb',
      config: {
        bin: 'notion-for-linux',
      },
    },
    // Fedora/RHEL package output.
    {
      name: '@electron-forge/maker-rpm',
      config: {
        name: 'notion-for-linux',
        bin: 'notion-for-linux',
        license: 'MIT',
        homepage: 'https://github.com/notyorch/Notion-for-Linux',
        description: 'Unofficial Notion desktop client for Linux',
        categories: ['Office', 'Utility'],
      },
    },
    // Universal AppImage output for Linux.
    {
      name: '@electron-forge/maker-appimage',
      config: {
        arch: ['x64', 'arm64'],
        options: {
          name: 'notion-for-linux',
          bin: 'notion-for-linux',
          productName: 'Notion',
          genericName: 'Unofficial Notion desktop client for Linux',
          icon: 'assets/notion-icon.png',
          categories: ['Office', 'Utility'],
        },
      },
    },
    // ZIP (can be extracted as portable Linux archive)
    {
      name: '@electron-forge/maker-zip',
      config: {
        platforms: ['linux'],
      },
    },
    // Snap package (universal Linux snap)
    {
      name: '@electron-forge/maker-snap',
      config: {
        summary: 'Unofficial Notion desktop client for Linux',
        description: 'Notion for Linux - A native desktop wrapper for Notion.so with enhanced features for Linux users',
        grade: 'stable',
        confinement: 'strict',
        plugs: ['home', 'x11', 'wayland', 'unity7', 'network'],
      },
    },
    // Flatpak package (universal Linux container)
    {
      name: '@electron-forge/maker-flatpak',
      config: {
        categories: ['Office', 'Utility'],
        icon: 'assets/notion-icon.png',
        id: 'com.github.notyorch.notion-for-linux',
        modules: [],
      },
    },
  ],
  plugins: [
    // Keep native modules unpacked for runtime compatibility.
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Harden the packaged Electron binary with v1 fuses.
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};