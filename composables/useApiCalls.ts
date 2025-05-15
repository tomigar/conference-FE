 
import type { User } from '~~/types/User'
import type { Conference } from '~~/types/Conference'
import type { Page } from '~~/types/Page'
import { useApi } from './useApi'

export function useApiCalls() {
  const api = useApi()

  const auth = {
    login: async (credentials: { email: string, password: string }) =>
      await api.post<{ data: User }>('/login', credentials),

    register: async (userData: User) =>
      await api.post('/register', userData),

    logout: async () => await api.post('/logout', {}),

    getCurrentUser: async () => await api.get<User>('/user'),

    useCurrentUser: (immediate = true) =>
      api.useData<User>('/user', {}, immediate)
  }

  const conferences = {
    list: async () => api.get<{ data: Conference[] }>('/conferences'),
    get: async (id: number) => api.get<{ data: Conference }>(`/conferences/${id}`),
    create: async (data: Conference) => api.post('/conferences', data),
    update: async (id: number, data: Conference) => api.put(`/conferences/${id}`, data),
    delete: async (id: number) => api.delete(`/conferences/${id}`)
  }

  const pages = {
    list: async (conferenceId: number) =>
      api.get<{ data: Page[] }>(`/conferences/${conferenceId}/pages`),

    get: async (conferenceId: number, pageId: number) =>
      api.get<{ data: Page }>(`/conferences/${conferenceId}/pages/${pageId}`),

    create: async (conferenceId: number, data: { title: string; content?: string, slug?: string }) =>
      api.post<{ data: Page }>(`/conferences/${conferenceId}/pages`, data),

    update: async (conferenceId: number, pageId: number, data: { title: string; content?: string, slug?: string }) =>
      api.put<{ data: Page }>(`/conferences/${conferenceId}/pages/${pageId}`, data),

    delete: async (conferenceId: number, pageId: number) =>
      api.delete<{ data: null }>(`/conferences/${conferenceId}/pages/${pageId}`)
  }
  

  

  const users = {
    list: async () => api.get('/users'),
    get: async (id: number) => api.get(`/users/${id}`),
    create: async (data: User) => api.post('/users', data),
    update: async (id: number | string, data: User) => api.put(`/users/${id}`, data),
    delete: async (id: number) => api.delete(`/users/${id}`)
  }

  const editors = {
    list: async (conferenceId: number) => api.get(`/conferences/${conferenceId}/editors`),
    available: async (conferenceId: number) =>
      api.get(`/conferences/${conferenceId}/available-editors`),
    assign: async (conferenceId: number, userId: number) =>
      api.post(`/conferences/${conferenceId}/editors`, { editor_id: userId }),
    unassign: async (conferenceId: number, userId: number) =>
      api.delete(`/conferences/${conferenceId}/editors/${userId}`)
  }

  return {
    auth,
    conferences,
    pages,
    users,
    editors
  }
}
