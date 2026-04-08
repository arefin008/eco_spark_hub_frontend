import type { AiUserProfile } from "@/lib/ai";

export const AI_PROFILE_STORAGE_KEY = "ecospark-ai-profile";

const defaultProfile: AiUserProfile = {
  searchHistory: [],
  categoryHistory: [],
  viewedIdeaIds: [],
  prefersPaid: false,
};

export function readAiProfile(): AiUserProfile {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  try {
    const rawValue = window.localStorage.getItem(AI_PROFILE_STORAGE_KEY);

    if (!rawValue) {
      return defaultProfile;
    }

    return {
      ...defaultProfile,
      ...(JSON.parse(rawValue) as Partial<AiUserProfile>),
    };
  } catch {
    return defaultProfile;
  }
}

export function writeAiProfile(profile: AiUserProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AI_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function updateAiProfile(
  updater: (profile: AiUserProfile) => AiUserProfile,
) {
  const nextProfile = updater(readAiProfile());
  writeAiProfile(nextProfile);
  return nextProfile;
}
