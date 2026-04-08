import { formatCurrency } from "@/lib/helpers";
import type { AdminStats, Idea, Purchase, User } from "@/types/domain";
import type { GeminiAssistantResponse, GeminiDraftAssistInput, GeminiDraftAssistResponse } from "@/types/gemini";

export type AiUserProfile = {
  searchHistory: string[];
  categoryHistory: string[];
  viewedIdeaIds: string[];
  prefersPaid: boolean;
};

export type SearchSuggestion = {
  label: string;
  type: "idea" | "category" | "keyword";
  reason: string;
};

export type InsightCard = {
  title: string;
  description: string;
  tone: "info" | "success" | "warning";
};

export type DraftAssist = GeminiDraftAssistResponse;
export type DraftAssistInput = GeminiDraftAssistInput;
export type IdeaAssistantResponse = GeminiAssistantResponse;

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "into",
  "from",
  "your",
  "their",
  "this",
  "will",
  "have",
  "about",
  "across",
  "through",
  "using",
  "idea",
  "community",
]);

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getIdeaText(idea: Idea) {
  return [
    idea.title,
    idea.category.name,
    idea.problemStatement,
    idea.proposedSolution,
    idea.description,
  ]
    .join(" ")
    .toLowerCase();
}

function getKeywordPool(ideas: Idea[]) {
  const counts = new Map<string, number>();

  for (const idea of ideas) {
    for (const token of getIdeaText(idea).split(/[^a-z0-9]+/)) {
      if (token.length < 4 || STOP_WORDS.has(token)) continue;
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([token]) => token);
}

export function getTrendingIdeas(ideas: Idea[], limit = 4) {
  return ideas
    .slice()
    .sort((left, right) => {
      const leftScore = left.upvotes * 2 + left.commentCount * 3 - left.downvotes;
      const rightScore = right.upvotes * 2 + right.commentCount * 3 - right.downvotes;
      return rightScore - leftScore;
    })
    .slice(0, limit);
}

export function getSearchSuggestions(ideas: Idea[], query: string, limit = 6): SearchSuggestion[] {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    const categories = Array.from(new Set(ideas.map((idea) => idea.category.name))).slice(0, 3);
    const keywords = getKeywordPool(ideas).slice(0, 3);

    return [
      ...categories.map((category) => ({
        label: category,
        type: "category" as const,
        reason: "Popular category",
      })),
      ...keywords.map((keyword) => ({
        label: keyword,
        type: "keyword" as const,
        reason: "Trending keyword",
      })),
    ].slice(0, limit);
  }

  const ideaMatches = ideas
    .filter((idea) => getIdeaText(idea).includes(normalizedQuery))
    .slice(0, limit)
    .map((idea) => ({
      label: idea.title,
      type: "idea" as const,
      reason: `${idea.category.name} idea with ${idea.upvotes} upvotes`,
    }));

  const categoryMatches = Array.from(new Set(ideas.map((idea) => idea.category.name)))
    .filter((category) => normalize(category).includes(normalizedQuery))
    .slice(0, 2)
    .map((category) => ({
      label: category,
      type: "category" as const,
      reason: "Category match",
    }));

  const keywordMatches = getKeywordPool(ideas)
    .filter((keyword) => keyword.includes(normalizedQuery))
    .slice(0, 2)
    .map((keyword) => ({
      label: keyword,
      type: "keyword" as const,
      reason: "Keyword match",
    }));

  return [...ideaMatches, ...categoryMatches, ...keywordMatches].slice(0, limit);
}

export function getPersonalizedIdeas(ideas: Idea[], profile: AiUserProfile, limit = 4) {
  const categoryWeights = new Map<string, number>();

  for (const category of profile.categoryHistory) {
    categoryWeights.set(category, (categoryWeights.get(category) ?? 0) + 2);
  }

  for (const search of profile.searchHistory) {
    for (const idea of ideas) {
      if (getIdeaText(idea).includes(normalize(search))) {
        categoryWeights.set(
          idea.category.name,
          (categoryWeights.get(idea.category.name) ?? 0) + 1,
        );
      }
    }
  }

  return ideas
    .slice()
    .sort((left, right) => {
      const leftScore =
        (categoryWeights.get(left.category.name) ?? 0) +
        (profile.prefersPaid && left.isPaid ? 2 : 0) +
        (profile.viewedIdeaIds.includes(left.id) ? -2 : 1) +
        left.upvotes / 20 +
        left.commentCount / 10;
      const rightScore =
        (categoryWeights.get(right.category.name) ?? 0) +
        (profile.prefersPaid && right.isPaid ? 2 : 0) +
        (profile.viewedIdeaIds.includes(right.id) ? -2 : 1) +
        right.upvotes / 20 +
        right.commentCount / 10;
      return rightScore - leftScore;
    })
    .slice(0, limit);
}

