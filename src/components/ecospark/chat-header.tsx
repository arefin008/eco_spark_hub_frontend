"use client";

import { ArrowLeft } from "lucide-react";

type ChatHeaderProps = {
  onClose: () => void;
};

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="grid grid-cols-[40px_1fr_40px] items-center rounded-t-[28px] bg-[linear-gradient(180deg,#16a34a,#15803d)] px-3 py-3 text-white sm:px-4">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex size-10 items-center justify-center rounded-full bg-white/12 transition hover:bg-white/18"
        aria-label="Close chat widget"
      >
        <ArrowLeft className="size-4.5" />
      </button>

      <div className="min-w-0 px-2 text-center">
        <p className="truncate text-[13px] font-semibold tracking-[0.02em] sm:text-sm">
          EcoSpark Support
        </p>
        <p className="truncate text-[11px] text-white/80 sm:text-xs">
          We typically reply instantly
        </p>
      </div>

      <div aria-hidden="true" className="size-10" />
    </div>
  );
}
