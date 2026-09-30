import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'

export default function BookingCancelledPage() {
  return (
    <>
      <PageHero eyebrow="Booking" title="Payment Cancelled" />
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="animate-fade-in-up bg-rose-50 rounded-2xl p-8">
          <p className="text-gray-600 text-sm mb-6">
            Your payment was not completed, so this booking hasn't been secured. You can try again below.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
          >
            Try Booking Again
          </Link>
        </div>
      </div>
    </>
  )
}
