// app/chat/page.tsx

import { ChatInterface } from '@/components/chatbot/ChatInterface';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chat dengan Safta AI | Smart Contract Developer",
  description: "Live interaction with AI that represents Safta Nasdalihin's experience and expertise in the fields of Web3 and Solidity.",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Talk with <span className="text-primary">Safta AI</span>
      </h1>
      <p className="text-muted-foreground mb-8 text-center max-w-lg">
        Ask about Smart Contracts, portfolio, or technical expertise.
      </p>
      
      <div className="w-full max-w-3xl">
        <ChatInterface />
      </div>
    </div>
  );
}