export type IdeaStatus = "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface IdeaCard {
  id: string;
  title: string;
  category: string;
  summary: string;
  voteScore: number;
  isPaid: boolean;
  author: string;
  publishedAt: string;
  status: IdeaStatus;
  problemStatement: string;
  proposedSolution: string;
  description: string;
}
