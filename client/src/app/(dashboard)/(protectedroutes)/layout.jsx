import React from 'react'
import ProtectedRoute from '@/components/auth/VerificationGuard'

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