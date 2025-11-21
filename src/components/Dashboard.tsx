import { LogOut, Users, ChefHat, Clock, ShoppingCart, TrendingUp } from 'lucide-react'
import MetricsOverview from './MetricsOverview'
import MetricsCharts from './MetricsCharts'

interface DashboardProps {
  onLogout: () => void
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">MAS-JAS Admin</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600 mt-2">Monitor your app's performance and user engagement</p>
        </div>

        {/* Metrics Overview Cards */}
        <MetricsOverview />

        {/* Charts Section */}
        <MetricsCharts />
      </main>
    </div>
  )
}

export default Dashboard


