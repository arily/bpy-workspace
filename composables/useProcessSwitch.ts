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
    switch(id: number) {
      if (!list.value) {
        return
      }
      if (!(id in list.value)) {
        err(`unknown id: ${id}`)
      }
      const cur = list.value[id]
      if (!cur) {
        err('unknown pid')
      }
      let _workspace
      _workspace = workspaces.get(id)
      if (!_workspace) {
        _workspace = createWorkspace()
        workspaces.set(id, _workspace)
      }
      _workspace.reset({ ...cur, stderr: [cur.stderr], stdout: [cur.stdout] })
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
