"use client";

import { ImagePlus, Paperclip, SendHorizonal } from "lucide-react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export function ChatInput({ value, onChange, onSubmit, disabled = false }: ChatInputProps) {
  return (
    <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3">
      <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition focus-within:border-[#16a34a]/35 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(22,163,74,0.12)]">
        <div className="flex items-end gap-3">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSubmit();
              }
            }}
            placeholder="Type here and press enter.."
            className="h-11 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex items-center gap-1 text-slate-500">
            <button
              type="button"
              disabled={disabled}
              className="inline-flex size-8 items-center justify-center rounded-full transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Attach file"
            >
              <Paperclip className="size-4" />
            </button>
            <button
              type="button"
              disabled={disabled}
              className="inline-flex size-8 items-center justify-center rounded-full transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Add image"
            >
              <ImagePlus className="size-4" />
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={disabled}
              className="inline-flex size-8 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-[0_10px_20px_-12px_rgba(22,163,74,0.9)] transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Send message"
            >
              <SendHorizonal className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
