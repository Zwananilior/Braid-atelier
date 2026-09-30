import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function AdminDashboard() {
  const today = new Date().toISOString().split('T')[0]

  const [
    { count: todayCount },
    { count: pendingCount },
    { count: totalServices },
    { count: newMessages },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('preferred_date', today),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
  ])

  const { data: todaysBookings } = await supabase
    .from('bookings')
    .select('id, client_name, preferred_time, status, services(name)')
    .eq('preferred_date', today)
    .order('preferred_time', { ascending: true })

  const stats = [
    { label: "Today's Appointments", value: todayCount ?? 0, href: '/admin/bookings' },
    { label: 'Pending Bookings', value: pendingCount ?? 0, href: '/admin/bookings' },
    { label: 'Active Services', value: totalServices ?? 0, href: '/admin/services' },
    { label: 'Contact Messages', value: newMessages ?? 0, href: '/admin/messages' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <p className="text-3xl font-serif text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl">Today's Schedule</h2>
          <Link href="/admin/bookings" className="text-rose-600 text-sm font-medium hover:underline">
            View All →
          </Link>
        </div>

        {!todaysBookings || todaysBookings.length === 0 ? (
          <p className="text-gray-500 text-sm py-6 text-center">No appointments scheduled for today.</p>
        ) : (
          <div className="space-y-2">
            {todaysBookings.map((b: any) => (
              <div
                key={b.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium">{b.client_name}</p>
                  <p className="text-xs text-gray-500">{b.services?.name || 'Service'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{b.preferred_time}</p>
                  <span
                    className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      b.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : b.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}