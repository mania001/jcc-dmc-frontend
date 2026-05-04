import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk'
import type { TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk'
import { toast } from 'sonner'
import { createOffering } from '@/services/offeringService'
import { generateOrderId, formatAmount } from '@/utils'
import type { CreateOfferingBody } from '@/types'

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY

type FormData = {
  name: string
  jumin1: string
  jumin2: string
  email: string
  tithe: string
  thanks: string
  building: string
  mission: string
  relief: string
}

interface OrderInfo {
  id: string
  name: string
  email?: string
  amount: number
}

const ssnCheck = (ssn1: string, ssn2: string) => {
  const ssn = `${ssn1}${ssn2}`
  if (ssn.length !== 13 || !/^\d{13}$/.test(ssn)) return false
  let checkSum = 0
  for (let i = 0; i < 12; i++) checkSum += parseInt(ssn[i]) * ((i % 8) + 2)
  return (11 - (checkSum % 11)) % 10 === parseInt(ssn[12])
}

type Step = 'form' | 'payment'

export default function Home() {
  const [step, setStep] = useState<Step>('form')
  const [submitting, setSubmitting] = useState(false)
  const [paying, setPaying] = useState(false)
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null)
  const jumin2Ref = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { tithe: '', thanks: '', building: '', mission: '', relief: '' },
  })

  const watched = useWatch({ control, name: ['tithe', 'thanks', 'building', 'mission', 'relief'] })
  const total = watched.reduce((sum, v) => sum + (parseInt(v ?? '') || 0), 0)

  const jumin1Reg = register('jumin1', {
    required: '주민번호를 입력해주세요.',
    pattern: { value: /^\d{6}$/, message: '숫자 6자리를 입력하세요' },
  })
  const { ref: jumin2RegRef, ...jumin2Rest } = register('jumin2', {
    required: '주민번호를 입력해주세요.',
    pattern: { value: /^\d{7}$/, message: '숫자 7자리를 입력하세요' },
  })

  // Toss 위젯 초기화 (결제 단계 진입 시)
  useEffect(() => {
    if (step !== 'payment' || !orderInfo) return
    if (!CLIENT_KEY) {
      console.error('[Toss] VITE_TOSS_CLIENT_KEY 환경변수가 설정되지 않았습니다.')
      toast.error('결제 키가 설정되지 않았습니다.')
      setStep('form')
      return
    }
    let mounted = true

    const initWidgets = async () => {
      try {
        const tossPayments = await loadTossPayments(CLIENT_KEY)
        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS }) as TossPaymentsWidgets
        if (!mounted) return
        widgetsRef.current = widgets

        await widgets.setAmount({ currency: 'KRW', value: orderInfo.amount })
        await Promise.all([
          widgets.renderPaymentMethods({ selector: '#payment-method' }),
          widgets.renderAgreement({ selector: '#agreement' }),
        ])
      } catch (err) {
        console.error('[Toss Widget 초기화 오류]', err)
        if (mounted) {
          const msg = (err as { message?: string })?.message ?? ''
          toast.error(`결제 모듈 오류: ${msg || '알 수 없는 오류'}`)
          setStep('form')
        }
      }
    }

    initWidgets()
    return () => {
      mounted = false
      widgetsRef.current = null
    }
  }, [step, orderInfo])

  const onFormSubmit = async (data: FormData) => {
    if (!ssnCheck(data.jumin1, data.jumin2)) {
      toast.error('주민번호를 정확히 입력해주세요.')
      return
    }
    if (total <= 0) {
      toast.error('헌금 금액을 1원 이상 입력해 주세요.')
      return
    }

    setSubmitting(true)
    try {
      const id = generateOrderId()
      const body: CreateOfferingBody = {
        name: data.name,
        jumin1: data.jumin1,
        jumin2: data.jumin2,
        email: data.email || undefined,
        tithe: parseInt(data.tithe) || 0,
        thanks: parseInt(data.thanks) || 0,
        building: parseInt(data.building) || 0,
        mission: parseInt(data.mission) || 0,
        relief: parseInt(data.relief) || 0,
        order_id: id,
      }
      await createOffering(body)

      sessionStorage.setItem('jcc_customer_name', data.name)
      setOrderInfo({ id, name: data.name, email: data.email || undefined, amount: total })
      setStep('payment')
    } catch {
      toast.error('처리 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = async () => {
    if (!widgetsRef.current || !orderInfo) return
    setPaying(true)
    try {
      await widgetsRef.current.requestPayment({
        orderId: orderInfo.id,
        orderName: '예수중심교회 인터넷헌금',
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        customerName: orderInfo.name,
        customerEmail: orderInfo.email,
      })
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      if (code !== 'PAY_PROCESS_CANCELED') {
        toast.error('결제 요청 중 오류가 발생했습니다.')
      }
    } finally {
      setPaying(false)
    }
  }

  // --- 결제 단계 ---
  if (step === 'payment' && orderInfo) {
    return (
      <div className="flex flex-col gap-4">
        {/* 결제 요약 */}
        <div className="border border-[#eee] bg-[#fafafa] rounded p-4 text-sm">
          <p className="font-semibold text-[#333] mb-1">{orderInfo.name} 성도님</p>
          <p className="text-[#cf000f] font-bold text-base">총 결제금액 : {formatAmount(orderInfo.amount)}</p>
        </div>

        {/* Toss 결제수단 위젯 */}
        <div id="payment-method" className="w-full" />

        {/* Toss 약관동의 위젯 */}
        <div id="agreement" className="w-full" />

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            className="btn"
            style={{ background: '#888' }}
            onClick={() => setStep('form')}
            disabled={paying}
          >
            이전
          </button>
          <button className="btn" onClick={handlePayment} disabled={paying}>
            {paying ? '처리중...' : '결제하기'}
          </button>
        </div>
      </div>
    )
  }

  // --- 헌금 정보 입력 단계 ---
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {/* 이름 */}
      <div className="form-group required">
        <label>이름</label>
        <input
          type="text"
          {...register('name', { required: '이름을 입력해주세요.' })}
          placeholder="성과 이름을 빈칸 없이 붙여 쓰세요"
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>

      {/* 주민번호 */}
      <div className="form-group required">
        <label>주민번호(연말정산용)</label>
        <div className="flex items-center gap-1.25">
          <input
            type="text"
            maxLength={6}
            className="flex-1 min-w-0"
            {...jumin1Reg}
            onChange={(e) => {
              jumin1Reg.onChange(e)
              if (e.target.value.length === 6) jumin2Ref.current?.focus()
            }}
          />
          <span className="text-[#666]">-</span>
          <input
            type="password"
            maxLength={7}
            className="flex-1 min-w-0"
            {...jumin2Rest}
            ref={(el) => {
              jumin2RegRef(el)
              jumin2Ref.current = el
            }}
          />
        </div>
        {(errors.jumin1 || errors.jumin2) && (
          <p className="error-message">{errors.jumin1?.message || errors.jumin2?.message}</p>
        )}
      </div>

      {/* 이메일 */}
      <div className="form-group">
        <label>이메일</label>
        <input
          type="text"
          {...register('email', {
            pattern: {
              value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: '이메일을 정확히 입력해주세요.',
            },
          })}
          placeholder="선택사항입니다."
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}
      </div>

      {/* 헌금 항목 (모바일 2열 / 데스크탑 3열) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-1.25">
        {(['tithe', 'thanks', 'building', 'mission', 'relief'] as const).map((key, i) => (
          <div className="form-group" key={key}>
            <label>{['십일조', '감사헌금', '건축헌금', '선교헌금', '153구제헌금'][i]}</label>
            <input type="number" min={0} step={1} {...register(key, { min: 0 })} className="text-right" />
          </div>
        ))}
        <div className="form-group required">
          <label>총계</label>
          <input type="number" value={total} readOnly className="text-right" />
        </div>
      </div>

      <div className="btn-group mt-2.5">
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? '전송중...' : '다음'}
        </button>
      </div>
    </form>
  )
}
