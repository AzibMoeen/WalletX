import React from 'react'
import ProtectedRoute from '@/components/VerificationGuard'

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