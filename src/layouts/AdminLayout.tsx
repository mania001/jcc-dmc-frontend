import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

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
