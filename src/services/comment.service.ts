import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { Comment } from "@/types/domain";

import { httpClient } from "./http-client";

export interface CommentInput {
  ideaId: string;
  content: string;
  parentId?: string;
}

export const commentService = {
  async listByIdea(ideaId: string) {
    const { data } = await httpClient.get<ApiResponse<Comment[]>>(
      apiEndpoints.comments.listByIdea(ideaId),
    );
    return data.data;
  },
  async create(payload: CommentInput) {
    const { data } = await httpClient.post<ApiResponse<Comment>>(
      apiEndpoints.comments.create,
      payload,
    );
    return data.data;
  },
  async remove(id: string) {
    await httpClient.delete(apiEndpoints.comments.remove(id));
  },
};
