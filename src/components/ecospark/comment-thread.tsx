"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircleReply, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDate } from "@/lib/helpers";
import { commentService } from "@/services/comment.service";
import type { Comment, ThreadComment, User } from "@/types/domain";

interface CommentNode extends Comment {
  replies: CommentNode[];
}

export function CommentThread({ ideaId }: { ideaId: string }) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const [newComment, setNewComment] = useState("");
  const commentsQuery = useQuery({
    queryKey: ["comments", ideaId],
    queryFn: () => commentService.listByIdea(ideaId),
  });

  const createMutation = useMutation({
    mutationFn: commentService.create,
    onSuccess: async () => {
      toast.success("Comment posted.");
      setNewComment("");
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
  const roots = useMemo(() => normalizeCommentTree(comments), [comments]);

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

              if (!newComment.trim()) {
                return;
              }

              createMutation.mutate({
                ideaId,
                content: newComment.trim(),
              });
            }}
          >
            <Textarea
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder="Add a constructive comment..."
              className="min-h-28 rounded-3xl"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled={createMutation.isPending || !newComment.trim()} type="submit">
                {createMutation.isPending ? "Posting..." : "Comment"}
              </Button>
            </div>
          </form>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Sign in to vote and join the discussion.
          </p>
        )}
      </div>

      {commentsQuery.isLoading ? (
        <div className="rounded-[28px] border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          Loading discussion...
        </div>
      ) : null}

      {!commentsQuery.isLoading && roots.length === 0 ? (
        <div className="rounded-[28px] border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          No comments yet. Start the discussion.
        </div>
      ) : null}

      <div className="space-y-4">
        {roots.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            ideaId={ideaId}
            onCreateReply={(payload) => createMutation.mutate(payload)}
            onDelete={(commentId) => deleteMutation.mutate(commentId)}
            isSubmittingReply={createMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}

function normalizeCommentTree(comments: ThreadComment[]) {
  const seen = new Set<string>();
  const flatComments: Comment[] = [];

  function visit(comment: ThreadComment) {
    if (seen.has(comment.id)) {
      return;
    }

    seen.add(comment.id);
    flatComments.push({
      id: comment.id,
      content: comment.content,
      ideaId: comment.ideaId,
      userId: comment.userId,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: comment.user,
    });

    const replies = comment.replies ?? [];

    for (const reply of replies) {
      visit(reply);
    }
  }

  for (const comment of comments) {
    visit(comment);
  }

  return buildTreeFromFlatComments(flatComments);
}

function buildTreeFromFlatComments(comments: Comment[]) {
  const nodes = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  const sortedComments = [...comments].sort(
    (left, right) =>
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );

  for (const comment of sortedComments) {
    nodes.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of sortedComments) {
    const node = nodes.get(comment.id);

    if (!node) {
      continue;
    }

    const parentId = comment.parentId?.trim();

    if (parentId) {
      const parent = nodes.get(parentId);

      if (parent) {
        parent.replies.push(node);
        continue;
      }
    }

    roots.push(node);
  }

  return roots;
}

function CommentItem({
  comment,
  currentUser,
  ideaId,
  onCreateReply,
  onDelete,
  isSubmittingReply,
  isDeleting,
  depth = 0,
}: {
  comment: CommentNode;
  currentUser?: User;
  ideaId: string;
  onCreateReply: (payload: { ideaId: string; content: string; parentId?: string }) => void;
  onDelete: (commentId: string) => void;
  isSubmittingReply: boolean;
  isDeleting: boolean;
  depth?: number;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const canDelete = currentUser?.role === "ADMIN" || currentUser?.id === comment.userId;
  const isRoot = depth === 0;

  function openReply() {
    setIsReplying(true);

    requestAnimationFrame(() => {
      replyRef.current?.focus();
      replyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function submitReply() {
    const trimmed = replyContent.trim();

    if (!trimmed) {
      return;
    }

    onCreateReply({
      ideaId,
      content: trimmed,
      parentId: comment.id,
    });
    setReplyContent("");
    setIsReplying(false);
  }

  return (
    <article
      className={
        isRoot
          ? "rounded-[28px] border border-border/80 bg-card p-6"
          : "rounded-2xl bg-secondary/50 p-4"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={isRoot ? "font-semibold" : "font-medium"}>{comment.user.name}</p>
          <p
            className={isRoot ? "text-sm text-muted-foreground" : "text-xs text-muted-foreground"}
          >
            {formatDate(comment.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {currentUser ? (
            <Button variant="ghost" size="sm" onClick={openReply}>
              <MessageCircleReply className="size-4" />
              Reply
            </Button>
          ) : null}
          {canDelete ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              onClick={() => onDelete(comment.id)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          ) : null}
        </div>
      </div>

      <p
        className={
          isRoot
            ? "mt-4 text-sm leading-7 text-muted-foreground"
            : "mt-3 text-sm leading-6 text-muted-foreground"
        }
      >
        {comment.content}
      </p>

      {currentUser && isReplying ? (
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            submitReply();
          }}
        >
          <p className="text-sm text-muted-foreground">
            Replying to <span className="font-medium text-foreground">{comment.user.name}</span>
          </p>
          <Textarea
            ref={replyRef}
            value={replyContent}
            onChange={(event) => setReplyContent(event.target.value)}
            placeholder="Write your reply..."
            className="min-h-24 rounded-2xl"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled={isSubmittingReply || !replyContent.trim()} type="submit">
              {isSubmittingReply ? "Posting..." : "Reply"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsReplying(false);
                setReplyContent("");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      {comment.replies.length ? (
        <div
          className={
            isRoot
              ? "mt-5 space-y-3 border-l border-border pl-4"
              : "mt-4 space-y-3 border-l border-border/70 pl-4"
          }
        >
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              ideaId={ideaId}
              onCreateReply={onCreateReply}
              onDelete={onDelete}
              isSubmittingReply={isSubmittingReply}
              isDeleting={isDeleting}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
