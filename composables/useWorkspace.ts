import dotenv from 'dotenv'
import { type Config, Database, type EmptyConfig, Preset, type ProcessStatus, WorkerEventType, configValidator } from '~/types'

export type Workspace = ReturnType<typeof createWorkspace>
export const workspace = computed(() => {
  const sw = useProcessSwitch()
  return sw.workspaces.get(sw.activeId.value ?? err('pid unknown')) ?? createWorkspace()
})

export function useWorkspace() {
  return {
    id: computed({
      get: () => workspace.value.id.value,
      set: val => workspace.value.id.value = val,
    }),
    stdout: computed({
      get: () => workspace.value.stdout.value,
      set: val => workspace.value.stdout.value = val,
    }),
    stderr: computed({
      get: () => workspace.value.stderr.value,
      set: val => workspace.value.stderr.value = val,
    }),
    status: computed({
      get: () => workspace.value.status.value,
      set: val => workspace.value.status.value = val,
    }),

    env: computed({
      get: () => workspace.value.env.value,
      set: val => workspace.value.env.value = val,
    }),
    bootConfig: computed({
      get: () => workspace.value.bootConfig.value,
      set: val => workspace.value.bootConfig.value = val,
    }),
    readEnvFromFile: () => workspace.value.readEnvFromFile,
    reset: () => workspace.value.reset,
    runApp: () => workspace.value.runApp,
    stream: () => workspace.value.stream,
    validated: computed(() => workspace.value.validated.value),
  }
}

const empty: EmptyConfig = {
  db: { type: Database.Unset },
  preset: Preset.Unset,
  env: {},
  python: {
    bin: 'python3',
  },
}
export function createWorkspace(val?: { config?: Config; id?: number; stderr?: string[]; stdout?: string[] }) {
  const { popupError } = useGlobalWindowManager()
  const conf = useRuntimeConfig()
  const id = ref<number>()
  const stdout = ref<string[]>([])
  const stderr = ref<string[]>([])
  const status = ref<ProcessStatus>(0)
  const bootConfig = ref<Config | EmptyConfig>(empty as any)
  const env = ref<string>()
  $fetch('/api/env/get').then(v => env.value = v)

  reset(val)

  let e: EventSource
  watch(() => bootConfig.value.preset, presetSelected)
  function readEnvFromFile(): void {
    if (!env.value) {
      popupError(new Error('empty env'))
      return
    }
    const parsedEnv = dotenv.parse(env.value)
    bootConfig.value.env = parsedEnv
  }

  async function reset(val: { config?: Config; id?: number; stderr?: string[]; stdout?: string[] } = {}) {
    const { config: _config = structuredClone(empty), id: _id = 0, stderr: _stderr = [], stdout: _stdout = [] } = val
    id.value = _id
    bootConfig.value = _config
    stderr.value = _stderr
    stdout.value = _stdout
  }
  async function runApp() {
    const v = await $fetch('/api/runner/add', { method: 'post', body: bootConfig.value })
    id.value = v.id
    bootConfig.value = v.config
    status.value = v.status
    stdout.value = v.stdout
    stderr.value = v.stderr

    const sw = useProcessSwitch()
    await sw.reload()
    sw.workspaces.set(v.id, workspace.value)
    sw.switch(id.value)
  }

  function presetSelected(val: Preset) {
    switch (val) {
      case Preset.Dev: {
        bootConfig.value.db = {
          type: Database.DSN,
          dsn: `sqlite://${conf.public.cwd}/.data/dev.db`,
        }
      }
    }
  }

  function unstream() {
    e.close()
  }

  function stream() {
    if (e) {
      unstream()
    }

    const u = new URL('/api/runner/stream', window.location.origin)
    u.searchParams.append('id', id.value?.toString() ?? err('pid is required'))

    e = new EventSource(u)

    e.addEventListener(WorkerEventType.Stdout, (e) => {
      const data: string = JSON.parse(e.data)
      stdout.value.push(data)
    })
    e.addEventListener(WorkerEventType.Stderr, (e) => {
      const data: string = JSON.parse(e.data)
      stderr.value.push(data)
    })
    e.addEventListener(WorkerEventType.Exited, (e) => {
      id.value = undefined
      unstream()
    })
  }
  return {
    id,
    stdout,
    stderr,
    status,

    env,
    bootConfig,
    readEnvFromFile,
    reset,
    runApp,
    stream,
    validated: computed(() => {
      const result = configValidator.safeParse(bootConfig.value)
      return result.success
    }),
  }
}
