'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface BookingRow {
  id: string
  client_name: string
  email: string
  phone: string | null
  preferred_date: string
  preferred_time: string
  notes: string | null
  status: string
  payment_status: string
  created_at: string
  services: { name: string; price_from: number; duration_minutes: number } | null
}

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const fetchBookings = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('bookings')
      .select(
        'id, client_name, email, phone, preferred_date, preferred_time, notes, status, payment_status, created_at, services(name, price_from, duration_minutes)'
      )
      .order('preferred_date', { ascending: false })
      .order('preferred_time', { ascending: false })

    setBookings((data as unknown as BookingRow[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    setActionError('')

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      setActionError('Your session has expired. Please log out and log back in.')
      setUpdatingId(null)
      return
    }

    try {
      const res = await fetch('/api/bookings/confirm/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ bookingId: id, status }),
      })

      let result: any = {}
      try {
        result = await res.json()
      } catch {
        // response wasn't JSON (e.g. the function crashed or isn't deployed)
        setActionError(
          `Server did not respond correctly (status ${res.status}). The API route may not be deployed.`
        )
        setUpdatingId(null)
        return
      }

      if (!res.ok) {
        setActionError(result.error || `Request failed (status ${res.status}).`)
        setUpdatingId(null)
        return
      }

      // Only update local state once the server actually confirms success
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))

      if (!result.emailSent) {
        setActionError('Status updated, but the email to the client could not be sent.')
      }
    } catch (err) {
      setActionError('Network error — could not reach the server.')
    }

    setUpdatingId(null)
  }

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  const statusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatDuration = (mins?: number) => {
    if (!mins) return ''
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
  <div>
    <h1 className="font-serif text-3xl text-gray-900">Bookings</h1>
    <p className="text-gray-500 text-sm mt-1">View and manage all client appointments.</p>
  </div>
  <button
    onClick={fetchBookings}
    className="text-sm border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-full transition-colors"
  >
    ↻ Refresh
  </button>
</div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {actionError}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status} {status !== 'all' && `(${bookings.filter((b) => b.status === status).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm py-10 text-center">Loading bookings...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500 text-sm">No bookings found for this filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Date & Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 last:border-b-0 align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium">{b.client_name}</p>
                      <p className="text-xs text-gray-500">{b.email}</p>
                      {b.phone && <p className="text-xs text-gray-500">{b.phone}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p>{b.services?.name || 'Service'}</p>
                      <p className="text-xs text-gray-500">
                        R{b.services?.price_from} · {formatDuration(b.services?.duration_minutes)}
                      </p>
                      {b.notes && (
                        <p className="text-xs text-gray-400 mt-1 max-w-[200px] truncate" title={b.notes}>
                          Note: {b.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p>{b.preferred_date}</p>
                      <p className="text-xs text-gray-500">{b.preferred_time}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full ${statusStyle(b.status)}`}>
                        {b.status}
                      </span>
                      <span
                        className={`block mt-1 text-[10px] uppercase tracking-wide px-2 py-1 rounded-full w-fit ${
                          b.payment_status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {b.payment_status === 'paid' ? 'Deposit Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(b.id, 'confirmed')}
                            disabled={updatingId === b.id}
                            className="text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-full transition-colors"
                          >
                            {updatingId === b.id ? '...' : 'Confirm'}
                          </button>
                        )}
                        {(b.status === 'pending' || b.status === 'confirmed') && (
                          <button
                            onClick={() => updateStatus(b.id, 'cancelled')}
                            disabled={updatingId === b.id}
                            className="text-xs bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 px-3 py-1.5 rounded-full transition-colors"
                          >
                            {updatingId === b.id ? '...' : 'Cancel'}
                          </button>
                        )}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(b.id, 'completed')}
                            disabled={updatingId === b.id}
                            className="text-xs bg-blue-100 hover:bg-blue-200 disabled:opacity-50 text-blue-700 px-3 py-1.5 rounded-full transition-colors"
                          >
                            {updatingId === b.id ? '...' : 'Mark Done'}
                          </button>
                        )}
                        {(b.status === 'completed' || b.status === 'cancelled') && (
                          <span className="text-xs text-gray-400">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
