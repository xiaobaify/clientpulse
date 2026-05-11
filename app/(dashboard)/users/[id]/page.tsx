import { notFound } from "next/navigation";
import { fetchUserById } from "@/lib/api";
import { UserDetailCard } from "@/components/users/user-detail-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const user = await fetchUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/users"
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">用户详情</h1>
          <p className="text-muted-foreground">{user.name}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <UserDetailCard user={user} />
      </div>
    </div>
  );
}
