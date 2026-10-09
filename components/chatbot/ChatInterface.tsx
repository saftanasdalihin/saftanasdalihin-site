"use client";

import React, { FormEvent, useCallback, useLayoutEffect, useRef, useState, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";

interface ChatContent {
  role: "user" | "model";
  parts: { text: string }[];
}

const MAX_INPUT_HEIGHT = 192;

const SUGGESTIONS = [
  "Tell me about Safta's background",
  "Explain the MiniDAO Treasury project",
  "What smart contract projects has Safta built?",
  "What can Safta AI verify from GitHub?",
];

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatContent[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamStarted, setStreamStarted] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottomRef = useRef(true);

  const resizeInput = useCallback(() => {
    const element = inputRef.current;
    if (!element) return;

    element.style.height = "auto";
    const nextHeight = Math.min(element.scrollHeight, MAX_INPUT_HEIGHT);
    element.style.height = Math.max(36, nextHeight) + "px";
    element.style.overflowY = element.scrollHeight > MAX_INPUT_HEIGHT ? "auto" : "hidden";
  }, []);

  useLayoutEffect(() => {
    resizeInput();
  }, [input, resizeInput]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container || !stickToBottomRef.current) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
  }, [messages, isLoading]);

  const handleMessagesScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 120;
  }, []);

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || isLoading) return;

    const updatedMessages: ChatContent[] = [
      ...messages,
      { role: "user", parts: [{ text: prompt }] },
    ];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setStreamStarted(false);
    stickToBottomRef.current = true;

    let accumulatedText = "";

    const appendText = (chunk: string) => {
      if (!chunk) return;
      accumulatedText += chunk;
      setStreamStarted(true);
      setMessages((current) => {
        const last = current[current.length - 1];
        const nextMessage: ChatContent = {
          role: "model",
          parts: [{ text: accumulatedText }],
        };

        if (last?.role === "model") {
          return [...current.slice(0, -1), nextMessage];
        }
        return [...current, nextMessage];
      });
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        let message = "Safta AI couldn't answer that right now. Please try again.";
        try {
          const errorData = (await response.json()) as { error?: string };
          if (errorData.error) message = errorData.error;
        } catch {
          // Keep the safe fallback message if the API error isn't JSON.
        }
        throw new Error(message);
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data = (await response.json()) as { response?: string };
        appendText(data.response || "Sorry, I couldn't process that.");
      } else {
        if (!response.body) throw new Error("The response stream is unavailable.");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const result = await reader.read();
          if (result.done) break;
          appendText(decoder.decode(result.value, { stream: true }));
        }
        appendText(decoder.decode());
      }

      if (!accumulatedText.trim()) {
        appendText("I couldn't generate a response. Please try again.");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "A connection error occurred. Please try again.";

      setMessages((current) => {
        const last = current[current.length - 1];
        if (accumulatedText && last?.role === "model") {
          return [
            ...current.slice(0, -1),
            {
              role: "model",
              parts: [
                {
                  text: accumulatedText + "\n\n*The connection was interrupted before the response finished.*",
                },
              ],
            },
          ];
        }
        return [...current, { role: "model", parts: [{ text: message }] }];
      });
    } finally {
      setIsLoading(false);
      setStreamStarted(false);
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div
        ref={chatContainerRef}
        onScroll={handleMessagesScroll}
        aria-live="polite"
        aria-relevant="additions text"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7"
      >
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center py-8 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted/50 text-2xl font-semibold tracking-tight">
              S
            </div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              What can I help you explore?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Ask about Safta&apos;s background, Solidity projects, or implementation details that can be verified from GitHub.
            </p>

            <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="min-h-14 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                text={message.parts[0].text}
                sender={message.role === "user" ? "user" : "ai"}
              />
            ))}

            {isLoading && !streamStarted && (
              <div className="flex items-center gap-3 py-2 text-sm text-muted-foreground">
                <span className="flex gap-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                </span>
                Safta AI is preparing a response...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-background/95 px-3 pb-3 pt-3 sm:px-5 sm:pb-4">
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
          <div className="flex items-end gap-2 rounded-2xl border border-input bg-background px-3 py-2 shadow-sm transition focus-within:ring-2 focus-within:ring-ring/50 sm:rounded-3xl sm:px-4">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (!isLoading && input.trim()) event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={isLoading ? "Write your next message..." : "Message Safta AI"}
              aria-label="Message Safta AI"
              className="max-h-48 min-h-9 flex-1 resize-none overflow-y-hidden border-0 bg-transparent py-2 text-sm leading-6 outline-none ring-0 placeholder:text-muted-foreground focus:outline-none focus:ring-0 sm:text-base"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              title="Send message"
              className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </button>
          </div>
          <p className="mt-2 px-1 text-center text-[11px] text-muted-foreground sm:text-xs">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </div>
    </section>
  );
};
