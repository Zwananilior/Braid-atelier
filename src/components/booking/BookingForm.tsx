'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'
import { useAuth } from '@/lib/AuthContext'

const OPEN_HOUR = 9
const CLOSE_HOUR = 18
const CLOSED_DAYS = [0, 1] 
const SLOT_INTERVAL_MINUTES = 30 

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}
const minutesToTime = (mins: number) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}
const formatSlotLabel = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`
}

const generateStartSlots = () => {
  const slots: string[] = []
  for (let mins = OPEN_HOUR * 60; mins < CLOSE_HOUR * 60; mins += SLOT_INTERVAL_MINUTES) {
    slots.push(minutesToTime(mins))
  }
  return slots
}
const ALL_START_SLOTS = generateStartSlots()

interface ExistingBooking {
  preferred_time: string
  services: { duration_minutes: number } | null
}

export default function BookingForm() {
  const searchParams = useSearchParams()
  const preselected = searchParams.get('service') || ''
  const { user } = useAuth()

  const [services, setServices] = useState<Service[]>([])
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([])
  const [checkingSlots, setCheckingSlots] = useState(false)
  const [dateError, setDateError] = useState('')

  const [form, setForm] = useState({
    client_name: '',
    email: '',
    phone: '',
    service_id: preselected,
    preferred_date: '',
    preferred_time: '',
    notes: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').order('name')
      setServices(data || [])
    }
    fetchServices()
  }, [])

  useEffect(() => {
    if (preselected) {
      setForm((prev) => ({ ...prev, service_id: preselected }))
    }
  }, [preselected])

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        client_name: (user.user_metadata?.full_name as string) || prev.client_name,
        email: user.email || prev.email,
        phone: (user.user_metadata?.phone as string) || prev.phone,
      }))
    }
  }, [user])

  // Fetch existing bookings (with their service durations) 
  useEffect(() => {
    const checkAvailability = async () => {
      if (!form.preferred_date) {
        setExistingBookings([])
        setDateError('')
        return
      }

      const dayOfWeek = new Date(form.preferred_date + 'T00:00:00').getDay()
      if (CLOSED_DAYS.includes(dayOfWeek)) {
        setDateError('We are closed on Sundays and Mondays. Please pick another date.')
        setExistingBookings([])
        return
      }
      setDateError('')

      setCheckingSlots(true)
      const { data } = await supabase
        .from('bookings')
        .select('preferred_time, services(duration_minutes)')
        .eq('preferred_date', form.preferred_date)
        .neq('status', 'cancelled')

      setExistingBookings((data as unknown as ExistingBooking[]) || [])
      setCheckingSlots(false)
      setForm((prev) => ({ ...prev, preferred_time: '' }))
    }
    checkAvailability()
  }, [form.preferred_date])

  const selectedService = services.find((s) => s.id === form.service_id)
  const selectedDuration = selectedService?.duration_minutes || 60

    const isSlotAvailable = (startTime: string) => {
    const newStart = timeToMinutes(startTime)
    const newEnd = newStart + selectedDuration

    if (newEnd > CLOSE_HOUR * 60) return false // would run past closing

    return !existingBookings.some((booking) => {
      const existingStart = timeToMinutes(booking.preferred_time)
      const existingDuration = booking.services?.duration_minutes || 60
      const existingEnd = existingStart + existingDuration
      return newStart < existingEnd && newEnd > existingStart // overlap check
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (dateError) return
    if (!isSlotAvailable(form.preferred_time)) {
      setErrorMsg('That time no longer works with this service\'s duration. Please choose another.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    const bookingId = crypto.randomUUID()

    const { error } = await supabase.from('bookings').insert([
      {
        id: bookingId,
        ...form,
        user_id: user?.id || null,
      },
    ])

    if (error) {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
      return
    }

    const res = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    })

    const result = await res.json()

    if (!res.ok || !result.url) {
      setErrorMsg('Could not start payment. Please try again.')
      setStatus('error')
      return
    }

    window.location.href = result.url
  }

  if (status === 'success') {
    return (
      <div className="animate-fade-in-up text-center bg-rose-50 rounded-2xl p-10">
        <h3 className="font-serif text-2xl mb-2">Booking Received! </h3>
        <p className="text-gray-600">
          Thank you — we've received your request and will confirm shortly via email or phone.
        </p>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="client_name"
          placeholder="Full Name"
          value={form.client_name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
        />
      </div>

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
      />

      <select
        name="service_id"
        value={form.service_id}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow bg-white"
      >
        <option value="">Select a Service</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — From R{s.price_from} ({s.duration_minutes >= 60
              ? `${Math.floor(s.duration_minutes / 60)}h${s.duration_minutes % 60 ? ` ${s.duration_minutes % 60}m` : ''}`
              : `${s.duration_minutes}m`})
          </option>
        ))}
      </select>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <input
            type="date"
            name="preferred_date"
            value={form.preferred_date}
            onChange={handleChange}
            min={today}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
          />
          {dateError && <p className="text-red-600 text-xs mt-1">{dateError}</p>}
        </div>

        <select
          name="preferred_time"
          value={form.preferred_time}
          onChange={handleChange}
          required
          disabled={!form.preferred_date || !form.service_id || !!dateError || checkingSlots}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {!form.service_id
              ? 'Pick a service first'
              : !form.preferred_date
              ? 'Pick a date first'
              : checkingSlots
              ? 'Checking availability...'
              : 'Select a Time'}
          </option>
          {ALL_START_SLOTS.map((slot) => {
            const available = isSlotAvailable(slot)
            return (
              <option key={slot} value={slot} disabled={!available}>
                {formatSlotLabel(slot)} {!available ? '— Unavailable' : ''}
              </option>
            )
          })}
        </select>
      </div>

      {form.service_id && (
        <p className="text-xs text-gray-500">
          This style takes approximately{' '}
          {selectedDuration >= 60
            ? `${Math.floor(selectedDuration / 60)}h${selectedDuration % 60 ? ` ${selectedDuration % 60}m` : ''}`
            : `${selectedDuration}m`}
          . We'll hold this window for your appointment.
        </p>
      )}

      <textarea
        name="notes"
        placeholder="Any notes for your stylist? (hair length, references, etc.)"
        value={form.notes}
        onChange={handleChange}
        rows={4}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
      />

      <button
        type="submit"
        disabled={status === 'loading' || !!dateError}
        className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
      >
        {status === 'loading' ? 'Redirecting to payment...' : 'Confirm Booking & Pay Deposit'}
      </button>

      {status === 'error' && <p className="text-red-600 text-sm">{errorMsg}</p>}
    </form>
  )
}