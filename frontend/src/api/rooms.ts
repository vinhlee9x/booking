import client from './client'
import type { ApiResponse, Booking, Room } from '../types'

export async function getRooms(): Promise<Room[]> {
  const { data } = await client.get<ApiResponse<Room[]>>('/rooms')
  return data.data
}

export async function getRoomBookings(roomId: number): Promise<Booking[]> {
  const { data } = await client.get<ApiResponse<Booking[]>>(`/rooms/${roomId}/bookings`)
  return data.data
}
