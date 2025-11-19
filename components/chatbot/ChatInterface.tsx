// components/chatbot/ChatInterface.tsx

"use client";

import { useState, FormEvent } from 'react';
import { MessageBubble } from './MessageBubble';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    
    // 1. Show user messages
    setMessages((prev) => [...prev, userMessage]);
    
    // Save input before cleaning
    const messageToSend = input;
    setInput('');
    setIsLoading(true);

    try {
      // 2. Call Chatbot API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from AI API');
      }

      const data = await response.json();
      const aiResponse: Message = { text: data.response || "Sorry, I failed to respond.", sender: 'ai' };

      // 3. Show AI response
      setMessages((prev) => [...prev, aiResponse]);
      
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { text: "A system error occurred. Please try again.", sender: 'ai' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] max-h-[800px] bg-card border border-border rounded-lg shadow-xl overflow-hidden">
      
      {/* Area Pesan */}
      <div className="grow p-4 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
            <div className="text-center text-muted-foreground pt-10">
                Hi! I'm Safta AI. Please feel free to ask questions about Smart Contracts, Web3, or Safta's portfolio.
            </div>
        )}
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
        {isLoading && (
            <div className='flex justify-start'>
                <div className='bg-muted p-3 my-1 rounded-lg rounded-tl-none animate-pulse'>
                    ... Safta AI is typing
                </div>
            </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Please wait..." : "Ask something..."}
          disabled={isLoading}
          className="grow p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};