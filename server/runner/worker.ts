import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process'
import { EventEmitter } from 'node:events'
import { type Buffer } from 'node:buffer'
import { parseDsnOrThrow } from '@soluble/dsn-parser'
import { logger } from '../logger'
import { type Config, Database, Preset, ProcessStatus } from '~/types'

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

  // DB_USER=cmyui
  // DB_PASS=lol123
  // DB_NAME=banchopy
  // DB_HOST=mysql
  // DB_PORT=3306
  prepareEnv() {
    const env = structuredClone(this.config.env)
    const p = this.config
    switch (p.preset) {
      case Preset.Prod: {
        break
      }
      case Preset.Dev: {
        switch (p.db.type) {
          case Database.DSN: {
            const parsed = parseDsnOrThrow(p.db.dsn)
            env.DB_USER = parsed.user
            env.DB_PASS = parsed.pass
            env.DB_HOST = parsed.host
            env.DB_PORT = parsed.port
            env.DB_NAME = parsed.db
            break
          }
          case Database.MySQL: {
            env.DB_USER = p.db.user
            env.DB_PASS = p.db.password
            env.DB_HOST = p.db.host
            env.DB_PORT = p.db.port
            env.DB_NAME = p.db.database
          }
        }
      }
    }
    return env
  }

  async run() {
    const conf = useRuntimeConfig()

    const env = this.prepareEnv()
    try {
      const proc = spawn(this.config.python.bin, [this.config.python.entry || 'main.py'], { cwd: this.config.cwd || conf.public.bpyLocation, env: env as NodeJS.ProcessEnv })

      this.id = proc.pid ?? err('exec\'d returns no pid')
      this.work = proc
      this.status = ProcessStatus.Running

      const startLog = `started process: ${proc.pid}`
      logger.info(startLog)
      this.stdout.push(startLog)

      proc.stdout.on('data', this.logStdout.bind(this))
      proc.stderr.on('data', this.logStderr.bind(this))
      proc.on('close', this.markClosed.bind(this))
      proc.on('error', this.logStderr.bind(this))

      return this
    }
    catch (e) {
      if (e instanceof Error) {
        this.stderr.push(e.message)
      }
    }
  }

  logStdout(data: Buffer) {
    const str = data.toString()
    this.stdout.push(str)
    this.ee.emit('stdout', str)
    // eslint-disable-next-line n/prefer-global/process
    process.dev && logger.info(str)
  }

  logStderr(data: Buffer) {
    const str = data.toString()
    this.stderr.push(str)
    this.ee.emit('stderr', str)
    // eslint-disable-next-line n/prefer-global/process
    process.dev && logger.error(str)
  }

  markClosed(code: number) {
    this.status = ProcessStatus.Exited
    this.exitCode = code
    this.ee.emit('exited')

    logger.info(`child process exited with code ${code}`)
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
