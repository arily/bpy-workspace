import { Worker } from './../../runner/worker'
import { container } from './../../runtime/index'
import { configValidator } from '~/types'

export default defineEventHandler(async (event) => {
  const config = await readBody(event)
  const validated = await configValidator.parseAsync(config)
  const w = new Worker(validated)
  await w.run()
  container.add(w)
  return w.serialize()
})
