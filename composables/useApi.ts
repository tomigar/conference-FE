/* eslint-disable @typescript-eslint/no-explicit-any */
// composables/useApi.ts
import { useState } from '#app'

interface ApiOptions {
  baseUrl?: string
  headers?: HeadersInit
  onError?: (error: Error | any) => void
}

interface RequestOptions {
  method?: string
  headers?: HeadersInit
  params?: Record<string, string>
  body?: any
  cache?: RequestCache
  credentials?: RequestCredentials
  mode?: RequestMode
  redirect?: RequestRedirect
}

interface ApiResponse<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  execute: () => Promise<void>
}

export function useApi(options: ApiOptions = {}) {
  const {
    baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:8000/api',
    headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    onError = console.error
  } = options

  const getAuthToken = () => {
    // Replace with your auth token logic if needed
    return useState('auth-token').value
  }

  const request = async <T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> => {
    const {
      method = 'GET',
      headers: customHeaders = {},
      params = {},
      body,
      ...fetchOptions
    } = options

    // Build URL with query parameters
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`)
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })

    // Merge default and custom headers
    const requestHeaders: HeadersInit = { ...headers, ...customHeaders }
    
    // Add auth token if available
    const token = getAuthToken()
    if (token) {
      (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      ...fetchOptions
    }

    // Add body if present
    if (body !== undefined) {
      requestOptions.body = typeof body === 'object' ? JSON.stringify(body) : body
    }

    // Execute the request
    const response = await fetch(url.toString(), requestOptions)

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const error = new Error(
        errorData?.message || `Request failed with status ${response.status}`
      )
      Object.assign(error, { status: response.status, data: errorData })
      throw error
    }

    // Return the data
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return await response.json()
    } else {
      return await response.text() as unknown as T
    }
  }

  const useRequest = function <T>(
    endpoint: string,
    options: RequestOptions = {},
    immediate = true
  ): ApiResponse<T> {
    const data: Ref<T | null> = ref(null)
    const error = ref<Error | null>(null)
    const loading = ref(false)

    const execute = async () => {
      loading.value = true
      error.value = null

      try {
        data.value = await request<T>(endpoint, options)
      } catch (err) {
        error.value = err as Error
        onError(err)
      } finally {
        loading.value = false
      }
    }

    if (immediate) {
      execute()
    }

    return {
      data,
      error,
      loading,
      execute
    }
  }

  return {
    get: <T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) => 
      request<T>(endpoint, { ...options, method: 'GET' }),
    
    post: <T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method'> = {}) => 
      request<T>(endpoint, { ...options, method: 'POST', body }),
    
    put: <T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method'> = {}) => 
      request<T>(endpoint, { ...options, method: 'PUT', body }),
    
    patch: <T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method'> = {}) => 
      request<T>(endpoint, { ...options, method: 'PATCH', body }),
    
    delete: <T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}) => 
      request<T>(endpoint, { ...options, method: 'DELETE' }),
    
    useRequest,
    
    // Advanced helper for reactive data fetching
    useData: <T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}, immediate = true) => 
      useRequest<T>(endpoint, { ...options, method: 'GET' }, immediate)
  }
}