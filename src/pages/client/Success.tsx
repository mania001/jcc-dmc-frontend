import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { confirmPayment } from '@/services/offeringService'

type Status = 'loading' | 'success' | 'error'

export default function Success() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('loading')
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const paymentKey = searchParams.get('paymentKey')
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount')

    if (!paymentKey || !orderId || !amount) {
      setStatus('error')
      return
    }

    confirmPayment(paymentKey, orderId, Number(amount))
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-sm">결제를 처리하고 있습니다...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-xl">✕</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">결제 처리 실패</h2>
        <p className="text-sm text-gray-500 mb-6">결제 승인 중 오류가 발생했습니다.</p>
        <button
          onClick={() => navigate('/')}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-green-600 text-xl">✓</span>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">헌금이 접수되었습니다</h2>
      <p className="text-sm text-gray-500 mb-6">감사합니다. 헌금이 성공적으로 처리되었습니다.</p>
      <button
        onClick={() => navigate('/')}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        처음으로
      </button>
    </div>
  )
}
