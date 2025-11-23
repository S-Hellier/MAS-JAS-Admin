// API Configuration
// In Vite, environment variables must be prefixed with VITE_
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1/admin'
export const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || 'e10fc184265409b7d72607f511d2421c5beefdb6a06b5699be33eaccf8c3e222'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface BackendMetrics {
  totalUsers: number
  totalPantryItems: number
  totalRecipes: number
  averageGenerationTimeMs: number
  average_weekly_recipes_per_user: number
  timestamp: string
}

/**
 * Fetch metrics from the admin API
 */
export async function fetchMetrics(): Promise<BackendMetrics> {
  const response = await fetch(`${API_BASE_URL}/metrics`, {
    method: 'GET',
    headers: {
      'x-admin-api-key': ADMIN_API_KEY,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - Invalid admin API key')
    }
    throw new Error(`Failed to fetch metrics: ${response.statusText}`)
  }

  const data: ApiResponse<BackendMetrics> = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch metrics')
  }

  return data.data
}

