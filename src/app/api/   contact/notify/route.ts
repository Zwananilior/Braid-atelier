import { NextResponse } from 'next/server'
import { sendContactMessageEmail } from '@/lib/email'

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json().catch(() => ({}))

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error } = await sendContactMessageEmail({ name, email, subject, message })

  if (error) {
    return NextResponse.json({ error: 'Email failed to send' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
