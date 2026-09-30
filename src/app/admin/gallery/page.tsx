'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { GalleryImage } from '@/types'
import ConfirmModal from '@/components/ui/ConfirmModal'

const emptyForm = { image_url: '', caption: '', category: 'braids' }
const CATEGORIES = ['braids', 'locs', 'twists', 'updos']

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null)
  const [filter, setFilter] = useState('all')

  const fetchImages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })
    setImages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!form.image_url.trim()) {
      setErrorMsg('Image URL is required.')
      return
    }

    setSaving(true)
    const { error } = await supabase.from('gallery_images').insert([
      {
        image_url: form.image_url.trim(),
        caption: form.caption.trim() || null,
        category: form.category,
      },
    ])
    setSaving(false)

    if (error) {
      setErrorMsg('Something went wrong. Please try again.')
      return
    }

    setForm(emptyForm)
    setShowForm(false)
    fetchImages()
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await supabase.from('gallery_images').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    fetchImages()
  }

  const filtered = filter === 'all' ? images : images.filter((img) => img.category === filter)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the images shown on your public gallery.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          {showForm ? 'Close' : '+ Add Image'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-serif text-xl mb-4">New Gallery Image</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="url"
              name="image_url"
              placeholder="Image URL (e.g. from Unsplash or your own hosted image)"
              value={form.image_url}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />

            {form.image_url && (
              <div className="w-40 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                />
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="caption"
                placeholder="Caption (optional)"
                value={form.caption}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

            <button
              type="submit"
              disabled={saving}
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              {saving ? 'Adding...' : 'Add to Gallery'}
            </button>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === cat
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-gray-500 text-sm py-10 text-center">Loading gallery...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500 text-sm">No images in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <div key={img.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group relative">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={img.image_url} alt={img.caption ?? ''} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 truncate">{img.caption || 'No caption'}</p>
                <span className="inline-block mt-1 text-[10px] uppercase tracking-wide bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full capitalize">
                  {img.category}
                </span>
              </div>
              <button
                onClick={() => setDeleteTarget(img)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-600 text-xs px-2.5 py-1.5 rounded-full shadow transition-colors opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Image"
        message="Are you sure you want to remove this image from the gallery?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}