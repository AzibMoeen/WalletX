import React from 'react'
import ProtectedRoute from '@/components/VerificationGuard'

const layout = ({children}) => {
  return (
    <div>
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    </div>
  )
}

export default layout