import { notFound } from "next/navigation";
import { mockProjects, mockMessages } from "@/lib/mock-data";
import { StageBoard } from "@/components/projects/stage-board";
import { FileUpload } from "@/components/projects/file-upload";
import { ShareLinkGenerator } from "@/components/projects/share-link-generator";
import { ClientMessages } from "@/components/projects/client-messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const projectMessages = mockMessages.filter(
    (m) => m.projectId === project.id
  );

  const currentStage = project.stages.find(
    (s) => s.status === "in_progress"
  );

  const statusLabels = {
    draft: "草稿",
    active: "进行中",
    completed: "已完成",
    archived: "已归档",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge>{statusLabels[project.status]}</Badge>
            </div>
            <p className="text-muted-foreground">{project.clientName}</p>
          </div>
        </div>
        <button className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-muted">
          <Edit className="mr-2 h-4 w-4" />
          编辑
        </button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>阶段管理</CardTitle>
          </CardHeader>
          <CardContent>
            <StageBoard stages={project.stages} />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>当前阶段</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStage ? (
                <div className="space-y-4">
                  <p className="font-medium">{currentStage.name}</p>
                  <FileUpload files={currentStage.files} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  暂无进行中的阶段
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <ShareLinkGenerator
              shareId={project.shareId}
              hasPassword={!!project.sharePassword}
            />
            <ClientMessages messages={projectMessages} />
          </div>
        </div>
      </div>
    </div>
  );
}
