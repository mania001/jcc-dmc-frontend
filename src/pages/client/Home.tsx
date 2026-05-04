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
  tithe: string
  thanks: string
  building: string
  mission: string
  relief: string
}

const ssnCheck = (ssn1: string, ssn2: string) => {
  const ssn = `${ssn1}${ssn2}`
  if (ssn.length !== 13 || !/^\d{13}$/.test(ssn)) return false
  let checkSum = 0
  for (let i = 0; i < 12; i++) checkSum += parseInt(ssn[i]) * ((i % 8) + 2)
  return (11 - (checkSum % 11)) % 10 === parseInt(ssn[12])
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: { pay_type: 'card', tithe: '', thanks: '', building: '', mission: '', relief: '' },
  })

  const calcTotal = () => {
    const { tithe, thanks, building, mission, relief } = getValues()
    return [tithe, thanks, building, mission, relief].reduce((sum, v) => sum + (parseInt(v) || 0), 0)
  }

  const handleAmountBlur = () => {
    setValue('tithe', getValues('tithe'))
    const total = calcTotal()
    setValue('relief', getValues('relief'))
    return total
  }

  const onSubmit = async (data: FormData) => {
    const total = calcTotal()

    if (!ssnCheck(data.jumin1, data.jumin2)) {
      alert('주민번호를 정확히 입력해주세요.')
      return
    }

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
        tithe: parseInt(data.tithe) || 0,
        thanks: parseInt(data.thanks) || 0,
        building: parseInt(data.building) || 0,
        mission: parseInt(data.mission) || 0,
        relief: parseInt(data.relief) || 0,
        order_id,
      }
      await createOffering(body)

      const tossPayments = await loadTossPayments(CLIENT_KEY)
      const paymentParams = {
        amount: total,
        orderId: order_id,
        orderName: '예수중심교회 인터넷헌금',
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
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      // 사용자가 직접 취소한 경우 알림 없이 처리
      if (code === 'PAY_PROCESS_CANCELED' || code === 'PAYMENT_WINDOW_IS_NOT_OPENED') {
        setLoading(false)
        return
      }
      console.error(err)
      alert('결제 요청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 성명 */}
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
      <div className="form-flex">
        <div className="form-group required">
          <label>주민번호(연말정산용)</label>
          <input
            type="text"
            maxLength={6}
            {...register('jumin1', {
              required: '주민번호를 입력해주세요.',
              pattern: { value: /^\d{6}$/, message: '숫자 6자리를 입력하세요' },
            })}
          />
          {(errors.jumin1 || errors.jumin2) && (
            <p className="error-message">{errors.jumin1?.message || errors.jumin2?.message}</p>
          )}
        </div>
        <div className="divider">-</div>
        <div className="form-group mt-[0.56em]">
          <label>&nbsp;</label>
          <input
            type="password"
            maxLength={7}
            {...register('jumin2', {
              required: '주민번호를 입력해주세요.',
              pattern: { value: /^\d{7}$/, message: '숫자 7자리를 입력하세요' },
            })}
          />
        </div>
      </div>

      {/* 이메일 */}
      <div className="form-group">
        <label>이메일</label>
        <input
          type="text"
          {...register('email', {
            pattern: { value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, message: '이메일을 정확히 입력해주세요.' },
          })}
          placeholder="선택사항입니다."
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}
      </div>

      {/* 헌금 항목 1행 */}
      <div className="form-flex">
        {(['tithe', 'thanks', 'building'] as const).map((key, i) => (
          <div className="form-group" key={key}>
            <label>{['십일조', '감사헌금', '건축헌금'][i]}</label>
            <input
              type="number"
              min={0}
              step={1}
              {...register(key, { min: 0 })}
              onBlur={handleAmountBlur}
              className="text-right"
            />
          </div>
        ))}
      </div>

      {/* 헌금 항목 2행 + 총계 */}
      <div className="form-flex">
        {(['mission', 'relief'] as const).map((key, i) => (
          <div className="form-group" key={key}>
            <label>{['선교헌금', '153구제헌금'][i]}</label>
            <input
              type="number"
              min={0}
              step={1}
              {...register(key, { min: 0 })}
              onBlur={handleAmountBlur}
              className="text-right"
            />
          </div>
        ))}
        <div className="form-group required">
          <label>총계</label>
          <input
            type="number"
            value={calcTotal()}
            readOnly
            className="text-right"
          />
        </div>
      </div>

      <div className="btn-group mt-2.5">
        <button type="submit" className="btn" disabled={loading}>
          {loading ? '전송중...' : '결재하기'}
        </button>
      </div>
    </form>
  )
}
