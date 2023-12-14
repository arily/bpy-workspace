import { Worker } from './../../runner/worker'
import { container } from './../../runtime/index'
import { type Config, configValidator } from '~/types'

export default defineEventHandler(async (event) => {
  const config = await readBody(event)
  const validated = await configValidator.parseAsync(config)
  const w = new Worker(validated)
  w.run()
  container.add(w)
  return w.serialize()
})
