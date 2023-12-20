<script setup lang="ts">
import { WindowEdit } from '#components'
import '~/assets/theme/windows11-full-rounded.css'

const {
  interacting,
} = useGlobalWindowManager()

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
      <WindowEdit ref="editWindow" v-model:content="workspace.env.value" default-language="ini" />
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
