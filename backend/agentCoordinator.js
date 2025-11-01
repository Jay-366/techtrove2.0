import { gptAgent } from './agents/gptAgent.js';
import { calendarAgent } from './agents/calendarAgent.js';
import { emailAgent, createCalendarButton, createCalendarLink } from './agents/emailAgent.js';
import { invoiceAgent } from './agents/invoiceAgent.js';
import { unifiedParser } from './utils/unifiedParser.js';
import {
  EVENT_SCHEMA, EVENT_PARSER_OPTIONS,
  INVOICE_SCHEMA, INVOICE_PARSER_OPTIONS,
  EMAIL_SCHEMA, EMAIL_PARSER_OPTIONS
} from './utils/schemas.js';
// Lazy load payment agent only when needed (stripe package is optional)
let paymentAgent, createPaymentLink, createHTMLEmailWithButton, createPaymentButton;
async function loadPaymentAgent() {
  if (!paymentAgent) {
    try {
      const paymentModule = await import('./agents/paymentAgent.js');
      paymentAgent = paymentModule.paymentAgent;
      createPaymentLink = paymentModule.createPaymentLink;
      createHTMLEmailWithButton = paymentModule.createHTMLEmailWithButton;
      createPaymentButton = paymentModule.createPaymentButton;
    } catch (error) {
      console.warn('[Coordinator] Payment agent not available (stripe package not installed)');
      // Create stub functions
      paymentAgent = async () => { throw new Error('Stripe package not installed. Run: npm install stripe'); };
      createPaymentLink = () => '';
      createHTMLEmailWithButton = (body) => body;
      createPaymentButton = () => '';
    }
  }
  return { paymentAgent, createPaymentLink, createHTMLEmailWithButton, createPaymentButton };
}

/**
 * Agent Coordinator - Orchestrates multiple agents to fulfill user requests
 * This is the collaboration layer that coordinates between different agents
 */
export class AgentCoordinator {
  constructor(userId = 'demoUser') {
    this.userId = userId;
    this.results = {};
  }

  /**
   * Detect actions without executing (for confirmation step)
   * @param {string} userPrompt - User's request
   * @returns {Promise<Object>} Detected actions info
   */
  async detectActions(userPrompt) {
    const actionTypes = this.detectRequestTypes(userPrompt);
    
    const agentDescriptions = {
      calendar: {
        agent: 'Event Planning Agent',
        action: 'Schedule calendar event',
        description: 'Creates and schedules events in Google Calendar. Handles date/time parsing, attendee management, and calendar integration.',
        icon: 'Calendar'
      },
      email: {
        agent: 'Email Communication Agent',
        action: 'Send email',
        description: 'Sends professional emails via Gmail API. Supports HTML templates, attachments, and automated email composition.',
        icon: 'Mail'
      },
      invoice: {
        agent: 'Invoice Generation Agent',
        action: 'Create invoice',
        description: 'Generates professional Excel invoices with Malaysian Ringgit (MYR) currency support and automated invoice numbering.',
        icon: 'FileText'
      },
      payment: {
        agent: 'Payment Processing Agent',
        action: 'Generate payment link',
        description: 'Creates secure Stripe payment links with MYR currency support, FPX banking integration, and beautiful HTML payment buttons.',
        icon: 'CreditCard'
      },
      general: {
        agent: 'GPT Response Agent',
        action: 'General response',
        description: 'Provides intelligent text responses using OpenAI GPT-4 for natural language understanding and generation.',
        icon: 'MessageCircle'
      }
    };
    
    const detectedActions = actionTypes
      .filter(type => type !== 'general')
      .map(type => ({
        type,
        agent: agentDescriptions[type]?.agent || `${type} Agent`,
        action: agentDescriptions[type]?.action || type,
        description: agentDescriptions[type]?.description || `${type} Agent will handle this task`,
        icon: agentDescriptions[type]?.icon || 'Settings'
      }));

    console.log('[AgentCoordinator] Detected actions with icons:', detectedActions.map(a => ({ agent: a.agent, icon: a.icon })));
    
    return {
      hasActions: detectedActions.length > 0,
      actions: detectedActions,
      actionTypes: actionTypes,
      agentSummary: detectedActions.map(action => action.agent).join(', ')
    };
  }

