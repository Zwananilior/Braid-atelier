import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const { bookingId } = await request.json().catch(() => ({}))

  if (!bookingId) {
    return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
  }

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('id, client_name, email, payment_status, services(name)')
    .eq('id', bookingId)
    .maybeSingle()

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (booking.payment_status === 'paid') {
    return NextResponse.json({ error: 'Already paid' }, { status: 400 })
  }

  const service: any = Array.isArray(booking.services) ? booking.services[0] : booking.services
  const amountRand = Number(process.env.DEPOSIT_AMOUNT || 100)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: booking.email,
    line_items: [
      {
        price_data: {
          currency: 'zar',
          unit_amount: Math.round(amountRand * 100), // Stripe uses cents
          product_data: {
            name: `Deposit - ${service?.name || 'Appointment'}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.id,
    },
    success_url: `${siteUrl}/booking/success?bookingId=${booking.id}`,
    cancel_url: `${siteUrl}/booking/cancelled?bookingId=${booking.id}`,
  })

  return NextResponse.json({ url: session.url })
}
