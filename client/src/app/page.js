"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/lib/store/useAuthStore'
import { Loader2 } from 'lucide-react'

const HomePage = () => {
  const router = useRouter()
  const { isAuthenticated, user, fetchUser, isLoading } = useAuthStore()

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Try to fetch user data if not already authenticated
      if (!isAuthenticated || !user) {
        await fetchUser()
      }
      
      // Redirect based on authentication status
      if (isAuthenticated && user) {
        router.push('/wallet')
      } else {
        router.push('/login')
      }
    }
    
    checkAuthAndRedirect()
  }, [isAuthenticated, user, fetchUser, router])

  // Show loading while checking auth and redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  )
}

export default HomePage