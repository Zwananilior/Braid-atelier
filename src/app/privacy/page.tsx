import PageHero from '@/components/ui/PageHero'

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How we collect, use, and protect your personal information."
      />

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-8 text-gray-700 text-sm leading-relaxed">
        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">1. Information We Collect</h2>
          <p>
            When you create an account or book an appointment, we collect your name, email
            address, phone number, and any notes you provide about your preferred style. When you
            pay a deposit, payment is processed securely by Stripe — we do not store your card
            details.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">2. How We Use Your Information</h2>
          <p>
            We use your information to manage your bookings, send appointment confirmations and
            updates, and respond to messages sent through our contact form. We do not sell your
            personal information to third parties.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">3. Email Communications</h2>
          <p>
            We'll send you emails related to your bookings, such as confirmations and status
            updates. These are transactional in nature and tied directly to your use of our
            services.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">4. Data Storage</h2>
          <p>
            Your account and booking information is stored securely using Supabase, with access
            restricted to authorized staff only.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">5. Your Rights</h2>
          <p>
            You can update your profile information at any time from your account page. If you'd
            like your account and associated data deleted, please contact us directly.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">6. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be posted on
            this page.
          </p>
        </div>

        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          Last updated: October 2026
        </p>
      </section>
    </>
  )
}
