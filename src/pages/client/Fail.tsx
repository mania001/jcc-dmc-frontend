import { useSearchParams } from 'react-router-dom'

export default function Fail() {
  const [searchParams] = useSearchParams()
  const message = searchParams.get('message') ?? '결제가 취소되었습니다.'
  const code = searchParams.get('code')

  return (
    <div>
      <h3 className="mb-4">결재 실패</h3>
      <p>{message}</p>
      {code && <p className="mt-2 text-[0.85em] text-[#999]">오류 코드: {code}</p>}
      <div className="btn-group mt-5">
        <button className="btn" onClick={() => (window.location.href = '/')}>
          다시 시도
        </button>
      </div>
    </div>
  )
}
