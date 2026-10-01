'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PageHero from '@/components/ui/PageHero'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      router.push(redirectTo)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8">
        <h2 className="font-serif text-2xl text-center mb-6">Welcome Back</h2>

        <SocialAuthButtons redirectTo={redirectTo} />

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-rose-200" />
          <span className="text-xs text-gray-500 uppercase">or</span>
          <div className="flex-1 h-px bg-rose-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
          />

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-rose-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-sm">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
          >
            {status === 'loading' ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-rose-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <>
      <PageHero eyebrow="Account" title="Log In" description="Access your bookings and profile." />
      <Suspense fallback={<p className="text-center py-16 text-gray-500">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </>
  )
}
