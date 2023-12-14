import fs from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const content = await fs.readFile(join(config.bpyLocation, '.env'))
  return content.toString()
})
