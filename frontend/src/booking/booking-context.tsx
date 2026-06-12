import { createContext, useCallback, useContext, useReducer } from 'react'
import { getRooms, getRoomBookings } from '../api/rooms'
import { createBooking, deleteBooking, type CreateBookingPayload } from '../api/bookings'
import type { Booking, Room } from '../types'

interface BookingState {
  rooms: Room[]
  selectedRoomId: number | null
  bookings: Booking[]
  loading: boolean
  error: string | null
}

type BookingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ROOMS'; payload: Room[] }
  | { type: 'SET_SELECTED_ROOM'; payload: number }
  | { type: 'SET_BOOKINGS'; payload: Booking[] }
  | { type: 'SET_ERROR'; payload: string }

function reducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload }
    case 'SET_SELECTED_ROOM':
      return { ...state, selectedRoomId: action.payload }
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
  }
}

const initialState: BookingState = {
  rooms: [],
  selectedRoomId: null,
  bookings: [],
  loading: false,
  error: null,
}

interface BookingContextValue extends BookingState {
  fetchRooms: () => Promise<void>
  selectRoom: (id: number) => void
  addBooking: (payload: CreateBookingPayload) => Promise<void>
  removeBooking: (id: number) => Promise<void>
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchBookings = useCallback(async (roomId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const bookings = await getRoomBookings(roomId)
      dispatch({ type: 'SET_BOOKINGS', payload: bookings })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load bookings' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const fetchRooms = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const rooms = await getRooms()
      dispatch({ type: 'SET_ROOMS', payload: rooms })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load rooms' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const selectRoom = useCallback((id: number) => {
    dispatch({ type: 'SET_SELECTED_ROOM', payload: id })
    void fetchBookings(id)
  }, [fetchBookings])

  const addBooking = useCallback(async (payload: CreateBookingPayload) => {
    await createBooking(payload)
    if (state.selectedRoomId !== null) {
      await fetchBookings(state.selectedRoomId)
    }
  }, [state.selectedRoomId, fetchBookings])

  const removeBooking = useCallback(async (id: number) => {
    await deleteBooking(id)
    if (state.selectedRoomId !== null) {
      await fetchBookings(state.selectedRoomId)
    }
  }, [state.selectedRoomId, fetchBookings])

  return (
    <BookingContext.Provider value={{ ...state, fetchRooms, selectRoom, addBooking, removeBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
