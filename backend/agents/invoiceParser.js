import { gptAgent } from './gptAgent.js';

/**
 * Invoice Parser - Extracts invoice details from natural language
 * Uses GPT to parse user requests and extract invoice components
 * @param {string} userPrompt - Natural language invoice request
 * @returns {Promise<Object>} Parsed invoice details
 */
export async function invoiceParser(userPrompt) {
  const systemMessage = `
You are an invoice parser. Extract invoice details from the user's request and return ONLY a JSON object with this exact structure:

{
  "clientName": "Client Company Name",
  "serviceDescription": "Description of services provided",
  "amount": 1500,
  "invoiceNumber": "INV-001",
  "dueDate": "2025-12-01",
  "companyName": "Your Company Name",
  "companyEmail": "email@company.com"
}

Rules:
- clientName: Extract the client/customer name (REQUIRED)
- serviceDescription: Extract service description or create professional one if vague (REQUIRED)
- amount: Extract numeric amount, remove currency symbols, convert to number (REQUIRED)
- invoiceNumber: Extract if provided, otherwise set to null
- dueDate: Extract if provided (YYYY-MM-DD format), otherwise set to null
- companyName: Extract if provided, otherwise set to null
- companyEmail: Extract if provided, otherwise set to null
- Return ONLY the JSON object, no other text
- Amounts should be numbers, not strings

Examples:
"Create an invoice for Client ABC for Web Development Services worth $1500" →
{
  "clientName": "Client ABC",
  "serviceDescription": "Web Development Services",
  "amount": 1500,
  "invoiceNumber": null,
  "dueDate": null,
  "companyName": null,
  "companyEmail": null
}

"Invoice ABC Corp for consulting work $2500 due Dec 15 2025" →
{
  "clientName": "ABC Corp",
  "serviceDescription": "Consulting Services",
  "amount": 2500,
  "invoiceNumber": null,
  "dueDate": "2025-12-15",
  "companyName": null,
  "companyEmail": null
}

"Make invoice #INV-123 for Tesla Motors for software development $5000" →
{
  "clientName": "Tesla Motors",
  "serviceDescription": "Software Development",
  "amount": 5000,
  "invoiceNumber": "INV-123",
  "dueDate": null,
  "companyName": null,
  "companyEmail": null
}
`;

  try {
    console.log('[invoiceParser] Parsing invoice request...');
    const response = await gptAgent(userPrompt, systemMessage);
    
    // Parse the JSON response
    const invoiceDetails = JSON.parse(response.trim());
    
    // Validate required fields
    if (!invoiceDetails.clientName) {
      throw new Error('Client name is required');
    }
    
    if (!invoiceDetails.serviceDescription) {
      throw new Error('Service description is required');
    }
    
    if (!invoiceDetails.amount || typeof invoiceDetails.amount !== 'number') {
      throw new Error('Valid amount is required');
    }
    
    // Set defaults for optional fields
    invoiceDetails.invoiceNumber = invoiceDetails.invoiceNumber || null;
    invoiceDetails.dueDate = invoiceDetails.dueDate || null;
    invoiceDetails.companyName = invoiceDetails.companyName || null;
    invoiceDetails.companyEmail = invoiceDetails.companyEmail || null;
    
    console.log('[invoiceParser] ✅ Parsed invoice details:', {
      clientName: invoiceDetails.clientName,
      serviceDescription: invoiceDetails.serviceDescription,
      amount: invoiceDetails.amount,
      hasInvoiceNumber: !!invoiceDetails.invoiceNumber,
      hasDueDate: !!invoiceDetails.dueDate
    });
    
    return invoiceDetails;
    
  } catch (error) {
    console.error('[invoiceParser] Error parsing invoice:', error.message);
    throw new Error(`Failed to parse invoice request: ${error.message}`);
  }
}