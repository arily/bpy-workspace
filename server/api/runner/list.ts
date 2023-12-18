import { container } from '~/server/runtime'

export default defineEventHandler(async (event) => {
  return container.sync()
})
