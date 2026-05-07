import api from '@/api'
import type { CreateOfferingBody, ListQuery, ListResponse } from '@/types'

export const createOffering = async (body: CreateOfferingBody): Promise<void> => {
  await api.post('/offering/create', body)
}

export const confirmPayment = async (paymentKey: string, orderId: string, amount: number): Promise<void> => {
  await api.post('/offering/confirm', { paymentKey, orderId, amount })
}

export const getOfferingStatus = async (orderId: string): Promise<string> => {
  const { data } = await api.get(`/offering/status/${orderId}`)
  return data.status
}

export const listOfferings = async (query: ListQuery): Promise<ListResponse> => {
  const params: Record<string, string | number> = {
    year: query.year ?? '',
    page: query.page ?? 1,
    size: query.size ?? 25,
    isPage: query.isPage !== false ? 'true' : 'false',
  }
  if (query.name) params.name = query.name
  if (query.ssn) params.ssn = query.ssn
  if (query.email) params.email = query.email
  if (query.payType) params.payType = query.payType

  const { data } = await api.get('/offerings', { params })
  return data.message
}

export const failPayment = async (body: {
  orderId: string
  paymentKey?: string
  errorCode?: string
  errorMessage?: string
}): Promise<void> => {
  await api.post('/offering/fail', body)
}

export const updateOfferingStatus = async (orderId: string, status: string): Promise<void> => {
  await api.patch(`/offering/${orderId}`, { status })
}
