import client from './client'
import type { ApiResponse, Booking } from '../types'

export interface CreateBookingPayload {
  room_id: number
  user_name: string
  start_time: string
  end_time: string
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await client.post<ApiResponse<Booking>>('/bookings', payload)
  return data.data
}

export async function deleteBooking(id: number): Promise<void> {
  await client.delete(`/bookings/${id}`)
}
