'use server'

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import type { Build } from '@/lib/builds-data'
import { INITIAL_BUILDS } from '@/lib/builds-data'

const DATA_PATH = path.join(process.cwd(), 'data', 'builds.json')

function ensureFile(): void {
  try {
    mkdirSync(path.dirname(DATA_PATH), { recursive: true })
    readFileSync(DATA_PATH, 'utf-8')
  } catch {
    writeFileSync(DATA_PATH, JSON.stringify(INITIAL_BUILDS, null, 2))
  }
}

export async function getBuildsAction(): Promise<Build[]> {
  try {
    ensureFile()
    const raw = readFileSync(DATA_PATH, 'utf-8')
    return JSON.parse(raw) as Build[]
  } catch {
    return INITIAL_BUILDS
  }
}

export async function upsertBuildAction(build: Build): Promise<{ ok: boolean }> {
  try {
    ensureFile()
    const builds = await getBuildsAction()
    const idx = builds.findIndex((b) => b.id === build.id)
    if (idx >= 0) {
      builds[idx] = build
    } else {
      builds.push(build)
    }
    writeFileSync(DATA_PATH, JSON.stringify(builds, null, 2))
    return { ok: true }
  } catch (e) {
    console.error('upsertBuild error:', e)
    return { ok: false }
  }
}

export async function deleteBuildAction(id: string): Promise<{ ok: boolean }> {
  try {
    ensureFile()
    const builds = await getBuildsAction()
    const filtered = builds.filter((b) => b.id !== id)
    writeFileSync(DATA_PATH, JSON.stringify(filtered, null, 2))
    return { ok: true }
  } catch (e) {
    console.error('deleteBuild error:', e)
    return { ok: false }
  }
}

export async function checkPasswordAction(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'teckware2026'
  return password === adminPassword
}
