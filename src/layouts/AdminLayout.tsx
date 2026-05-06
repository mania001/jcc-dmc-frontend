import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const today = new Date()
const thisYear = today.getFullYear()
const yearOptions = Array.from({ length: thisYear - 2000 }, (_, i) => String(thisYear - i))

const PAY_TYPE_OPTIONS = [
  { value: '', label: '전체' },
  { value: '카드', label: '카드' },
  { value: '휴대폰', label: '휴대폰' },
  { value: '계좌이체', label: '계좌이체' },
  { value: '가상계좌', label: '가상계좌' },
  { value: '간편결제', label: '간편결제' },
  { value: '문화상품권', label: '문화상품권' },
  { value: '도서문화상품권', label: '도서상품권' },
  { value: '게임문화상품권', label: '게임상품권' },
]

function getDefaultYear() {
  const now = new Date()
  return now.getMonth() > 5 ? String(now.getFullYear()) : String(now.getFullYear() - 1)
}

export default function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const year = searchParams.get('year') ?? getDefaultYear()
  const payType = searchParams.get('payType') ?? ''

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      next.set('page', '1')
      return next
    })
  }

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="bg-[#e9ecef] min-h-screen flex flex-col items-center">
      <header className="w-full h-12.5 bg-white border-b border-black/12 fixed z-100 flex items-center justify-between px-5 shadow-[0_3px_5px_-1px_rgba(0,0,0,0.2),0_5px_8px_0_rgba(0,0,0,0.14),0_1px_14px_0_rgba(0,0,0,0.12)]">
        <h1 className="text-lg text-[#333] m-0">JCC 인터넷 헌금 서비스</h1>
        <nav>
          <ul className="flex list-none m-0 p-0 gap-5 items-center">
            <li>
              <select
                value={year}
                onChange={(e) => setParam('year', e.target.value)}
                className="py-1 px-1.5 border border-[#ccc] rounded text-[13px] font-[inherit] w-22.5"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
            </li>
            <li>
              <select
                value={payType}
                onChange={(e) => setParam('payType', e.target.value)}
                className="py-1 px-1.5 border border-[#ccc] rounded text-[13px] font-[inherit]"
              >
                {PAY_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-transparent border-none cursor-pointer text-[#333] text-sm font-[inherit]"
              >
                로그아웃
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="w-285 max-w-full mt-17.5 px-7.5 pt-7.5 pb-12.5 min-h-75 bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.2)]">
        <Outlet />
      </main>
    </div>
  )
}
