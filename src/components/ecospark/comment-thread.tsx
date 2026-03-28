"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircleReply, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDate } from "@/lib/helpers";
import { commentService } from "@/services/comment.service";

export function CommentThread({ ideaId }: { ideaId: string }) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | undefined>();
  const { data: currentUser } = useCurrentUser();
  const commentsQuery = useQuery({
    queryKey: ["comments", ideaId],
    queryFn: () => commentService.listByIdea(ideaId),
  });

  const createMutation = useMutation({
    mutationFn: commentService.create,
    onSuccess: async () => {
      toast.success("Comment posted.");
      setContent("");
      setReplyingTo(undefined);
      await queryClient.invalidateQueries({ queryKey: ["comments", ideaId] });
      await queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: commentService.remove,
    onSuccess: async () => {
      toast.success("Comment removed.");
      await queryClient.invalidateQueries({ queryKey: ["comments", ideaId] });
      await queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
    onError: (error) => toast.error(error.message),
  });

  const comments = commentsQuery.data ?? [];
  const roots = comments.filter((comment) => !comment.parentId);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border/80 bg-card p-6">
        <h3 className="text-2xl font-semibold">Discussion</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Share experiences, feedback, and implementation questions.
        </p>

        {currentUser ? (
          <form
            className="mt-5 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate({ ideaId, content, parentId: replyingTo });
            }}
          >
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={
                replyingTo ? "Write your reply..." : "Add a constructive comment..."
              }
              className="min-h-28 w-full rounded-3xl border border-border bg-background px-4 py-3 outline-none"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled={createMutation.isPending || !content.trim()} type="submit">
                {createMutation.isPending ? "Posting..." : replyingTo ? "Reply" : "Comment"}
              </Button>
              {replyingTo ? (
                <Button variant="outline" type="button" onClick={() => setReplyingTo(undefined)}>
                  Cancel reply
                </Button>
              ) : null}
            </div>
          </form>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Sign in to vote and join the discussion.
          </p>
        )}
      </div>

      <div className="space-y-4">
        {roots.map((comment) => {
          const replies = comments.filter((item) => item.parentId === comment.id);
          const canDelete =
            currentUser?.role === "ADMIN" || currentUser?.id === comment.userId;

          return (
            <article key={comment.id} className="rounded-[28px] border border-border/80 bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{comment.user.name}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  {currentUser ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(comment.id)}
                    >
                      <MessageCircleReply className="size-4" />
                      Reply
                    </Button>
                  ) : null}
                  {canDelete ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(comment.id)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{comment.content}</p>

              {replies.length ? (
                <div className="mt-5 space-y-3 border-l border-border pl-4">
                  {replies.map((reply) => {
                    const canDeleteReply =
                      currentUser?.role === "ADMIN" || currentUser?.id === reply.userId;

                    return (
                      <div key={reply.id} className="rounded-2xl bg-secondary/50 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium">{reply.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(reply.createdAt)}
                            </p>
                          </div>
                          {canDeleteReply ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMutation.mutate(reply.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {reply.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
