import { PageShell } from "@/components/ecospark/page-shell";
import { SectionHeading } from "@/components/ecospark/section-heading";

const posts = [
  {
    title: "How community review makes sustainability platforms credible",
    excerpt:
      "A moderation model is only useful when it is visible. EcoSpark Hub keeps member trust by making each idea status legible.",
    date: "March 26, 2026",
  },
  {
    title: "When a sustainability idea should become a paid implementation guide",
    excerpt:
      "Premium access works best when it wraps detailed execution knowledge, not basic community discovery.",
    date: "March 18, 2026",
  },
  {
    title: "Designing public idea spaces that encourage follow-through",
    excerpt:
      "Votes, comments, and clear ownership are stronger signals than generic engagement metrics when ideas need traction.",
    date: "March 10, 2026",
  },
];

export default function BlogPage() {
  return (
    <PageShell className="space-y-10">
      <SectionHeading
        eyebrow="Blog"
        title="Editorial notes on moderation, community design, and green implementation"
        description="This section gives the project a portfolio-ready editorial layer beyond the assignment minimum."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.title} className="rounded-[28px] border border-border/80 bg-card p-6">
            <p className="text-sm text-muted-foreground">{post.date}</p>
            <h2 className="mt-3 text-2xl font-semibold">{post.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
