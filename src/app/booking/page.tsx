import { Suspense } from 'react'
import PageHero from '@/components/ui/PageHero'
import BookingForm from '@/components/booking/BookingForm'

export default function BookingPage() {
  return (
    <>
      <PageHero
        eyebrow="Book Your Appointment"
        title="Let's Get You Booked"
        description="Choose your service, pick a date and we'll take care of the rest."
      />

      <section className="max-w-2xl mx-auto px-6 py-16">
        <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
          <BookingForm />
        </Suspense>
      </section>
    </>
  )
}