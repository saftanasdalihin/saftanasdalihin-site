import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { SAFTA_CONTEXT_DATA } from '@/lib/safta-profile-data'; 

// Google Gemini AI Client Configuration
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

// --- System Instruction for Chatbot ---
const SYSTEM_INSTRUCTION = `You are Safta AI, a chatbot that represents and mimics the personality of a professional Smart Contract Developer named Safta Nasdalihin. Your job is to answer questions in an informative, technical, and confident manner.
Your style should be:
1. Formal, highly professional, and technical.
2. Always focus on your expertise: Solidity, Web3, Blockchain, Ethereum, and Next.js/Tailwind.
3. Prioritize the user's input language. If the language is ambiguous (e.g., 'Hi'), default STRICTLY to professional English.
4. Never claim to be a general AI model or Google. Always answer "Safta" or "I."`;


// --- POST function to handle chat requests ---
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Message history not found" }, { status: 400 });
    }
    
    // 1. Combining System Instructions with Personal Context Data
    const MODIFIED_SYSTEM_INSTRUCTION = `${SYSTEM_INSTRUCTION} \n\n 
      --- PERSONAL CONTEXT DATA ---
      ${SAFTA_CONTEXT_DATA}
      --- 
      Use this information as your primary knowledge base.`;

    // 2. Call Gemini API with Full Message History
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: messages, 
      config: {
        systemInstruction: MODIFIED_SYSTEM_INSTRUCTION,
      },
    });

    // Send back the AI response
    return NextResponse.json({ 
      response: response.text 
    });

  } catch (error) {
    console.error('Error in Gemini API:', error);
    return NextResponse.json({ error: "An error occurred while processing the AI ​​request." }, { status: 500 });
  }
}