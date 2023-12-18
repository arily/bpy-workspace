import { type Worker } from './worker'

export class Container {
  running = new Map<number, Worker>()

  add(work: Worker) {
    work.id === 0 && err('work with pid 0? You can only add / remove started worker.')
    this.running.has(work.id) && err(`Have process ${work.id} running`)

    this.running.set(work.id, work)
  }

  remove(work: Pick<Worker, 'id'>) {
    if (work.id === 0) {
      err('work with pid 0? You can only add / remove started worker.')
    }
    const _w = this.running.get(work.id) ?? err('pid not found')
    this.running.delete(work.id)
    return _w.kill()
  }

  sync() {
    return Object.fromEntries([...this.running.entries()].map(([k, v]) => {
      return [
        k,
        v.serializeList(),
      ]
    }))
  }
}
