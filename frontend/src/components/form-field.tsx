import { AlertCircle } from 'lucide-react'
import type { FieldError } from 'react-hook-form'
import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  error?: FieldError
  children: (props: { className: string }) => ReactNode
}

const INPUT_BASE =
  'w-full bg-white border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 transition-all duration-150 shadow-xs'
const INPUT_ERROR = 'border-destructive focus:ring-destructive/20 focus:border-destructive'
const INPUT_NORMAL = 'border-input focus:ring-primary/20 focus:border-primary'

export function FormField({ label, error, children }: FormFieldProps) {
  const className = `${INPUT_BASE} ${error ? INPUT_ERROR : INPUT_NORMAL}`

  return (
    <div>
      <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children({ className })}
      {error && (
        <p className="text-destructive text-xs font-medium mt-1.5 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
          {error.message}
        </p>
      )}
    </div>
  )
}
