/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from '~~/types/User'
import { useApi } from './useApi' // Adjust path if needed

export function useApiCalls() {
  const api = useApi()
  const auth = {
    login: async (credentials: { email: string, password: string }) => {
      return await api.post<{ token: string, user: User }>('/login', credentials)
    },
    
    register: async (userData: User) => {
      return await api.post('/auth/register', userData)
    },
    
    logout: async () => {
      return await api.post('/auth/logout', {})
    },
    
    getCurrentUser: async () => {
      return await api.get<any>('/auth/user')
    },
    
    // Reactive version
    useCurrentUser: (immediate = true) => {
      return api.useData('/auth/user', {}, immediate)
    }
  }
  return {
    auth,
  }
}