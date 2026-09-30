import Stripe from 'Stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY!,{
'apiVersion: 2025-08-2027.basil'
})