import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { GalleryImage } from '@/types'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1595163609897-06db2b5e0e1b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1618375531912-867984bdfd87?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
]

export default async function GallerySection() {
  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .limit(4)

  // Fill up to 4 slots with fallback images if there aren't enough real ones yet
  const displayImages: { id: string; image_url: string; caption: string | null }[] =
    images && images.length > 0
      ? [
          ...images,
          ...FALLBACK_IMAGES.slice(images.length).map((url, i) => ({
            id: `fallback-${i}`,
            image_url: url,
            caption: 'Styled by The Braid Atelier',
          })),
        ]
      : FALLBACK_IMAGES.map((url, i) => ({
          id: `fallback-${i}`,
          image_url: url,
          caption: 'Styled by The Braid Atelier',
        }))

  return (
    <section className="bg-rose-50 py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 items-center">
        <div>
          <p className="text-rose-600 text-xs font-semibold uppercase tracking-widest mb-2">
            Our Gallery
          </p>
          <h2 className="font-serif text-3xl mb-3">Real Styles. Real People.</h2>
          <p className="text-gray-600 text-sm mb-6">
            Take a look at some of our latest work and get inspired for your next look.
          </p>
          <Link
            href="/gallery"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            View Gallery →
          </Link>
        </div>

        <div className="md:col-span-2 grid grid-cols-4 gap-3">
          {displayImages.map((img, i) => (
            <div
              key={img.id}
              className="animate-fade-in-up aspect-[3/4] rounded-xl overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <img src={img.image_url} alt={img.caption ?? ''} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
