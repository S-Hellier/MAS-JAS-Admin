import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useMetrics } from '../hooks/useMetrics'

const MetricsCharts = () => {
  const { chartData, isLoading } = useMetrics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-background-surface rounded-lg shadow-light border border-border p-base animate-pulse">
            <div className="h-6 bg-disabled rounded w-1/3 mb-base"></div>
            <div className="h-64 bg-disabled rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  // Check if we have data for the charts
  const hasRecipesData = chartData.recipesOverTime.length > 0
  const hasUsersData = chartData.usersOverTime.length > 0

  if (!hasRecipesData && !hasUsersData) {
    return (
      <div className="bg-status-warning/10 border border-status-warning/30 text-status-warning px-xl py-base rounded-lg">
        <p className="font-semibold text-body">No chart data available</p>
        <p className="text-body-small mt-sm">Daily metrics data is not available. Please check your backend connection.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
      {/* Recipes Generated Over Time */}
      {hasRecipesData && (
        <div className="bg-background-surface rounded-lg shadow-light border border-border p-base">
          <h3 className="text-h3 font-semibold text-text-primary mb-base">Recipes Generated (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.recipesOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" />
              <XAxis dataKey="date" stroke="#5F6B5A" />
              <YAxis stroke="#5F6B5A" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E1D8',
                  borderRadius: '10px',
                  color: '#2D3A28'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="recipes" stroke="#7C9070" strokeWidth={2} name="Recipes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Active Users Over Time */}
      {hasUsersData && (
        <div className="bg-background-surface rounded-lg shadow-light border border-border p-base">
          <h3 className="text-h3 font-semibold text-text-primary mb-base">Active Users (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.usersOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" />
              <XAxis dataKey="date" stroke="#5F6B5A" />
              <YAxis stroke="#5F6B5A" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E1D8',
                  borderRadius: '10px',
                  color: '#2D3A28'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#9AAA8E" strokeWidth={2} name="Active Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default MetricsCharts


