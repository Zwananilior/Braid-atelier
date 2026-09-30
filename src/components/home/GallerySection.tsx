import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { GalleryImage } from '@/types'

export default async function GallerySection() {
  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .limit(4)

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
          {images?.map((img: GalleryImage, i: number) => (
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