import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  GeminiAssistantRequest,
  GeminiAssistantResponse,
  GeminiDraftAssistInput,
  GeminiDraftAssistResponse,
} from "@/types/gemini";
import { httpClient } from "./http-client";

export const aiService = {
  async assistant(input: GeminiAssistantRequest) {
    const { data } = await httpClient.post<ApiResponse<GeminiAssistantResponse>>(
      apiEndpoints.ai.assistant,
      input,
    );
    return data.data;
  },
  async draftAssist(input: GeminiDraftAssistInput) {
    const { data } = await httpClient.post<ApiResponse<GeminiDraftAssistResponse>>(
      apiEndpoints.ai.draft,
      input,
    );
    return data.data;
  },
};
