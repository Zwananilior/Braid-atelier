import { supabase } from '@/lib/supabase'
import { Testimonial } from '@/types'

export default async function Testimonials() {
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
	.eq('status', 'approved')
    .limit(3)

  return (
    <section className="bg-[#faf7f5] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-rose-600 text-xs font-semibold uppercase tracking-widest mb-2">
              What Our Clients Say
            </p>
            <h2 className="font-serif text-3xl mb-10">Loved by Our Community</h2>
          </div>
          <a href="/reviews" className="hidden items-center gap-2 text-sm font-medium text-rose-500 transition-colors hover:text-rose-700 md:flex">
            Read More reviews
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials?.map((t: Testimonial, i: number) => (
            <article
              key={t.id}
              className="animate-fade-in-up rounded-2xl border border-[#eadfe1] bg-white p-5 shadow-[0_4px_20px_rgba(33,29,31,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(33,29,31,0.08)]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100 text-sm font-medium text-rose-600">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.client_name} className="h-full w-full object-cover" />
                  ) : (
                    t.client_name.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm leading-6 text-gray-600">"{t.message}"</p>
                  <p className="mt-4 text-sm font-semibold text-[#211d1f]">{t.client_name}</p>
                  <div className="mt-1 flex gap-0.5 text-rose-500">{'★'.repeat(t.rating)}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <a href="/reviews" className="inline-flex items-center gap-2 text-sm font-medium text-rose-500">
            Read More →
          </a>
        </div>

      </div>
    </section>
  )
}