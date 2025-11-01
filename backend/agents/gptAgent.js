import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * GPT Agent - Pure text generation agent
 * This agent only handles GPT responses, no actions
 * Actions are handled by the coordinator layer
 * @param {string} userPrompt - The user's prompt
 * @param {string} [systemContext] - Optional system context message
 * @returns {Promise<string>} GPT's text response
 */
export async function gptAgent(userPrompt, systemContext = null) {
  try {
    // Default system message
    const systemMessage = systemContext || 'You are a helpful AI assistant.';

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.4
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      return "Sorry, I couldn't generate a response.";
    }

    return responseContent;

  } catch (error) {
    console.error("Error in gptAgent:", error.message);
    return "Error: " + error.message;
  }
}

// Test instruction:
// import { gptAgent } from "./gptAgent.js";
// const result = await gptAgent("AI tutor app for students");
// console.log(result);
