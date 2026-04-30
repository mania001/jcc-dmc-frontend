import { useSearchParams, useNavigate } from 'react-router-dom'

export default function Fail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const message = searchParams.get('message') ?? '결제가 취소되었습니다.'
  const code = searchParams.get('code')

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-red-600 text-xl">✕</span>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">결제 실패</h2>
      <p className="text-sm text-gray-500 mb-1">{message}</p>
      {code && <p className="text-xs text-gray-400 mb-6">오류 코드: {code}</p>}
      <button
        onClick={() => navigate('/')}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        다시 시도
      </button>
    </div>
  )
}
