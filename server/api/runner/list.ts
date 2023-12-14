import { container } from './../../runtime/index'

export default defineEventHandler(async (event) => {
  return container.sync()
})
