import { type ZodSchema, discriminatedUnion, literal, number, object, record, string, union, unknown } from 'zod'

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
}

export enum ProcessStatus {
  Created,
  Running,
  Exited,
}

interface NoDatabaseConfig {
  type: Database.Unset
}
interface SQLiteDatabase {
  type: Database.SQLite
  file: string
}

interface MySQLDatabase {
  type: Database.MySQL
  host: string
  port?: number
  user?: string
  password?: string
  database?: string
}

interface DSNDatabase {
  type: Database.DSN
  dsn: string
}

export type DBConfig = SQLiteDatabase | MySQLDatabase | DSNDatabase | NoDatabaseConfig

interface BaseConfig {
  cwd?: string
  env: Record<string, unknown>
  python: {
    bin: string
    entry?: string
  }
}

interface ProductionConfig extends BaseConfig {
  db: NoDatabaseConfig
  preset: Preset.Prod
}

export interface DevelopConfig extends BaseConfig {
  db: DSNDatabase | MySQLDatabase
  preset: Preset.Dev
  cwd?: string
  env: Record<string, unknown>
  python: {
    bin: string
    entry?: string
  }
}
export interface EmptyConfig extends BaseConfig {
  db: NoDatabaseConfig
  preset: Preset.Unset
}

export type Config = DevelopConfig | ProductionConfig

const noDatabase = object({
  type: literal(Database.Unset),
}) satisfies ZodSchema<NoDatabaseConfig>

const mysqlDatabase = object({
  type: literal(Database.MySQL),
  host: string(),
  port: number().optional(),
  user: string().optional(),
  password: string().optional(),
  database: string().optional(),
}) satisfies ZodSchema<MySQLDatabase>

const dsnDatabase = object({ type: literal(Database.DSN), dsn: string() }) satisfies ZodSchema<DSNDatabase>

const baseConfig = object({
  env: record(string(), unknown()),
  python: object({
    bin: string(),
    entry: string().optional(),
  }),
}) satisfies ZodSchema<BaseConfig>

const productionConfig = object({
  preset: literal(Preset.Prod),
  db: noDatabase,
}).and(baseConfig) satisfies ZodSchema<ProductionConfig>

const developConfig = object({
  preset: literal(Preset.Dev),
  db: discriminatedUnion('type', [
    mysqlDatabase,
    dsnDatabase,
  ]),
}).and(baseConfig) satisfies ZodSchema<DevelopConfig>

export const configValidator = union([
  productionConfig, developConfig,
]) satisfies ZodSchema<Config>

export enum WorkerEventType {
  Stdout = 'stdout',
  Stderr = 'stderr',
  Exited = 'exited',
}

export type WorkerEvent =
  | [WorkerEventType.Stdout | WorkerEventType.Stderr, string]
  | [WorkerEventType.Exited]
  | ['test', 'test']
