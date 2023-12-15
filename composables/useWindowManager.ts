export interface WindowOption {
  readonly id: symbol
  title: string
  titleIconURL: string
  active: boolean
  dragging: boolean
  top: number
  left: number
  width: number
  height: number
  minWidth?: number
  minHeight?: number
}

export interface IWindow extends Ref<WindowOption> {}

export default function () {
  const popups = ref(new Map<IWindow, string>())
  const windowLayer = ref<symbol[]>([])
  const activeWindowId = ref(Symbol('god'))
  const interacting = ref(false)
  const managedWindow = new Map<symbol, IWindow>()
  const activeWindow = computed(() => managedWindow.get(activeWindowId.value)?.value)

  function windowEventStart() {
    interacting.value = true
  }

  function windowEventEnd() {
    interacting.value = false
  }

  function moveWindowToTop(data: symbol) {
    const inStack = windowLayer.value.indexOf(data)
    inStack >= 0 && windowLayer.value.splice(inStack, 1)
    windowLayer.value.push(data)
    activeWindowId.value = data
  }

  function createWindow(opt: Partial<WindowOption>): IWindow {
    return ref({
      id: Symbol('window'),
      title: '',
      titleIconURL: '',
      active: false,
      dragging: false,
      top: 0,
      left: 0,
      width: 200,
      height: 200,
      minHeight: 50,
      minWidth: 50,
      ...opt,
    } satisfies WindowOption)
  }
  function manageWindow(input: IWindow): void {
    managedWindow.set(input.value.id, input)
  }
  function unmanageWindow(input: IWindow): void {
    managedWindow.delete(input.value.id)
    const i = windowLayer.value.indexOf(input.value.id)
    i !== -1 && windowLayer.value.splice(i, 1)
  }

  async function popupError(e: unknown, opt?: Partial<WindowOption>) {
    const window = createWindow({
      id: Symbol('error'),
      title: 'Error',
      titleIconURL: 'https://cdn-icons-png.flaticon.com/512/337/337948.png',
      active: true,
      dragging: false,
      top: (activeWindow.value?.top ?? 100) + 40,
      left: (activeWindow.value?.left ?? 100) + 20,
      width: 300,
      height: 100,
      minWidth: 300,
      minHeight: 100,
      ...opt,
    })
    console.error(e)
    if (e instanceof Error) {
      e = process.dev
        ? e.stack
        : e.message
    }
    popups.value.set(window, (e as string).toString())
    manageWindow(window)
    await nextTick()
    moveWindowToTop(window.value.id)
  }
  return {
    managedWindow,
    createWindow,
    manageWindow,
    unmanageWindow,
    windowEventStart,
    windowEventEnd,
    moveWindowToTop,
    windowLayer,
    activeWindowId,
    interacting,
    activeWindow,

    popups,
    popupError,
  }
}
