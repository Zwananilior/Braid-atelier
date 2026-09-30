import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'The Braid Atelier <onboarding@resend.dev>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'


export interface BookingEmailData {
client_name: string
email: string
service_name: string
preferred_date: string
preferred_time: string
price_from?: number
notes?: string | null 
}

//Stops client-type text 
const esc = (value: string) =>
value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
	
	const formatTime = (time: string) =>{
		const [h, m] = time.split(':').map(number)
		const period = h >= 12 ? 'PM' : 'AM'
		const hour12 = h % 12 === 0 ? 12 : h % 12
		return "${hour12}: ${string(m).padStart(2, '0') ${period}}"
		
		
	}
	
	const layout = (title: string, body: string) => `
  <div style="font-family: Arial, sans-serif; background:#fdf2f6; padding:24px;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:16px; padding:32px;">
      <h1 style="font-family: Georgia, serif; color:#3b0d1c; font-size:24px; margin:0 0 4px;">The Braid Atelier</h1>
      <p style="color:#9ca3af; font-size:12px; margin:0 0 24px;">Braids · Locs · Styles</p>
      <h2 style="color:#111827; font-size:20px; margin:0 0 16px;">${title}</h2>
      ${body}
      <hr style="border:none; border-top:1px solid #fbe6ee; margin:24px 0;" />
      <p style="color:#9ca3af; font-size:12px; margin:0;">Questions? Reply to this email or visit ${SITE_URL}/contact</p>
    </div>
  </div>
`

const detailsBlock = (d: BookingEmailData) =>`
  <table style="width:100%; background:#fdf2f6; border-radius:12px; padding:16px; font-size:14px; color:#374151;">
    <tr><td style="padding:4px 0; color:#6b7280;">Service</td><td style="text-align:right;"><strong>${esc(d.service_name)}</strong></td></tr>
    <tr><td style="padding:4px 0; color:#6b7280;">Date</td><td style="text-align:right;"><strong>${esc(d.preferred_date)}</strong></td></tr>
    <tr><td style="padding:4px 0; color:#6b7280;">Time</td><td style="text-align:right;"><strong>${formatTime(d.preferred_time)}</strong></td></tr>
    ${d.price_from ? `<tr><td style="padding:4px 0; color:#6b7280;">Price from</td><td style="text-align:right;"><strong>R${d.price_from}</strong></td></tr>` : ''}
    ${d.notes ? `<tr><td style="padding:4px 0; color:#6b7280;">Your notes</td><td style="text-align:right;">${esc(d.notes)}</td></tr>` : ''}
  </table>
`

export async function sendBookingReceivedEmail(d: BookingEmailData){
	return resend.emails.send({
		from: FROM,
		to: d.email,
		subject: 'we received your booking request',
		 html: layout(
      'Booking received',
      `<p style="color:#374151; font-size:14px;">Hi ${esc(d.client_name)}, thank you for booking with us! We've received your request and will confirm it shortly.</p>
       ${detailsBlock(d)}`
    ),
	})
}
export async function sendBookingStatusEmail(
d: BookingEmailData,
status: 'confirm' | 'cancelled' | 'complete'
){
	if(status === 'confirm'){
		return resend.emails({
			from: FROM
			to: d.email,
			subject: 'Your appointment is confirmed'
			html: layout(
                'Your appointment is confirmed ',
               `<p style="color:#374151; font-size:14px;">Hi ${esc(d.client_name)}, your appointment is confirmed. We look forward to seeing you!</p>
                ${detailsBlock(d)}`
				),
		})
	}
	
	if(status === 'cancelled'){
		return resend.emails.send({
			from: FROM,
			to: d.email,
			subject: 'Your appointment was cancelled'
			html: layout(
        'Appointment cancelled',
        `<p style="color:#374151; font-size:14px;">Hi ${esc(d.client_name)}, unfortunately your appointment has been cancelled. You're welcome to book another time.</p>
         ${detailsBlock(d)}
         <p style="margin-top:20px;"><a href="${SITE_URL}/booking" style="background:#c2255c; color:#fff; padding:10px 20px; border-radius:999px; text-decoration:none; font-size:14px;">Book Again</a></p>`
		 ),
	 })
	}
	
	return resnd.emails.send({
		from: FROM,
		to: d.email,
		subject: 'Thank you for trusting us'
		html(
		'Thank you for visiting!',
      `<p style="color:#374151; font-size:14px;">Hi ${esc(d.client_name)}, thank you for trusting us with your hair. We'd love to hear how it went.</p>
       <p style="margin-top:20px;"><a href="${SITE_URL}/reviews" style="background:#c2255c; color:#fff; padding:10px 20px; border-radius:999px; text-decoration:none; font-size:14px;">Leave a Review</a></p>`
		),
	})
	
}