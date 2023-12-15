<script lang="ts" setup>
import { watch } from 'vue'

const emit = defineEmits<{
  (e: 'dragStart', value: symbol): void
  (e: 'dragEnd', value: symbol): void
  (e: 'resizeStart', value: symbol): void
  (e: 'resizeEnd', value: symbol): void
  (e: 'clickMin', value: symbol): void
  (e: 'clickWindow', value: symbol): void
  (e: 'clickDestroy', value: symbol): void
}>()
const top = defineModel<number>('top', { default: undefined })
const left = defineModel<number>('left', { default: undefined })
const width = defineModel<number>('width', { default: undefined })
const height = defineModel<number>('height', { default: undefined })
const minWidth = defineModel<number>('minWidth', { default: undefined })
const minHeight = defineModel<number>('minHeight', { default: undefined })
const isResizing = defineModel<string[]>('isResizing', { default: undefined })
const isActive = defineModel<boolean>('isActive', { default: undefined })
const isMaximized = defineModel<boolean>('isMaximized', { default: undefined })
const maxWidth = defineModel<number>('maxWidth', { default: undefined })
const maxHeight = defineModel<number>('maxHeight', { default: undefined })
const title = defineModel<string>('title', { default: undefined })
const windowInnerWidth = defineModel<number>('windowInnerWidth', { default: undefined })
const windowId = defineModel<symbol>('windowId', { default: undefined })
const titleIcon = defineModel<string>('titleIcon', { default: undefined })
const showMaximizeButton = defineModel<boolean>('showMaximizeButton', { default: undefined })
const showMinimizeButton = defineModel<boolean>('showMinimizeButton', { default: undefined })

function startDrag() {
  if (!windowId.value) {
    return
  }
  emit('dragStart', windowId.value)
}
function endDrag(data: { left: number }) {
  if (!windowId.value) {
    return
  }
  left.value = data.left
  emit('dragEnd', windowId.value)
}
function startResize(data: { width: number }) {
  if (!windowId.value) {
    return
  }
  width.value = data.width
  emit('resizeStart', windowId.value)
}
function endResize(data: { width: number }) {
  if (!windowId.value) {
    return
  }
  width.value = data.width
  emit('resizeEnd', windowId.value)
}
function minimize() {
  if (!windowId.value) {
    return
  }
  emit('clickMin', windowId.value)
}
function activeMouse() {
  if (!windowId.value) {
    return
  }
  emit('clickWindow', windowId.value)
}
function maximize() {
  if (isMaximized.value) {
    isMaximized.value = false
  }
  else {
    isMaximized.value = true
  }
}
function close() {
  if (!windowId.value) {
    return
  }
  emit('clickDestroy', windowId.value)
}
watch(
  windowInnerWidth,
  (newValue) => {
    if (left?.value || 0 + (width?.value || 0) > (newValue || 0)) {
      left.value = (newValue || 0) - (width.value || 0)
    }
  }
)
</script>

<template>
  <vue-resizable
    v-show="isActive"
    style="overflow-wrap: break-word"
    class="obaWindowStyle"
    drag-selector=".toolbar"
    :top="top"
    :left="left"
    :width="width"
    :height="height"
    :max-width="maxWidth"
    :max-height="maxHeight"
    :min-width="minWidth"
    :min-height="minHeight"
    :active="isResizing"
    :maximize="isMaximized"
    :fit-parent="true"
    @resize:start="startResize"
    @drag:start="startDrag"
    @drag:end="endDrag"
    @drag:move="(data) => {
      top = data.top,
      left = data.left
    }"
    @resize:end="endResize"
    @mousedown="activeMouse"
  >
    <div
      class="toolbar"
    >
      <div class="icon" :style="`background-image: url('${titleIcon}');`" />
      <div class="title">
        {{ title }}
      </div>
      <div class="buttons">
        <div v-if="showMinimizeButton" class="button" @click="minimize">
          &#9472;
        </div>
        <div v-if="showMaximizeButton" class="button" @click="maximize">
          &#9723;
        </div>
        <div class="button close" @click="close">
          &#10005;
        </div>
      </div>
    </div>
    <div class="window-content">
      <slot />
    </div>
  </vue-resizable>
</template>

<style lang="postcss" scoped>
.icon {
  width: 16px;
  height: 16px;
  @apply mx-2;
  background-size: cover;
  justify-self: center;
}

.buttons {
  @apply h-full ms-auto flex;
}

.button {
  width: 46.6px;
  font-size: 14px;
  cursor: default;
  @apply h-full flex items-center justify-center;
}

.button:hover {
  background: #858585;
}

.button:active {
  background: #5f5f5f;
}

.close:hover {
  background: #e81123;
}

.close:active {
  background: #8b0a14;
}

.obaWindowStyle {
  @apply transition-shadow duration-75;
  @apply border border-base-content/50;
  @apply shadow-sm;
  @apply rounded-md overflow-clip;
  @apply grid;
  @apply box-content;
  @apply !bg-base-200/75;
  @apply text-current;
  @apply backdrop-blur;

  grid-template-rows: 30px 1fr;
  font-size: 12px;
  font: inherit;

  .toolbar {
    @apply !bg-transparent;
    @apply flex items-center select-none;
    padding-left: 4px;
    font-family: Arial, Helvetica, sans-serif !important;
    font-size: 12px;

    @apply text-current;
  }

  > .window-content {
    overflow: hidden;
  }
}

.obaWindowStyle.active {
  @apply backdrop-blur-lg;
  @apply border border-neutral/50;
  @apply !bg-base-200/90;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.2), 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>
