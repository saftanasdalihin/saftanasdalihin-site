// components/chatbot/MessageBubble.tsx

import React from 'react';

interface MessageProps {
  text: string;
  sender: 'user' | 'ai';
}

export const MessageBubble: React.FC<MessageProps> = ({ text, sender }) => {
  const isUser = sender === 'user';
  
  const bubbleClasses = isUser
    ? 'bg-primary text-primary-foreground ml-auto rounded-br-none'
    : 'bg-muted text-foreground rounded-tl-none';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-xs md:max-w-md p-3 my-1 rounded-lg shadow-md ${bubbleClasses}`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
};