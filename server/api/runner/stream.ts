import { type WorkerEvent } from './../../../types/index'
import { container } from './../../runtime'

// ~/server/api/sse.ts
export default defineEventHandler<{ query: { id: string } }>(async (event) => {
  const q = getQuery(event)
  event.node.res.writeHead(200, {
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
  })

  const work = container.running.get(Number(q.id)) ?? err('pid not found')
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  const lStdout = (str: string) => createMessage(<WorkerEvent>['stdout', str])
  const lStderr = (str: string) => createMessage(<WorkerEvent>['stderr', str])
  const lExited = () => createMessage(<WorkerEvent>['exited'])

  work.ee.on('stdout', lStdout)
  work.ee.on('stderr', lStderr)
  work.ee.on('exited', lExited)

  event.node.req.on('close', () => {
    work.ee.removeListener('stdout', lStdout)
    work.ee.removeListener('stderr', lStderr)
    work.ee.removeListener('exited', lExited)
  })
  event._handled = true
  await sendStream(event, readable)

  function createMessage(input: WorkerEvent) {
    return writer.write(encoder.encode([
      `event: ${input[0]}`,
      input[1] && `data: ${JSON.stringify(input[1])}`,
      '\n',
    ].filter(Boolean).join('\n')))
  }
})
