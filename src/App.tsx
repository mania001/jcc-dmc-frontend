import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/authContext'
import PrivateRoute from '@/routers/PrivateRoute'
import ClientLayout from '@/layouts/ClientLayout'
import AdminLayout from '@/layouts/AdminLayout'
import Login from '@/pages/auth/Login'
import Home from '@/pages/client/Home'
import Success from '@/pages/client/Success'
import Fail from '@/pages/client/Fail'
import List from '@/pages/admin/List'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 클라이언트 */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/success" element={<Success />} />
            <Route path="/fail" element={<Fail />} />
          </Route>

          {/* 인증 */}
          <Route path="/login" element={<Login />} />

          {/* 어드민 (보호) */}
          <Route element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<List />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
