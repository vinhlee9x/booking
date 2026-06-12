import { Clock, Calendar } from 'lucide-react'
import { useAuth } from '../auth/auth-context'
import { useBooking } from '../booking/booking-context'
import { formatDisplay } from '../lib/datetime'
import LoadingState from './loading-state'
import EmptyState from './empty-state'

export default function BookingList() {
  const { isAuthenticated } = useAuth()
  const { bookings, loading, removeBooking } = useBooking()

  if (loading) {
    return <LoadingState message="Loading bookings..." />
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings scheduled"
        description="There are no sessions scheduled for this room yet."
        icon={Calendar}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Scheduled Bookings</h2>
        <span className="text-xs bg-secondary border border-border text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
          {bookings.length} {bookings.length === 1 ? 'session' : 'sessions'}
        </span>
      </div>

      <ul className="divide-y divide-border">
        {bookings.map((b) => (
          <li key={b.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-foreground uppercase">
                {b.user_name.substring(0, 2)}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none mb-1">{b.user_name}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground/70" strokeWidth={2} />
                  <span>{formatDisplay(b.start_time)} – {formatDisplay(b.end_time)}</span>
                </div>
              </div>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => void removeBooking(b.id)}
                className="text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
