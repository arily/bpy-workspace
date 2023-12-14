import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process'
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

  run() {
    const conf = useRuntimeConfig()
    const exec = spawn('python3', ['main.py'], { cwd: this.config.cwd || conf.bpyLocation, env: this.config.env as NodeJS.ProcessEnv })

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
}
