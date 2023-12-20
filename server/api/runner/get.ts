import { container } from '~/server/runtime'

export default defineEventHandler<{ query: { id: string } }>(async (event) => {
  const q = getQuery(event)
  const _id = Number.parseInt(q.id)

  return container.running.get(_id)?.serialize() ?? err('pid not found')
})
