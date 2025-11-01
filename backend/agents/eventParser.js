import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Parses event details from natural language
 * @param {string} userMessage - User's message containing event details
 * @returns {Promise<Object>} Parsed event with summary, startISO, endISO, description
 */
export async function eventParser(userMessage) {
  try {
    const systemPrompt = `You are an event parser for calendar events.
Extract event details from the user's message and return STRICT JSON only.

Format:
{
  "summary": "Event title/summary",
  "startISO": "2025-11-05T14:00:00+08:00",  // ISO 8601 format with timezone
  "endISO": "2025-11-05T14:30:00+08:00",    // ISO 8601 format with timezone
  "description": "Event description"
}

Rules:
- If date/time not specified, use tomorrow at 2pm as default
- Default duration: 30 minutes
- Timezone: Asia/Kuala_Lumpur (+08:00)
- Start and end must be in ISO format: YYYY-MM-DDTHH:mm:ss+08:00

Return ONLY valid JSON, no explanation.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.2
    });

    const responseContent = completion.choices[0]?.message?.content?.trim();
    
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Clean markdown code blocks if present
    let cleanContent = responseContent;
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.slice(7);
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith('```')) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    const parsed = JSON.parse(cleanContent);
    
    // Validate required fields
    if (!parsed.summary || !parsed.startISO || !parsed.endISO) {
      throw new Error("Missing required fields in parsed event");
    }

    return parsed;

  } catch (error) {
    console.error("Error in eventParser:", error.message);
    
    // Fallback: create a default event for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0); // 2:00 PM
    
    const startISO = tomorrow.toISOString().replace('Z', '+08:00');
    
    const endTime = new Date(tomorrow);
    endTime.setHours(14, 30, 0, 0); // 2:30 PM
    const endISO = endTime.toISOString().replace('Z', '+08:00');

    return {
      summary: userMessage.substring(0, 50) || "New Event",
      startISO: startISO,
      endISO: endISO,
      description: userMessage
    };
  }
}

