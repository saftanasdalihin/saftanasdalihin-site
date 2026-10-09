"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  text: string;
  sender: "user" | "ai";
}

export const MessageBubble: React.FC<MessageProps> = ({ text, sender }) => {
  const isUser = sender === "user";

  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-[min(88%,42rem)] break-words rounded-3xl rounded-br-lg bg-muted px-4 py-3 text-sm leading-6 text-foreground sm:px-5 sm:py-3.5 sm:text-base">
          <div className="whitespace-pre-wrap">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-foreground">
      <div className="max-w-none break-words text-sm leading-7 sm:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-xl [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-lg [&_h3]:mb-2 [&_h3]:mt-5 [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
};
