"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

type WindowWithLenis = Window & {
  __ecosparkLenis?: {
    scrollTo: (target: number, options?: { duration?: number }) => void;
  };
};

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 180);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const appWindow = window as WindowWithLenis;

    if (appWindow.__ecosparkLenis) {
      appWindow.__ecosparkLenis.scrollTo(0, { duration: 1 });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={[
        "fixed bottom-[4.9rem] right-4 z-40 flex size-11 items-center justify-center rounded-full",
        "border border-border/70 bg-background/92 text-foreground shadow-[0_18px_40px_-20px_rgba(15,23,42,0.4)]",
        "backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary",
        "sm:bottom-[5.7rem] sm:right-5",
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      ].join(" ")}
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
