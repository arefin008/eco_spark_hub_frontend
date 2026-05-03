import { Toaster } from "@/components/ui/sonner";
import AppProviders from "@/providers/AppProviders";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eco Spark Hub | Sustainable Innovation, Green Tech & Eco Ideas",
  description:
    "Eco Spark Hub is a platform for sustainable innovation, eco-friendly ideas, and green technology solutions. Explore projects, insights, and environmental impact tools.",
  keywords: [
    "eco spark hub",
    "sustainable innovation",
    "green technology",
    "eco friendly ideas",
    "environment platform"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>
          {children}
          <Toaster position="top-right" richColors />
        </AppProviders>
      </body>
    </html>
  );
}
