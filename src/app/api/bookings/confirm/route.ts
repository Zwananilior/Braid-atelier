import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { sendBookingReceivedEmail } from '@/lib/email'

export async function POST(request: Request) {
  const { bookingId } = await request.json().catch(() => ({}))

  if (!bookingId || typeof bookingId !== 'string') {
    return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
  }

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select(
      'id, client_name, email, preferred_date, preferred_time, notes, confirmation_sent, created_at, services(name, price_from)'
    )
    .eq('id', bookingId)
    .maybeSingle()

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Only allow this for brand-new bookings, so the route can't be abused later
  const ageMs = Date.now() - new Date(booking.created_at).getTime()
  if (ageMs > 10 * 60 * 1000) {
    return NextResponse.json({ error: 'Booking too old' }, { status: 400 })
  }

  if (booking.confirmation_sent) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  // Claim the send first so a double-click can't send two emails
  const { data: claimed } = await supabaseAdmin
    .from('bookings')
    .update({ confirmation_sent: true })
    .eq('id', bookingId)
    .eq('confirmation_sent', false)
    .select('id')

  if (!claimed || claimed.length === 0) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const service: any = Array.isArray(booking.services) ? booking.services[0] : booking.services

  const { error } = await sendBookingReceivedEmail({
    client_name: booking.client_name,
    email: booking.email,
    service_name: service?.name || 'Your service',
    price_from: service?.price_from,
    preferred_date: booking.preferred_date,
    preferred_time: booking.preferred_time,
    notes: booking.notes,
  })

  if (error) {
    // Undo the claim so it can be retried
    await supabaseAdmin.from('bookings').update({ confirmation_sent: false }).eq('id', bookingId)
    console.error('Email failed:', error)
    return NextResponse.json({ error: 'Email failed to send' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
