<script lang="ts" setup>
import { Database, Preset } from '~/types'

const {
  createWindow,
  windowEventEnd,
  windowEventStart,
  moveWindowToTop,
  windowLayer,
  manageWindow,
  activeWindowId,
} = useGlobalWindowManager()

const { list, activeId } = useProcessSwitch()
const { bootConfig, validated, env } = useWorkspace()
const window = createWindow({
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
manageWindow(window)
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
    :max-height="500"
    @drag-start="windowEventStart"
    @resize-start="windowEventStart"
    @drag-end="windowEventEnd"
    @resize-end="windowEventEnd"
    @click-window="moveWindowToTop"
    @click-destroy="window.active = false"
  >
    <div class="flex flex-col h-full gap-2 p-2">
      <input v-model="bootConfig.python.bin" type="text" class="input input-bordered" placeholder="python executable location">
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
        <!-- <option :value="Preset.Custom">
          Custom Config
        </option> -->
      </select>
      <div class="flex flex-wrap join">
        <select id="database" v-model="bootConfig.db.type" class="select input-bordered join-item" name="database">
          <option :value="Database.Unset" disabled>
            No Database config
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

        <!-- <template v-if="bootConfig.db.type === Database.SQLite">
          <input v-model="bootConfig.db.file" type="text" class="join-item input input-bordered grow" placeholder=".db path or 'memory'">
        </template> -->

        <template v-if="bootConfig.db.type === Database.DSN">
          <input v-model="bootConfig.db.dsn" type="text" class="join-item input-bordered input grow" placeholder="DSN">
        </template>

        <template v-else-if="bootConfig.db.type === Database.MySQL">
          <label class="label input join-item input-bordered">
            <span class="label-text">mysql://</span>
          </label>
          <input v-model="bootConfig.db.user" type="text" class="join-item input-bordered input grow" placeholder="user">
          <label class="label input join-item input-bordered">
            <span class="label-text">:</span>
          </label>
          <input v-model="bootConfig.db.password" type="text" class="join-item input-bordered input grow" placeholder="password">
          <label class="label input join-item input-bordered">
            <span class="label-text">@</span>
          </label>
          <input v-model="bootConfig.db.address" type="text" class="join-item input-bordered input grow" placeholder="host">
          <label class="label input join-item input-bordered">
            <span class="label-text">:</span>
          </label>
          <input v-model="bootConfig.db.port" type="text" class="join-item input-bordered input grow" placeholder="port">
          <label class="label input join-item input-bordered">
            <span class="label-text">/</span>
          </label>
          <input v-model="bootConfig.db.database" type="text" class="join-item input-bordered input grow" placeholder="database">
        </template>
      </div>
      <div
        class="flex gap-4"
      >
        <div class="join">
          <button
            class="join-item btn btn-warning" @click="workspace.reset({ id: activeId })"
          >
            Reset
          </button>
          <button
            v-if="env"
            class="join-item btn btn-secondary" @click="workspace.readEnvFromFile"
          >
            Parse .env files to env Object
          </button>
        </div>
        <div
          v-if="validated"
          class="join"
        >
          <button
            v-if="list && workspace.id?.value && (workspace.id.value in list)"
            class="join-item btn btn-success"
          >
            Save
          </button>
        </div>

        <div class="flex gap-4 ms-auto">
          <button
            v-if="validated"
            class="btn btn-warning" @click="workspace.runApp"
          >
            Run new instance
          </button>
        </div>
      </div>
    </div>
  </VueWindowManager>
</template>

<style scoped lang="postcss">
button,label,span {
  @apply select-none
}
</style>
