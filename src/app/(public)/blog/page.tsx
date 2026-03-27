import { blogPosts } from "@/data/mock-content";

export default function BlogPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Blog
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Editorial space for sustainability stories
        </h1>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{post.date}</p>
            <h2 className="mt-3 text-xl font-semibold">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
