import { NextResponse } from 'next/link'
import { headers } from '@/next/headers'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { sendBookingReceivedEmail } from '@/lib/email'
import Stripe from 'stripe'

export async function POST(request: Request){
    const body = await request.text.text()
    const signature =(await headers()).get('stripe-signature')
	 
	 if(!signature){
	    return NextResponse.json({ error: 'Missing signature'},{ status: 400})
	 }
	 
	 let event: Stripe.Event
	 
	 try{
		 event = stripe.webhooks.constructEvent(
		 body,
		 signature,
		 process.env.STRPE_WEBHOOK_SECRET!
		 )
	    }catch(err){
			console.error('webhook signature verification failed:', err)
			return NextResponse.json({ error: 'Invalid signature' }, { status: 400})
		}
		if( event.type == 'checkout.session.completed'){
			const session = event.data.object as Stripe.Checkout.Session 
			const booikingId = session.metadata?.bookingId
			
			if(bookingId){
				const { data: booking } = await supabaseAdmin
				.from('bookings')
				.update({payment_status: 'paid', payment_ref: session.payment_intent as string})
				.eq('id',bookingId)
				.select(
				'client_name, email, preferred_data, preferred_time, notes, confirmation_sent, services(name, price_from)')
				.maybeSingle()
				
				if(booking && !booking.confirmation_sent){
					const service: any = Array.isArray(booking.services) ? booking.services[0]:  booking.services
					const { error } =await sendBookingReceivedEmail({
						client_name: booking.client_name,
						email: booking.email,
						service_name: service?.name || 'Your service',
						price_from: service?.price_from,
						preferred_date: booking.preferred_data,
						preferred_time: booking.preferred_time,
						notes: booking.notes
						
					})
					if(error){
						await supabaseAdmin
						.from('bookings')
						.update({confirmation_sent: true})
						.eq('id', bookingId)
					}
				}
			}
		}
	 return NextResponse.json({ received: true })
		
}