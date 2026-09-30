'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ContactMessage } from '@/types'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('unread')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null)

  const fetchMessages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const toggleExpand = async (msg: ContactMessage) => {
    const opening = expandedId !== msg.id
    setExpandedId(opening ? msg.id : null)

    // Mark as read the moment it's opened
    if (opening && !msg.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', msg.id)
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)))
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await supabase.from('contact_messages').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    fetchMessages()
  }

  const filtered = filter === 'unread' ? messages.filter((m) => !m.is_read) : messages
  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">Messages submitted through your Contact page.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-rose-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-rose-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          All ({messages.length})
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm py-10 text-center">Loading messages...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-500 text-sm">
            {filter === 'unread' ? "You're all caught up — no unread messages." : 'No messages yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {filtered.map((msg) => {
            const expanded = expandedId === msg.id
            return (
              <div key={msg.id}>
                <button
                  onClick={() => toggleExpand(msg)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" aria-label="Unread" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!msg.is_read ? 'font-semibold' : 'font-medium'}`}>
                        {msg.name}
                        {msg.subject && <span className="text-gray-400 font-normal"> — {msg.subject}</span>}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>
                      ▾
                    </span>
                  </div>
                </button>

                {expanded && (
                  <div className="px-5 pb-5 -mt-1">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      
                        href={"mailto:${msg.email}${msg.subject ? `?subject=Re: ${encodeURIComponent(msg.subject)}` : ''}"}
                        className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-full transition-colors"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => setDeleteTarget(msg)}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-full transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Message"
        message="Are you sure you want to delete this message? This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