  /**
   * Process user request and coordinate appropriate agents
   * @param {string} userPrompt - User's request
   * @param {boolean} executeMode - If false, only detect actions. If true, execute them.
   * @returns {Promise<Object>} Coordinated result from all agents
   */
  async processRequest(userPrompt, executeMode = true) {
    this.results = {
      message: '',
      calendar: null,
      email: null,
      invoice: null,
      payment: null,
      actions: [],
      logs: [], // Store backend processing logs for frontend display
      statusUpdates: [] // Store status updates for frontend progress display
    };

    // Detect what types of requests this is (can be multiple)
    const actionTypes = this.detectRequestTypes(userPrompt);
    this.actionTypes = actionTypes; // Store as instance variable for use in other methods
    
    // If not in execute mode, return detection results
    if (!executeMode) {
      return this.detectActions(userPrompt);
    }
    
    this.results.logs.push({ 
      timestamp: new Date().toISOString(), 
      message: `[Coordinator] Detected action types: ${actionTypes.join(', ')}` 
    });
    this.addStatusUpdate('Content generated', 'success');
    console.log(`[Coordinator] Detected action types: ${actionTypes.join(', ')}`);

    // Process actions in logical order (create resources first, then send notifications)
    
    // 1. Handle invoice requests first (creates files that might be needed for email)
    if (actionTypes.includes('invoice')) {
      this.addStatusUpdate('Creating invoice...', 'progress');
      await this.handleInvoiceRequest(userPrompt);
      if (this.results.invoice?.status === 'CREATED') {
        this.addStatusUpdate('Invoice created', 'success');
      }
    }
    
    // 2. Handle payment requests - Auto-create when invoice + email detected OR explicitly requested
    const shouldCreatePayment = actionTypes.includes('payment') || 
                               (actionTypes.includes('invoice') && actionTypes.includes('email'));
    
    if (shouldCreatePayment && this.results.invoice?.status === 'CREATED') {
      this.addStatusUpdate('Generating payment link...', 'progress');
      await this.handlePaymentRequest(userPrompt);
      if (this.results.payment?.checkoutUrl) {
        this.addStatusUpdate('Payment link generated', 'success');
      }
    }
    
    // 3. Handle calendar requests
    if (actionTypes.includes('calendar')) {
      this.addStatusUpdate('Creating calendar event...', 'progress');
      await this.handleCalendarRequest(userPrompt);
      if (this.results.calendar?.status === 'CREATED') {
        this.addStatusUpdate('Calendar event created', 'success');
      }
    }
    
    // 4. Handle email requests last (might include attachments + payment links)
    if (actionTypes.includes('email')) {
      this.addStatusUpdate('Sending email...', 'progress');
      await this.handleEmailRequest(userPrompt);
      if (this.results.email?.status === 'SENT') {
        this.addStatusUpdate('Email sent', 'success');
      }
    }

    // Always get GPT response (with context about actions taken)
    await this.handleGPTResponse(userPrompt);

    return this.results;
  }

