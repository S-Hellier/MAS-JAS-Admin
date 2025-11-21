import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useMetrics } from '../hooks/useMetrics'

const MetricsCharts = () => {
  const { chartData } = useMetrics()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recipes Generated Over Time */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipes Generated Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.recipesOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="recipes" stroke="#0ea5e9" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Active Users Over Time */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.usersOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recipe Generation Time Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Recipe Generation Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.recipeTimeDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgTime" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pantry Items Added Over Time */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pantry Items Added Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.pantryItemsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="items" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MetricsCharts


