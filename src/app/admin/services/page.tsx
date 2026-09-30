'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Service } from '@/types'
import ConfirmModal from '@/components/ui/ConfirmModal'

const emptyForm = {
  name: '',
  description: '',
  price_from: '',
  duration_minutes: '60',
  category: 'braids',
  image_url: '',
}

const CATEGORIES = ['braids', 'locs', 'twists', 'updos']

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)

  const fetchServices = async () => {
    setLoading(true)
    const { data } = await supabase.from('services').select('*').order('name')
    setServices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrorMsg('')
    setShowForm(true)
  }

  const openEditForm = (service: Service) => {
    setEditingId(service.id)
    setForm({
      name: service.name,
      description: service.description || '',
      price_from: String(service.price_from),
      duration_minutes: String(service.duration_minutes),
      category: service.category || 'braids',
      image_url: service.image_url || '',
    })
    setErrorMsg('')
    setShowForm(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!form.name.trim() || !form.price_from || !form.duration_minutes) {
      setErrorMsg('Name, price, and duration are required.')
      return
    }

    setSaving(true)

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price_from: Number(form.price_from),
      duration_minutes: Number(form.duration_minutes),
      category: form.category,
      image_url: form.image_url.trim() || null,
    }

    const { error } = editingId
      ? await supabase.from('services').update(payload).eq('id', editingId)
      : await supabase.from('services').insert([payload])

    setSaving(false)

    if (error) {
      setErrorMsg('Something went wrong. Please try again.')
      return
    }

    setShowForm(false)
    setForm(emptyForm)
    setEditingId(null)
    fetchServices()
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await supabase.from('services').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    fetchServices()
  }

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Services</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the styles clients can book.</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          + Add Service
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-serif text-xl mb-4">{editingId ? 'Edit Service' : 'New Service'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Service Name"
                value={form.name}
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

            <textarea
              name="description"
              placeholder="Short description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Price From (R)</label>
                <input
                  type="number"
                  name="price_from"
                  min="0"
                  value={form.price_from}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration_minutes"
                  min="15"
                  step="15"
                  value={form.duration_minutes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            <input
              type="url"
              name="image_url"
              placeholder="Image URL (optional)"
              value={form.image_url}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />

            {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Service'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="border border-gray-300 hover:bg-gray-50 px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services list */}
      {loading ? (
        <p className="text-gray-500 text-sm py-10 text-center">Loading services...</p>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500 text-sm">No services yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {s.image_url && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-serif text-lg">{s.name}</h3>
                  <span className="text-[10px] uppercase tracking-wide bg-rose-50 text-rose-600 px-2 py-1 rounded-full capitalize">
                    {s.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  R{s.price_from} · {formatDuration(s.duration_minutes)}
                </p>
                {s.description && (
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{s.description}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(s)}
                    className="flex-1 text-xs border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-full transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="flex-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-full transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}