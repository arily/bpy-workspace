<script lang="ts" setup>
import { Data as DataComponent } from '#components'

const {
  createWindow,
  windowEventEnd,
  windowEventStart,
  moveWindowToTop,
  windowLayer,
  activeWindowId,
} = useGlobalWindowManager()

const {
  bootConfig,
} = useWorkspace()

const window = createWindow({
  id: Symbol('data'),
  title: 'Start Config',
  titleIconURL: 'https://cdn-icons-png.flaticon.com/512/337/337948.png',
  active: true,
  dragging: false,
  top: 200,
  left: 200,
  width: 860,
  height: 507,
  minWidth: 700,
  minHeight: 300,
})
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
    class="!absolute"
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
    :max-height="500"
    @drag-start="windowEventStart"
    @resize-start="windowEventStart"
    @drag-end="windowEventEnd"
    @resize-end="windowEventEnd"
    @click-window="moveWindowToTop"
    @click-destroy="window.active = false"
  >
    <DataComponent v-model="bootConfig" class="absolute w-full h-full overflow-visible" />
  </VueWindowManager>
</template>
