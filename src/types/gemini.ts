export interface GeminiIdeaContext {
  id: string;
  title: string;
  category: string;
  isPaid: boolean;
  upvotes: number;
  commentCount: number;
  problemStatement: string;
  proposedSolution: string;
  description: string;
}

export interface GeminiAssistantRequest {
  question: string;
  ideas: GeminiIdeaContext[];
}

export interface GeminiAssistantResponse {
  answer: string;
  suggestions: string[];
}

export interface GeminiDraftAssistInput {
  title: string;
  categoryName?: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  isPaid: boolean;
}

export interface GeminiDraftAssistResponse {
  title: string;
  categoryHint: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  mediaUrls: string;
  price?: number;
  readinessScore: number;
  reasons: string[];
}
