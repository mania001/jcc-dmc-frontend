import api from '@/api'
import type { LoginBody } from '@/types'

export const login = async (body: LoginBody): Promise<string> => {
  const { data } = await api.post('/login', body)
  return data.message // JWT token
}

export const signup = async (body: LoginBody): Promise<void> => {
  await api.post('/signup', body)
}
