/**
 * JSON Schemas for different entity types
 * These schemas define the structure for parsed data
 */

// Calendar Event Schema
export const EVENT_SCHEMA = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "Event title or summary"
    },
    startISO: {
      type: "string",
      description: "Start date/time in ISO 8601 format with timezone (e.g., 2025-11-05T14:00:00+08:00)"
    },
    endISO: {
      type: "string",
      description: "End date/time in ISO 8601 format with timezone (e.g., 2025-11-05T14:30:00+08:00)"
    },
    description: {
      type: "string",
      description: "Event description or notes"
    }
  },
  required: ["summary", "startISO", "endISO"]
};

export const EVENT_PARSER_OPTIONS = {
  requiredFields: ["summary", "startISO", "endISO"],
  defaults: {
    description: ""
  },
  validationRules: `- If date/time not specified, use tomorrow at 2pm as default
- Default duration: 30 minutes
- Timezone: Asia/Kuala_Lumpur (+08:00)
- Start and end must be in ISO format: YYYY-MM-DDTHH:mm:ss+08:00`,
  fallback: (userPrompt) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    
    const startISO = tomorrow.toISOString().replace('Z', '+08:00');
    const endTime = new Date(tomorrow);
    endTime.setHours(14, 30, 0, 0);
    const endISO = endTime.toISOString().replace('Z', '+08:00');
    
    return {
      summary: userPrompt.substring(0, 50) || "New Event",
      startISO: startISO,
      endISO: endISO,
      description: userPrompt
    };
  }
};

// Invoice Schema
export const INVOICE_SCHEMA = {
  type: "object",
  properties: {
    clientName: {
      type: "string",
      description: "Client or customer company name"
    },
    serviceDescription: {
      type: "string",
      description: "Description of services provided"
    },
    amount: {
      type: "number",
      description: "Invoice amount (numeric, no currency symbols)"
    },
    invoiceNumber: {
      type: ["string", "null"],
      description: "Invoice number if provided, otherwise null"
    },
    dueDate: {
      type: ["string", "null"],
      description: "Due date in YYYY-MM-DD format, or null"
    },
    companyName: {
      type: ["string", "null"],
      description: "Your company name if provided, otherwise null"
    },
    companyEmail: {
      type: ["string", "null"],
      description: "Your company email if provided, otherwise null"
    }
  },
  required: ["clientName", "serviceDescription", "amount"]
};

export const INVOICE_PARSER_OPTIONS = {
  requiredFields: ["clientName", "serviceDescription", "amount"],
  defaults: {
    invoiceNumber: null,
    dueDate: null,
    companyName: null,
    companyEmail: null
  },
  validationRules: `- clientName: Extract the client/customer name (REQUIRED)
- serviceDescription: Extract service description or create professional one if vague (REQUIRED)
- amount: Extract numeric amount, remove currency symbols, convert to number (REQUIRED)
- invoiceNumber: Extract if provided, otherwise set to null
- dueDate: Extract if provided (YYYY-MM-DD format), otherwise set to null
- companyName: Extract if provided, otherwise set to null
- companyEmail: Extract if provided, otherwise set to null
- Amounts should be numbers, not strings`,
  examples: `"Create an invoice for Client ABC for Web Development Services worth $1500" →
{
  "clientName": "Client ABC",
  "serviceDescription": "Web Development Services",
  "amount": 1500,
  "invoiceNumber": null,
  "dueDate": null,
  "companyName": null,
  "companyEmail": null
}`
};

// Email Schema
export const EMAIL_SCHEMA = {
  type: "object",
  properties: {
    to: {
      type: "string",
      description: "Recipient email address"
    },
    subject: {
      type: "string",
      description: "Email subject line"
    },
    body: {
      type: "string",
      description: "Email body content"
    }
  },
  required: ["to"]
};

export const EMAIL_PARSER_OPTIONS = {
  requiredFields: ["to"],
  defaults: {
    subject: "Message",
    body: "Hello,\n\nI hope this message finds you well.\n\nBest regards"
  },
  validationRules: `- If no recipient is specified, use "to": null
- If no subject is specified, create a brief, relevant subject
- If no body content is specified, create a brief, professional message
- Use proper email etiquette in the body`,
  examples: `"send email to john@company.com about meeting tomorrow" →
{
  "to": "john@company.com",
  "subject": "Meeting Tomorrow",
  "body": "Hi,\\n\\nI wanted to follow up about our meeting scheduled for tomorrow.\\n\\nBest regards"
}`
};

