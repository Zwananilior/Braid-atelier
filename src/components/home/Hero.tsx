import Link from 'next/link'

const trustBadges = [
  {
    label: 'Professional Stylists',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: 'Premium Products',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: 'Flexible Booking',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: 'Safe & Clean Environment',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
]

export default function Hero() {
  return (
    <section className="bg-rose-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-fade-in-up">
          <p className="uppercase tracking-widest text-xs text-gray-500 mb-3">
            Beautiful Braids. Bold Confidence
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-gray-900 mb-2">The braid Atelier</h1>

          <p className="font-serif italic text-3xl text-rose-500 mb-6">
            More Than Just Hair
          </p>

          <p className="text-gray-600 max-w-md mb-8">
            We specialise in braids, locs and stylish hair solution designed to bring
            out your unique beauty. From classic looks to trendy styles, we've got you covered.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/booking" className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors">
              Book an appointment
            </Link>

            <Link href="/services" className="border border-gray-300 hover:border-rose-400 px-6 py-3 rounded-full text-sm font-medium transition-colors">
              Explore Our styles
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => (
              <div
                key={badge.label}
                className="animate-fade-in-up flex flex-col items-start gap-2"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="text-rose-500">{badge.icon}</span>
                <span className="text-xs text-gray-600 leading-tight">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in-up animate-delay-2 aspect-[4/5] rounded bg-rose-200 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1709672262859-68cb9b39ae4f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Braided hairstyle"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
