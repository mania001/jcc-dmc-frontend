import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { login } from '@/services/authService'
import type { LoginBody } from '@/types'

export default function Login() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginBody>()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const isExpired = searchParams.get('expired') === '1'

  const onSubmit = async (data: LoginBody) => {
    if (loading) return
    setLoading(true)
    try {
      const token = await login(data)
      signIn(token)
      navigate('/admin')
    } catch {
      setError('userId', { type: 'manual', message: '아이디와 비밀번호를 정확히 입력해 주세요.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#e9ecef] min-h-screen flex items-center justify-center">
      <div className="w-100 bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.2)]">
        <div className="text-center px-8 pt-12 pb-6 border-b border-[#e9ecef]">
          <h4 className="text-[36px] text-[#343a40] m-0">LOGIN</h4>
        </div>
        <div className="px-8 pt-6.25 pb-12">
          {isExpired && (
            <p className="mb-4 text-sm text-center text-[#cf000f]">세션이 만료되었습니다. 다시 로그인해 주세요.</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-5">
              <label>아이디</label>
              <input
                type="text"
                {...register('userId', { required: '아이디를 입력해주세요.' })}
                placeholder="아이디를 입력해주세요."
              />
              {errors.userId && <p className="error-message">{errors.userId.message}</p>}
            </div>
            <div className="form-group mb-5">
              <label>비밀번호</label>
              <input
                type="password"
                {...register('password', { required: '비밀번호를 입력해주세요.' })}
                placeholder="비밀번호를 입력해주세요."
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
            <div className="btn-group mt-5">
              <button type="submit" className="btn w-full" disabled={loading}>
                {loading ? '전송중...' : '로그인'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
