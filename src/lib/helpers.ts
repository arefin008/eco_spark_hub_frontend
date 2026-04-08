import { format } from "date-fns";

import type { Idea, IdeaDetail } from "@/types/domain";

export function cnValue(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatDate(value?: string | null) {
  if (!value) {
    return "N/A";
  }

  return format(new Date(value), "MMM d, yyyy");
}

export function formatCurrency(value?: number | string | null, currency = "BDT") {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export function formatCurrencyParts(value?: number | string | null, currency = "BDT") {
  const numericValue = Number(value ?? 0);
  const parts = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).formatToParts(numericValue);

  const currencyLabel =
    parts.find((part) => part.type === "currency")?.value ?? currency;
  const amount = parts
    .filter((part) => part.type !== "currency")
    .map((part) => part.value)
    .join("")
    .trim();

  return {
    currencyLabel,
    amount,
  };
}

export function toNumber(value?: number | string | null) {
  return Number(value ?? 0);
}

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}

export function extractErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong.";
}

export function ideaHasAccess(idea: IdeaDetail): idea is Idea {
  return idea.canAccess !== false;
}
