import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Unified Parser - Extracts structured data from natural language using JSON Schema
 * @param {string} userPrompt - User's natural language input
 * @param {Object} schema - JSON Schema definition for the expected output
 * @param {string} entityType - Type of entity being parsed (for logging/context)
 * @param {Object} options - Additional options (defaults, validation rules, etc.)
 * @returns {Promise<Object>} Parsed data matching the schema
 */
export async function unifiedParser(userPrompt, schema, entityType = 'data', options = {}) {
  const {
    requiredFields = [],
    defaults = {},
    validationRules = '',
    examples = ''
  } = options;

  try {
    // Build system prompt with JSON Schema
    const schemaString = JSON.stringify(schema, null, 2);
    
    const systemPrompt = `You are a data extraction assistant. Extract structured data from the user's message and return ONLY valid JSON that matches this schema:

${schemaString}

${validationRules ? `\nRules:\n${validationRules}\n` : ''}
${examples ? `\nExamples:\n${examples}\n` : ''}

Return ONLY valid JSON, no explanation, no markdown code blocks, just the raw JSON object.`;

    console.log(`[unifiedParser] Parsing ${entityType}...`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2
    });

    const responseContent = completion.choices[0]?.message?.content?.trim();
    
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Clean markdown code blocks if present (backup, though response_format should prevent this)
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

    // Parse JSON
    const parsed = JSON.parse(cleanContent);
    
    // Apply defaults for missing optional fields
    Object.keys(defaults).forEach(key => {
      if (parsed[key] === undefined || parsed[key] === null) {
        parsed[key] = defaults[key];
      }
    });
    
    // Validate required fields
    requiredFields.forEach(field => {
      if (parsed[field] === undefined || parsed[field] === null || parsed[field] === '') {
        throw new Error(`Missing required field: ${field}`);
      }
    });

    console.log(`[unifiedParser] ✅ Parsed ${entityType}:`, 
      Object.keys(parsed).reduce((acc, key) => {
        if (requiredFields.includes(key) || parsed[key] !== null) {
          acc[key] = parsed[key];
        }
        return acc;
      }, {})
    );

    return parsed;

  } catch (error) {
    console.error(`[unifiedParser] Error parsing ${entityType}:`, error.message);
    
    // If there's a default fallback, use it
    if (defaults.fallback) {
      console.log(`[unifiedParser] Using fallback for ${entityType}`);
      return defaults.fallback(userPrompt);
    }
    
    throw new Error(`Failed to parse ${entityType}: ${error.message}`);
  }
}

