import { useState, useEffect, useRef } from 'react'
import { fetchMetrics, fetchDailyMetrics, BackendMetrics, DailyMetrics } from '../config/api'
import { useAuth } from './useAuth'

interface Metrics {
  activeUsers: number
  recipesGenerated: number
  avgRecipeTime: number
  pantryItemsAdded: number
  averageWeeklyRecipesPerUser: number
}

interface ChartData {
  recipesOverTime: Array<{ date: string; recipes: number }>
  usersOverTime: Array<{ date: string; users: number }>
  recipeTimeDistribution: Array<{ period: string; avgTime: number }>
  pantryItemsOverTime: Array<{ date: string; items: number }>
}

interface UseMetricsReturn {
  metrics: Metrics | null
  chartData: ChartData
  isLoading: boolean
  error: string | null
}

/**
 * Convert backend metrics to dashboard format
 */
const mapBackendMetricsToDashboard = (backendMetrics: BackendMetrics): Metrics => {
  // Handle average_weekly_recipes_per_user - may be undefined/null if no data exists
  const avgWeeklyRecipes = backendMetrics.average_weekly_recipes_per_user;
  const averageWeeklyRecipesPerUser = (avgWeeklyRecipes !== null && avgWeeklyRecipes !== undefined && !isNaN(avgWeeklyRecipes))
    ? Math.round(avgWeeklyRecipes * 10) / 10
    : 0; // Default to 0 if not available

  return {
    activeUsers: backendMetrics.totalUsers,
    recipesGenerated: backendMetrics.totalRecipes,
    avgRecipeTime: Math.round((backendMetrics.averageGenerationTimeMs / 1000) * 10) / 10, // Convert ms to seconds, round to 1 decimal
    pantryItemsAdded: backendMetrics.totalPantryItems,
    averageWeeklyRecipesPerUser,
  }
}

/**
 * Convert daily metrics to chart data format
 */
const mapDailyMetricsToChartData = (dailyMetrics: DailyMetrics): ChartData => {
  return {
    recipesOverTime: dailyMetrics.dailyBreakdown.map((day) => ({
      date: day.dateFormatted,
      recipes: day.recipesGenerated,
    })),
    usersOverTime: dailyMetrics.dailyBreakdown.map((day) => ({
      date: day.dateFormatted,
      users: day.activeUsers,
    })),
    // Recipe time distribution and pantry items not available in daily endpoint
    // Keeping as empty arrays - these charts can be removed or updated when backend provides this data
    recipeTimeDistribution: [],
    pantryItemsOverTime: [],
  }
}

/**
 * Generate fallback chart data if daily metrics fail
 */
const generateFallbackChartData = (): ChartData => {
  return {
    recipesOverTime: [],
    usersOverTime: [],
    recipeTimeDistribution: [],
    pantryItemsOverTime: [],
  }
}

/**
 * Compare two metrics objects to see if they're different
 */
const metricsChanged = (oldMetrics: Metrics | null, newMetrics: Metrics): boolean => {
  if (!oldMetrics) return true
  
  return (
    oldMetrics.activeUsers !== newMetrics.activeUsers ||
    oldMetrics.recipesGenerated !== newMetrics.recipesGenerated ||
    oldMetrics.avgRecipeTime !== newMetrics.avgRecipeTime ||
    oldMetrics.pantryItemsAdded !== newMetrics.pantryItemsAdded ||
    oldMetrics.averageWeeklyRecipesPerUser !== newMetrics.averageWeeklyRecipesPerUser
  )
}

/**
 * Compare two chart data arrays to see if they're different
 */
const chartDataChanged = (
  oldData: Array<{ date: string; recipes?: number; users?: number }>,
  newData: Array<{ date: string; recipes?: number; users?: number }>
): boolean => {
  if (oldData.length !== newData.length) return true
  
  return oldData.some((oldItem, index) => {
    const newItem = newData[index]
    return (
      oldItem.date !== newItem.date ||
      oldItem.recipes !== newItem.recipes ||
      oldItem.users !== newItem.users
    )
  })
}

export const useMetrics = (): UseMetricsReturn => {
  const { user, signOut } = useAuth()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [chartData, setChartData] = useState<ChartData>(generateFallbackChartData())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Use refs to track current values for comparison without causing re-renders
  const metricsRef = useRef<Metrics | null>(null)
  const chartDataRef = useRef<ChartData>(generateFallbackChartData())
  const isInitialLoadRef = useRef(true)

  useEffect(() => {
    // Don't fetch if user is not logged in
    if (!user) {
      return
    }

    const loadMetrics = async () => {
      // Don't show loading state on refresh - only on initial load
      if (isInitialLoadRef.current) {
        setIsLoading(true)
      }
      setError(null)
      
      let mainMetricsSuccess = false
      const userId = user.id
      
      // Fetch main metrics
      try {
        const backendMetrics = await fetchMetrics(userId)
        const dashboardMetrics = mapBackendMetricsToDashboard(backendMetrics)
        
        // Only update if metrics have changed
        if (metricsChanged(metricsRef.current, dashboardMetrics)) {
          setMetrics(dashboardMetrics)
          metricsRef.current = dashboardMetrics
        }
        mainMetricsSuccess = true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics'
        
        // If user lost admin access, sign them out
        if (errorMessage === 'FORBIDDEN_ADMIN_ACCESS') {
          console.warn('User lost admin privileges, signing out')
          signOut()
          return // Don't continue fetching
        }
        
        setError(errorMessage)
        console.error('Error fetching main metrics:', err)
      }
      
      // Fetch daily metrics separately - don't fail entire load if this fails
      try {
        const dailyMetrics = await fetchDailyMetrics(userId)
        const chartDataFromDaily = mapDailyMetricsToChartData(dailyMetrics)
        
        // Only update if chart data has changed
        if (
          chartDataChanged(chartDataRef.current.recipesOverTime, chartDataFromDaily.recipesOverTime) ||
          chartDataChanged(chartDataRef.current.usersOverTime, chartDataFromDaily.usersOverTime)
        ) {
          setChartData(chartDataFromDaily)
          chartDataRef.current = chartDataFromDaily
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch daily metrics'
        
        // If user lost admin access, sign them out
        if (errorMessage === 'FORBIDDEN_ADMIN_ACCESS') {
          console.warn('User lost admin privileges, signing out')
          signOut()
          return // Don't continue
        }
        
        console.error('Error fetching daily metrics:', err)
        // Set fallback chart data if daily metrics fail
        if (chartDataRef.current.recipesOverTime.length > 0 || chartDataRef.current.usersOverTime.length > 0) {
          const fallback = generateFallbackChartData()
          setChartData(fallback)
          chartDataRef.current = fallback
        }
        // Only set error if main metrics also failed
        if (!mainMetricsSuccess) {
          setError(errorMessage)
        }
      } finally {
        if (isInitialLoadRef.current) {
          setIsLoading(false)
          isInitialLoadRef.current = false
        }
      }
    }

    loadMetrics()

    // Refresh data every 30 seconds
    const interval = setInterval(loadMetrics, 30000)
    return () => clearInterval(interval)
  }, [user])
  
  // Update refs when state changes
  useEffect(() => {
    metricsRef.current = metrics
  }, [metrics])
  
  useEffect(() => {
    chartDataRef.current = chartData
  }, [chartData])

  return { metrics, chartData, isLoading, error }
}


