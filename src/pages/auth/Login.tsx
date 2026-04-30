import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/authContext'
import { login } from '@/services/authService'
import type { LoginBody } from '@/types'

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginBody>()
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginBody) => {
    try {
      const token = await login(data)
      signIn(token)
      navigate('/admin')
    } catch (err: any) {
      const status = err.response?.status
      if (status === 400 || status === 401) {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.')
      } else {
        alert('로그인 중 오류가 발생했습니다.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">관리자 로그인</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input
              type="text"
              {...register('userId', { required: '아이디를 입력하세요' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="아이디"
            />
            {errors.userId && <p className="mt-1 text-xs text-red-500">{errors.userId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              {...register('password', { required: '비밀번호를 입력하세요' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비밀번호"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
