import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { login } from '@/services/authService'
import type { LoginBody } from '@/types'

export default function Login() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginBody>()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

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
    <div style={{ background: '#e9ecef', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '400px', background: '#fff', boxShadow: '0 0 8px 0 rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', padding: '48px 32px 24px', borderBottom: '1px solid #e9ecef' }}>
          <h4 style={{ fontSize: '36px', color: '#343a40', margin: 0 }}>LOGIN</h4>
        </div>
        <div style={{ padding: '25px 32px 48px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>아이디</label>
              <input
                type="text"
                {...register('userId', { required: '아이디를 입력해주세요.' })}
                placeholder="아이디를 입력해주세요."
                style={{ width: '100%', padding: '7px', border: '1px solid #ccc', borderRadius: '4px', color: '#666', fontFamily: 'inherit', fontSize: '100%' }}
              />
              {errors.userId && <p className="error-message">{errors.userId.message}</p>}
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>비밀번호</label>
              <input
                type="password"
                {...register('password', { required: '비밀번호를 입력해주세요.' })}
                placeholder="비밀번호를 입력해주세요."
                style={{ width: '100%', padding: '7px', border: '1px solid #ccc', borderRadius: '4px', color: '#666', fontFamily: 'inherit', fontSize: '100%' }}
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
            <div className="btn-group" style={{ marginTop: '20px' }}>
              <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
                {loading ? '전송중...' : '로그인'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
