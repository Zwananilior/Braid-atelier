import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Hardcoded on purpose — Resend only allows this address until a domain is verified.
// No env var needed for this, so there's nothing to misconfigure.
const FROM = 'The Braid Atelier <onboarding@resend.dev>'

// All notifications go to the owner for now, since Resend's free tier
// won't deliver to any other address until a domain is verified.
const OWNER_EMAIL = 'zwananiluyanda@gmail.com'

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

export interface ContactMessageData {
  name: string
  email: string
  subject?: string | null
  message: string
}

const esc = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const formatTime = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

const layout = (title: string, body: string) => `
  <div style="font-family: Arial, sans-serif; background:#fdf2f6; padding:24px;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:16px; padding:32px;">
      <h1 style="font-family: Georgia, serif; color:#3b0d1c; font-size:24px; margin:0 0 4px;">The Braid Atelier</h1>
      <p style="color:#9ca3af; font-size:12px; margin:0 0 24px;">Braids · Locs · Styles</p>
      <h2 style="color:#111827; font-size:20px; margin:0 0 16px;">${title}</h2>
      ${body}
      <hr style="border:none; border-top:1px solid #fbe6ee; margin:24px 0;" />
      <p style="color:#9ca3af; font-size:12px; margin:0;">Sent from your site at ${SITE_URL}</p>
    </div>
  </div>
`

const bookingDetailsBlock = (d: BookingEmailData) => `
  <table style="width:100%; background:#fdf2f6; border-radius:12px; padding:16px; font-size:14px; color:#374151;">
    <tr><td style="padding:4px 0; color:#6b7280;">Client</td><td style="text-align:right;"><strong>${esc(d.client_name)}</strong></td></tr>
    <tr><td style="padding:4px 0; color:#6b7280;">Client Email</td><td style="text-align:right;"><strong>${esc(d.email)}</strong></td></tr>
    <tr><td style="padding:4px 0; color:#6b7280;">Service</td><td style="text-align:right;"><strong>${esc(d.service_name)}</strong></td></tr>
    <tr><td style="padding:4px 0; color:#6b7280;">Date</td><td style="text-align:right;"><strong>${esc(d.preferred_date)}</strong></td></tr>
    <tr><td style="padding:4px 0; color:#6b7280;">Time</td><td style="text-align:right;"><strong>${formatTime(d.preferred_time)}</strong></td></tr>
    ${d.price_from ? `<tr><td style="padding:4px 0; color:#6b7280;">Price from</td><td style="text-align:right;"><strong>R${d.price_from}</strong></td></tr>` : ''}
    ${d.notes ? `<tr><td style="padding:4px 0; color:#6b7280;">Notes</td><td style="text-align:right;">${esc(d.notes)}</td></tr>` : ''}
  </table>
`

// Booking received — notifies the owner that a new booking came in
export async function sendBookingReceivedEmail(d: BookingEmailData) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `New booking: ${d.client_name} — ${d.service_name}`,
    html: layout(
      'New Booking Received 📅',
      `<p style="color:#374151; font-size:14px;">A new booking just came in.</p>
       ${bookingDetailsBlock(d)}`
    ),
  })

  if (error) console.error('Booking-received email failed:', error)
  return { error }
}

// Status change (confirmed / cancelled / completed) — notifies the owner
export async function sendBookingStatusEmail(
  d: BookingEmailData,
  status: 'confirmed' | 'cancelled' | 'completed'
) {
  const titles: Record<typeof status, string> = {
    confirmed: 'Booking Confirmed ✅',
    cancelled: 'Booking Cancelled ❌',
    completed: 'Booking Marked Complete 💛',
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `${titles[status]}: ${d.client_name} — ${d.service_name}`,
    html: layout(
      titles[status],
      `<p style="color:#374151; font-size:14px;">You marked this booking as <strong>${status}</strong>.</p>
       ${bookingDetailsBlock(d)}`
    ),
  })

  if (error) console.error('Booking-status email failed:', error)
  return { error }
}

// Contact form — notifies the owner when someone submits the Contact page form
export async function sendContactMessageEmail(d: ContactMessageData) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `New contact message: ${d.subject || 'No subject'} (from ${d.name})`,
    html: layout(
      'New Contact Message 📩',
      `<table style="width:100%; background:#fdf2f6; border-radius:12px; padding:16px; font-size:14px; color:#374151; margin-bottom:16px;">
         <tr><td style="padding:4px 0; color:#6b7280;">Name</td><td style="text-align:right;"><strong>${esc(d.name)}</strong></td></tr>
         <tr><td style="padding:4px 0; color:#6b7280;">Email</td><td style="text-align:right;"><strong>${esc(d.email)}</strong></td></tr>
         ${d.subject ? `<tr><td style="padding:4px 0; color:#6b7280;">Subject</td><td style="text-align:right;"><strong>${esc(d.subject)}</strong></td></tr>` : ''}
       </table>
       <p style="color:#374151; font-size:14px; white-space:pre-wrap;">${esc(d.message)}</p>`
    ),
  })

  if (error) console.error('Contact-message email failed:', error)
  return { error }
}
