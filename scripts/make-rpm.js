#!/usr/bin/env node

const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const { spawnSync } = require('child_process')

const rootDir = path.resolve(__dirname, '..')
const packageJson = require(path.join(rootDir, 'package.json'))

const version = packageJson.version
const rpmTopDir = path.join(rootDir, 'out', 'make', 'rpm')
const appImageDir = path.join(rootDir, 'out', 'make', 'AppImage')
const expectedAppImagePath = path.join(appImageDir, 'x64', `Notion-${version}-x64.AppImage`)
const sourceAppImageName = `notion-for-linux-${version}-x64.AppImage`
const sourceAppImagePath = path.join(rpmTopDir, 'SOURCES', sourceAppImageName)
const specSourcePath = path.join(rootDir, 'notion-for-linux.spec')
const specTargetPath = path.join(rpmTopDir, 'SPECS', 'notion-for-linux.spec')

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

async function pathExists(targetPath) {
  try {
    await fsp.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function ensureDirectory(targetPath) {
  await fsp.mkdir(targetPath, { recursive: true })
}

async function findAppImage(directoryPath) {
  const entries = await fsp.readdir(directoryPath, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name)

    if (entry.isFile() && entry.name.endsWith('.AppImage')) {
      return entryPath
    }

    if (entry.isDirectory()) {
      const nestedMatch = await findAppImage(entryPath)
      if (nestedMatch) {
        return nestedMatch
      }
    }
  }

  return null
}

async function main() {
  const requiredDirectories = [
    path.join(rpmTopDir, 'BUILD'),
    path.join(rpmTopDir, 'RPMS'),
    path.join(rpmTopDir, 'SOURCES'),
    path.join(rpmTopDir, 'SPECS'),
    path.join(rpmTopDir, 'SRPMS'),
  ]

  await Promise.all(requiredDirectories.map(ensureDirectory))

  if (!(await pathExists(expectedAppImagePath))) {
    run('npm', ['run', 'make:appimage'])
  }

  const appImagePath = (await pathExists(expectedAppImagePath))
    ? expectedAppImagePath
    : (await pathExists(appImageDir) ? await findAppImage(appImageDir) : null)

  if (!appImagePath) {
    throw new Error(`No se encontró un AppImage en ${appImageDir}`)
  }

  await fsp.copyFile(appImagePath, sourceAppImagePath)
  await fsp.copyFile(specSourcePath, specTargetPath)

  run('rpmbuild', ['-bb', specTargetPath, '--define', `_topdir ${rpmTopDir}`])
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})