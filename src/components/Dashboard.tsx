import { LogOut, Users, ChefHat, Clock, ShoppingCart, TrendingUp } from 'lucide-react'
import MetricsOverview from './MetricsOverview'
import MetricsCharts from './MetricsCharts'

interface DashboardProps {
  onLogout: () => void
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background-surface shadow-light border-b border-border">
        <div className="max-w-7xl mx-auto px-base sm:px-xl lg:px-xxl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-md">
              <ChefHat className="w-8 h-8 text-primary" />
              <h1 className="text-h1 font-bold text-text-primary">Pantry Partner</h1>
              <span className="text-body-small text-text-tertiary ml-sm">Admin Dashboard</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-sm px-base py-sm text-text-secondary hover:bg-primary-light/20 rounded-lg transition font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-base sm:px-xl lg:px-xxl py-xxl">
        <div className="mb-xxl">
          <h2 className="text-h1 font-bold text-text-primary">Dashboard Overview</h2>
          <p className="text-body text-text-secondary mt-base">Monitor your app's performance and user engagement</p>
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


