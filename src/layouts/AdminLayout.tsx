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
    <div style={{ background: '#e9ecef', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header style={{
        width: '100%',
        height: '50px',
        background: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        position: 'fixed',
        zIndex: 100,
        boxShadow: '0 3px 5px -1px rgba(0,0,0,0.2), 0 5px 8px 0 rgba(0,0,0,0.14), 0 1px 14px 0 rgba(0,0,0,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        <h1 style={{ fontSize: '18px', color: '#333', margin: 0 }}>JCC 인터넷 헌금 서비스</h1>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '20px', alignItems: 'center' }}>
            <li>
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', fontSize: '14px', fontFamily: 'inherit' }}
              >
                로그아웃
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main style={{
        width: '1140px',
        maxWidth: '100%',
        marginTop: '70px',
        padding: '30px 30px 50px',
        minHeight: '300px',
        background: '#fff',
        boxShadow: '0 0 8px 0 rgba(0,0,0,0.2)',
      }}>
        <Outlet />
      </main>
    </div>
  )
}
