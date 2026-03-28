import { AuthGuard } from "@/components/ecospark/auth-guard";
import { PageShell } from "@/components/ecospark/page-shell";
import { ProfilePanel } from "@/components/ecospark/profile-panel";

export default function MyProfilePage() {
  return (
    <PageShell>
      <AuthGuard>
        <ProfilePanel />
      </AuthGuard>
    </PageShell>
  );
}
