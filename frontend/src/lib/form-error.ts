import { isAxiosError } from 'axios'
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form'

export function handleApiError<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  fallback = 'Something went wrong'
) {
  if (!isAxiosError(err)) return
  const serverErrors = err.response?.data?.errors as Record<string, string[]> | undefined
  if (serverErrors) {
    for (const [field, messages] of Object.entries(serverErrors)) {
      setError(field as Path<T>, { message: messages[0] })
    }
  } else {
    setError('root' as Path<T>, {
      message: (err.response?.data?.msg as string | undefined) ?? fallback,
    })
  }
}
