import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  fullScreen?: boolean
  className?: string
}

export default function LoadingState({
  message = 'Loading...',
  fullScreen = false,
  className = ''
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center ${
        fullScreen ? 'fixed inset-0 bg-background/80 backdrop-blur-xs z-50 min-h-screen' : 'w-full py-8'
      } ${className}`}
    >
      <Loader2 className="animate-spin h-6 w-6 text-primary mb-2.5" />
      {message && <p className="text-sm font-medium text-muted-foreground">{message}</p>}
    </div>
  )
}
