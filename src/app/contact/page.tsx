import PageHero from '@/components/ui/PageHero'
import ContactForm from '@/components/contact/ContactForm'

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        description="Have a question or want to plan your next style? Send us a message."
      />

      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div className="animate-fade-in-up">
          <h2 className="font-serif text-2xl mb-6">Visit or Reach Us</h2>
          <ul className="space-y-4 text-gray-700 text-sm">
            <li><strong>Phone:</strong> +27 81 234 5678</li>
            <li><strong>Email:</strong> hello@thebraidatelier.co.za</li>
            <li><strong>Address:</strong> Eshowe, South Africa</li>
            <li><strong>Hours:</strong> Tue – Sat, 9am – 6pm</li>
          </ul>

          <div className="mt-8 aspect-video rounded-xl overflow-hidden bg-rose-100">
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
              alt="Salon location"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl mb-6">Send a Message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  )
}