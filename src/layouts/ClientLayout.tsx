import { Outlet } from 'react-router-dom'
import logo from '@/assets/logo.png'

export default function ClientLayout() {
  return (
    <div className="bg-[#cf000f] min-h-screen flex justify-center">
      <div className="w-135 max-w-full flex flex-col min-h-screen">
        <header className="h-15.5 bg-[#003063] relative shrink-0">
          <h1 className="mt-1.25 ml-1.25">
            <img src={logo} alt="Jesus Centered Church" className="h-12.5" />
          </h1>
        </header>

        <main className="flex-1 flex flex-col">
          <div className="bg-black h-15 flex items-center justify-center">
            <h3 className="bg-[#cf000f] text-white w-full h-12 flex items-center justify-center text-sm font-bold">
              인터넷 헌금 서비스
            </h3>
          </div>
          <div className="bg-white flex-1">
            <div className="px-4 py-4 sm:px-12.5 sm:py-5">
              <Outlet />
            </div>
          </div>
        </main>

        <footer className="bg-[#003063] px-2.5 pt-1.25 pb-2.5 text-center shrink-0">
          <nav>
            <ul className="flex flex-row justify-center my-2.5 list-none p-0">
              {['[이용전 잠깐!!!]', '[도움말]', '[해외성도]', '[English]'].map((item) => (
                <li key={item} className="mx-1.25">
                  <a href="/" className="text-white text-[11px]">{item}</a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-[11px] text-white">Copyright ⓒ 2000 Jesus Centered Church All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
