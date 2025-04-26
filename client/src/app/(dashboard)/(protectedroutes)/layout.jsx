import React from 'react'
import ProtectedRoute from '@/components/VerificationGuard'
import useAuthStore from '@/lib/store/useAuthStore'

const Layout = ({children}) => {

  return (
    <div>
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    </div>
  )
}

export default Layout