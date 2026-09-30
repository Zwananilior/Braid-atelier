'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/messages', label: 'Messages' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
    }
  }, [loading, user, isAdmin, router])

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-gray-500 text-sm">Checking access...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex-shrink-0 hidden md:block">
        <div className="p-6">
          <h2 className="font-serif text-xl text-white">The Braid Atelier</h2>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>
        <nav className="px-3 space-y-1">
          {adminLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? 'bg-rose-600 text-white' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 mt-6">
          <Link
            href="/"
            className="block px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}