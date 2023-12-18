import { type H3Event, setHeader, setResponseStatus } from 'h3'

export function useSSE(event: H3Event, hookName: string) {
  setHeader(event, 'content-type', 'text/event-stream')
  setHeader(event, 'cache-control', 'no-cache')
  setHeader(event, 'connection', 'keep-alive')
  setResponseStatus(event, 200)

  const send = (data: unknown): boolean => {
    return event.node.res.write(JSON.stringify(data))
  }

  const close = () => {
    event.node.res.end()
  }

  event._handled = true
  event.node.req.on('close', close)

  return { send, close }
}
