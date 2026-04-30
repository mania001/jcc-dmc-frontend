import { Outlet } from 'react-router-dom'

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <Outlet />
      </main>
      <footer className="py-4 text-center text-xs text-gray-400">
        © JCC 헌금 시스템
      </footer>
    </div>
  )
}
