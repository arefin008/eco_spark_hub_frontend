"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

import { ChatHeader } from "@/components/ecospark/chat-header";
import { ChatInput } from "@/components/ecospark/chat-input";
import { ChatMessages, type ChatMessage } from "@/components/ecospark/chat-messages";
import { ChatToggleButton } from "@/components/ecospark/chat-toggle-button";
import { aiService } from "@/services/ai.service";
import { ideaService } from "@/services/idea.service";
import { cn } from "@/lib/utils";

const initialMessages: ChatMessage[] = [
  {
    id: "initial-assistant",
    sender: "assistant",
    content: "Hello. Ask about trending ideas, paid content, moderation, or what to explore next.",
  },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const ideasQuery = useQuery({
    queryKey: ["ideas", "chat-widget-assistant"],
    queryFn: () => ideaService.list({ page: 1, limit: 100, sortBy: "TOP_VOTED" }),
  });
  const assistantMutation = useMutation({
    mutationFn: (question: string) =>
      aiService.assistant({
        question,
        ideas: (ideasQuery.data?.data ?? []).slice(0, 12).map((idea) => ({
          id: idea.id,
          title: idea.title,
          category: idea.category.name,
          isPaid: idea.isPaid,
          upvotes: idea.upvotes,
          commentCount: idea.commentCount,
          problemStatement: idea.problemStatement,
          proposedSolution: idea.proposedSolution,
          description: idea.description,
        })),
      }),
    onSuccess: (result) => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          content: result.answer,
        },
      ]);
    },
    onError: () => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          sender: "assistant",
          content: "I could not generate a response right now. Please try again in a moment.",
        },
      ]);
    },
  });

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const badgeLabel = useMemo(() => "Powered by EcoSpark Support", []);

  function handleSubmit() {
    const value = draft.trim();

    if (!value || assistantMutation.isPending) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `message-${Date.now()}`,
        sender: "user",
        content: value,
      },
    ]);
    setDraft("");
    assistantMutation.mutate(value);
  }

  return (
    <div
      data-lenis-prevent
      data-scroll-lock
      className="pointer-events-none fixed inset-x-0 bottom-3 z-50 px-3 sm:bottom-4 sm:inset-x-auto sm:right-5 sm:px-0"
    >
      <div className="flex flex-col items-end gap-3">
        <div
          className={cn(
            "pointer-events-auto w-full max-w-[22rem] overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_28px_80px_-34px_rgba(15,23,42,0.32)] transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 sm:max-w-none sm:w-[380px] sm:rounded-[30px]",
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0",
          )}
        >
          <ChatHeader onClose={() => setOpen(false)} />

          <div className="flex h-[min(62vh,32rem)] flex-col bg-[linear-gradient(180deg,#f6faf7,#eef7f1)] dark:bg-[linear-gradient(180deg,#0f172a,#092016)] sm:h-[min(68vh,36rem)]">
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
              <ChatMessages messages={messages} />
            </div>

            <div className="px-4 pb-3">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium tracking-[0.01em] text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                {assistantMutation.isPending ? "EcoSpark Support is typing..." : badgeLabel}
              </div>
            </div>

            <ChatInput
              value={draft}
              onChange={setDraft}
              onSubmit={handleSubmit}
              disabled={assistantMutation.isPending || ideasQuery.isLoading}
            />
          </div>
        </div>

        <ChatToggleButton open={open} onClick={() => setOpen((value) => !value)} />
      </div>
    </div>
  );
}
