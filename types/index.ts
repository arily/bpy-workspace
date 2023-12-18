import { type ZodSchema, discriminatedUnion, literal, nativeEnum, number, object, record, string, unknown } from 'zod'

export enum Database {
  Unset,
  SQLite = 'sqlite',
  MySQL = 'mysql',
  DSN = 'dsn',
}

export enum Preset {
  Unset,
  Dev = 'dev',
  Prod = 'prod',
  Custom = 'custom',
}

export enum ProcessStatus {
  Created,
  Running,
  Exited,
}

export type DBConfig = {
  type: Database.SQLite
  file: string
} | {
  type: Database.MySQL
  address: string
  port?: number
  user?: string
  password?: string
  database?: string
} | {
  type: Database.DSN
  dsn: string
} | {
  type: Database.Unset
}

export interface Config {
  db: DBConfig
  preset: Preset
  cwd?: string
  env: Record<string, unknown>
  python: {
    bin: string
    entry?: string
  }
}

export const configValidator: ZodSchema<Config> = object({
  db: discriminatedUnion('type', [
    object({ type: literal(Database.SQLite), file: string() }),
    object({ type: literal(Database.MySQL), address: string(), port: number().optional(), user: string().optional(), password: string().optional(), database: string().optional() }),
    object({ type: literal(Database.DSN), dsn: string() }),
  ]),
  preset: nativeEnum(Preset),
  cwd: string().optional(),
  env: record(string(), unknown()),
  python: object({
    bin: string(),
    entry: string().optional(),
  }),
})

export enum WorkerEventType {
  Stdout = 'stdout',
  Stderr = 'stderr',
  Exited = 'exited',
}

export type WorkerEvent =
| [WorkerEventType.Stdout | WorkerEventType.Stderr, string]
| [WorkerEventType.Exited]
| ['test', 'test']
