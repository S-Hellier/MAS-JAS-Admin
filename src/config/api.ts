// API Configuration
// In Vite, environment variables must be prefixed with VITE_
// Base URL should NOT include /admin - login endpoint is public
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1'
// Remove /admin if it was accidentally included
export const API_BASE_URL = BASE_URL.replace(/\/admin$/, '')
export const ADMIN_API_BASE_URL = `${API_BASE_URL}/admin`
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

export interface DailyBreakdown {
  date: string
  dateFormatted: string
  recipesGenerated: number
  activeUsers: number
  cumulativeRecipes: number
  cumulativeUsers: number
}

export interface DailyMetricsSummary {
  totalRecipes: number
  totalActiveUsers: number
  averageRecipesPerDay: number
  averageActiveUsersPerDay: number
  recipesGrowthPercent: number
}

export interface DailyMetrics {
  dailyBreakdown: DailyBreakdown[]
  summary: DailyMetricsSummary
  dateRange: {
    startDate: string
    endDate: string
  }
  timestamp: string
}

export interface User {
  id: string
  email: string
  [key: string]: any
}

export interface AdminVerification {
  is_admin: boolean
  user?: {
    id: string
    email: string
    is_admin: boolean
    [key: string]: any
  }
}

/**
 * Login user via backend API
 * Response structure: { user: { id, email, ... } }
 */
export async function loginUser(email: string): Promise<User> {
  const url = `${API_BASE_URL}/auth/login`
  
  // Debug: Log the actual URL being used
  console.log('Login URL being called:', url)
  console.log('API_BASE_URL value:', API_BASE_URL)
  console.log('Full constructed URL:', url)
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorData
    try {
      errorData = JSON.parse(errorText)
    } catch {
      errorData = { error: errorText || 'Login failed' }
    }
    
    const errorMessage = errorData.error || errorData.message || errorText
    
    // Check if this is the authentication error (backend still protecting login endpoint)
    if (errorMessage.includes('Authentication required') || 
        errorMessage.includes('x-admin-api-key') || 
        errorMessage.includes('x-user-id')) {
      console.error('Login endpoint authentication error:', {
        url,
        status: response.status,
        error: errorMessage,
      })
      throw new Error(
        `Backend Configuration Issue: The login endpoint at ${url} is still protected.\n\n` +
        `Expected: Public endpoint (no authentication required)\n` +
        `Actual: Endpoint requires authentication\n\n` +
        `Please verify in your backend:\n` +
        `1. The route '/api/v1/auth/login' is registered BEFORE any admin middleware\n` +
        `2. The route is NOT under '/api/v1/admin/*' paths\n` +
        `3. Test with: curl -X POST ${url} -H "Content-Type: application/json" -d '{"email":"test@example.com"}'`
      )
    }
    
    throw new Error(errorMessage || `Login failed: ${response.statusText}`)
  }

  const data = await response.json()
  
  // Response structure: { user: {...}, message?: "Login successful" }
  if (!data.user || !data.user.id) {
    console.error('Invalid login response structure:', data)
    throw new Error('Invalid response from login endpoint: user data missing')
  }
  
  return data.user
}

/**
 * Verify user is admin
 * Endpoint: GET /api/v1/admin/auth/verify
 * Headers: x-user-id (required) - NO admin authentication required (public endpoint)
 * Response: { success: true, data: { is_admin: boolean, user?: {...} } }
 */
export async function verifyAdminStatus(userId: string): Promise<boolean> {
  if (!userId) {
    console.error('verifyAdminStatus: userId is required')
    return false
  }

  try {
    const response = await fetch(`${ADMIN_API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // If 401/403, user is not authenticated or not admin
      if (response.status === 401 || response.status === 403) {
        const errorText = await response.text().catch(() => '')
        console.error('Admin verification failed:', response.status, errorText)
        return false
      }
      
      // For other errors, throw
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`Failed to verify admin status: ${response.status} - ${errorText}`)
    }

    const data: ApiResponse<AdminVerification> = await response.json()
    
    // Response structure: { success: true, data: { is_admin: boolean, user?: {...} } }
    if (!data.success || !data.data) {
      return false
    }
    
    // Check is_admin field (can be in data.is_admin or data.user.is_admin)
    return data.data.is_admin === true || data.data.user?.is_admin === true
  } catch (err) {
    console.error('verifyAdminStatus exception:', err)
    // Re-throw to allow caller to handle
    throw err
  }
}

/**
 * Fetch metrics from the admin API
 * Uses user-based authentication if userId is provided, otherwise falls back to API key
 */
export async function fetchMetrics(userId?: string): Promise<BackendMetrics> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Use user-based auth if userId is provided, otherwise use API key
  if (userId) {
    headers['x-user-id'] = userId
  } else {
    headers['x-admin-api-key'] = ADMIN_API_KEY
  }

  const response = await fetch(`${ADMIN_API_BASE_URL}/metrics`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - Invalid credentials')
    }
    if (response.status === 403) {
      // User lost admin privileges - this will be handled by the caller
      throw new Error('FORBIDDEN_ADMIN_ACCESS')
    }
    throw new Error(`Failed to fetch metrics: ${response.statusText}`)
  }

  const data: ApiResponse<BackendMetrics> = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch metrics')
  }

  return data.data
}

/**
 * Fetch daily growth metrics from the admin API
 * Uses user-based authentication if userId is provided, otherwise falls back to API key
 */
export async function fetchDailyMetrics(userId?: string): Promise<DailyMetrics> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Use user-based auth if userId is provided, otherwise use API key
  if (userId) {
    headers['x-user-id'] = userId
  } else {
    headers['x-admin-api-key'] = ADMIN_API_KEY
  }

  const response = await fetch(`${ADMIN_API_BASE_URL}/metrics/daily`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - Invalid credentials')
    }
    if (response.status === 403) {
      throw new Error('Forbidden - Admin access required')
    }
    throw new Error(`Failed to fetch daily metrics: ${response.statusText}`)
  }

  const data: ApiResponse<DailyMetrics> = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Failed to fetch daily metrics')
  }

  return data.data
}
