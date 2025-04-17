/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from '~~/types/User'
import type { Conference } from '~~/types/Conference'
import { useApi } from './useApi'

export function useApiCalls() {
  const api = useApi()

  const auth = {
    login: async (credentials: { email: string, password: string }) => {
      return await api.post<{ data: User }>('/login', credentials)
    },
    register: async (userData: User) => {
      return await api.post('/register', userData)
    },
    logout: async () => {
      return await api.post('/logout', {})
    },
    getCurrentUser: async () => {
      return await api.get<User>('/user')
    },
    useCurrentUser: (immediate = true) => {
      return api.useData<User>('/user', {}, immediate)
    }
  }

  const conferences = {
    list: async () => api.get<{ data: Conference[] }>('/conferences'),
    get: async (id: number) => api.get<{ data: Conference }>(`/conferences/${id}`),
    create: async (data: Conference) => api.post('/conferences', data),
    update: async (id: number, data: Conference) => api.put(`/conferences/${id}`, data),
    delete: async (id: number) => api.delete(`/conferences/${id}`)
  }

  const pages = {
    list: async (conferenceId: number) => api.get(`/conferences/${conferenceId}/pages`),
    get: async (conferenceId: number, pageId: number) => api.get(`/conferences/${conferenceId}/pages/${pageId}`),
    create: async (conferenceId: number, data: any) => api.post(`/conferences/${conferenceId}/pages`, data),
    update: async (conferenceId: number, pageId: number, data: any) => api.put(`/conferences/${conferenceId}/pages/${pageId}`, data),
    delete: async (conferenceId: number, pageId: number) => api.delete(`/conferences/${conferenceId}/pages/${pageId}`)
  }

  const editors = {
    getAssigned: async (conferenceId: number) => api.get(`/conferences/${conferenceId}/editors`),
    getAvailable: async (conferenceId: number) => api.get(`/conferences/${conferenceId}/available-editors`),
    assign: async (conferenceId: number, editorId: number) => api.post(`/conferences/${conferenceId}/editors`, { editor_id: editorId }),
    remove: async (conferenceId: number, editorId: number) => api.delete(`/conferences/${conferenceId}/editors/${editorId}`)
  }

  const files = {
    upload: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return await api.post('/upload', formData)
    },
    get: async (id: number) => api.get(`/files/${id}`)
  }

  const users = {
    list: async () => api.get('/users'),
    get: async (id: number) => api.get(`/users/${id}`),
    create: async (data: User) => api.post('/users', data),
    update: async (id: number, data: User) => api.put(`/users/${id}`, data),
    delete: async (id: number) => api.delete(`/users/${id}`)
  }

  return {
    auth,
    conferences,
    pages,
    editors,
    files,
    users
  }
}
