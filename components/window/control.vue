<script lang="ts" setup>
import { Database, Preset } from '~/types'

const {
  createWindow,
  windowEventEnd,
  windowEventStart,
  moveWindowToTop,
  windowLayer,
  activeWindowId,
} = useGlobalWindowManager()

const {
  prepare,
  runApp,
  bootConfig,
  validated,
} = useWorkspace()

const control = createWindow({
  id: Symbol('control'),
  title: 'Control',
  titleIconURL: 'https://cdn-icons-png.flaticon.com/512/337/337948.png',
  active: true,
  dragging: false,
  top: 100,
  left: 100,
  width: 860,
  height: 307,
  minWidth: 700,
  minHeight: 300,
})
</script>

<template>
  <VueWindowManager
    v-model:is-active="control.active"
    v-model:top="control.top"
    v-model:left="control.left"
    v-model:width="control.width"
    v-model:height="control.height"
    v-model:min-width="control.minWidth"
    v-model:min-height="control.minHeight"
    v-model:is-dragging="control.dragging"
    v-model:window-id="control.id"
    v-model:title="control.title"
    v-model:title-icon="control.titleIconURL"
    class="!absolute"
    :class="{
      active: activeWindowId === control.id,
    }"
    :style="{
      'z-index': 1 + windowLayer.indexOf(control.id),
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
    @click-destroy="control.active = false"
  >
    <div class="flex flex-col h-full gap-2 p-2">
      <select id="preset" v-model="bootConfig.preset" class="select" name="preset">
        <option :value="Preset.Unset" disabled>
          Select preset
        </option>

        <option :value="Preset.Dev">
          Develop
        </option>
        <option :value="Preset.Prod">
          Production
        </option>
      </select>
      <div class="join">
        <select id="database" v-model="bootConfig.db.type" class="select join-item" name="database">
          <option :value="Database.Unset" disabled>
            Select Database
          </option>

          <option :value="Database.SQLite">
            SQLite
          </option>
          <option :value="Database.MySQL">
            MySQL
          </option>
          <option :value="Database.DSN">
            DSN
          </option>
        </select>
        <template v-if="bootConfig.db.type === Database.SQLite">
          <input v-model="bootConfig.db.file" type="text" class="join-item input grow" placeholder=".db path or 'memory'">
        </template>
        <template v-else-if="bootConfig.db.type === Database.DSN">
          <input v-model="bootConfig.db.dsn" type="text" class="join-item input grow" placeholder="DSN">
        </template>
      </div>
      <div
        v-if="validated"
        class="join"
      >
        <button
          class="join-item btn" @click="prepare"
        >
          prepare
        </button>
        <button
          class="join-item btn" @click="runApp"
        >
          run
        </button>
      </div>
    </div>
  </VueWindowManager>
</template>

<style scoped lang="postcss">
button,label,span {
  @apply select-none
}
</style>