export function getDynamicHeroContent(profile: AiUserProfile) {
  const topCategory = profile.categoryHistory[0];

  if (topCategory) {
    return {
      eyebrow: "Adaptive discovery",
      title: `The platform is prioritizing ${topCategory.toLowerCase()} ideas for you right now.`,
      description:
        "EcoSpark Hub is adapting its opening story based on the categories you explore most often, so the homepage feels relevant instead of generic.",
      ctaLabel: `Explore ${topCategory}`,
    };
  }

  if (profile.prefersPaid) {
    return {
      eyebrow: "Premium-ready guidance",
      title: "You appear to prefer deeper implementation playbooks over general idea browsing.",
      description:
        "The hero is highlighting structured, higher-intent content because your recent activity leans toward paid and implementation-focused ideas.",
      ctaLabel: "Browse premium ideas",
    };
  }

  return {
    eyebrow: "Smart onboarding",
    title: "Start with the strongest sustainability ideas instead of an empty discovery state.",
    description:
      "New visitors see a broader framing, while repeat visitors get a more personalized opening message shaped by their recent interests.",
    ctaLabel: "Explore ideas",
  };
}

export function getCouponRecommendation(ideas: Idea[], profile: AiUserProfile) {
  const matchedIdea = getPersonalizedIdeas(
    ideas.filter((idea) => idea.isPaid),
    profile,
    1,
  )[0];

  if (!matchedIdea) {
    return null;
  }

  const discountPercent = profile.prefersPaid ? 18 : 12;
  const basePrice = Number(matchedIdea.price ?? 0);
  const discountedPrice = basePrice * (1 - discountPercent / 100);

  return {
    title: matchedIdea.title,
    discountPercent,
    message: `Predicted fit: ${discountPercent}% off would likely increase conversion on ${matchedIdea.title}. Estimated offer price ${formatCurrency(discountedPrice)}.`,
  };
}

export function getNewsletterRecommendations(ideas: Idea[]) {
  const trendingIdeas = getTrendingIdeas(ideas, 3);

  return trendingIdeas.map((idea) => ({
    title: idea.title,
    topic: idea.category.name,
    reason: `${idea.upvotes} upvotes and ${idea.commentCount} comments suggest above-average interest.`,
  }));
}

export function getIdeaAssistantResponse(question: string, ideas: Idea[]) {
  const normalizedQuestion = normalize(question);
  const trendingIdeas = getTrendingIdeas(ideas, 2);

  if (!normalizedQuestion) {
    return {
      answer: "Ask about trending ideas, paid content, categories, or how EcoSpark Hub works.",
      suggestions: [
        "What is trending right now?",
        "Which paid idea looks most promising?",
        "How does idea review work?",
      ],
    };
  }

  if (normalizedQuestion.includes("trend")) {
    return {
      answer: `Right now the strongest traction is around ${trendingIdeas.map((idea) => idea.title).join(" and ")}.`,
      suggestions: trendingIdeas.map((idea) => `Show me ideas like ${idea.title}`),
    };
  }

  if (normalizedQuestion.includes("paid") || normalizedQuestion.includes("premium")) {
    const paidIdea = getTrendingIdeas(ideas.filter((idea) => idea.isPaid), 1)[0];
    return {
      answer: paidIdea
        ? `${paidIdea.title} is the strongest paid candidate based on current engagement and visibility signals.`
        : "There is no paid idea with strong engagement data yet.",
      suggestions: ["What categories are growing?", "How can I publish my own idea?"],
    };
  }

  if (normalizedQuestion.includes("review") || normalizedQuestion.includes("approve")) {
    return {
      answer:
        "Members draft and submit ideas, then admins moderate them before public visibility. Approved ideas stay discoverable while rejected ones can be revised with feedback.",
      suggestions: ["How do members submit ideas?", "What appears in the public feed?"],
    };
  }

  const matchedIdeas = ideas.filter((idea) => getIdeaText(idea).includes(normalizedQuestion)).slice(0, 2);

  if (matchedIdeas.length) {
    return {
      answer: `I found ${matchedIdeas.map((idea) => idea.title).join(" and ")} as the closest match to that request.`,
      suggestions: matchedIdeas.map((idea) => `Why is ${idea.title} recommended?`),
    };
  }

  return {
    answer:
      "I could not find a strong direct match, so I would start with the trending feed or the category filters to narrow intent.",
    suggestions: [
      "What is trending right now?",
      "Which ideas are best for beginners?",
      "How does the newsletter personalize updates?",
    ],
  };
}

