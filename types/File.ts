type File = {
  id: number
  name: string
  url: string
  mime_type: string
}

const files = ref<File[]>([])
