<script lang="ts" setup>
import JsonEditorVue from 'json-editor-vue'

const data = defineModel<Record<string, any>>('modelValue')
</script>

<template>
  <JsonEditorVue v-model="data" />
</template>
