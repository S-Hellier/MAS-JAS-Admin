import { useState, FormEvent, useEffect, useRef } from 'react'
import { ChefHat } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signIn, isLoading: authLoading, user, isAdmin } = useAuth()
  const hasNavigatedRef = useRef(false)

  // Navigate to dashboard when user becomes authenticated (only once)
  useEffect(() => {
    // Only navigate if:
    // 1. User is authenticated
    // 2. Not currently loading
    // 3. Haven't already navigated
    // 4. Not already on dashboard (check window.location to avoid unnecessary redirects)
    if (user && isAdmin && !authLoading && !isSubmitting && !hasNavigatedRef.current) {
      const currentPath = window.location.pathname
      if (currentPath !== '/dashboard') {
        hasNavigatedRef.current = true
        // Use window.location for a hard redirect - more reliable than useNavigate
        window.location.href = '/dashboard'
      }
    }
  }, [user, isAdmin, authLoading, isSubmitting])

  // Reset navigation flag when user logs out
  useEffect(() => {
    if (!user || !isAdmin) {
      hasNavigatedRef.current = false
    }
  }, [user, isAdmin])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await signIn(email)
      
      if (result.error) {
        setError(result.error.message || 'Failed to sign in. Please check your email and try again.')
        setIsSubmitting(false)
      } else {
        // Login successful - state will be updated by useAuth hook
        // Navigation will be handled by useEffect
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const isLoading = isSubmitting || authLoading

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary-100 p-4 rounded-full mb-4">
            <ChefHat className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {isLoading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              Signing in...
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              placeholder="admin@example.com"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Only users with admin privileges can access this dashboard
        </p>
      </div>
    </div>
  )
}

export default Login


