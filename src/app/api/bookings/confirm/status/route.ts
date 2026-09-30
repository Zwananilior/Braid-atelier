import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { sendBookingStatusEmail } from '@/lib/email'

const ALLOWED = ["confirmed","cancelled", "complete"] as const
type AllowedStatus = (typeof ALLOWED [number])

export async function POST (request: Reqquest){
const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  }

  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token)

  if (!user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  // 2. Are they an admin?
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 3. Validate the request
  const { bookingId, status } = await request.json().catch(() => ({}))

  if (!bookingId || !ALLOWED.includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // 4. Update the booking
  const { data: booking, error: updateError } = await supabaseAdmin
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select(
      'client_name, email, preferred_date, preferred_time, notes, services(name, price_from)'
    )
    .maybeSingle()

  if (updateError || !booking) {
    return NextResponse.json({ error: 'Could not update booking' }, { status: 500 })
  }

  // 5. Email the client. The status change stays saved even if the email fails.
  const service: any = Array.isArray(booking.services) ? booking.services[0] : booking.services

  const { error: emailError } = await sendBookingStatusEmail(
    {
      client_name: booking.client_name,
      email: booking.email,
      service_name: service?.name || 'Your service',
      price_from: service?.price_from,
      preferred_date: booking.preferred_date,
      preferred_time: booking.preferred_time,
      notes: booking.notes,
    },
    status as AllowedStatus
  )

  if (emailError) console.error('Status email failed:', emailError)

  return NextResponse.json({ ok: true, emailSent: !emailError })	
	
	
}