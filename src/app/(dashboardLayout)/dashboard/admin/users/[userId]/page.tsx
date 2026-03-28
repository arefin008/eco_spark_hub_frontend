import { AdminUserDetail } from "@/components/ecospark/admin-user-detail";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return <AdminUserDetail userId={userId} />;
}
