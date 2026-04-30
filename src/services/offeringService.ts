import api from '@/api'
import type { CreateOfferingBody, ListQuery, ListResponse } from '@/types'

export const createOffering = async (body: CreateOfferingBody): Promise<void> => {
  await api.post('/create', body)
}

export const confirmPayment = async (paymentKey: string, orderId: string, amount: number): Promise<void> => {
  await api.post('/confirm', { paymentKey, orderId, amount })
}

export const getOfferingStatus = async (orderId: string): Promise<string> => {
  const { data } = await api.get(`/status/${orderId}`)
  return data.status
}

export const listOfferings = async (query: ListQuery): Promise<ListResponse> => {
  const { data } = await api.get('/list', {
    params: {
      ...query,
      isPage: query.isPage !== false ? 'true' : 'false',
    },
  })
  return data.message
}

export const updateOfferingStatus = async (orderId: string, status: string): Promise<void> => {
  await api.put(`/update/${orderId}`, { status })
}
