"use client";

import { useEffect } from "react";
import Lenis from "lenis";

type WindowWithLenis = Window & {
  __ecosparkLenis?: Lenis;
};

export function HomeLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.05,
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      touchMultiplier: 1,
    });

    (window as WindowWithLenis).__ecosparkLenis = lenis;

    return () => {
      const appWindow = window as WindowWithLenis;

      if (appWindow.__ecosparkLenis === lenis) {
        delete appWindow.__ecosparkLenis;
      }

      lenis.destroy();
    };
  }, []);

  return null;
}
