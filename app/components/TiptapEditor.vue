<template>
  <div>
    <div v-if="editor">
      <UButton
        icon="i-lucide-bold"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      />
      <UButton
        icon="i-lucide-italic"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      />
      <UButton
        icon="i-lucide-code"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
        @click="editor.chain().focus().toggleCode().run()"
      />
      <UButton icon="i-lucide-bold" @click="editor.chain().focus().unsetAllMarks().run()">
        clear marks
      </UButton>
      <UButton icon="i-lucide-bold" @click="editor.chain().focus().clearNodes().run()">
        clear nodes
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('paragraph') }"
        @click="editor.chain().focus().setParagraph().run()"
      >
        paragraph
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        h1
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        h2
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        h3
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
      >
        h4
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
      >
        h5
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
      >
        h6
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        bullet list
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        ordered list
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        code block
      </UButton>
      <UButton
icon="i-lucide-bold"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        blockquote
      </UButton>
      <UButton icon="i-lucide-bold" @click="editor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </UButton>
      <UButton icon="i-lucide-bold" @click="editor.chain().focus().setHardBreak().run()">
        hard break
      </UButton>
      <UButton
icon="i-lucide-bold"
        :disabled="!editor.can().chain().focus().undo().run()"
        @click="editor.chain().focus().undo().run()"
      >
        undo
      </UButton>
      <UButton
icon="i-lucide-bold"
        :disabled="!editor.can().chain().focus().redo().run()"
        @click="editor.chain().focus().redo().run()"
      >
        redo
      </UButton>
    </div>
    <input type="file" accept="image/*" @change="uploadImage" class="my-2" />
    <TiptapEditorContent :editor="editor" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, unref } from 'vue'
import TiptapStarterKit from '@tiptap/starter-kit'
import TiptapCodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import { common } from 'lowlight'

import { useEditor, EditorContent as TiptapEditorContent } from '@tiptap/vue-3'
import Image from '@tiptap/extension-image' 


const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const lowlight = createLowlight(common);

const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  extensions: [
    TiptapStarterKit.configure({
      codeBlock: false,
    }),
    TiptapCodeBlockLowlight.configure({ lowlight }),
     Image,
  ],
  editorProps: {
    attributes: {
      class:
        'border border-gray-400 p-4 min-h-[12rem] max-h-[12rem] overflow-y-auto outline-none prose max-w-none',
    },
  },
})

const uploadImage = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('http://localhost:8000/api/files', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    const imageUrl = data.url || data.path

    editor.value.chain().focus().setImage({ src: imageUrl }).run()
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

// Watch for changes in modelValue and update editor content if needed
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && newValue !== editor.value.getHTML()) {
      editor.value.commands.setContent(newValue, false)
    }
  }
)

onBeforeUnmount(() => {
  unref(editor)?.destroy();
});
</script>

<style scoped>
.is-active {
  background-color: #008437;
  border-radius: 0.25rem;
}


button:hover:not(:disabled) {
  background-color: #008437;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}


</style>