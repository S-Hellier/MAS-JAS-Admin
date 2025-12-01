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
    <div className="min-h-screen bg-background flex items-center justify-center p-base">
      <div className="bg-background-surface rounded-xl shadow-heavy p-xxxl w-full max-w-md">
        <div className="flex flex-col items-center mb-xxl">
          <div className="bg-primary-light p-base rounded-full mb-base">
            <ChefHat className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-display font-bold text-text-primary">Pantry Partner</h1>
          <p className="text-body text-text-secondary mt-base">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-xl" noValidate>
          {error && (
            <div className="bg-status-error/10 border border-status-error/30 text-status-error px-base py-md rounded-lg" role="alert">
              <strong className="font-semibold">Error:</strong> {error}
            </div>
          )}
          
          {isLoading && (
            <div className="bg-status-info/10 border border-status-info/30 text-status-info px-base py-md rounded-lg">
              Signing in...
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-label font-medium text-text-primary mb-sm">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-base py-md border border-border rounded-lg focus:ring-2 focus:ring-border-focus focus:border-border-focus outline-none transition text-body text-text-primary placeholder:text-placeholder disabled:bg-disabled disabled:cursor-not-allowed"
              placeholder="admin@example.com"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-text-inverse py-md rounded-lg font-semibold hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed text-button"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-xl text-center text-body-small text-text-tertiary">
          Only users with admin privileges can access this dashboard
        </p>
      </div>
    </div>
  )
}

export default Login


