import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { confirmPayment } from '@/services/offeringService'
import { formatAmount } from '@/utils'

type Status = 'loading' | 'success' | 'error'

export default function Success() {
  const [searchParams] = useSearchParams()

  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amountStr = searchParams.get('amount')
  const amountNum = Number(amountStr)
  const orderName = searchParams.get('orderName') ?? ''
  const isValid = !!(paymentKey && orderId && amountStr)

  const [status, setStatus] = useState<Status>(isValid ? 'loading' : 'error')
  const called = useRef(false)

  useEffect(() => {
    if (!isValid || called.current) return
    called.current = true

    confirmPayment(paymentKey!, orderId!, amountNum)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [isValid, paymentKey, orderId, amountNum])

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <p>처리중...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div>
        <h3 style={{ marginBottom: '16px' }}>결재 오류</h3>
        <p>결제 처리 중 오류가 발생했습니다.</p>
        <div className="btn-group" style={{ marginTop: '20px' }}>
          <button className="btn" onClick={() => window.location.href = '/'}>다시 시도</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>결재 완료</h3>
      <br />
      {amountNum > 0 && <p>총 결재금액 : {formatAmount(amountNum)}</p>}
      <br />
      <br />
      <p>
        {orderName && `${orderName} `}성도님<br />
        헌금이 정상적으로 처리되었습니다.<br />
        이 소중한 헌금이<br />
        지구촌을 복음화 하는데<br />
        귀중히 쓰임받을 것입니다.<br />
        반드시 그날에 하나님께 기억되고<br />
        당신이 심은것에 100배를 보상하십니다.<br />
        <br />
        확인버튼을 누르시면 창이 닫힙니다.<br />
        <br />
        <button className="btn" onClick={() => window.close()}>확인</button>
      </p>
    </div>
  )
}
