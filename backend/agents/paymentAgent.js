import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with test key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2024-10-28.acacia'
});

/**
 * Payment Agent - Creates Stripe checkout sessions for invoices
 * @param {Object} params - Payment parameters
 * @param {string} params.amount - Amount in Ringgit (will be converted to sen)
 * @param {string} params.description - Payment description
 * @param {string} [params.customerEmail] - Customer email for pre-filling checkout
 * @param {string} [params.invoiceNumber] - Invoice number for reference
 * @param {string} [params.successUrl] - Success redirect URL
 * @param {string} [params.cancelUrl] - Cancel redirect URL
 * @param {string} [params.currency] - Currency code (default: 'myr')
 * @returns {Promise<Object>} Result with checkout URL and session details
 */
export async function paymentAgent({
  amount,
  description,
  customerEmail,
  invoiceNumber,
  successUrl = 'https://techtrove.com/payment/success',
  cancelUrl = 'https://techtrove.com/payment/canceled',
  currency = 'myr'
}) {
  try {
    console.log(`[paymentAgent] Creating checkout session for RM${amount} (${currency.toUpperCase()})`);

    // Convert Ringgit to sen (Stripe requires amounts in smallest currency unit)
    // 1 MYR = 100 sen
    const amountInSen = Math.round(amount * 100);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'fpx'], // Add FPX for Malaysian banks
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: description,
              description: invoiceNumber ? `Invoice #${invoiceNumber}` : 'Payment for services'
            },
            unit_amount: amountInSen,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelUrl}?canceled=true`,
      metadata: {
        invoice_number: invoiceNumber || '',
        amount_myr: amount.toString(),
        currency: currency
      }
    });

    console.log(`[paymentAgent] ✅ Checkout session created: ${session.id}`);

    return {
      status: 'CREATED',
      sessionId: session.id,
      checkoutUrl: session.url,
      amount: amount,
      amountSen: amountInSen,
      currency: currency.toUpperCase(),
      description: description,
      invoiceNumber: invoiceNumber,
      customerEmail: customerEmail
    };

  } catch (error) {
    console.error('[paymentAgent] Error creating checkout session:', error.message);
    throw new Error(`Failed to create payment session: ${error.message}`);
  }
}

/**
 * Create a payment button HTML for emails
 * @param {string} checkoutUrl - Stripe checkout URL
 * @param {number} amount - Amount in Ringgit
 * @param {string} currency - Currency code (default: 'MYR')
 * @returns {string} HTML button code
 */
export function createPaymentButton(checkoutUrl, amount, currency = 'MYR') {
  const currencySymbol = currency.toUpperCase() === 'MYR' ? 'RM' : '$';
  
  return `
<div style="text-align: center; margin: 30px 0; padding: 20px;">
  <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
    <tr>
      <td style="border-radius: 6px; background-color: #635BFF; text-align: center;">
        <a href="${checkoutUrl}" 
           style="display: inline-block; 
                  background-color: #635BFF; 
                  color: #ffffff; 
                  padding: 15px 30px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: bold; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.4;
                  border: none;
                  cursor: pointer;
                  transition: background-color 0.2s ease;">
          💳 Pay ${currencySymbol}${amount} Now
        </a>
      </td>
    </tr>
  </table>
  <p style="font-size: 12px; 
            color: #6B7280; 
            margin-top: 15px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
    🔒 Secure payment powered by Stripe
  </p>
</div>`;
}

/**
 * Create payment link text for plain emails (fallback)
 * @param {string} checkoutUrl - Stripe checkout URL  
 * @param {number} amount - Amount in Ringgit
 * @param {string} currency - Currency code (default: 'MYR')
 * @returns {string} Plain text payment link
 */
export function createPaymentLink(checkoutUrl, amount, currency = 'MYR') {
  const currencySymbol = currency.toUpperCase() === 'MYR' ? 'RM' : '$';
  
  return `
💳 Pay ${currencySymbol}${amount} securely: ${checkoutUrl}

This is a secure payment link powered by Stripe.
Click the link above to complete your payment.
`;
}

/**
 * Create enhanced HTML email body with payment button
 * @param {string} originalBody - Original email body text
 * @param {string} checkoutUrl - Stripe checkout URL
 * @param {number} amount - Amount in dollars
 * @returns {string} HTML email body with embedded payment button
 */
export function createHTMLEmailWithButton(originalBody, checkoutUrl, amount) {
  // Convert plain text to HTML paragraphs
  const htmlBody = originalBody
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => `<p style="margin: 0 0 16px 0; line-height: 1.5; color: #374151;">${paragraph}</p>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Payment</title>
</head>
<body style="margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
            background-color: #f9fafb; 
            color: #374151;">
  
  <div style="max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff; 
              border-radius: 8px; 
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); 
              overflow: hidden;">
    
    <!-- Header -->
    <div style="background-color: #635BFF; 
                color: white; 
                padding: 24px; 
                text-align: center;">
      <h1 style="margin: 0; 
                 font-size: 24px; 
                 font-weight: bold;">
        Invoice & Payment
      </h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 32px 24px;">
      ${htmlBody}
      
      <!-- Payment Section -->
      <div style="margin: 32px 0; 
                  padding: 24px; 
                  background-color: #f8fafc; 
                  border-radius: 8px; 
                  border-left: 4px solid #635BFF;">
        <h3 style="margin: 0 0 16px 0; 
                   font-size: 18px; 
                   color: #635BFF; 
                   font-weight: bold;">
          💳 Ready to Pay?
        </h3>
        <p style="margin: 0 0 20px 0; 
                  color: #6B7280; 
                  line-height: 1.5;">
          Click the button below to securely complete your payment through Stripe.
        </p>
        
        ${createPaymentButton(checkoutUrl, amount)}
      </div>
      
      <!-- Footer Note -->
      <div style="margin-top: 32px; 
                  padding-top: 24px; 
                  border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; 
                  font-size: 14px; 
                  color: #6B7280; 
                  text-align: center; 
                  line-height: 1.5;">
          If you have any questions about this invoice or payment, please don't hesitate to contact us.<br>
          <strong>Thank you for your business!</strong>
        </p>
      </div>
    </div>
  </div>
  
</body>
</html>`;
}