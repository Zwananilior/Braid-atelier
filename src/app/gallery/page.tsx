import { supabase } from '@/lib/supabase'
import { GalleryImage } from '@/types'
import PageHero from '@/components/ui/PageHero'
import GalleryGrid from '@/components/gallery/GalleryGrid'

export default async function GalleryPage() {
  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHero
        eyebrow="Our Gallery"
        title="Real Styles. Real People."
        description="Browse our latest work and get inspired for your next look."
      />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <GalleryGrid images={(images as GalleryImage[]) || []} />
      </section>
    </>
  )
}