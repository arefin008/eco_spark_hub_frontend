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
      anchors: true,
      stopInertiaOnNavigate: true,
      prevent: (node) => {
        for (let element: HTMLElement | null = node; element; element = element.parentElement) {
          if (
            element.matches(
              "input, textarea, select, option, iframe, dialog, [contenteditable='true']",
            ) ||
            element.hasAttribute("data-lenis-prevent") ||
            element.hasAttribute("data-scroll-lock")
          ) {
            return true;
          }

          const style = window.getComputedStyle(element);
          const isScrollableY =
            /(auto|scroll|overlay)/.test(style.overflowY) &&
            element.scrollHeight > element.clientHeight;
          const isScrollableX =
            /(auto|scroll|overlay)/.test(style.overflowX) &&
            element.scrollWidth > element.clientWidth;

          if (isScrollableY || isScrollableX) {
            return true;
          }
        }

        return false;
      },
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
