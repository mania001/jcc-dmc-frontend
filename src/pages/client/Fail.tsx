import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { failPayment } from '@/services/offeringService'

export default function Fail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const orderId = searchParams.get('orderId')
  const paymentKey = searchParams.get('paymentKey')
  const code = searchParams.get('code')
  const message = searchParams.get('message') ?? '결제가 취소되었습니다.'

  const returnUrl = sessionStorage.getItem('jcc_return_url')
  const isPopup = !!(window.opener && !window.opener.closed)
  const called = useRef(false)

  useEffect(() => {
    if (!orderId || called.current) return
    called.current = true
    failPayment({
      orderId,
      paymentKey: paymentKey ?? undefined,
      errorCode: code ?? undefined,
      errorMessage: message,
    }).catch(() => {})
  }, [orderId, paymentKey, code, message])

  const goBack = () => {
    sessionStorage.removeItem('jcc_return_url')
    if (returnUrl) window.location.href = returnUrl
    else navigate('/')
  }

  return (
    <div>
      <h3 className="mb-4">결제 실패</h3>
      <p>{message}</p>
      {code && <p className="mt-2 text-[0.85em] text-[#999]">오류 코드: {code}</p>}
      <div className="btn-group mt-5">
        {isPopup
          ? <button className="btn" onClick={() => window.close()}>닫기</button>
          : <button className="btn" onClick={goBack}>{returnUrl ? '돌아가기' : '다시 시도'}</button>
        }
      </div>
    </div>
  )
}
