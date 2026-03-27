export default function AdminUsersPage() {
  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">
          Member management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Use this page for user status updates, role controls, and admin-only
          moderation actions.
        </p>
      </div>
    </main>
  );
}
