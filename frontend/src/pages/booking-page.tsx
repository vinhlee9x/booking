import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Building2, Calendar, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../auth/auth-context'
import { useBooking } from '../booking/booking-context'
import RoomList from '../components/room-list'
import BookingList from '../components/booking-list'
import BookingForm from '../components/booking-form'
import EmptyState from '../components/empty-state'

export default function BookingPage() {
  const { user, isAuthenticated, logout, status } = useAuth()
  const { selectedRoomId, fetchRooms } = useBooking()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void fetchRooms()
  }, [fetchRooms])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    void navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Building2 className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">Co-Working Manager</span>
        </div>
        <div className="flex items-center gap-4">
          {status === 'loading' ? null : isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-secondary/35 hover:bg-secondary/60 border border-border/80 px-3.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer text-left focus:outline-hidden"
              >
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold uppercase shadow-xs">
                  {user?.name?.substring(0, 2) ?? 'AD'}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-bold text-foreground leading-tight">{user?.name}</span>
                  <span className="text-[10px] text-muted-foreground leading-none">Administrator</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-xl shadow-md py-1.5 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3.5 py-2.5 border-b border-border bg-secondary/15">
                    <p className="text-xs font-semibold text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-bold text-foreground truncate mt-0.5">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={async () => {
                        setIsProfileOpen(false)
                        await handleLogout()
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/5 font-semibold transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => void navigate('/login')}
              className="text-sm bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4.5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border bg-secondary/20">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Workspace Rooms</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <RoomList />
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {selectedRoomId === null ? (
            <EmptyState
              icon={Calendar}
              title="No Room Selected"
              description="Choose a meeting or workspace room from the left sidebar to view availability and schedule bookings."
              className="h-full"
            />
          ) : (
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className={`${isAuthenticated ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl'} bg-white border border-border rounded-xl shadow-xs p-6`}>
                <BookingList />
              </div>
              {isAuthenticated && (
                <div className="lg:col-span-5 bg-white border border-border rounded-xl shadow-xs p-6 sticky top-20">
                  <BookingForm />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
