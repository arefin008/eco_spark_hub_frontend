import { apiEndpoints } from "@/lib/api-endpoints";
import { buildQueryString } from "@/lib/helpers";
import type { ApiMeta, ApiResponse } from "@/types/api";
import type { Idea, IdeaDetail } from "@/types/domain";

import { httpClient } from "./http-client";

export interface IdeaListParams {
  searchTerm?: string;
  categoryId?: string;
  authorId?: string;
  paymentStatus?: "PAID" | "FREE";
  isPaid?: boolean;
  minUpvotes?: number;
  sortBy?: "RECENT" | "TOP_VOTED" | "MOST_COMMENTED";
  page?: number;
  limit?: number;
}

export interface IdeaInput {
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  categoryId: string;
  isPaid: boolean;
  price?: number;
  mediaUrls?: string[];
}

export interface ReviewIdeaInput {
  action: "APPROVE" | "REJECT";
  rejectionReason?: string;
}

export const ideaService = {
  async list(params?: IdeaListParams) {
    const query = buildQueryString({
      searchTerm: params?.searchTerm,
      categoryId: params?.categoryId,
      authorId: params?.authorId,
      paymentStatus: params?.paymentStatus,
      isPaid: params?.isPaid,
      minUpvotes: params?.minUpvotes,
      sortBy: params?.sortBy,
      page: params?.page,
      limit: params?.limit,
    });

    const { data } = await httpClient.get<ApiResponse<Idea[]>>(
      `${apiEndpoints.ideas.list}${query ? `?${query}` : ""}`,
    );

    return {
      data: data.data,
      meta: data.meta as ApiMeta | undefined,
    };
  },
  async mine() {
    const { data } = await httpClient.get<ApiResponse<Idea[]>>(apiEndpoints.ideas.mine);
    return data.data;
  },
  async byId(id: string) {
    const { data } = await httpClient.get<ApiResponse<IdeaDetail>>(
      apiEndpoints.ideas.byId(id),
    );
    return data.data;
  },
  async create(payload: IdeaInput) {
    const { data } = await httpClient.post<ApiResponse<Idea>>(apiEndpoints.ideas.create, payload);
    return data.data;
  },
  async update(id: string, payload: Partial<IdeaInput>) {
    const { data } = await httpClient.patch<ApiResponse<Idea>>(
      apiEndpoints.ideas.update(id),
      payload,
    );
    return data.data;
  },
  async remove(id: string) {
    await httpClient.delete(apiEndpoints.ideas.remove(id));
  },
  async submit(id: string) {
    const { data } = await httpClient.patch<ApiResponse<Idea>>(apiEndpoints.ideas.submit(id));
    return data.data;
  },
  async review(id: string, payload: ReviewIdeaInput) {
    const { data } = await httpClient.patch<ApiResponse<Idea>>(
      apiEndpoints.ideas.review(id),
      payload,
    );
    return data.data;
  },
};
