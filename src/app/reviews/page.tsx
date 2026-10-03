import { supabase } from '@/lib/supabase'
import { Testimonial } from '@/types'
import PageHero from '@/components/ui/PageHero'
import ReviewForm from '@/components/reviews/ReviewForm'

export const revalidate = 0

export default async function ReviewsPage() {
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const list = (testimonials as Testimonial[]) || []
  const avgRating =
    list.length > 0
      ? (list.reduce((sum, t) => sum + t.rating, 0) / list.length).toFixed(1)
      : '5.0'

  return (
    <>
      <PageHero
        eyebrow="What Our Clients Say"
        title="Loved by Our Community"
        description={`Rated ${avgRating} / 5 by clients who trust us with their hair.`}
      />

      <section className="max-w-2xl mx-auto px-6 pt-16">
        <ReviewForm />
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((t, i) => (
            <div
              key={t.id}
              className="animate-fade-in-up bg-rose-50 rounded-2xl p-6"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <p className="text-rose-500 mb-3">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</p>
              <p className="text-sm text-gray-700 mb-4">"{t.message}"</p>
              <p className="font-medium text-sm">{t.client_name}</p>
            </div>
          ))}
        </div>

        {list.length === 0 && (
          <p className="text-center text-gray-500">No reviews yet — be the first to book and share your experience!</p>
        )}
      </section>
    </>
  )
}
