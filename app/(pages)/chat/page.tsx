// app/chat/page.tsx

import { ChatInterface } from '@/components/chatbot/ChatInterface';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chat with Safta AI | Smart Contract Developer",
  description: "Live interaction with AI that represents Safta Nasdalihin's experience and expertise in the fields of Smart Contracts and Web3.",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-start p-4 min-h-[90vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Talk with <span className="text-primary">Safta AI</span>
      </h1>
      <p className="text-muted-foreground mb-8 text-center max-w-lg">
        Ask about this website, my projects, my background, or my expertise in Smart Contracts and Web3.
      </p>
      <div className="w-full max-w-3xl grow h-[75vh]">
        <ChatInterface />
      </div>
    </div>
  );
}