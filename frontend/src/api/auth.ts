import client from './client'
import type { ApiResponse, AuthUser } from '../types'

export async function login(email: string, password: string): Promise<AuthUser> {
  const { data } = await client.post<ApiResponse<AuthUser>>('/login', { email, password })
  return data.data
}

export async function logout(): Promise<void> {
  await client.post('/logout')
}

export async function fetchUser(): Promise<AuthUser> {
  const { data } = await client.get<ApiResponse<AuthUser>>('/user')
  return data.data
}
