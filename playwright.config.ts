import { defineConfig } from '@playwright/test'

// Auditoría de cierre. Dos modos, nunca mezclados:
// - AUDIT_TARGET=prod (por defecto): solo lectura sobre AUDIT_BASE_URL.
// - AUDIT_TARGET=local: formularios, chat y /admin contra `next dev` con un Supabase falso.
//   Estas variables valen solo para ese proceso: .env.local apunta a la base real y Next no
//   sobrescribe lo que ya viene en el entorno, así que ninguna prueba llega a producción.
const local = process.env.AUDIT_TARGET === 'local'
const PUERTO_LOCAL = 3100
const PUERTO_SUPABASE = 54399

export default defineConfig({
  testDir: 'tests/auditoria',
  testMatch: local ? /local\..*\.spec\.ts/ : /prod\.spec\.ts/,
  outputDir: 'test-results',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  timeout: 300_000,
  use: {
    baseURL: local
      ? `http://localhost:${PUERTO_LOCAL}`
      : (process.env.AUDIT_BASE_URL ?? 'https://www.teckware.cl'),
    locale: 'es-CL',
    timezoneId: 'America/Santiago',
    trace: 'off',
    screenshot: 'off',
  },
  webServer: local
    ? [
        {
          command: 'node tests/auditoria/supabase-falso.mjs',
          url: `http://127.0.0.1:${PUERTO_SUPABASE}/__salud`,
          reuseExistingServer: false,
        },
        {
          command: `npx next dev -p ${PUERTO_LOCAL}`,
          url: `http://localhost:${PUERTO_LOCAL}/privacidad`,
          timeout: 240_000,
          reuseExistingServer: false,
          env: {
            NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${PUERTO_SUPABASE}`,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: 'clave-falsa-auditoria',
            SUPABASE_SERVICE_ROLE_KEY: 'clave-falsa-auditoria',
            ADMIN_PASSWORD: 'clave-solo-para-auditoria-local',
          },
        },
      ]
    : undefined,
})
