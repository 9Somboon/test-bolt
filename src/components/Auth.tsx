import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let error = null
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin, // For email confirmation, if enabled
          },
        })
        error = signUpError
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        error = signInError
      }

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Check your email for the login link!')
        if (!isSignUp) {
          setMessage('Signed in successfully!')
        }
      }
    } catch (error: any) {
      setMessage(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-dark-background p-4">
      <div className="w-full max-w-md bg-surface dark:bg-dark-surface p-8 rounded-xl shadow-xl animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          {isSignUp ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
        </h1>
        <p className="text-center text-textSecondary dark:text-dark-textSecondary mb-8">
          {isSignUp ? 'สร้างบัญชีใหม่เพื่อเริ่มต้น' : 'เข้าสู่ระบบเพื่อจัดการ Todo ของคุณ'}
        </p>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text dark:text-dark-text mb-2">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-border dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text dark:text-dark-text mb-2">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-border dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface dark:focus:ring-offset-dark-surface"
            disabled={loading}
          >
            {loading ? 'กำลังดำเนินการ...' : (isSignUp ? 'ลงทะเบียน' : 'เข้าสู่ระบบ')}
          </button>
        </form>

        {message && (
          <p className={`mt-6 text-center text-sm ${message.includes('Check your email') || message.includes('Signed in') ? 'text-success' : 'text-error'}`}>
            {message}
          </p>
        )}

        <p className="mt-8 text-center text-textSecondary dark:text-dark-textSecondary">
          {isSignUp ? 'มีบัญชีอยู่แล้วใช่ไหม? ' : 'ยังไม่มีบัญชี? '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface dark:focus:ring-offset-dark-surface"
          >
            {isSignUp ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Auth
