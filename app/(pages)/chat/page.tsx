// app/chat/page.tsx

import { ChatInterface } from '@/components/chatbot/ChatInterface';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chat with Safta AI | Smart Contract Developer",
  description: "Chat with an AI assistant representing Safta Nasdalihin's portfolio, with live GitHub-backed project information.",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-start p-4 min-h-[90vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Talk with <span className="text-primary">Safta AI</span>
      </h1>
      <p className="text-muted-foreground mb-8 text-center max-w-lg">
        Ask about Safta&apos;s background and projects, or request evidence-backed details from his GitHub repositories.
      </p>
      <div className="w-full max-w-3xl grow h-[75vh]">
        <ChatInterface />
      </div>
    </div>
  );
}