import { useState, useEffect } from 'react'
import { fetchMetrics, fetchDailyMetrics, BackendMetrics, DailyMetrics } from '../config/api'

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

export const useMetrics = (): UseMetricsReturn => {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [chartData, setChartData] = useState<ChartData>(generateFallbackChartData())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMetrics = async () => {
      setIsLoading(true)
      setError(null)
      
      let mainMetricsSuccess = false
      
      // Fetch main metrics
      try {
        const backendMetrics = await fetchMetrics()
        console.log('Backend metrics received:', backendMetrics)
        console.log('average_weekly_recipes_per_user value:', backendMetrics.average_weekly_recipes_per_user)
        const dashboardMetrics = mapBackendMetricsToDashboard(backendMetrics)
        setMetrics(dashboardMetrics)
        mainMetricsSuccess = true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics'
        setError(errorMessage)
        console.error('Error fetching main metrics:', err)
      }
      
      // Fetch daily metrics separately - don't fail entire load if this fails
      try {
        const dailyMetrics = await fetchDailyMetrics()
        const chartDataFromDaily = mapDailyMetricsToChartData(dailyMetrics)
        setChartData(chartDataFromDaily)
      } catch (err) {
        console.error('Error fetching daily metrics:', err)
        // Set fallback chart data if daily metrics fail
        setChartData(generateFallbackChartData())
        // Only set error if main metrics also failed
        if (!mainMetricsSuccess) {
          setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()

    // Refresh data every 30 seconds
    const interval = setInterval(loadMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  return { metrics, chartData, isLoading, error }
}


