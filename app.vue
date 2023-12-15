<script setup lang="ts">
import { WindowEdit } from '#components'
import '~/assets/theme/windows11-full-rounded.css'

const {
  interacting,
} = useGlobalWindowManager()

const { env } = useWorkspace()

const editWindow = ref<InstanceType<typeof WindowEdit>>()
</script>

<template>
  <div class="flex flex-col overflow-clip max-w-[100dvw] max-h-[100dvh] w-[100dvw] h-[100dvh] bg-base-300">
    <div
      class="relative grow"
      :class="{
        interacting,
      }"
    >
      <div class="dropdown mb-72">
        <div tabindex="0" role="button" class="m-1 btn">
          Theme
          <svg width="12px" height="12px" class="inline-block w-2 h-2 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" /></svg>
        </div>
        <ul tabindex="0" class="p-2 shadow-2xl dropdown-content bg-base-300 rounded-box w-52">
          <li><input type="radio" name="theme-dropdown" class="justify-start theme-controller btn btn-sm btn-block btn-ghost" aria-label="Default" value="default"></li>
          <li><input type="radio" name="theme-dropdown" class="justify-start theme-controller btn btn-sm btn-block btn-ghost" aria-label="Retro" value="retro"></li>
          <li><input type="radio" name="theme-dropdown" class="justify-start theme-controller btn btn-sm btn-block btn-ghost" aria-label="Cyberpunk" value="cyberpunk"></li>
          <li><input type="radio" name="theme-dropdown" class="justify-start theme-controller btn btn-sm btn-block btn-ghost" aria-label="Valentine" value="valentine"></li>
          <li><input type="radio" name="theme-dropdown" class="justify-start theme-controller btn btn-sm btn-block btn-ghost" aria-label="Aqua" value="aqua"></li>
        </ul>
      </div>

      <WindowEdit ref="editWindow" v-model:content="env" default-language="ini" />
      <window-control :edit="editWindow" />
      <window-data />
      <window-errors />
      <window-process />
      <window-logs />

      <dev-only>
        <window-debug />
      </dev-only>
    </div>
    <dock class="" />
  </div>
</template>

<style lang="postcss">
.interacting {
  .obaWindowStyle {
    .window-content {
      @apply pointer-events-none
    }
  }
}
</style>
