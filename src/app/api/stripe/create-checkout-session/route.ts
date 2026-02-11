import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acme' as any,
})

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
    }

    const { taskId, title, amount } = await req.json()

    if (!taskId || !title || !amount) {
      return NextResponse.json({ error: 'taskId, title, amount are required' }, { status: 400 })
    }

    const successUrl = process.env.STRIPE_CHECKOUT_SUCCESS_URL || `${process.env.NEXT_PUBLIC_APP_URL}/#/dashboard`
    const cancelUrl = process.env.STRIPE_CHECKOUT_CANCEL_URL || `${process.env.NEXT_PUBLIC_APP_URL}/#/tasks`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { taskId },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            product_data: { name: `Escrow funding: ${title}` },
            unit_amount: Math.round(Number(amount) * 100),
          },
        },
      ],
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Checkout error' }, { status: 500 })
  }
}
