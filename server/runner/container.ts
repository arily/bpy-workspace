import { type Worker } from './worker'

export class Container {
  running = new Map<number, Worker>()

  add(work: Worker) {
    work.id === 0 && err('work with pid 0? You can only add / remove started worker.')
    this.running.has(work.id) && err(`Have process ${work.id} running`)

    this.running.set(work.id, work)
  }

  remove(work: Worker) {
    if (work.id === 0) {
      err('work with pid 0? You can only add / remove started worker.')
    }
    this.running.delete(work.id)
  }

  sync() {
    return Object.fromEntries([...this.running.entries()].map(([k, v]) => {
      return [
        k,
        v.serialize(),
      ]
    }))
  }
}
