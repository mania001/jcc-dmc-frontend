export type PayType = 'card' | 'mobile'
export type OfferingStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELED'

export interface Offering {
  id: number
  pay_type: PayType
  name: string
  jumin1: string
  email: string | null
  tithe: number
  thanks: number
  building: number
  mission: number
  relief: number
  amount: number
  order_id: string
  status: OfferingStatus
  created_at: string
}

export interface PageInfo {
  current: number
  pageSize: number
  totalPage: number
  totalResults: number
}

export interface PaymentInfo {
  totalPay: number
  currentPagePay: number
}

export interface ListResponse {
  pageInfo: PageInfo
  paymentInfo: PaymentInfo
  results: Offering[]
}

export interface CreateOfferingBody {
  pay_type: PayType
  name: string
  jumin1: string
  jumin2: string
  email?: string
  tithe?: number
  thanks?: number
  building?: number
  mission?: number
  relief?: number
  order_id: string
}

export interface LoginBody {
  userId: string
  password: string
}

export interface ListQuery {
  year?: string
  page?: number
  size?: number
  name?: string
  ssn?: string
  email?: string
  isPage?: boolean
}
