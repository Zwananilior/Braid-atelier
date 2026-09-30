'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PageHero from '@/components/ui/PageHero'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons'

function RegisterForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          phone: form.phone,
        },
        // Sends the user back to the homepage once they click the confirmation link
        emailRedirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
      return
    }

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8 text-center">
          <h2 className="font-serif text-2xl mb-2">Check Your Email 📩</h2>
          <p className="text-gray-600 text-sm">
            We've sent a confirmation link to <strong>{form.email}</strong>. Click it to
            activate your account — you'll be taken straight to the homepage, logged in.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8">
        <h2 className="font-serif text-2xl text-center mb-6">Create Your Account</h2>

        <SocialAuthButtons redirectTo={redirectTo} />

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-rose-200" />
          <span className="text-xs text-gray-500 uppercase">or</span>
          <div className="flex-1 h-px bg-rose-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
          />
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
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
          />

          {status === 'error' && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
          >
            {status === 'loading' ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-rose-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Create Account"
        description="Sign up to book faster and track your appointments."
      />
      <Suspense fallback={<p className="text-center py-16 text-gray-500">Loading...</p>}>
        <RegisterForm />
      </Suspense>
    </>
  )
}