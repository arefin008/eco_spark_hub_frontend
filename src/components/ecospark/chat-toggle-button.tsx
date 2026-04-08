"use client";

import { MessageCircleMore, X } from "lucide-react";

type ChatToggleButtonProps = {
  open: boolean;
  onClick: () => void;
};

export function ChatToggleButton({ open, onClick }: ChatToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto inline-flex size-13 items-center justify-center rounded-full bg-[linear-gradient(180deg,#16a34a,#15803d)] text-white shadow-[0_22px_45px_-24px_rgba(22,163,74,0.95)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_28px_55px_-24px_rgba(21,128,61,0.95)] sm:size-15"
      aria-label={open ? "Close support chat" : "Open support chat"}
    >
      {open ? <X className="size-5" /> : <MessageCircleMore className="size-5" />}
    </button>
  );
}
