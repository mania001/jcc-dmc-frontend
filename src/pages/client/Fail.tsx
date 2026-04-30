import { useSearchParams } from 'react-router-dom'

export default function Fail() {
  const [searchParams] = useSearchParams()
  const message = searchParams.get('message') ?? '결제가 취소되었습니다.'
  const code = searchParams.get('code')

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>결재 실패</h3>
      <p>{message}</p>
      {code && <p style={{ marginTop: '8px', fontSize: '0.85em', color: '#999' }}>오류 코드: {code}</p>}
      <div className="btn-group" style={{ marginTop: '20px' }}>
        <button className="btn" onClick={() => window.location.href = '/'}>다시 시도</button>
      </div>
    </div>
  )
}
