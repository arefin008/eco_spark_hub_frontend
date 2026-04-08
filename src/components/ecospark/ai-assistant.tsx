"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Bot, MessageCircleMore, SendHorizonal, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ideaService } from "@/services/idea.service";
import { aiService } from "@/services/ai.service";
import type { GeminiAssistantResponse, GeminiIdeaContext } from "@/types/gemini";

const starterPrompts = [
  "What is trending right now?",
  "Which paid idea looks most promising?",
  "How does idea review work?",
];

export function AiAssistant() {
  const [question, setQuestion] = useState(starterPrompts[0]);
  const [hasBootstrapped, setHasBootstrapped] = useState(false);
  const [response, setResponse] = useState<GeminiAssistantResponse>({
    answer: "Ask about trends, premium ideas, moderation, or what to explore next.",
    suggestions: starterPrompts,
  });
  const ideasQuery = useQuery({
    queryKey: ["ideas", "assistant"],
    queryFn: () => ideaService.list({ page: 1, limit: 100, sortBy: "TOP_VOTED" }),
  });
  const assistantMutation = useMutation({
    mutationFn: (input: { question: string; ideas: GeminiIdeaContext[] }) => aiService.assistant(input),
    onSuccess: (nextResponse) => setResponse(nextResponse),
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!hasBootstrapped && ideasQuery.isSuccess && ideasQuery.data.data.length) {
      setHasBootstrapped(true);
      assistantMutation.mutate({
        question: starterPrompts[0],
        ideas: ideasQuery.data.data.slice(0, 12).map((idea) => ({
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
      });
    }
  }, [assistantMutation, hasBootstrapped, ideasQuery.isSuccess, ideasQuery.data]);

  function askAssistant(nextQuestion: string) {
    const ideas = (ideasQuery.data?.data ?? []).slice(0, 12).map((idea) => ({
      id: idea.id,
      title: idea.title,
      category: idea.category.name,
      isPaid: idea.isPaid,
      upvotes: idea.upvotes,
      commentCount: idea.commentCount,
      problemStatement: idea.problemStatement,
      proposedSolution: idea.proposedSolution,
      description: idea.description,
    }));

    if (!nextQuestion.trim()) {
      toast.error("Enter a question first.");
      return;
    }

    assistantMutation.mutate({
      question: nextQuestion.trim(),
      ideas,
    });
  }

  return (
    <section className="rounded-3xl border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,251,248,0.98))] p-5 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] transition duration-300 hover:shadow-[0_28px_72px_-34px_rgba(15,23,42,0.34)] dark:border-emerald-500/15 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,28,19,0.98))] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/15 bg-emerald-600/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            <MessageCircleMore className="size-3.5" />
            Support Assistant
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Premium support, right inside the platform
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Ask about ideas, moderation, premium content, or next steps. The assistant responds using live EcoSpark Hub context in a clean support-style workspace.
            </p>
          </div>
        </div>
        <div className="hidden rounded-2xl border border-emerald-600/15 bg-emerald-600/10 p-3 text-emerald-700 md:block">
          <Sparkles className="size-5" />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-emerald-500/15 dark:bg-slate-900/70 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Bot className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">EcoSpark Support</p>
            <p className="mt-2 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-200">
              {response.answer}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {response.suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuestion(suggestion);
                askAssistant(suggestion);
              }}
              className="rounded-full border border-emerald-700/10 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition duration-200 hover:border-emerald-600/20 hover:bg-emerald-100"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              setQuestion(prompt);
              askAssistant(prompt);
            }}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition duration-200 hover:border-emerald-600/20 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-emerald-900/10 bg-white p-3 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.3)] dark:border-emerald-500/15 dark:bg-slate-900/80">
        <label className="block space-y-3">
          <span className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Message
          </span>
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-2 transition duration-200 focus-within:border-emerald-500/40 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.12)] dark:border-slate-700 dark:bg-slate-950/80 dark:focus-within:bg-slate-900">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="min-h-28 w-full resize-none bg-transparent px-3 py-3 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="Ask about trends, approvals, paid ideas, or platform workflow"
            />

            <div className="flex items-center justify-between gap-3 border-t border-slate-200/80 px-2 pt-3 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {assistantMutation.isPending ? "Preparing response..." : "Powered by Gemini"}
              </p>
              <button
                type="button"
                onClick={() => askAssistant(question)}
                disabled={assistantMutation.isPending || ideasQuery.isLoading}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(5,150,105,0.9)] transition duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {assistantMutation.isPending ? "Sending..." : "Send"}
                <SendHorizonal className="size-4" />
              </button>
            </div>
          </div>
        </label>
      </div>
    </section>
  );
}
