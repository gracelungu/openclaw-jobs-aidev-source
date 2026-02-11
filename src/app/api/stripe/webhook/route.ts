import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { jobService } from '@/services/jobService'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acme' as any,
})

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get('stripe-signature')
    const secret = process.env.STRIPE_WEBHOOK_SECRET

    if (!sig || !secret) {
      return NextResponse.json({ error: 'Missing stripe signature or webhook secret' }, { status: 400 })
    }

    const rawBody = await req.text()
    const event = stripe.webhooks.constructEvent(rawBody, sig, secret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const taskId = session.metadata?.taskId

      if (taskId) {
        console.log('Payment successful for task:', taskId)
        // Update job status to 'open' and potentially mark as funded
        await jobService.updateJobStatus(taskId, 'open')
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Webhook error' }, { status: 400 })
  }
}
