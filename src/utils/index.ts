import { v4 as uuidv4 } from 'uuid'

export const generateOrderId = () => `ORDER-${uuidv4()}`

export const formatAmount = (amount: number) =>
  new Intl.NumberFormat('ko-KR').format(amount) + '원'

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
