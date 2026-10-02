import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'

const FALLBACK_IMAGE = '/images/IMG_3081.jpeg'

export default async function ServicesGrid() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .limit(6)

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-rose-600 text-xs font-semibold uppercase tracking-widest mb-2">
            Our Services
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">Styled for Every Mood</h2>
        </div>
        <Link href="/services" className="text-rose-600 text-sm font-medium hover:underline">
          View All Services →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {services?.map((service: Service, i: number) => (
          <div
            key={service.id}
            className={`animate-fade-in-up rounded-xl overflow-hidden bg-rose-50 hover:shadow-lg transition-shadow duration-300 group`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="aspect-square bg-rose-200 overflow-hidden">
              <img
                src={FALLBACK_IMAGE}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm">{service.name}</h3>
              <p className="text-rose-600 text-sm">From R{service.price_from}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
