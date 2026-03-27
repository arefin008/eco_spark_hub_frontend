"use client";

import { ThemeProvider } from "next-themes";

import QueryProviders from "@/providers/QueryProvider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProviders>{children}</QueryProviders>
    </ThemeProvider>
  );
}
