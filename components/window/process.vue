<script lang="ts" setup>
import { ProcessStatus } from '../../types'

const {
  activeWindowId,
  windowEventEnd,
  windowEventStart,
  windowLayer,
  moveWindowToTop,
  createWindow,
} = useGlobalWindowManager()
const window = createWindow({
  title: 'Processes',
  active: true,
})
const { list, switch: switchProcess, killTask, reload } = useProcessSwitch()
const { id } = useWorkspace()
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
    @drag-start="windowEventStart"
    @resize-start="windowEventStart"
    @drag-end="windowEventEnd"
    @resize-end="windowEventEnd"
    @click-window="moveWindowToTop"
    @click-destroy="window.active = false"
  >
    <div class="flex flex-col h-full">
      <div class="overflow-auto shrink">
        <div
          v-for="(v, key) in list"
          :key="key"
          class="collapse collapse-arrow bg-base-200"
        >
          <input type="radio" name="my-accordion-2" :checked="v.id === id" @click="switchProcess(v.id)">
          <div class="text-xl font-medium collapse-title">
            Process {{ key }}
            <template v-if="v.status === ProcessStatus.Exited">
              {{ ProcessStatus[v.status] }} ({{ v.exitCode }})
            </template>
            <template v-else>
              {{ ProcessStatus[v.status] }}
            </template>
          </div>
          <div class="collapse-content">
            <div class="join">
              <button class="join-item btn btn-warning" @click="killTask(v.id)">
                Kill
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="self-end mt-auto">
        <button class="btn" @click="reload()">
          (WIP) refresh
        </button>
      </div>
    </div>
  </VueWindowManager>
</template>

<style scoped></style>
