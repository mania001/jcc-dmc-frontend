import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { loadTossPayments } from '@tosspayments/sdk'
import { createOffering } from '@/services/offeringService'
import { generateOrderId } from '@/utils'
import type { CreateOfferingBody, PayType } from '@/types'

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY

type FormData = {
  pay_type: PayType
  name: string
  jumin1: string
  jumin2: string
  email: string
  tithe: number
  thanks: number
  building: number
  mission: number
  relief: number
}

const OFFERING_FIELDS = [
  { key: 'tithe', label: '십일조' },
  { key: 'thanks', label: '감사' },
  { key: 'building', label: '건축' },
  { key: 'mission', label: '선교' },
  { key: 'relief', label: '구제' },
] as const

export default function Home() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { pay_type: 'card', tithe: 0, thanks: 0, building: 0, mission: 0, relief: 0 },
  })

  const values = watch(['tithe', 'thanks', 'building', 'mission', 'relief'])
  const total = values.reduce((sum, v) => sum + (Number(v) || 0), 0)

  const onSubmit = async (data: FormData) => {
    if (total <= 0) {
      alert('헌금 금액을 1원 이상 입력해 주세요.')
      return
    }
    setLoading(true)
    try {
      const order_id = generateOrderId()
      const body: CreateOfferingBody = {
        pay_type: data.pay_type,
        name: data.name,
        jumin1: data.jumin1,
        jumin2: data.jumin2,
        email: data.email || undefined,
        tithe: Number(data.tithe) || 0,
        thanks: Number(data.thanks) || 0,
        building: Number(data.building) || 0,
        mission: Number(data.mission) || 0,
        relief: Number(data.relief) || 0,
        order_id,
      }
      await createOffering(body)

      const tossPayments = await loadTossPayments(CLIENT_KEY)
      const paymentParams = {
        amount: total,
        orderId: order_id,
        orderName: `JCC 헌금 (${data.name})`,
        customerName: data.name,
        customerEmail: data.email || undefined,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      }
      if (data.pay_type === 'card') {
        await tossPayments.requestPayment('카드', paymentParams)
      } else {
        await tossPayments.requestPayment('휴대폰', paymentParams)
      }
    } catch (err: any) {
      console.error(err)
      alert('결제 요청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">헌금 납부</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* 결제수단 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">결제수단</label>
          <div className="flex gap-3">
            {(['card', 'mobile'] as const).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={type} {...register('pay_type')} className="accent-blue-600" />
                <span className="text-sm text-gray-700">{type === 'card' ? '카드' : '휴대폰'}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 성명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">성명 <span className="text-red-500">*</span></label>
          <input
            type="text"
            {...register('name', { required: '성명을 입력하세요' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="홍길동"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        {/* 주민번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">주민번호 <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              maxLength={6}
              {...register('jumin1', {
                required: '앞자리를 입력하세요',
                pattern: { value: /^\d{6}$/, message: '숫자 6자리를 입력하세요' },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="앞 6자리"
            />
            <span className="text-gray-400">-</span>
            <input
              type="password"
              maxLength={7}
              {...register('jumin2', {
                required: '뒷자리를 입력하세요',
                pattern: { value: /^\d{7}$/, message: '숫자 7자리를 입력하세요' },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="뒤 7자리"
            />
          </div>
          {(errors.jumin1 || errors.jumin2) && (
            <p className="mt-1 text-xs text-red-500">{errors.jumin1?.message || errors.jumin2?.message}</p>
          )}
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일 <span className="text-gray-400 font-normal">(선택)</span></label>
          <input
            type="email"
            {...register('email', {
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '올바른 이메일 형식을 입력하세요' },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* 헌금 항목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">헌금 항목 (원)</label>
          <div className="space-y-2">
            {OFFERING_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-12 text-sm text-gray-600 shrink-0">{label}</span>
                <input
                  type="number"
                  min={0}
                  {...register(key, { min: 0 })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 합계 */}
        <div className="flex justify-between items-center py-3 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">합계</span>
          <span className="text-lg font-semibold text-blue-600">
            {new Intl.NumberFormat('ko-KR').format(total)}원
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || total <= 0}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? '처리 중...' : '결제하기'}
        </button>
      </form>
    </div>
  )
}
