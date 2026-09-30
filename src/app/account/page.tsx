'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'
import PageHero from '@/components/ui/PageHero'
import ConfirmModal from '@/components/ui/ConfirmModal'
import Toast from '@/components/ui/Toast'

interface AppointmentRow {
  id: string
  preferred_date: string
  preferred_time: string
  status: string
  services: { name: string } | null
}

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' })
  const [profileStatus, setProfileStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' })
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [passwordError, setPasswordError] = useState('')

  const [appointments, setAppointments] = useState<AppointmentRow[]>([])

  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/account')
    }
  }, [loading, user, router])

  // Pre-fill profile form
  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: (user.user_metadata?.full_name as string) || '',
        phone: (user.user_metadata?.phone as string) || '',
      })
    }
  }, [user])

  // Fetch this user's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return
      const { data } = await supabase
        .from('bookings')
        .select('id, preferred_date, preferred_time, status, services(name)')
        .eq('user_id', user.id)
        .order('preferred_date', { ascending: false })

      setAppointments((data as unknown as AppointmentRow[]) || [])
    }
    fetchAppointments()
  }, [user])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileStatus('loading')

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profileForm.full_name,
        phone: profileForm.phone,
      },
    })

    setProfileStatus(error ? 'error' : 'success')
    if (!error) {
      setTimeout(() => setProfileStatus('idle'), 2500)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordStatus('loading')
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword })

    if (error) {
      setPasswordStatus('error')
      setPasswordError(error.message)
    } else {
      setPasswordStatus('success')
      setPasswordForm({ newPassword: '', confirmPassword: '' })
      setTimeout(() => setPasswordStatus('idle'), 2500)
    }
  }

  const handleLogoutConfirmed = async () => {
    setLogoutModalOpen(false)
    await signOut()
    setToastMessage('You have logged out.')
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      router.push('/')
    }, 1500)
  }

  if (loading || !user) {
    return <p className="text-center py-24 text-gray-500">Loading your account...</p>
  }

  return (
    <>
      <PageHero eyebrow="Account" title="My Account" description="Manage your profile, password and appointments." />

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        {/* Profile */}
        <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8">
          <h2 className="font-serif text-2xl mb-6">Profile Details</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={profileForm.full_name}
              onChange={handleProfileChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={profileForm.phone}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
            />
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-4 py-3 text-sm cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={profileStatus === 'loading'}
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
            >
              {profileStatus === 'loading' ? 'Saving...' : 'Save Changes'}
            </button>

            {profileStatus === 'success' && <p className="text-green-600 text-sm">Profile updated!</p>}
            {profileStatus === 'error' && <p className="text-red-600 text-sm">Something went wrong. Try again.</p>}
          </form>
        </div>

        {/* Password */}
        <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8">
          <h2 className="font-serif text-2xl mb-6">Update Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password (min 6 characters)"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
            />

            {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
            {passwordStatus === 'success' && <p className="text-green-600 text-sm">Password updated!</p>}

            <button
              type="submit"
              disabled={passwordStatus === 'loading'}
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
            >
              {passwordStatus === 'loading' ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Appointments */}
        <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8">
          <h2 className="font-serif text-2xl mb-6">My Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-sm">You have no appointments yet.</p>
          ) : (
            <ul className="space-y-3">
              {appointments.map((appt) => (
                <li key={appt.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{appt.services?.name || 'Service'}</p>
                    <p className="text-xs text-gray-500">
                      {appt.preferred_date} · {appt.preferred_time}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wide text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                    {appt.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Logout */}
        <div className="animate-fade-in-up text-center">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="text-rose-600 font-medium text-sm hover:underline"
          >
            Log Out
          </button>
        </div>
      </section>

      <ConfirmModal
        open={logoutModalOpen}
        title="Log Out?"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Yes, Log Out"
        cancelLabel="Stay Logged In"
        onConfirm={handleLogoutConfirmed}
        onCancel={() => setLogoutModalOpen(false)}
      />

      <Toast message={toastMessage} show={showToast} />
    </>
  )
}