import { useNavigate, useLocation } from 'react-router'
import { Building2 } from 'lucide-react'
import LoginForm from '../components/login-form'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-xl shadow-xs p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
            <Building2 className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center tracking-tight">Co-Working Manager</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">Sign in to your administration dashboard</p>
        </div>
        <LoginForm onSuccess={() => navigate(from, { replace: true })} />
      </div>
    </div>
  )
}
