import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../auth/auth-context'
import { handleApiError } from '../lib/form-error'
import { FormField } from './form-field'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

interface Props {
  onSuccess: () => void
}

export default function LoginForm({ onSuccess }: Props) {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values.email, values.password)
      onSuccess()
    } catch (err) {
      handleApiError(err, setError, 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField label="Email address" error={errors.email}>
        {({ className }) => (
          <input
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            {...register('email')}
            className={className}
          />
        )}
      </FormField>

      <FormField label="Password" error={errors.password}>
        {({ className }) => (
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register('password')}
            className={className}
          />
        )}
      </FormField>

      {errors.root && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-destructive text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-destructive" strokeWidth={2} />
          <span>{errors.root.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 px-4 rounded-md text-sm shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 text-white" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}
