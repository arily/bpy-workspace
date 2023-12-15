<script lang="ts" setup>
const {
  createWindow,
  activeWindowId,
  windowEventEnd,
  windowEventStart,
  windowLayer,
  moveWindowToTop,
  manageWindow,
  managedWindow,
  activeWindow,
} = useGlobalWindowManager()

const debug = createWindow({
  id: Symbol('debug'),
  title: 'Debug',
  titleIconURL: 'https://cdn-icons-png.flaticon.com/512/337/337948.png',
  active: true,
  dragging: false,
  top: 500,
  left: 500,
  width: 850,
  height: 300,
  minWidth: 700,
  minHeight: 300,
})
manageWindow(debug)
</script>

<template>
  <VueWindowManager
    v-model:is-active="debug.active"
    v-model:top="debug.top"
    v-model:left="debug.left"
    v-model:width="debug.width"
    v-model:height="debug.height"
    v-model:min-width="debug.minWidth"
    v-model:min-height="debug.minHeight"
    v-model:is-dragging="debug.dragging"
    v-model:window-id="debug.id"
    v-model:title="debug.title"
    v-model:title-icon="debug.titleIconURL"
    class="overflow-clip"
    :class="{
      active: activeWindowId === debug.id,
    }"
    :style="{
      'z-index': 1 + windowLayer.indexOf(debug.id),
    }"
    :is-resizing="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
    :show-maximize-button="true"
    :show-minimize-button="true"
    :is-maximized="false"
    @drag-start="windowEventStart"
    @resize-start="windowEventStart"
    @drag-end="windowEventEnd"
    @resize-end="windowEventEnd"
    @click-window="moveWindowToTop"
    @click-destroy="debug.active = false"
  >
    <div v-for="([sym, window]) in managedWindow" :key="sym" class="font-mono">
      [ {{ window.value.top }},
      {{ window.value.left }} ] {{ sym }}
      <template v-if="activeWindow?.id === window.value.id">
        active
      </template>
    </div>
  </VueWindowManager>
</template>
