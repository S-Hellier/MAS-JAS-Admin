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
    <div className="bg-background-surface rounded-lg shadow-light border border-border p-base hover:shadow-medium transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label font-medium text-text-secondary">{title}</p>
          <p className="text-h1 font-bold text-text-primary mt-sm">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-sm">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-status-success mr-xs" />
              ) : (
                <TrendingDown className="w-4 h-4 text-status-error mr-xs" />
              )}
              <span className={`text-body-small font-medium ${isPositive ? 'text-status-success' : 'text-status-error'}`}>
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        <div className={`${color} p-md rounded-lg`}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-xl mb-xxl">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-background-surface rounded-lg shadow-light border border-border p-base animate-pulse">
            <div className="h-4 bg-disabled rounded w-1/2 mb-base"></div>
            <div className="h-8 bg-disabled rounded w-1/3 mb-sm"></div>
            <div className="h-4 bg-disabled rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-status-error/10 border border-status-error/30 text-status-error px-xl py-base rounded-lg mb-xxl">
        <p className="font-semibold text-body">Error loading metrics</p>
        <p className="text-body-small mt-sm">{error}</p>
        <p className="text-body-small mt-sm">Please check that the backend is running and the API key is correct.</p>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="bg-status-warning/10 border border-status-warning/30 text-status-warning px-xl py-base rounded-lg mb-xxl">
        <p className="text-body">No metrics data available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-xl mb-xxl">
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers.toLocaleString()}
        icon={<Users className="w-6 h-6 text-primary" />}
        color="bg-primary-light/20"
      />
      <MetricCard
        title="Recipes Generated"
        value={metrics.recipesGenerated.toLocaleString()}
        icon={<ChefHat className="w-6 h-6 text-status-success" />}
        color="bg-status-success/20"
      />
      <MetricCard
        title="Avg Recipe Time"
        value={`${metrics.avgRecipeTime}s`}
        icon={<Clock className="w-6 h-6 text-accent" />}
        color="bg-accent/20"
      />
      <MetricCard
        title="Pantry Items Added"
        value={metrics.pantryItemsAdded.toLocaleString()}
        icon={<ShoppingCart className="w-6 h-6 text-accent-secondary" />}
        color="bg-accent-secondary/20"
      />
      <MetricCard
        title="Avg Recipes/Week per User"
        value={metrics.averageWeeklyRecipesPerUser.toFixed(1)}
        icon={<Calendar className="w-6 h-6 text-status-info" />}
        color="bg-status-info/20"
      />
    </div>
  )
}

export default MetricsOverview


