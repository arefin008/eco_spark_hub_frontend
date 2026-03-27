const overviewCards = [
  "Member and admin route groups are in place.",
  "Backend endpoint mappings are scaffolded in the service layer.",
  "Auth, payments, newsletter, votes, comments, and ideas all have frontend placeholders.",
];

export default function DashboardPage() {
  return (
    <main className="space-y-8 px-6 py-10 lg:px-10">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Overview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard foundation ready
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          The scaffold mirrors the assignment and backend route map so you can
          continue implementing member and admin workflows without reorganizing
          the app later.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {overviewCards.map((card) => (
          <div
            key={card}
            className="rounded-3xl border border-border bg-card p-6 text-sm leading-6 text-muted-foreground shadow-sm"
          >
            {card}
          </div>
        ))}
      </div>
    </main>
  );
}
