import { useState, useEffect } from 'react'

interface Metrics {
  activeUsers: number
  recipesGenerated: number
  avgRecipeTime: number
  pantryItemsAdded: number
}

interface ChartData {
  recipesOverTime: Array<{ date: string; recipes: number }>
  usersOverTime: Array<{ date: string; users: number }>
  recipeTimeDistribution: Array<{ period: string; avgTime: number }>
  pantryItemsOverTime: Array<{ date: string; items: number }>
}

interface UseMetricsReturn {
  metrics: Metrics
  chartData: ChartData
  isLoading: boolean
}

// Mock data generator - replace with actual API calls later
const generateMockMetrics = (): Metrics => ({
  activeUsers: 12450,
  recipesGenerated: 89320,
  avgRecipeTime: 3.2,
  pantryItemsAdded: 156780,
})

const generateMockChartData = (): ChartData => {
  // Generate last 7 days of data
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  return {
    recipesOverTime: dates.map((date, i) => ({
      date,
      recipes: Math.floor(Math.random() * 2000) + 1000 + i * 100,
    })),
    usersOverTime: dates.map((date, i) => ({
      date,
      users: Math.floor(Math.random() * 500) + 1500 + i * 50,
    })),
    recipeTimeDistribution: [
      { period: 'Mon', avgTime: 3.1 },
      { period: 'Tue', avgTime: 3.3 },
      { period: 'Wed', avgTime: 3.0 },
      { period: 'Thu', avgTime: 3.4 },
      { period: 'Fri', avgTime: 3.2 },
      { period: 'Sat', avgTime: 3.5 },
      { period: 'Sun', avgTime: 3.1 },
    ],
    pantryItemsOverTime: dates.map((date, i) => ({
      date,
      items: Math.floor(Math.random() * 3000) + 2000 + i * 200,
    })),
  }
}

export const useMetrics = (): UseMetricsReturn => {
  const [metrics, setMetrics] = useState<Metrics>(generateMockMetrics())
  const [chartData, setChartData] = useState<ChartData>(generateMockChartData())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call - replace with actual API call later
    const fetchMetrics = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      setMetrics(generateMockMetrics())
      setChartData(generateMockChartData())
      setIsLoading(false)
    }

    fetchMetrics()

    // Refresh data every 30 seconds (optional)
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  return { metrics, chartData, isLoading }
}


