'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'
import { useAppointments } from '@/lib/AppointmentsContext'

export default function ReviewForm() {
  const { user } = useAuth()
  const { appointments, refresh } = useAppointments()

  const [selectedBooking, setSelectedBooking] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (appointments.length > 0 && !selectedBooking) {
      setSelectedBooking(appointments[0].id)
    }
  }, [appointments, selectedBooking])

  // Only show this form to logged-in users who actually have an appointment to review
  if (!user || appointments.length === 0) return null

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

    // This is the trigger: marking the booking "completed" clears it from the cart badge everywhere
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'completed' })
      .eq('id', selectedBooking)

    if (bookingError) {
      setStatus('error')
      return
    }

    setStatus('success')
    setMessage('')
    setRating(5)
    refresh()
  }

  if (status === 'success') {
    return (
      <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8 text-center">
        <h3 className="font-serif text-2xl mb-2">Thank You! 💛</h3>
        <p className="text-gray-600 text-sm">
          Your review has been submitted and your appointment marked as complete.
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
          {appointments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.service_name} — {a.preferred_date}
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