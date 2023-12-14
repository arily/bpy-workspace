let sw: ReturnType<typeof processSw>
export default function () {
  return sw || (sw = processSw())
}

export function processSw() {
  const workspace = useWorkspace()
  const { data: list, refresh, pending } = useFetch('/api/runner/list')
  return {
    switch(id: number) {
      if (!list.value) {
        return
      }
      if (!(id in list.value)) {
        err(`unknown id: ${id}`)
      }
      workspace.reset(list.value[id])
    },
    list,
    reload: refresh,
    reloading: pending,
    async killTask(task: number) {
      const rValue = await $fetch('/api/runner/kill', { method: 'post', body: { id: task } })
    },
  }
}
