<script lang="ts" setup>
defineProps<{
  defaultLanguage: string
}>()
const content = (defineModel<string | null>('content', { default: '' }))
const {
  createWindow,
  manageWindow,
  windowEventEnd,
  windowEventStart,
  moveWindowToTop,
  windowLayer,
  activeWindowId,
} = useGlobalWindowManager()

const edit = createWindow({
  id: Symbol('edit'),
  title: 'Edit',
  titleIconURL: 'https://cdn-icons-png.flaticon.com/512/337/337948.png',
  active: true,
  dragging: false,
  top: 50,
  left: 50,
  width: 400,
  height: 700,
  minWidth: 200,
  minHeight: 100,
})
manageWindow(edit)

defineExpose({
  window: edit,
})
</script>

<template>
  <VueWindowManager
    v-model:is-active="edit.active"
    v-model:top="edit.top"
    v-model:left="edit.left"
    v-model:width="edit.width"
    v-model:height="edit.height"
    v-model:min-width="edit.minWidth"
    v-model:min-height="edit.minHeight"
    v-model:is-dragging="edit.dragging"
    v-model:window-id="edit.id"
    v-model:title="edit.title"
    v-model:title-icon="edit.titleIconURL"
    class="h-0"
    :class="{
      active: activeWindowId === edit.id,
    }"
    :style="{
      'z-index': 1 + windowLayer.indexOf(edit.id),
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
    @click-destroy="edit.active = false"
  >
    <editor v-model:content="content" :default-language="defaultLanguage" />
  </VueWindowManager>
</template>

<style scoped></style>
