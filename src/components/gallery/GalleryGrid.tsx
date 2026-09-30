'use client'

import { useState } from 'react'
import { GalleryImage } from '@/types'

const categories = ['all', 'braids', 'locs', 'twists', 'updos']

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState('all')

  const filtered =
    active === 'all' ? images : images.filter((img) => img.category === active)

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors duration-200 ${
              active === cat
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-gray-700 hover:bg-rose-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {filtered.map((img, i) => (
          <div
            key={img.id}
            className="animate-fade-in-up break-inside-avoid rounded-xl overflow-hidden"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <img
              src={img.image_url}
              alt={img.caption ?? ''}
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-10">No images in this category yet.</p>
      )}
    </div>
  )
}