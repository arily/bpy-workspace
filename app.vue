<script setup lang="ts">
import { WindowEdit } from '#components'

const {
  interacting,
} = useGlobalWindowManager()

const { env } = useWorkspace()

const editWindow = ref<InstanceType<typeof WindowEdit>>()
</script>

<template>
  <div
    class="relative overflow-clip max-w-[100dvw] max-h-[100dvh] w-[100dvw] h-[100dvh] bg-secondary"
    :class="{
      interacting,
    }"
  >
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
