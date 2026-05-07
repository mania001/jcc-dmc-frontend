import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { confirmPayment } from '@/services/offeringService'
import { formatAmount } from '@/utils'

type Status = 'loading' | 'success' | 'error'

export default function Success() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amountStr = searchParams.get('amount')
  const amountNum = Number(amountStr)
  const isValid = !!(paymentKey && orderId && amountStr)

  const customerName = sessionStorage.getItem('jcc_customer_name') ?? ''
  const returnUrl = sessionStorage.getItem('jcc_return_url')
  const isPopup = !!(window.opener && !window.opener.closed)

  const goBack = () => {
    sessionStorage.removeItem('jcc_return_url')
    if (returnUrl) window.location.href = returnUrl
    else navigate('/')
  }

  const [status, setStatus] = useState<Status>(isValid ? 'loading' : 'error')
  const called = useRef(false)

  useEffect(() => {
    if (!isValid || called.current) return
    called.current = true

    confirmPayment(paymentKey!, orderId!, amountNum)
      .then(() => {
        sessionStorage.removeItem('jcc_customer_name')
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [isValid, paymentKey, orderId, amountNum])

  if (status === 'loading') {
    return (
      <div className="text-center py-5">
        <p>처리중...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div>
        <h3 className="mb-4">결제 오류</h3>
        <p>결제 처리 중 오류가 발생했습니다.</p>
        <div className="btn-group mt-5">
          {isPopup
            ? <button className="btn" onClick={() => window.close()}>닫기</button>
            : <button className="btn" onClick={goBack}>{returnUrl ? '돌아가기' : '다시 시도'}</button>
          }
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-4">결제 완료</h3>
      <br />
      {amountNum > 0 && <p>총 결제금액 : {formatAmount(amountNum)}</p>}
      <br />
      <br />
      <p>
        {customerName && `${customerName} `}성도님
        <br />
        헌금이 정상적으로 처리되었습니다.
        <br />
        이 소중한 헌금이
        <br />
        지구촌을 복음화 하는데
        <br />
        귀중히 쓰임받을 것입니다.
        <br />
        반드시 그날에 하나님께 기억되고
        <br />
        당신이 심은것에 100배를 보상하십니다.
      </p>
      <div className="btn-group mt-5">
        {isPopup
          ? <button className="btn" onClick={() => window.close()}>확인</button>
          : <button className="btn" onClick={goBack}>{returnUrl ? '돌아가기' : '다시 헌금하기'}</button>
        }
      </div>
    </div>
  )
}
