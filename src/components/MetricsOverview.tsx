import { Users, ChefHat, Clock, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react'
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
  const { metrics } = useMetrics()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers.toLocaleString()}
        change={12.5}
        icon={<Users className="w-6 h-6 text-primary-600" />}
        color="bg-primary-50"
      />
      <MetricCard
        title="Recipes Generated"
        value={metrics.recipesGenerated.toLocaleString()}
        change={8.3}
        icon={<ChefHat className="w-6 h-6 text-green-600" />}
        color="bg-green-50"
      />
      <MetricCard
        title="Avg Recipe Time"
        value={`${metrics.avgRecipeTime}s`}
        change={-5.2}
        icon={<Clock className="w-6 h-6 text-orange-600" />}
        color="bg-orange-50"
      />
      <MetricCard
        title="Pantry Items Added"
        value={metrics.pantryItemsAdded.toLocaleString()}
        change={15.7}
        icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
        color="bg-purple-50"
      />
    </div>
  )
}

export default MetricsOverview


