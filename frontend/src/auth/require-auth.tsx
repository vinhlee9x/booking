import { Navigate, useLocation } from 'react-router'
import { useAuth } from './auth-context'
import LoadingState from '../components/loading-state'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <LoadingState message="Checking authentication..." fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
