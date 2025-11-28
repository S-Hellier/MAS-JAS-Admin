import { useState, useEffect, useCallback } from 'react'
import { User, loginUser, verifyAdminStatus } from '../config/api'

interface UseAuthReturn {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  isInitialLoad: boolean
  signIn: (email: string) => Promise<{ error: Error | null }>
  signOut: () => void
}

const STORAGE_KEY = 'admin_user'

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)

  const signOut = useCallback(() => {
    setUser(null)
    setIsAdmin(false)
    sessionStorage.removeItem(STORAGE_KEY)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let isMounted = true

    const restoreSession = async () => {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      
      if (!stored) {
        if (isMounted) {
          setIsLoading(false)
          setIsInitialLoad(false)
        }
        return
      }

      try {
        const storedUser: User = JSON.parse(stored)
        const adminStatus = await verifyAdminStatus(storedUser.id)
        
        if (isMounted) {
          if (adminStatus) {
            setUser(storedUser)
            setIsAdmin(true)
          } else {
            sessionStorage.removeItem(STORAGE_KEY)
            setUser(null)
            setIsAdmin(false)
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err)
        sessionStorage.removeItem(STORAGE_KEY)
        if (isMounted) {
          setUser(null)
          setIsAdmin(false)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setIsInitialLoad(false)
        }
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  const signIn = async (email: string): Promise<{ error: Error | null }> => {
    try {
      setIsLoading(true)

      const loggedInUser = await loginUser(email)

      if (!loggedInUser?.id) {
        setIsLoading(false)
        return { error: new Error('Invalid user data received from server') }
      }

      const adminStatus = await verifyAdminStatus(loggedInUser.id)

      if (!adminStatus) {
        setIsLoading(false)
        return { error: new Error('Access denied. Admin privileges required.') }
      }

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
      setUser(loggedInUser)
      setIsAdmin(true)
      setIsLoading(false)

      return { error: null }
    } catch (err) {
      console.error('Sign in error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
      setIsLoading(false)
      return { error: new Error(errorMessage) }
    }
  }

  return {
    user,
    isAdmin,
    isLoading,
    isInitialLoad,
    signIn,
    signOut,
  }
}
