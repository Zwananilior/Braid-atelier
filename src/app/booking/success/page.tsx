'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import PageHero from '@/components/ui/PageHero'

function SuccessContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8">
        <h2 className="font-serif text-2xl mb-2">Payment Received! 🎉</h2>
        <p className="text-gray-600 text-sm mb-2">
          Your deposit has been received and your booking is on its way to being confirmed.
        </p>
        {bookingId && (
          <p className="text-xs text-gray-400 mb-6">Reference: {bookingId.slice(0, 8)}</p>
        )}
        <Link
          href="/account"
          className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
        >
          View My Appointments
        </Link>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <>
      <PageHero eyebrow="Booking" title="All Set" />
      <Suspense fallback={<p className="text-center py-16 text-gray-500">Loading...</p>}>
        <SuccessContent />
      </Suspense>
    </>
  )
}
