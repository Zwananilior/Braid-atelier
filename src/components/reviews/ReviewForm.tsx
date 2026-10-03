'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'

interface CompletedBooking {
  id: string
  preferred_date: string
  services: { name: string } | null
}

export default function ReviewForm() {
  const { user } = useAuth()

  const [completedBookings, setCompletedBookings] = useState<CompletedBooking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const fetchCompletedUnreviewed = async () => {
    if (!user) {
      setLoadingBookings(false)
      return
    }
    setLoadingBookings(true)
    const { data } = await supabase
      .from('bookings')
      .select('id, preferred_date, services(name)')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .eq('reviewed', false)
      .order('preferred_date', { ascending: false })

    const list = (data as unknown as CompletedBooking[]) || []
    setCompletedBookings(list)
    if (list.length > 0) setSelectedBooking(list[0].id)
    setLoadingBookings(false)
  }

  useEffect(() => {
    fetchCompletedUnreviewed()
  }, [user])

  // Only show this form to logged-in users with a completed appointment awaiting review
  if (!user || loadingBookings) return null
  if (completedBookings.length === 0) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const fullName = (user.user_metadata?.full_name as string) || user.email || 'Client'

    const { error: testimonialError } = await supabase.from('testimonials').insert([
      { client_name: fullName, message, rating, status: 'pending' },
    ])

    if (testimonialError) {
      setStatus('error')
      return
    }

    // Mark this specific booking as reviewed so it doesn't show here again
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ reviewed: true })
      .eq('id', selectedBooking)

    if (bookingError) {
      setStatus('error')
      return
    }

    setStatus('success')
    setMessage('')
    setRating(5)
    fetchCompletedUnreviewed()
  }

  if (status === 'success') {
    return (
      <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8 text-center">
        <h3 className="font-serif text-2xl mb-2">Thank You! 💛</h3>
        <p className="text-gray-600 text-sm">
          Your review has been submitted and is awaiting approval.
        </p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8">
      <h3 className="font-serif text-2xl mb-6">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedBooking}
          onChange={(e) => setSelectedBooking(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white"
        >
          {completedBookings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.services?.name || 'Appointment'} — {b.preferred_date}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              className={`text-2xl transition-colors ${n <= rating ? 'text-rose-500' : 'text-gray-300'}`}
              aria-label={`${n} star`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your experience..."
          required
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        {status === 'error' && <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
