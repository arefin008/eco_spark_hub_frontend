"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import type { Idea } from "@/types/domain";

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="bg-card/90 shadow-emerald-950/5">
      <CardContent className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge>{idea.category.name}</Badge>
            {idea.isPaid ? (
              <Badge variant="warning" className="gap-1">
                <Lock className="size-3" />
                {formatCurrency(idea.price)}
              </Badge>
            ) : (
              <Badge variant="success">Free access</Badge>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{idea.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {idea.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-5 text-sm text-muted-foreground">
        <span>By {idea.author.name}</span>
        <span>{formatDate(idea.createdAt)}</span>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ThumbsUp className="size-4 text-emerald-600" />
            {idea.upvotes}
          </span>
          <span className="inline-flex items-center gap-1">
            <ThumbsDown className="size-4 text-rose-600" />
            {idea.downvotes}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-4" />
            {idea.commentCount}
          </span>
        </div>

        <Link
          href={`/ideas/${idea.id}`}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "rounded-full px-4",
          )}
        >
          View Idea
          <ArrowRight className="size-4" />
        </Link>
      </div>
      </CardContent>
      </Card>
    </motion.article>
  );
}
