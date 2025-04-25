<template>
    <div>
      <div class="toolbar">
        <button @click="editor.chain().focus().toggleBold().run()">B</button>
        <button @click="editor.chain().focus().toggleItalic().run()">I</button>
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">H1</button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
        <input type="color" @input="setColor($event.target.value)" title="Farba textu" />
        <button @click="addImage">URL obrázok</button>
        <input type="file" @change="uploadImage" accept="image/*" />
      </div>
      <editor-content :editor="editor" class="editor" />
    </div>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount, ref } from 'vue'
  import { Editor, EditorContent } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import Image from '@tiptap/extension-image'
  import TextStyle from '@tiptap/extension-text-style'
  import Color from '@tiptap/extension-color'
  
  const props = defineProps({
    modelValue: String
  })
  const emit = defineEmits(['update:modelValue'])
  
  const editor = ref(null)
  
  const setColor = (color) => {
    editor.value.chain().focus().setColor(color).run()
  }
  
  const addImage = () => {
    const url = prompt('Zadajte URL obrázka:')
    if (url) {
      editor.value.chain().focus().setImage({ src: url }).run()
    }
  }
  
  const uploadImage = async (event) => {
    const file = event.target.files[0]
    if (!file) return
  
    const formData = new FormData()
    formData.append('image', file)
  
    try {
      const response = await fetch('http://localhost:8000/api/uploads/image', {
        method: 'POST',
        body: formData,
      })
  
      const data = await response.json()
      if (data.url) {
        editor.value.chain().focus().setImage({ src: data.url }).run()
      } else {
        alert('Nepodarilo sa nahrať obrázok.')
      }
    } catch (e) {
      console.error(e)
      alert('Chyba pri nahrávaní obrázka.')
    }
  }
  
  onMounted(() => {
    editor.value = new Editor({
      extensions: [
        StarterKit,
        Image,
        TextStyle,
        Color,
      ],
      content: props.modelValue,
      onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
      },
    })
  })
  
  onBeforeUnmount(() => {
    if (editor.value) {
      editor.value.destroy()
    }
  })
  </script>
  
  <style scoped>
  .toolbar {
    margin-bottom: 1rem;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .toolbar button {
    padding: 0.3rem 0.6rem;
    background: #edf2f7;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    cursor: pointer;
  }
  .editor {
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    padding: 1rem;
    min-height: 300px;
    background: #fff;
  }
  </style>
  