  /**
   * Add status update for frontend progress tracking
   * @param {string} message - Status message
   * @param {string} status - Status type: 'pending', 'progress', 'success', 'error'
   */
  addStatusUpdate(message, status = 'progress') {
    this.results.statusUpdates.push({
      message,
      status,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Detect what types of requests the user is making (can be multiple)
   * @param {string} prompt - User prompt
   * @returns {Array<string>} Array of request types: ['calendar', 'email', 'invoice']
   */
  detectRequestTypes(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const actionTypes = [];
    
    if (/schedule|calendar|meeting|book|appointment|remind|event/i.test(lowerPrompt)) {
      actionTypes.push('calendar');
    }
    
    if (/send email|email|mail|message|write to|contact|inform.*email/i.test(lowerPrompt)) {
      actionTypes.push('email');
    }
    
    if (/create invoice|invoice|bill|billing|generate invoice|make invoice/i.test(lowerPrompt)) {
      actionTypes.push('invoice');
    }
    
    // Detect payment requests (for invoices with payment buttons)
    if (/pay|payment|checkout|stripe|pay.*button|payment.*link/i.test(lowerPrompt)) {
      actionTypes.push('payment');
    }
    
    // If no specific actions detected, default to general
    if (actionTypes.length === 0) {
      actionTypes.push('general');
    }
    
    return actionTypes;
  }

  /**
   * Legacy method for backward compatibility
   * @param {string} prompt - User prompt
   * @returns {string} Primary request type
   */
  detectRequestType(prompt) {
    const types = this.detectRequestTypes(prompt);
    return types[0]; // Return first detected type for compatibility
  }

  /**
   * Handle calendar-related requests
   * @param {string} userPrompt - User's calendar request
   */
  async handleCalendarRequest(userPrompt) {
    try {
      const log = (msg, data = null) => {
        console.log(msg);
        this.results.logs.push({ timestamp: new Date().toISOString(), message: msg, data });
      };
      
      log('[Coordinator] Processing calendar request...');
      
      // Parse event details from natural language using unified parser
      const eventDetails = await unifiedParser(
        userPrompt,
        EVENT_SCHEMA,
        'calendar event',
        EVENT_PARSER_OPTIONS
      );
      log('[Coordinator] Parsed event:', eventDetails);

      // Create calendar event
      const calendarResult = await calendarAgent({
        userId: this.userId,
        summary: eventDetails.summary,
        startISO: eventDetails.startISO,
        endISO: eventDetails.endISO,
        description: eventDetails.description
      });

      this.results.calendar = calendarResult;
      this.results.actions.push({
        type: 'calendar',
        status: 'success',
        result: calendarResult
      });
      
      log('[Coordinator] ✅ Calendar event created');

    } catch (error) {
      console.error('[Coordinator] Calendar error:', error.message);
      
      this.results.logs.push({ 
        timestamp: new Date().toISOString(), 
        message: `[Coordinator] ❌ Calendar error: ${error.message}`, 
        level: 'error' 
      });
      
      if (error.needAuth) {
        this.results.calendar = {
          error: 'Google Calendar not connected',
          authRequired: true,
          authUrl: error.authUrl,
          message: 'Calendar connection required'
        };
      } else {
        this.results.calendar = {
          error: error.message,
          message: 'Failed to create calendar event'
        };
      }
      
      this.results.actions.push({
        type: 'calendar',
        status: 'error',
        error: error.message
      });
    }
  }

  /**
   * Handle email-related requests
   * @param {string} userPrompt - User's email request
   */
  async handleEmailRequest(userPrompt) {
    try {
      const log = (msg, data = null) => {
        console.log(msg);
        this.results.logs.push({ timestamp: new Date().toISOString(), message: msg, data });
      };
      
      log('[Coordinator] Processing email request...');
      
      // Parse email details from natural language using unified parser
      const emailDetails = await unifiedParser(
        userPrompt,
        EMAIL_SCHEMA,
        'email',
        EMAIL_PARSER_OPTIONS
      );
      log('[Coordinator] Parsed email:', emailDetails);

      // Check if we should attach an invoice file
      let attachmentPath = null;
      if (this.results.invoice?.status === 'CREATED') {
        // Auto-attach invoice if:
        // 1. User explicitly asks for attachment/include/excel
        // 2. User says "email it" (referring to the invoice)
        // 3. Both invoice and email actions are detected (likely wants invoice attached)
        const shouldAttach = userPrompt.toLowerCase().includes('attach') || 
                           userPrompt.toLowerCase().includes('include') ||
                           userPrompt.toLowerCase().includes('send this') ||
                           userPrompt.toLowerCase().includes('excel file') ||
                           userPrompt.toLowerCase().includes('email it') ||
                           (this.actionTypes.includes('invoice') && this.actionTypes.includes('email'));
        
        if (shouldAttach) {
          attachmentPath = this.results.invoice.filePath;
          console.log('[Coordinator] Will attach invoice file:', attachmentPath);
        }
      }

      // Add payment link to email body if payment session exists
      let enhancedBody = emailDetails.body;
      let isHTML = false;
      
      // Check if we have calendar or payment info to include
      const hasPayment = this.results.payment?.status === 'CREATED';
      const hasCalendar = this.results.calendar?.status === 'CREATED';
      
      if (hasPayment || hasCalendar) {
        // Create comprehensive HTML email with buttons
        const options = {};
        
        if (hasPayment) {
          options.payment = {
            checkoutUrl: this.results.payment.checkoutUrl,
            amount: this.results.payment.amount
          };
        }
        
        if (hasCalendar) {
          // Format date for display
          const eventDate = new Date(this.results.calendar.start).toLocaleDateString('en-MY', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kuala_Lumpur'
          });
          
          options.calendar = {
            calendarUrl: this.results.calendar.calendarLink,
            eventTitle: this.results.calendar.eventSummary,
            eventDate: eventDate
          };
        }
        
        enhancedBody = this.createComprehensiveHTMLEmail(emailDetails.body, options);
        isHTML = true;
        
        if (hasPayment && hasCalendar) {
          console.log('[Coordinator] Will include both calendar and payment buttons in email');
        } else if (hasPayment) {
          console.log('[Coordinator] Will include payment button in email');
        } else if (hasCalendar) {
          console.log('[Coordinator] Will include calendar button in email');
        }
      }

      // Send email
      const emailResult = await emailAgent({
        userId: this.userId,
        to: emailDetails.to,
        subject: emailDetails.subject,
        body: enhancedBody,
        attachmentPath: attachmentPath,
        isHTML: isHTML
      });

      this.results.email = emailResult;
      this.results.actions.push({
        type: 'email',
        status: 'success',
        result: emailResult
      });
      
      console.log('[Coordinator] ✅ Email sent');

    } catch (error) {
      console.error('[Coordinator] Email error:', error.message);
      
      if (error.needAuth) {
        this.results.email = {
          error: 'Gmail not connected',
          authRequired: true,
          authUrl: error.authUrl,
          message: 'Gmail connection required'
        };
      } else {
        this.results.email = {
          error: error.message,
          message: 'Failed to send email'
        };
      }
      
      this.results.actions.push({
        type: 'email',
        status: 'error',
        error: error.message
      });
    }
  }

  /**
   * Handle invoice-related requests
   * @param {string} userPrompt - User's invoice request
   */
  async handleInvoiceRequest(userPrompt) {
    try {
      console.log('[Coordinator] Processing invoice request...');
      
      // Parse invoice details from natural language using unified parser
      const invoiceDetails = await unifiedParser(
        userPrompt,
        INVOICE_SCHEMA,
        'invoice',
        INVOICE_PARSER_OPTIONS
      );
      console.log('[Coordinator] Parsed invoice:', invoiceDetails);

      // Create invoice
      const invoiceResult = await invoiceAgent({
        userId: this.userId,
        clientName: invoiceDetails.clientName,
        serviceDescription: invoiceDetails.serviceDescription,
        amount: invoiceDetails.amount,
        invoiceNumber: invoiceDetails.invoiceNumber,
        dueDate: invoiceDetails.dueDate,
        companyName: invoiceDetails.companyName,
        companyEmail: invoiceDetails.companyEmail
      });

      this.results.invoice = invoiceResult;
      this.results.actions.push({
        type: 'invoice',
        status: 'success',
        result: invoiceResult
      });
      
      console.log('[Coordinator] ✅ Invoice created');

    } catch (error) {
      console.error('[Coordinator] Invoice error:', error.message);
      
      this.results.invoice = {
        error: error.message,
        message: 'Failed to create invoice'
      };
      
      this.results.actions.push({
        type: 'invoice',
        status: 'error',
        error: error.message
      });
    }
  }

  /**
   * Handle payment-related requests
   * @param {string} userPrompt - User's payment request
   */
  async handlePaymentRequest(userPrompt) {
    try {
      console.log('[Coordinator] Processing payment request...');
      
      // Use invoice data for payment
      const invoice = this.results.invoice;
      if (!invoice || invoice.status !== 'CREATED') {
        throw new Error('No invoice available for payment creation');
      }

      // Extract email for customer pre-fill from prompt or use a default
      let customerEmail = null;
      const emailMatch = userPrompt.match(/[\w\.-]+@[\w\.-]+\.\w+/);
      if (emailMatch) {
        customerEmail = emailMatch[0];
      }

      // Load payment agent
      const { paymentAgent: payAgent } = await loadPaymentAgent();
      
      // Create payment session
      const paymentResult = await payAgent({
        amount: invoice.amount,
        description: `${invoice.serviceDescription} - ${invoice.clientName}`,
        customerEmail: customerEmail,
        invoiceNumber: invoice.invoiceNumber
      });

      this.results.payment = paymentResult;
      this.results.actions.push({
        type: 'payment',
        status: 'success',
        result: paymentResult
      });
      
      console.log('[Coordinator] ✅ Payment session created');

    } catch (error) {
      console.error('[Coordinator] Payment error:', error.message);
      
      this.results.payment = {
        error: error.message,
        message: 'Failed to create payment session'
      };
      
      this.results.actions.push({
        type: 'payment',
        status: 'error',
        error: error.message
      });
    }
  }

  /**
   * Get GPT response with context about actions taken
   * @param {string} userPrompt - Original user prompt
   */
  async handleGPTResponse(userPrompt) {
    try {
      // Build system message with context about actions taken
      let systemContext = 'You are a helpful AI assistant.';
      
      if (this.results.calendar?.status === 'CREATED') {
        systemContext += ` The user just asked to schedule something, and you successfully created a calendar event. Confirm this naturally in your response. Event: ${this.results.calendar.eventSummary} at ${this.results.calendar.start}.`;
      } else if (this.results.calendar?.authRequired) {
        systemContext += ` The user asked to schedule something, but Google Calendar needs to be connected. Mention this in a helpful way.`;
      }
      
      if (this.results.email?.status === 'SENT') {
        systemContext += ` The user just asked to send an email, and you successfully sent it. Confirm this naturally in your response. Email sent to: ${this.results.email.to} with subject: "${this.results.email.subject}".`;
      } else if (this.results.email?.authRequired) {
        systemContext += ` The user asked to send an email, but Gmail needs to be connected. Mention this in a helpful way.`;
      }
      
      if (this.results.invoice?.status === 'CREATED') {
        systemContext += ` The user just asked to create an invoice, and you successfully created it. Confirm this naturally in your response. Invoice #${this.results.invoice.invoiceNumber} for ${this.results.invoice.clientName} for $${this.results.invoice.amount} has been created and saved as ${this.results.invoice.filename}.`;
      } else if (this.results.invoice?.error) {
        systemContext += ` The user asked to create an invoice, but there was an error. Mention this and suggest they try again with more details.`;
      }

      // Get GPT response
      const gptResponse = await gptAgent(userPrompt, systemContext);
      this.results.message = gptResponse;
      
      this.results.logs.push({ 
        timestamp: new Date().toISOString(), 
        message: '[Coordinator] ✅ GPT response generated' 
      });
      console.log('[Coordinator] ✅ GPT response generated');

    } catch (error) {
      console.error('[Coordinator] GPT error:', error.message);
      this.results.message = `I encountered an error: ${error.message}`;
    }
  }

  /**
   * Create comprehensive HTML email with payment and/or calendar buttons
   * @param {string} originalBody - Original email body text
   * @param {Object} options - Options object
   * @param {Object} [options.payment] - Payment details {checkoutUrl, amount}
   * @param {Object} [options.calendar] - Calendar details {calendarUrl, eventTitle, eventDate}
   * @returns {string} HTML email body
   */
  createComprehensiveHTMLEmail(originalBody, options = {}) {
    const { payment, calendar } = options;
    
    // Convert plain text to HTML paragraphs
    const htmlBody = originalBody
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p style="margin: 0 0 16px 0; line-height: 1.5; color: #374151;">${paragraph}</p>`)
      .join('');

    // Determine header title based on content
    let headerTitle = 'Meeting & Information';
    if (payment && calendar) {
      headerTitle = 'Meeting & Payment';
    } else if (payment) {
      headerTitle = 'Invoice & Payment';
    } else if (calendar) {
      headerTitle = 'Meeting Invitation';
    }

    let sectionsHTML = '';
    
    // Add calendar section if present
    if (calendar) {
      sectionsHTML += `
      <!-- Calendar Section -->
      <div style="margin: 32px 0; 
                  padding: 24px; 
                  background-color: #eff6ff; 
                  border-radius: 8px; 
                  border-left: 4px solid #2563EB;">
        <h3 style="margin: 0 0 16px 0; 
                   font-size: 18px; 
                   color: #2563EB; 
                   font-weight: bold;">
          📅 Meeting Details
        </h3>
        <p style="margin: 0 0 20px 0; 
                  color: #6B7280; 
                  line-height: 1.5;">
          Click the button below to view the meeting details in your Google Calendar.
        </p>
        
        ${createCalendarButton(calendar.calendarUrl, calendar.eventTitle, calendar.eventDate)}
      </div>`;
    }
    
    // Add payment section if present
    if (payment) {
      sectionsHTML += `
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
        
        ${createPaymentButton ? createPaymentButton(payment.checkoutUrl, payment.amount) : `<a href="${payment.checkoutUrl}" style="display: inline-block; background-color: #635BFF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">💳 Pay RM${payment.amount} Now</a>`}
      </div>`;
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle}</title>
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
    <div style="background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); 
                color: white; 
                padding: 24px; 
                text-align: center;">
      <h1 style="margin: 0; 
                 font-size: 24px; 
                 font-weight: bold;">
        ${headerTitle}
      </h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 32px 24px;">
      ${htmlBody}
      
      ${sectionsHTML}
      
      <!-- Footer Note -->
      <div style="margin-top: 32px; 
                  padding-top: 24px; 
                  border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; 
                  font-size: 14px; 
                  color: #6B7280; 
                  text-align: center; 
                  line-height: 1.5;">
          If you have any questions, please don't hesitate to contact us.<br>
          <strong>Thank you!</strong>
        </p>
      </div>
    </div>
  </div>
  
</body>
</html>`;
  }
}

/**
 * Convenience function to process a request
 * @param {string} userPrompt - User's request
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} Coordinated result
 */
export async function coordinateAgents(userPrompt, userId = 'demoUser', executeMode = true) {
  const coordinator = new AgentCoordinator(userId);
  return await coordinator.processRequest(userPrompt, executeMode);
}

