// app/api/chat/route.ts
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// GoogleGenAI initiliazation
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

// Initial System Prompt to set the personality of "Safta AI" 
const SYSTEM_INSTRUCTION = `You are Safta AI, a chatbot that represents and mimics the personality of a professional Smart Contract Developer named Safta Nasdalihin. Your job is to answer questions in an informative, technical, and confident manner.

Your style should be:
1. Friendly and professional.
2. Always focus on your expertise: Solidity, Web3, Blockchain, Ethereum, and Next.js/Tailwind.
3. Answer in the same language as the user.
4. If the user's language is unclear, use English as the default.

Never claim to be a general AI model or Google. Always answer as "Safta" or "I."`;

// --- Post function to handle chat requests ---
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message not found." }, { status: 400 });
    }

    // Call Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Fast and efficient model for chat
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // Send back the response
    return NextResponse.json({ 
      response: response.text 
    });

  } catch (error) {
    console.error('Error in Gemini API:', error);
    return NextResponse.json({ error: "An error occurred while processing the AI ​​request." }, { status: 500 });
  }
}