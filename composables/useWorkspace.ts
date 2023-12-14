import dotenv from 'dotenv'
import { type Config, Database, Preset, type ProcessStatus, configValidator } from '~/types'

let singleton: ReturnType<typeof workspace>
export default function () {
  return singleton ?? (singleton = workspace())
}
const empty = {
  db: { type: Database.Unset },
  preset: Preset.Unset,
  env: {},
} as const
function workspace() {
  const id = ref<number>()
  const stdout = ref<string[]>([])
  const stderr = ref<string[]>([])
  const status = ref<ProcessStatus>(0)
  const { popupError } = useGlobalWindowManager()
  const { data: env, refresh: refreshEnv } = useFetch('/api/env/get')

  const bootConfig = ref<Config>(empty as any)
  function prepare(): void {
    if (!env.value) {
      popupError(new Error('empty env'))
      return
    }
    const parsedEnv = dotenv.parse(env.value)
    bootConfig.value.env = parsedEnv
  }
  async function reset(val: { config: Config; id?: number; stderr: string[]; stdout: string[] } = empty as any) {
    id.value = val.id
    bootConfig.value = val.config
    stderr.value = val.stderr
    stdout.value = val.stdout

    await refreshEnv()
  }
  async function runApp() {
    const v = await $fetch('/api/runner/add', { method: 'post', body: bootConfig.value })
    id.value = v.id
    bootConfig.value = v.config
    status.value = v.status
    stdout.value = v.stdout
    stderr.value = v.stderr

    const sw = useProcessSwitch()
    return sw.reload()
  }
  return {
    id,
    stdout,
    stderr,
    status,

    env,
    bootConfig,
    prepare,
    reset,
    runApp,
    validated: computed(() => {
      const result = configValidator.safeParse(bootConfig.value)
      return result.success
    }),
  }
}
