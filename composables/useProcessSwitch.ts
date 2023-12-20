import type { Workspace } from './useWorkspace'

let sw: ReturnType<typeof processSw>
export default function () {
  return sw || (sw = processSw())
}

const workspaces: Map<number, Workspace> = new Map()
export function processSw() {
  const { data: list, refresh, pending } = useFetch('/api/runner/list')
  const activeId = ref<number>(-1)
  return {
    interval: setInterval(() => refresh(), 3000),
    async switch(id: number) {
      const cur = await $fetch('/api/runner/get', { query: { id } })
      let _workspace
      _workspace = workspaces.get(id)
      if (!_workspace) {
        _workspace = createWorkspace()
        workspaces.set(id, _workspace)
      }
      _workspace.reset(cur)
      _workspace.stream()
      activeId.value = id
    },
    list,
    activeId,
    workspaces,
    reload: refresh,
    reloading: pending,
    async killTask(task: number) {
      await $fetch('/api/runner/kill', { method: 'post', body: { id: task } })
      workspaces.set(-1, workspaces.get(task) ?? undefined as never)
      await refresh()
    },
  }
}
