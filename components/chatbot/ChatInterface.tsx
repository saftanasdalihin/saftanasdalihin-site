// components/chatbot/ChatInterface.tsx

"use client";

import React, { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import { MessageBubble } from './MessageBubble';

interface ChatContent {
  role: 'user' | 'model';
  parts: { text: string }[]; 
}

const MAX_ROWS = 7;

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatContent[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [textAreaRows, setTextAreaRows] = useState(1); 

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // --- Utility: Scroll to Bottom ---
  const scrollToBottom = useCallback(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, []);

  // --- Auto-focus on Mount ---
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // --- Logic: Handle Textarea Auto-Resize ---
  useEffect(() => {
    if (inputRef.current) {
      const currentLines = input.split('\n').length;
      const rowsToShow = Math.min(MAX_ROWS, Math.max(1, currentLines));
      setTextAreaRows(rowsToShow);
    }
  }, [input]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatContent = { 
      role: 'user', 
      parts: [{ text: input }] 
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Initial scroll after user sends message
    setTimeout(scrollToBottom, 50);
    
    setInput('');
    setIsLoading(true);
    setTextAreaRows(1);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }), 
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');

      const data = await response.json();
      
      const aiResponse: ChatContent = { 
        role: 'model', 
        parts: [{ text: data.response || "Sorry, I couldn't process that." }] 
      };

      setMessages((prev) => [...prev, aiResponse]);
      setTimeout(scrollToBottom, 50); // Scroll again after AI response
      
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: ChatContent = { 
        role: 'model', 
        parts: [{ text: "A system error occurred. Please try again later." }] 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg shadow-xl overflow-hidden">
      {/* Messages Display Area */}
      <div 
        ref={chatContainerRef} 
        className="grow p-4 space-y-4 overflow-y-auto"
      >
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground pt-10">
            Hi! I'm Safta AI. Feel free to ask about this website, my projects, or my expertise in Smart Contracts and Web3.
          </div>
        )}

        {messages.map((msg, index) => (
          <MessageBubble 
            key={index} 
            text={msg.parts[0].text}
            sender={msg.role === 'user' ? 'user' : 'ai'} 
          />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 my-1 rounded-lg rounded-tl-none animate-pulse">
              Safta AI is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Form Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background flex gap-2">
        <textarea
          ref={inputRef}
          rows={textAreaRows} 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as FormEvent);
            }
          }}
          placeholder={isLoading ? "Processing..." : "Type your message..."}
          disabled={isLoading}
          className="grow p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed resize-none overflow-y-auto"
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