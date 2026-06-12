import { Building2 } from 'lucide-react'
import { useBooking } from '../booking/booking-context'
import EmptyState from './empty-state'

export default function RoomList() {
  const { rooms, selectedRoomId, selectRoom } = useBooking()

  if (rooms.length === 0) {
    return <EmptyState title="No rooms available" icon={Building2} className="p-4" />
  }

  return (
    <ul className="space-y-1 p-3">
      {rooms.map((room) => {
        const isSelected = selectedRoomId === room.id
        return (
          <li key={room.id}>
            <button
              onClick={() => selectRoom(room.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'text-foreground hover:bg-secondary/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                <Building2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} strokeWidth={2} />
                <span className="truncate" title={room.name}>{room.name}</span>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                isSelected
                  ? 'bg-primary-foreground/15 border-primary-foreground/10 text-primary-foreground'
                  : 'bg-secondary border-border text-muted-foreground'
              }`}>
                Cap {room.capacity}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
