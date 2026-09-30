'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'

const SHOW_APPLE = false

export default function SocialAuthButtons({ redirectTo }: { redirectTo: string }) {
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'apple' | null>(null)

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setLoadingProvider(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`,
      },
    })
    if (error) {
      alert(`${provider} sign-in failed: ${error.message}`)
      setLoadingProvider(null)
    }
    // On success, Supabase redirects the browser away automatically
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => handleOAuth('google')}
        disabled={loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full px-5 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-60 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.47a5.55 5.55 0 0 1-2.4 3.64v3h3.87c2.27-2.09 3.58-5.17 3.58-8.83z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.87-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A11.997 11.997 0 0 0 12 24z" />
          <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.28a12 12 0 0 0 0 10.8l3.99-3.11z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.6l3.99 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
        </svg>
        {loadingProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
      </button>
	  {SHOW_APPLE && (
      <button
        type="button"
        onClick={() => handleOAuth('apple')}
        disabled={loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-full px-5 py-3 text-sm font-medium hover:bg-gray-900 disabled:opacity-60 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M16.365 1.43c0 1.14-.42 2.06-1.26 2.86-.85.8-1.87 1.28-2.87 1.16-.13-1.1.38-2.15 1.2-2.9.83-.76 2.02-1.28 2.93-1.12zM20.5 17.14c-.5 1.16-.74 1.68-1.38 2.7-.9 1.44-2.17 3.24-3.75 3.26-1.4.02-1.76-.92-3.66-.91-1.9.01-2.3.93-3.7.91-1.58-.02-2.78-1.64-3.68-3.08-2.53-4.02-2.8-8.74-1.24-11.25.98-1.58 2.64-2.6 4.52-2.63 1.5-.02 2.9.99 3.66.99.76 0 2.44-1.22 4.1-1.04.7.03 2.67.28 3.94 2.14-.1.06-2.35 1.37-2.33 4.08.03 3.24 2.83 4.32 2.86 4.33z" />
        </svg>
        {loadingProvider === 'apple' ? 'Connecting...' : 'Continue with Apple'}
      </button>
	  )}
    </div>
  )
}