export interface ApiResponse<T> {
  code: number
  data: T
  msg: string | null
  success: boolean
}

export interface ApiError {
  code: number
  msg: string
  errors?: Record<string, string[]> | null
  error?: { message: string }
}

export interface Room {
  id: number
  name: string
  capacity: number
}

export interface Booking {
  id: number
  room_id: number
  user_name: string
  start_time: string
  end_time: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
}
