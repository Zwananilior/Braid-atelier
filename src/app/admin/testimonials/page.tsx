'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Testimonial } from '@/types'
import ConfirmModal from '@/components/ui/ConfirmModal'

const STATUS_FILTERS = ['all', 'pending', 'approved']

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editMessage, setEditMessage] = useState('')
  const [editRating, setEditRating] = useState(5)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)

  const fetchTestimonials = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    setTestimonials(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    const { error } = await supabase.from('testimonials').update({ status }).eq('id', id)
    if (!error) {
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    }
    setUpdatingId(null)
  }

  const startEdit = (t: Testimonial) => {
    setEditingId(t.id)
    setEditMessage(t.message)
    setEditRating(t.rating)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditMessage('')
    setEditRating(5)
  }

  const saveEdit = async (id: string) => {
    setSaving(true)
    const { error } = await supabase
      .from('testimonials')
      .update({ message: editMessage, rating: editRating })
      .eq('id', id)
    setSaving(false)
    if (!error) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, message: editMessage, rating: editRating } : t))
      )
      cancelEdit()
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await supabase.from('testimonials').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    fetchTestimonials()
  }

  const filtered = filter === 'all' ? testimonials : testimonials.filter((t) => t.status === filter)
  const pendingCount = testimonials.filter((t) => t.status === 'pending').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-gray-900">Testimonials</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review and manage client testimonials before they go live.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status}
            {status === 'pending' && pendingCount > 0 && ` (${pendingCount})`}
            {status === 'approved' && ` (${testimonials.filter((t) => t.status === 'approved').length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm py-10 text-center">Loading testimonials...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500 text-sm">No testimonials found for this filter.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-sm">{t.client_name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full ${
                    t.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {t.status}
                </span>
              </div>

              {editingId === t.id ? (
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setEditRating(n)}
                        className={`text-xl ${n <= editRating ? 'text-rose-500' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(t.id)}
                      disabled={saving}
                      className="text-xs bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-full transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-xs border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-rose-500 text-sm mb-2">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</p>
                  <p className="text-sm text-gray-600 mb-4">"{t.message}"</p>

                  <div className="flex flex-wrap gap-2">
                    {t.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(t.id, 'approved')}
                        disabled={updatingId === t.id}
                        className="text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-full transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {t.status === 'approved' && (
                      <button
                        onClick={() => updateStatus(t.id, 'pending')}
                        disabled={updatingId === t.id}
                        className="text-xs bg-yellow-100 hover:bg-yellow-200 disabled:opacity-50 text-yellow-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        Unpublish
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(t)}
                      className="text-xs border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(t)}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}