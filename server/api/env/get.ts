import fs from 'node:fs/promises'
import { join } from 'node:path'
import { logger } from '../../logger'

export interface Query extends Record<string, string | undefined> {
  cwd?: string
}
export default defineEventHandler<{ query: Query }>(async (event) => {
  const q = getQuery(event)
  const loc = q.cwd || useRuntimeConfig().public.bpyLocation
  const content = await fs.readFile(join(loc, '.env'))
  logger.info(`get env from ${loc}`)
  return content.toString()
})