export function getDraftAssist(input: DraftAssistInput) {
  const baseTitle = input.title.trim() || `${input.categoryName ?? "Sustainability"} pilot blueprint`;
  const categoryHint = input.categoryName ?? "Choose the category that best matches the operational domain.";
  const problem =
    input.problemStatement.trim() ||
    `Teams working in ${input.categoryName?.toLowerCase() ?? "this area"} still face a repeatable adoption gap, weak coordination, and unclear evidence for scaling.`;
  const solution =
    input.proposedSolution.trim() ||
    `Launch a 90-day pilot with simple success metrics, community partners, and a documented rollout kit that can be repeated in similar neighborhoods.`;
  const description =
    input.description.trim() ||
    `This proposal combines a small pilot, community onboarding, measurement checkpoints, and reusable materials so the idea can move from discussion into delivery without requiring a full-scale launch on day one.`;
  const readinessScore = [
    baseTitle.length >= 12,
    problem.length >= 40,
    solution.length >= 40,
    description.length >= 80,
  ].filter(Boolean).length * 25;

  return {
    title: baseTitle,
    categoryHint,
    problemStatement: problem,
    proposedSolution: solution,
    description,
    mediaUrls:
      "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1, https://images.unsplash.com/photo-1473448912268-2022ce9509d8",
    price: input.isPaid ? 399 : undefined,
    readinessScore,
    reasons: [
      "The suggestion favors pilot-oriented language because it is easier to review and approve.",
      "The draft adds measurable framing so admins can judge feasibility faster.",
      input.isPaid
        ? "A starter premium price is suggested because the content is positioned as a deeper implementation guide."
        : "The draft stays free-first because broad access usually helps validate early traction.",
    ],
  } satisfies DraftAssist;
}

export function getMemberAiInsights(ideas: Idea[], purchases: Purchase[]): InsightCard[] {
  const approvedIdeas = ideas.filter((idea) => idea.status === "APPROVED").length;
  const paidIdeas = ideas.filter((idea) => idea.isPaid).length;
  const paidPurchases = purchases.filter((purchase) => purchase.status === "PAID").length;

  return [
    {
      title: "Approval prediction",
      description:
        approvedIdeas >= Math.max(1, Math.ceil(ideas.length / 3))
          ? "Your recent portfolio suggests you are building ideas that clear review with reasonable consistency."
          : "Your current mix suggests adding more operational detail before submission would improve approval probability.",
      tone: approvedIdeas > 0 ? "success" : "warning",
    },
    {
      title: "Monetization signal",
      description:
        paidIdeas > 0 || paidPurchases > 0
          ? "There is enough premium behavior to justify offering one deeper implementation package."
          : "Your current activity suggests free discovery content is still the best growth lever.",
      tone: paidIdeas > 0 || paidPurchases > 0 ? "info" : "warning",
    },
    {
      title: "Next best action",
      description:
        ideas.some((idea) => idea.status === "DRAFT")
          ? "Submit one polished draft for review to turn stored work into visible traction."
          : "Publish a new idea in the category where you already have the strongest response signal.",
      tone: "info",
    },
  ];
}

export function getAdminAiInsights(stats: AdminStats, ideas: Idea[], users: User[]): InsightCard[] {
  const rejectionRate = stats.totalIdeas ? stats.rejectedIdeas / stats.totalIdeas : 0;
  const pendingRate = stats.totalIdeas ? stats.underReviewIdeas / stats.totalIdeas : 0;
  const deactivatedRate = users.length
    ? users.filter((user) => user.status === "DEACTIVATED").length / users.length
    : 0;
  const topCategory = getTopIdeaCategory(ideas);

  return [
    {
      title: "Top growth pocket",
      description: topCategory
        ? `${topCategory} is currently generating the strongest visible momentum across the idea catalog.`
        : "There is not enough category spread yet to identify a growth pocket.",
      tone: "success",
    },
    {
      title: "Moderation backlog forecast",
      description:
        pendingRate > 0.25
          ? "The under-review queue is large enough to risk a slower approval cycle unless moderators clear the backlog."
          : "Current moderation throughput looks healthy relative to total idea volume.",
      tone: pendingRate > 0.25 ? "warning" : "success",
    },
    {
      title: "Anomaly watch",
      description:
        rejectionRate > 0.35 || deactivatedRate > 0.2
          ? "One operational signal is outside the healthy band: rejection or deactivation rates are high enough to warrant investigation."
          : "No major operational anomaly stands out from the current user and idea distribution.",
      tone: rejectionRate > 0.35 || deactivatedRate > 0.2 ? "warning" : "info",
    },
  ];
}

export function getTopIdeaCategory(ideas: Idea[]) {
  const counts = new Map<string, number>();

  for (const idea of ideas) {
    counts.set(idea.category.name, (counts.get(idea.category.name) ?? 0) + idea.upvotes + 1);
  }

  return Array.from(counts.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
}
