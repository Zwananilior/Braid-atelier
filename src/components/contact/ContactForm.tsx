'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

       const { error } = await supabase.from('contact_messages').insert([form])

   if (error) {
     setStatus('error')
   } else {
     fetch('/api/contact/notify', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(form),
     }).catch(() => {})

     setStatus('success')
     setForm({ name: '', email: '', subject: '', message: '' })
   }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
        />
      </div>
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        required
        rows={5}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-shadow"
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && (
        <p className="text-green-600 text-sm">Thanks! We'll get back to you shortly.</p>
      )}
      {status === 'error' && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
