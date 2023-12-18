import { type ChildProcessWithoutNullStreams, exec, spawn } from 'node:child_process'
import { EventEmitter } from 'node:events'
import type { Buffer } from 'node:buffer'
import { type Config, ProcessStatus } from '~/types'

export class Worker {
  config: Config
  id: number = 0
  work?: ChildProcessWithoutNullStreams
  status: ProcessStatus = ProcessStatus.Created
  exitCode: number = 0

  stdout: string[] = []
  stderr: string[] = []

  ee: EventEmitter = new EventEmitter()
  constructor(config: Config) {
    this.config = config
  }

  async run() {
    const conf = useRuntimeConfig()
    const exec = spawn(this.config.python.bin, [this.config.python.entry || 'main.py'], { cwd: this.config.cwd || conf.bpyLocation, env: this.config.env as NodeJS.ProcessEnv })

    console.log('pid:', exec.pid)
    this.id = exec.pid ?? err('exec\'d returns no pid')
    this.work = exec
    this.status = ProcessStatus.Running

    exec.stdout.on('data', this.logStdout.bind(this))
    exec.stderr.on('data', this.logStderr.bind(this))
    exec.on('close', this.markClosed.bind(this))
    return this
  }

  logStdout(data: Buffer) {
    const str = data.toString()
    this.stdout.push(str)
    this.ee.emit('stdout', str)
  }

  logStderr(data: Buffer) {
    const str = data.toString()
    this.stderr.push(str)
    this.ee.emit('stderr', str)
  }

  markClosed(code: number) {
    this.status = ProcessStatus.Exited
    this.exitCode = code
    this.ee.emit('exited')

    // eslint-disable-next-line no-console
    console.info(`child process exited with code ${code}`)
  }

  serialize() {
    return {
      id: this.id,
      exitCode: this.exitCode,
      status: this.status,
      stdout: this.stdout,
      stderr: this.stderr,
      config: this.config,
    }
  }

  serializeList() {
    return {
      id: this.id,
      exitCode: this.exitCode,
      status: this.status,
      stdout: this.stdout.at(-1),
      stderr: this.stderr.at(-1),
      config: this.config,
    }
  }

  #postKill() {
    this.id = 0
  }

  kill(signal?: number): boolean {
    const res = (this.work ?? err('not running'))?.kill(signal)
    if (res) {
      this.#postKill()
    }

    return res
  }
}
