import { container } from '../../runtime'

export interface Body {
  id: number
}
export default defineEventHandler<{ body: Body }>(async (event) => {
  const body = await readBody(event)

  return await container.remove(body)
})
