import { useApi } from "~~/composables/useApi"

export default defineNuxtPlugin(() => {
    const api = useApi({
      baseUrl: 'http://127.0.0.1/api',
      // Optional global error handler
      onError: (error) => {
        console.error('API Error', error)
        // You could add toast notifications or other error handling here
      }
    })
    
    return {
      provide: {
        api
      }
    }
  })