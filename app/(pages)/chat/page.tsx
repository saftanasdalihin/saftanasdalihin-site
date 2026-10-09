import { ChatInterface } from "@/components/chatbot/ChatInterface";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat with Safta AI | Smart Contract Developer",
  description:
    "Chat with Safta AI about Safta Nasdalihin's background and portfolio, with project information grounded in GitHub evidence.",
};

export default function ChatPage() {
  return (
    <main className="mx-auto flex h-[calc(100dvh-5rem)] min-h-[34rem] w-full max-w-6xl flex-col px-3 pb-4 pt-5 sm:px-6 sm:pt-7">
      <header className="mb-5 flex shrink-0 flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Safta <span className="text-primary">AI</span>
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            A portfolio assistant for Safta&apos;s background, smart contract projects, and GitHub-backed evidence.
          </p>
        </div>
        <div className="hidden items-center gap-2 pb-1 text-xs text-muted-foreground sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Portfolio assistant
        </div>
      </header>
      <div className="min-h-0 flex-1">
        <ChatInterface />
      </div>
    </main>
  );
}
