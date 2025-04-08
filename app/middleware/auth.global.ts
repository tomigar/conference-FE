export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware on server-side to avoid SSR issues
  if (import.meta.server) return
  const token = sessionStorage.getItem('user')
  console.log('Token:', token)
  
  if (to.path.startsWith('/dashboard')) {

    if (!token) {
      return navigateTo('/auth/login')
    }
  }

  if (to.path.startsWith('/auth/login')) {

    if (token) {
      return navigateTo('/dashboard')
    }
  }
  
  // For non-dashboard routes, do nothing
})