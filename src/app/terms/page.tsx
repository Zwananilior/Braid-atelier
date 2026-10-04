import PageHero from '@/components/ui/PageHero'

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Please read these terms carefully before booking an appointment with us."
      />

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-8 text-gray-700 text-sm leading-relaxed">
        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">1. Bookings & Deposits</h2>
          <p>
            A non-refundable deposit is required to secure your appointment. Your booking is only
            confirmed once payment has been received and the appointment has been approved by our
            team.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">2. Cancellations & Rescheduling</h2>
          <p>
            If you need to cancel or reschedule, please contact us as soon as possible. Deposits
            are non-refundable but may be transferred to a new appointment date at our discretion,
            provided reasonable notice is given.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">3. Late Arrivals</h2>
          <p>
            Please arrive on time for your appointment. Arrivals more than 15 minutes late may
            result in a shortened service or the need to reschedule, depending on availability.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">4. Service Accuracy</h2>
          <p>
            Prices listed on our site are starting prices and may vary depending on hair length,
            density, and style complexity. Final pricing will be confirmed in person before your
            service begins.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">5. Client Conduct</h2>
          <p>
            We reserve the right to refuse service to anyone behaving in a disrespectful or unsafe
            manner towards our staff or other clients.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">6. Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of our booking services
            after changes are posted constitutes acceptance of the updated terms.
          </p>
        </div>

        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          Last updated: October 2026
        </p>
      </section>
    </>
  )
}
