<script setup lang="ts">
import type * as Monaco from 'monaco-editor'

const props = defineProps<{
  content: string | null
  defaultLanguage: string
}>()

const emits = defineEmits<(e: 'update:content', v: string | null) => void>()

const content = computed({
  get() {
    return props.content
  },

  set(val) {
    emits('update:content', val)
  },
})

const MONACO_EDITOR_OPTIONS: Monaco.editor.IStandaloneDiffEditorConstructionOptions = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  minimap: {
    enabled: false,
  },
}

const editorRef = shallowRef<typeof Monaco>()
const handleMount = (editor: typeof Monaco) => (editorRef.value = editor)
</script>

<template>
  <vue-monaco-editor
    v-model:value="content"
    theme="vs-dark"
    :options="MONACO_EDITOR_OPTIONS"
    :default-language="defaultLanguage"
    @mount="handleMount"
  />
</template>
