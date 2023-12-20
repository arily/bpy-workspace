import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { type Query } from './get'

// import { formidable } from 'formidable'

// const form = formidable({ multiples: true })

export default defineEventHandler<{ query: Query; body: { env: string } }>(async (event) => {
  const write = await readBody(event)
  const q = getQuery(event)
  const loc = q.cwd || useRuntimeConfig().public.bpyLocation
  await writeFile(join(loc, '.env'), write.env)
  return true
})
