import { gptAgent } from './gptAgent.js';

/**
 * Email Parser - Extracts email details from natural language
 * Uses GPT to parse user requests and extract email components
 * @param {string} userPrompt - Natural language email request
 * @returns {Promise<Object>} Parsed email details
 */
export async function emailParser(userPrompt) {
  const systemMessage = `
You are an email parser. Extract email details from the user's request and return ONLY a JSON object with this exact structure:

{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email body content"
}

Rules:
- If no recipient is specified, use "to": null
- If no subject is specified, create a brief, relevant subject
- If no body content is specified, create a brief, professional message
- Return ONLY the JSON object, no other text
- Use proper email etiquette in the body

Examples:
"send email to john@company.com about meeting tomorrow" →
{
  "to": "john@company.com",
  "subject": "Meeting Tomorrow",
  "body": "Hi,\\n\\nI wanted to follow up about our meeting scheduled for tomorrow. Please let me know if you need any additional information.\\n\\nBest regards"
}

"email sarah@test.com saying project is complete" →
{
  "to": "sarah@test.com", 
  "subject": "Project Complete",
  "body": "Hi Sarah,\\n\\nI'm pleased to inform you that the project has been completed successfully.\\n\\nBest regards"
}
`;

  try {
    console.log('[emailParser] Parsing email request...');
    const response = await gptAgent(userPrompt, systemMessage);
    
    // Parse the JSON response
    const emailDetails = JSON.parse(response.trim());
    
    // Validate required fields
    if (!emailDetails.to) {
      throw new Error('Recipient email address is required');
    }
    
    // Set defaults if missing
    if (!emailDetails.subject) {
      emailDetails.subject = 'Message';
    }
    
    if (!emailDetails.body) {
      emailDetails.body = 'Hello,\n\nI hope this message finds you well.\n\nBest regards';
    }
    
    console.log('[emailParser] ✅ Parsed email details:', {
      to: emailDetails.to,
      subject: emailDetails.subject,
      bodyLength: emailDetails.body.length
    });
    
    return emailDetails;
    
  } catch (error) {
    console.error('[emailParser] Error parsing email:', error.message);
    throw new Error(`Failed to parse email request: ${error.message}`);
  }
}