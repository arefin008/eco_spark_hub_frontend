export type UserRole = "MEMBER" | "ADMIN";
export type UserStatus = "ACTIVE" | "DEACTIVATED";
export type IdeaStatus = "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
export type VoteType = "UPVOTE" | "DOWNVOTE";
export type PurchaseStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaMedia {
  id: string;
  url: string;
  altText?: string | null;
}

export interface IdeaAuthor {
  id: string;
  name: string;
  email: string;
}

export interface Idea {
  id: string;
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  isPaid: boolean;
  price?: number | string | null;
  status: IdeaStatus;
  rejectionReason?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  authorId?: string;
  categoryId?: string;
  author: IdeaAuthor;
  category: Category;
  media: IdeaMedia[];
  upvotes: number;
  downvotes: number;
  commentCount: number;
  voteCount: number;
  canAccess?: true;
}

export interface LockedIdea {
  id: string;
  title: string;
  isPaid: true;
  price?: number | string | null;
  category: Category;
  author: IdeaAuthor;
  createdAt: string;
  canAccess: false;
  lockReason: string;
}

export type IdeaDetail = Idea | LockedIdea;

export interface Comment {
  id: string;
  content: string;
  ideaId: string;
  userId: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  user: IdeaAuthor;
}

export interface Purchase {
  id: string;
  ideaId: string;
  userId: string;
  amount: number | string;
  currency: string;
  status: PurchaseStatus;
  paymentProvider: string;
  transactionId?: string | null;
  purchasedAt?: string | null;
  createdAt: string;
  idea: {
    id: string;
    title: string;
    isPaid: boolean;
    price?: number | string | null;
  };
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  sessionToken?: string;
  user: User;
}

export interface AdminStats {
  totalUsers: number;
  totalIdeas: number;
  approvedIdeas: number;
  rejectedIdeas: number;
  underReviewIdeas: number;
  totalComments: number;
  totalPaidPurchases: number;
}
