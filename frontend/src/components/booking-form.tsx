import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PlusCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useBooking } from '../booking/booking-context'
import { nowLocal, toIso } from '../lib/datetime'
import { handleApiError } from '../lib/form-error'
import { FormField } from './form-field'

const bookingSchema = z
  .object({
    user_name: z.string().min(1, 'Name is required'),
    start_time: z.string().refine((v) => new Date(v) >= new Date(nowLocal()), {
      message: 'Start time must be in the future',
    }),
    end_time: z.string().min(1, 'End time is required'),
  })
  .refine((d) => d.end_time > d.start_time, {
    message: 'End time must be after start time',
    path: ['end_time'],
  })

type BookingValues = z.infer<typeof bookingSchema>

export default function BookingForm() {
  const { selectedRoomId, addBooking } = useBooking()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({ resolver: zodResolver(bookingSchema) })

  const onSubmit = async (values: BookingValues) => {
    if (selectedRoomId === null) return
    try {
      await addBooking({
        room_id: selectedRoomId,
        user_name: values.user_name,
        start_time: toIso(values.start_time),
        end_time: toIso(values.end_time),
      })
      reset()
    } catch (err) {
      handleApiError(err, setError, 'Failed to create booking')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <PlusCircle className="w-4 h-4 text-primary shrink-0" strokeWidth={2.5} />
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">New Booking</h3>
      </div>

      <FormField label="Your name" error={errors.user_name}>
        {({ className }) => (
          <input
            type="text"
            placeholder="Enter name for the session"
            {...register('user_name')}
            className={className}
          />
        )}
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Start Date & Time" error={errors.start_time}>
          {({ className }) => (
            <input
              type="datetime-local"
              {...register('start_time')}
              min={nowLocal()}
              className={className}
            />
          )}
        </FormField>

        <FormField label="End Date & Time" error={errors.end_time}>
          {({ className }) => (
            <input
              type="datetime-local"
              {...register('end_time')}
              className={className}
            />
          )}
        </FormField>
      </div>

      {errors.root && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-destructive text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-destructive" strokeWidth={2} />
          <span>{errors.root.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 px-4 rounded-md text-sm shadow-xs transition-all focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 text-white" />
            Booking room...
          </>
        ) : (
          'Book Workspace Room'
        )}
      </button>
    </form>
  )
}
