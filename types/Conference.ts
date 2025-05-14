type Conference = {
    id?: number
    year: number
    name: string
    description: string
    location: string
    start_date: string
    end_date: string
    is_active: boolean | number
    created_at?: string
    updated_at?: string
  }
  
  export type { Conference }
  