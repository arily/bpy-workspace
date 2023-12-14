<script lang="ts" setup>
const {
  popups,
  activeWindowId,
  windowEventEnd,
  windowEventStart,
  windowLayer,
  moveWindowToTop,
  unmanageWindow,
} = useGlobalWindowManager()
</script>

<template>
  <VueWindowManager
    v-for="[error, msg] in popups"
    :key="msg"
    v-model:is-active="error.value.active"
    v-model:top="error.value.top"
    v-model:left="error.value.left"
    v-model:width="error.value.width"
    v-model:height="error.value.height"
    v-model:min-width="error.value.minWidth"
    v-model:min-height="error.value.minHeight"
    v-model:is-dragging="error.value.dragging"
    v-model:window-id="error.value.id"
    v-model:title="error.value.title"
    v-model:title-icon="error.value.titleIconURL"
    class="!absolute"
    :class="{
      active: activeWindowId === error.value.id,
    }"
    :style="{
      'z-index': 1 + windowLayer.indexOf(error.value.id),
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
    @click-destroy="() => {
      popups.delete(error)
      unmanageWindow(error)
    }"
  >
    <div class="inset-0 w-full h-full font-mono whitespace-break-spaces">
      {{ msg }}
    </div>
  </VueWindowManager>
</template>

<style scoped></style>
