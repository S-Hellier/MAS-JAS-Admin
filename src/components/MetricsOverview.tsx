import { Users, ChefHat, Clock, ShoppingCart, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { useMetrics } from '../hooks/useMetrics'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color: string
}

const MetricCard = ({ title, value, change, icon, color }: MetricCardProps) => {
  const isPositive = change !== undefined && change >= 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

const MetricsOverview = () => {
  const { metrics, isLoading, error } = useMetrics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
        <p className="font-semibold">Error loading metrics</p>
        <p className="text-sm mt-1">{error}</p>
        <p className="text-sm mt-2">Please check that the backend is running and the API key is correct.</p>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl mb-8">
        <p>No metrics data available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers.toLocaleString()}
        icon={<Users className="w-6 h-6 text-primary-600" />}
        color="bg-primary-50"
      />
      <MetricCard
        title="Recipes Generated"
        value={metrics.recipesGenerated.toLocaleString()}
        icon={<ChefHat className="w-6 h-6 text-green-600" />}
        color="bg-green-50"
      />
      <MetricCard
        title="Avg Recipe Time"
        value={`${metrics.avgRecipeTime}s`}
        icon={<Clock className="w-6 h-6 text-orange-600" />}
        color="bg-orange-50"
      />
      <MetricCard
        title="Pantry Items Added"
        value={metrics.pantryItemsAdded.toLocaleString()}
        icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
        color="bg-purple-50"
      />
      <MetricCard
        title="Avg Recipes/Week per User"
        value={
          metrics.averageWeeklyRecipesPerUser !== null && metrics.averageWeeklyRecipesPerUser !== undefined && !isNaN(metrics.averageWeeklyRecipesPerUser)
            ? metrics.averageWeeklyRecipesPerUser.toFixed(1)
            : 'N/A'
        }
        icon={<Calendar className="w-6 h-6 text-indigo-600" />}
        color="bg-indigo-50"
      />
    </div>
  )
}

export default MetricsOverview


