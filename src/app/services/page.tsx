import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'
import PageHero from '@/components/ui/PageHero'

export default async function ServicesPage() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('category', { ascending: true })

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Styled for Every Mood"
        description="From everyday elegance to special occasions, explore our full range of braiding, loc and styling services."
      />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service: Service, i: number) => (
            <div
              key={service.id}
              className="animate-fade-in-up bg-rose-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={
                    service.image_url ||
                    'https://images.unsplash.com/photo-1595163609897-06db2b5e0e1b?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl">{service.name}</h3>
                  <span className="text-rose-600 font-medium text-sm whitespace-nowrap">
                    From R{service.price_from}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {service.description || 'A signature style tailored to you.'}
                </p>
                <Link
                  href={`/booking?service=${service.id}`}
                  className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Book This Style →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}