<script lang="ts" setup>
const {
  createWindow,
  windowEventEnd,
  manageWindow,
  windowEventStart,
  moveWindowToTop,
  windowLayer,
  activeWindowId,
} = useGlobalWindowManager()

const { stderr, stdout, id } = useWorkspace()

const window = createWindow({
  id: Symbol('Logs'),
  title: 'Logs',
  titleIconURL: 'https://cdn-icons-png.flaticon.com/512/337/337948.png',
  active: true,
  dragging: false,
  top: 400,
  left: 100,
  width: 860,
  height: 507,
  minWidth: 700,
  minHeight: 300,
})
manageWindow(window)

watch(
  () => [stderr, stdout],
  () => {
    if (!id) {
      window.value.active = false
    }
    if (!stderr.value.length && !stdout.value.length) {
      window.value.active = false
    }
  }
)
</script>

<template>
  <VueWindowManager
    v-model:is-active="window.active"
    v-model:top="window.top"
    v-model:left="window.left"
    v-model:width="window.width"
    v-model:height="window.height"
    v-model:min-width="window.minWidth"
    v-model:min-height="window.minHeight"
    v-model:is-dragging="window.dragging"
    v-model:window-id="window.id"
    v-model:title="window.title"
    v-model:title-icon="window.titleIconURL"
    :class="{
      active: activeWindowId === window.id,
    }"
    :style="{
      'z-index': 1 + windowLayer.indexOf(window.id),
    }"
    :is-resizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
    :show-maximize-button="false"
    :show-minimize-button="false"
    :is-maximized="false"
    @drag-start="windowEventStart"
    @resize-start="windowEventStart"
    @drag-end="windowEventEnd"
    @resize-end="windowEventEnd"
    @click-window="moveWindowToTop"
    @click-destroy="window.active = false"
  >
    <div id="logs" class="relative w-full h-full p-1 bg-indigo-900">
      <pre
        v-if="stdout.length"
        class="inline-block w-full overflow-y-auto h-1/2"
      >
<span class="text-white">stdout</span>
<code v-for="i, index in workspace.stdout.value" :key="index" class="text-white lazy-render">
  {{ i }}
</code>
</pre>

      <pre
        v-if="stderr.length"
        class="inline-block w-full overflow-y-auto h-1/2"
      >
<span class="text-error">stderr</span>
<code v-for="i, index in workspace.stderr.value" :key="index" class="text-error lazy-render">
  {{ i }}
</code>
      </pre>
    </div>
  </VueWindowManager>
</template>

<style scoped lang="postcss">
.lazy-render {
  content-visibility: auto;
}

#logs {
  pre + pre {
    @apply border-t-2
  }
}
</style>
