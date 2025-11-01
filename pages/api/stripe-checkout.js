import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-10-28.acacia'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { planName, isAnnual, successUrl, cancelUrl } = req.body;

    // Define pricing based on plans from subscribe.js
    const planPricing = {
      Free: { monthly: 0, annual: 0 },
      Pro: { monthly: 29, annual: 290 }
    };

    const plan = planPricing[planName];
    if (!plan) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // Free plan doesn't need Stripe checkout
    if (planName === 'Free') {
      return res.status(200).json({ 
        message: 'Free plan selected',
        redirectUrl: successUrl || '/dashboard'
      });
    }

    const amount = isAnnual ? plan.annual : plan.monthly;
    const currency = 'myr'; // Malaysian Ringgit

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `TechTrove ${planName} Plan`,
              description: `${isAnnual ? 'Annual' : 'Monthly'} subscription to TechTrove ${planName} plan`,
            },
            unit_amount: amount * 100, // Convert to cents
            recurring: {
              interval: isAnnual ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/subscribe?canceled=true`,
      metadata: {
        plan: planName,
        billing: isAnnual ? 'annual' : 'monthly',
        amount: amount.toString(),
      }
    });

    console.log(`[Stripe Checkout] ✅ Session created for ${planName} plan: ${session.id}`);

    res.status(200).json({
      sessionId: session.id,
      checkoutUrl: session.url,
      plan: planName,
      amount: amount,
      currency: currency.toUpperCase(),
      billing: isAnnual ? 'annual' : 'monthly'
    });

  } catch (error) {
    console.error('[Stripe Checkout] Error creating session:', error.message);
    res.status(500).json({ 
      message: 'Error creating checkout session',
      error: error.message 
    });
  }
}