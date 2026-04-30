import { Outlet } from 'react-router-dom'
import logo from '@/assets/logo.png'

export default function ClientLayout() {
  return (
    <div style={{ background: '#cf000f', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '540px', maxWidth: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* 헤더 */}
        <header style={{ height: '62px', background: '#003063', position: 'relative', flexShrink: 0 }}>
          <h1 style={{ margin: '5px 0 0 5px' }}>
            <img src={logo} alt="Jesus Centered Church" style={{ height: '50px' }} />
          </h1>
        </header>

        {/* 본문 */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#000', textAlign: 'center', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ background: '#cf000f', color: '#fff', width: '100%', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>
              인터넷 신용카드 헌금 서비스
            </h3>
          </div>
          <div style={{ background: '#fff', flex: 1 }}>
            <div style={{ padding: '20px 50px' }}>
              <Outlet />
            </div>
          </div>
        </main>

        {/* 푸터 */}
        <footer style={{ background: '#003063', padding: '5px 10px 10px', textAlign: 'center', flexShrink: 0 }}>
          <nav>
            <ul style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '10px', listStyle: 'none', padding: 0 }}>
              {['[이용전 잠깐!!!]', '[도움말]', '[해외성도]', '[English]'].map((item) => (
                <li key={item} style={{ margin: '0 5px' }}>
                  <a href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '12px' }}>{item}</a>
                </li>
              ))}
            </ul>
          </nav>
          <p style={{ fontSize: '11px', color: '#fff' }}>Copyright ⓒ 2000 Jesus Centered Church All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
