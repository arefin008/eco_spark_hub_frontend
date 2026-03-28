"use client";

import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { newsletterService } from "@/services/newsletter.service";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: newsletterService.subscribe,
    onSuccess: () => {
      toast.success("Subscribed to the EcoSpark Hub newsletter.");
      setEmail("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate(email);
      }}
    >
      <label className="flex h-12 flex-1 items-center gap-3 rounded-full border border-border bg-background px-4">
        <Mail className="size-4 text-muted-foreground" />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email for updates"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>
      <Button size="lg" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Subscribing..." : "Join Newsletter"}
      </Button>
    </form>
  );
}
