'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'
import { useAuth } from '@/lib/AuthContext'
import { useAppointments } from '@/lib/AppointmentsContext'
import ConfirmModal from '@/components/ui/ConfirmModal'
import Toast from '@/components/ui/Toast'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
]

type DropdownKey = 'search' | 'user' | 'appointments' | null

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, isAdmin, signOut } = useAuth()
  const { appointments, loading: appointmentsLoading } = useAppointments()

  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [allServices, setAllServices] = useState<Service[]>([])

  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const clusterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*')
      setAllServices(data || [])
    }
    fetchServices()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (clusterRef.current && !clusterRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown((prev) => (prev === key ? null : key))
    if (key !== 'search') setSearchQuery('')
  }

  const filteredServices =
    searchQuery.trim().length > 0
      ? allServices.filter((s) =>
          s.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
      : []

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (filteredServices.length > 0) {
      router.push(`/services`)
      setOpenDropdown(null)
      setSearchQuery('')
    }
  }

  const handleBookNowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    setOpenDropdown(null)
    if (user) {
      router.push('/booking')
    } else {
      router.push('/login?redirect=/booking')
    }
  }

  const handleLogoutClick = async () => {
    setOpenDropdown(null)
    setMenuOpen(false)
    setLogoutModalOpen(true)
  }

  const handleLogoutConfirmed = async () => {
    setLogoutModalOpen(false)
    await signOut()
    setToastMessage('You have logged out.')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
    router.push('/')
  }

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || 'Account'

  const getInitials = () => {
    const name = (user?.user_metadata?.full_name as string) || ''
    if (!name.trim()) return null
    const parts = name.trim().split(/\s+/)
    const initials =
      parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)
    return initials.toUpperCase()
  }
  const initials = getInitials()

  return (
    <header className="sticky top-0 z-50 bg-rose-50/90 backdrop-blur border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-serif text-2xl text-rose-900 whitespace-nowrap">
          The Braid Atelier
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 transition-colors duration-200 ${
                  active ? 'text-rose-600' : 'text-gray-700 hover:text-rose-500'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-0.5 bg-rose-500 transition-all duration-300 ${
                    active ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        {/* Right-side icon cluster + Book Now (desktop) */}
        <div ref={clusterRef} className="hidden md:flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('search')}
              aria-label="Search"
              className="text-gray-700 hover:text-rose-600 transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <div
              className={`absolute right-0 top-full mt-3 transition-all duration-300 origin-top-right ${
                openDropdown === 'search'
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search styles..."
                  autoFocus={openDropdown === 'search'}
                  className="w-64 border border-rose-200 rounded-full px-4 py-2 text-sm bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </form>

              {searchQuery.trim().length > 0 && (
                <div className="mt-2 w-64 bg-white rounded-xl shadow-md border border-rose-100 overflow-hidden max-h-64 overflow-y-auto">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((s) => (
                      <Link
                        key={s.id}
                        href={`/services`}
                        onClick={() => {
                          setOpenDropdown(null)
                          setSearchQuery('')
                        }}
                        className="flex justify-between items-center px-4 py-3 text-sm hover:bg-rose-50 transition-colors border-b border-rose-50 last:border-b-0"
                      >
                        <span>{s.name}</span>
                        <span className="text-rose-600 text-xs">From R{s.price_from}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray-500">No matching styles found.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User account */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('user')}
              aria-label="Account"
              className="text-gray-700 hover:text-rose-600 transition-colors duration-200"
            >
              {initials ? (
                <span className="w-8 h-8 rounded-full bg-rose-600 text-white text-xs font-semibold flex items-center justify-center">
                  {initials}
                </span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>

            <div
              className={`absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-md border border-rose-100 overflow-hidden transition-all duration-200 origin-top-right ${
                openDropdown === 'user'
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              {loading ? (
                <p className="px-4 py-3 text-sm text-gray-500">Loading...</p>
              ) : user ? (
                <>
                  <div className="px-4 py-3 border-b border-rose-50">
                    <p className="text-sm font-medium truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 transition-colors"
                  >
                    My Account
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-3 text-sm text-rose-600 font-medium hover:bg-rose-50 transition-colors border-t border-rose-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-rose-50"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-rose-50 transition-colors border-t border-rose-50"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Appointments (cart-style) */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('appointments')}
              aria-label="My Appointments"
              className="relative text-gray-700 hover:text-rose-600 transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {appointments.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                  {appointments.length}
                </span>
              )}
            </button>

            <div
              className={`absolute right-0 top-full mt-3 w-72 bg-white rounded-xl shadow-md border border-rose-100 overflow-hidden transition-all duration-200 origin-top-right ${
                openDropdown === 'appointments'
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="px-4 py-3 border-b border-rose-50">
                <p className="text-sm font-medium">My Appointments</p>
              </div>

              {appointmentsLoading ? (
                <p className="px-4 py-6 text-sm text-gray-500 text-center">Loading...</p>
              ) : appointments.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500 text-center">No upcoming appointments.</p>
              ) : (
                <ul>
                  {appointments.map((appt) => (
                    <li key={appt.id} className="px-4 py-3 border-b border-rose-50 last:border-b-0">
                      <p className="text-sm font-medium">{appt.service_name}</p>
                      <p className="text-xs text-gray-500">
                        {appt.preferred_date} · {appt.preferred_time}
                      </p>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wide text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        {appt.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href="/booking"
                onClick={() => setOpenDropdown(null)}
                className="block text-center text-sm font-medium text-rose-600 hover:bg-rose-50 px-4 py-3 transition-colors"
              >
                Book Another Style →
              </Link>
            </div>
          </div>

          <button
            onClick={handleBookNowClick}
            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200"
          >
            Book Now
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => {
            setMenuOpen(!menuOpen)
            setOpenDropdown(null)
          }}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-[32rem]' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col gap-4 px-6 pb-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${
                pathname === link.href ? 'text-rose-600' : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 border-t border-rose-100">
            {user ? (
              <>
                <Link href="/account" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">
                  My Account
                </Link>

                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-rose-600 font-medium">
                    Admin Dashboard
                  </Link>
                )}

                <button onClick={handleLogoutClick} className="text-sm text-rose-600">
                  Log Out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700">
                Log In
              </Link>
            )}
            <Link href="/booking" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 relative">
              My Appointments
              {appointments.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center bg-rose-600 text-white text-[10px] rounded-full w-4 h-4">
                  {appointments.length}
                </span>
              )}
            </Link>
          </div>

          <button
            onClick={handleBookNowClick}
            className="bg-rose-600 text-white px-5 py-2.5 rounded-full text-sm font-medium text-center"
          >
            Book Now
          </button>
        </nav>
      </div>

      <ConfirmModal
        open={logoutModalOpen}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Yes"
        cancelLabel="No"
        onConfirm={handleLogoutConfirmed}
        onCancel={() => setLogoutModalOpen(false)}
      />

      <Toast message={toastMessage} show={showToast} />
    </header>
  )
}