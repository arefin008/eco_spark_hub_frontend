"use client";

import { cn } from "@/lib/utils";

export type ChatMessage = {
  id: string;
  content: string;
  sender: "user" | "assistant";
};

type ChatMessagesProps = {
  messages: ChatMessage[];
};

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[82%] rounded-[22px] px-4 py-3 text-sm leading-7 shadow-sm",
                message.sender === "user"
                  ? "rounded-br-md bg-[#dcf8e8] text-slate-900"
                  : "rounded-bl-md border border-slate-200 bg-white text-slate-700",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
